using System.Net;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Infrastructure.Persistence;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private const decimal FreeShippingAbove = 499m;
    private const decimal ShippingFee = 49m;

    private readonly AppDbContext _db;
    private readonly IRazorpayService _razorpay;
    private readonly IEmailService _email;
    private readonly ILogger<OrdersController> _log;

    public OrdersController(AppDbContext db, IRazorpayService razorpay, IEmailService email, ILogger<OrdersController> log)
    { _db = db; _razorpay = razorpay; _email = email; _log = log; }

    public record CartItem(Guid BookId, int Quantity);
    public record Address(string Name, string Phone, string Line1, string? Line2, string City, string State, string Pincode);
    public record CreateOrderRequest(List<CartItem> Items, Address Address);
    public record VerifyRequest(string RazorpayOrderId, string RazorpayPaymentId, string RazorpaySignature);
    public record StatusRequest(OrderStatus Status, string? Courier, string? TrackingNumber);

    private Guid UserId => Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    // ───────────── Customer ─────────────

    [HttpPost]
    public async Task<IActionResult> Create([FromBody] CreateOrderRequest r, CancellationToken ct)
    {
        var a = r.Address;
        if (r.Items is not { Count: > 0 }) return BadRequest(ApiResponse<object>.Failure("Your cart is empty."));
        if (a is null || new[] { a.Name, a.Phone, a.Line1, a.City, a.State, a.Pincode }.Any(string.IsNullOrWhiteSpace))
            return BadRequest(ApiResponse<object>.Failure("Please fill the complete shipping address."));
        if (!System.Text.RegularExpressions.Regex.IsMatch(a.Pincode.Trim(), @"^\d{6}$")) return BadRequest(ApiResponse<object>.Failure("Enter a valid 6-digit pincode."));
        if (!System.Text.RegularExpressions.Regex.IsMatch(a.Phone.Trim(), @"^[6-9]\d{9}$")) return BadRequest(ApiResponse<object>.Failure("Enter a valid 10-digit mobile number."));
        if (!_razorpay.IsConfigured) return StatusCode(500, ApiResponse<object>.Failure("Payment gateway is not configured."));

        var qty = r.Items.GroupBy(i => i.BookId).ToDictionary(g => g.Key, g => g.Sum(i => i.Quantity));
        if (qty.Values.Any(q => q is < 1 or > 10)) return BadRequest(ApiResponse<object>.Failure("Quantity must be between 1 and 10."));

        var books = await _db.Books.Where(b => qty.Keys.Contains(b.Id) && b.IsActive).ToListAsync(ct);
        if (books.Count != qty.Count) return BadRequest(ApiResponse<object>.Failure("Some books in your cart are no longer available."));
        if (books.FirstOrDefault(b => b.Stock < qty[b.Id]) is { } oos)
            return BadRequest(ApiResponse<object>.Failure($"Only {oos.Stock} left for \"{oos.Title}\"."));

        // Prices always come from the DB, never from the client.
        var order = new Order
        {
            UserId = UserId,
            OrderNumber = $"BK{DateTime.UtcNow:yyMMdd}{Random.Shared.Next(100000, 999999)}",
            ShipName = a.Name.Trim(), ShipPhone = a.Phone.Trim(), ShipLine1 = a.Line1.Trim(), ShipLine2 = a.Line2?.Trim(),
            ShipCity = a.City.Trim(), ShipState = a.State.Trim(), ShipPincode = a.Pincode.Trim(),
            Items = books.Select(b => new OrderItem { BookId = b.Id, Title = b.Title, UnitPrice = b.Price, Quantity = qty[b.Id] }).ToList()
        };
        order.Subtotal = order.Items.Sum(i => i.UnitPrice * i.Quantity);
        order.ShippingFee = order.Subtotal >= FreeShippingAbove ? 0 : ShippingFee;
        order.Total = order.Subtotal + order.ShippingFee;

        try { order.RazorpayOrderId = await _razorpay.CreateOrderAsync(order.Total, order.OrderNumber, ct); }
        catch (Exception ex)
        {
            _log.LogError(ex, "Book order creation failed");
            return StatusCode(502, ApiResponse<object>.Failure("Could not reach the payment gateway. Please try again."));
        }

        _db.Orders.Add(order);
        await _db.SaveChangesAsync(ct);

        var user = await _db.Users.AsNoTracking().FirstAsync(u => u.Id == order.UserId, ct);
        return Ok(ApiResponse<object>.Ok(new
        {
            orderId = order.Id, order.OrderNumber, razorpayOrderId = order.RazorpayOrderId,
            amount = (long)(order.Total * 100), currency = "INR", keyId = _razorpay.KeyId,
            userName = order.ShipName, userEmail = user.Email, userPhone = order.ShipPhone
        }));
    }

    [HttpPost("verify")]
    public async Task<IActionResult> Verify([FromBody] VerifyRequest r, CancellationToken ct)
    {
        var order = await _db.Orders.Include(o => o.Items).Include(o => o.User)
            .FirstOrDefaultAsync(o => o.RazorpayOrderId == r.RazorpayOrderId && o.UserId == UserId, ct);
        if (order is null) return NotFound(ApiResponse<object>.Failure("Order not found."));
        if (order.Status != OrderStatus.PendingPayment && order.Status != OrderStatus.PaymentFailed)
            return Ok(ApiResponse<object>.Ok(new { order.Id, order.OrderNumber }, "Order already confirmed."));

        if (!_razorpay.VerifySignature(r.RazorpayOrderId, r.RazorpayPaymentId, r.RazorpaySignature))
        {
            order.Status = OrderStatus.PaymentFailed;
            await _db.SaveChangesAsync(ct);
            return BadRequest(ApiResponse<object>.Failure("Payment verification failed."));
        }

        order.Status = OrderStatus.Paid;
        order.RazorpayPaymentId = r.RazorpayPaymentId;
        order.PaidAt = DateTime.UtcNow;

        // Atomic, oversell-safe stock reservation: only decrement when enough stock remains.
        var reserved = new List<OrderItem>();
        foreach (var item in order.Items)
        {
            var rows = await _db.Books.Where(b => b.Id == item.BookId && b.Stock >= item.Quantity)
                .ExecuteUpdateAsync(s => s.SetProperty(b => b.Stock, b => b.Stock - item.Quantity), ct);
            if (rows == 0)
            {
                await RestoreStock(reserved, ct);
                await CancelAndRefund(order, "Item went out of stock during payment", ct);
                await _db.SaveChangesAsync(ct);
                return BadRequest(ApiResponse<object>.Failure($"Sorry, '{item.Title}' just went out of stock. Your payment has been refunded."));
            }
            reserved.Add(item);
        }
        await _db.SaveChangesAsync(ct);

        SendEmail(order, $"Order confirmed — {order.OrderNumber}", Invoice.Build(order, isInvoice: false));
        return Ok(ApiResponse<object>.Ok(new { order.Id, order.OrderNumber }, "Payment successful. Order placed!"));
    }

    [HttpGet("mine")]
    public async Task<IActionResult> Mine(CancellationToken ct)
    {
        var orders = await _db.Orders.AsNoTracking().Where(o => o.UserId == UserId && o.Status != OrderStatus.PendingPayment)
            .OrderByDescending(o => o.CreatedAt).Select(Projection).ToListAsync(ct);
        return Ok(ApiResponse<object>.Ok(orders));
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Details(Guid id, CancellationToken ct)
    {
        var order = await _db.Orders.AsNoTracking().Where(o => o.Id == id && o.UserId == UserId).Select(Projection).FirstOrDefaultAsync(ct);
        return order is null ? NotFound(ApiResponse<object>.Failure("Order not found.")) : Ok(ApiResponse<object>.Ok(order));
    }

    /// <summary>Most recent shipping address + account contact, used to prefill checkout on any device.</summary>
    [HttpGet("last-address")]
    public async Task<IActionResult> LastAddress(CancellationToken ct)
    {
        var user = await _db.Users.AsNoTracking().FirstAsync(u => u.Id == UserId, ct);
        var last = await _db.Orders.AsNoTracking().Where(o => o.UserId == UserId).OrderByDescending(o => o.CreatedAt)
            .Select(o => new { name = o.ShipName, phone = o.ShipPhone, line1 = o.ShipLine1, line2 = o.ShipLine2, city = o.ShipCity, state = o.ShipState, pincode = o.ShipPincode })
            .FirstOrDefaultAsync(ct);
        return Ok(ApiResponse<object>.Ok(new
        {
            email = user.Email,
            address = last ?? new { name = $"{user.FirstName} {user.LastName}".Trim(), phone = user.PhoneNumber ?? "", line1 = user.Address ?? "", line2 = (string?)"", city = user.City ?? "", state = "", pincode = "" }
        }));
    }

    /// <summary>Customer can cancel before the order ships; payment is refunded automatically.</summary>
    [HttpPost("{id:guid}/cancel")]
    public async Task<IActionResult> Cancel(Guid id, CancellationToken ct)
    {
        var order = await _db.Orders.Include(o => o.Items).Include(o => o.User).FirstOrDefaultAsync(o => o.Id == id && o.UserId == UserId, ct);
        if (order is null) return NotFound(ApiResponse<object>.Failure("Order not found."));
        if (order.Status != OrderStatus.Paid) return BadRequest(ApiResponse<object>.Failure("This order can no longer be cancelled."));
        await RestoreStock(order.Items, ct);
        await CancelAndRefund(order, "Cancelled by customer", ct);
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { order.Id }, "Order cancelled. Refund will reach your account in 5-7 working days."));
    }

    /// <summary>Returns a printable HTML invoice. Available once payment is confirmed.</summary>
    [HttpGet("{id:guid}/invoice")]
    public async Task<IActionResult> InvoiceHtml(Guid id, CancellationToken ct)
    {
        var order = await _db.Orders.AsNoTracking().Include(o => o.Items).Include(o => o.User).FirstOrDefaultAsync(o => o.Id == id, ct);
        if (order is null || (order.UserId != UserId && !User.IsInRole("Admin"))) return NotFound(ApiResponse<object>.Failure("Order not found."));
        if (order.Status is not (OrderStatus.Paid or OrderStatus.Shipped or OrderStatus.Delivered))
            return BadRequest(ApiResponse<object>.Failure("Invoice is available once payment is confirmed."));
        return Content(Invoice.Build(order, isInvoice: true), "text/html", Encoding.UTF8);
    }

    // ───────────── Admin ─────────────

    [Authorize(Roles = "Admin")]
    [HttpGet("admin")]
    public async Task<IActionResult> AdminList([FromQuery] OrderStatus? status, CancellationToken ct)
    {
        var q = _db.Orders.AsNoTracking().Where(o => o.Status != OrderStatus.PendingPayment);
        if (status is not null) q = q.Where(o => o.Status == status);
        return Ok(ApiResponse<object>.Ok(await q.OrderByDescending(o => o.CreatedAt).Select(Projection).ToListAsync(ct)));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("admin/summary")]
    public async Task<IActionResult> AdminSummary(CancellationToken ct)
    {
        var since = DateTime.UtcNow.AddDays(-30);
        var paid = new[] { OrderStatus.Paid, OrderStatus.Shipped, OrderStatus.Delivered };
        var summary = new
        {
            toShip = await _db.Orders.CountAsync(o => o.Status == OrderStatus.Paid, ct),
            inTransit = await _db.Orders.CountAsync(o => o.Status == OrderStatus.Shipped, ct),
            revenue30d = await _db.Orders.Where(o => paid.Contains(o.Status) && o.PaidAt >= since).SumAsync(o => (decimal?)o.Total, ct) ?? 0,
            orders30d = await _db.Orders.CountAsync(o => paid.Contains(o.Status) && o.PaidAt >= since, ct),
            lowStock = await _db.Books.CountAsync(b => b.IsActive && b.Stock < 5, ct),
            activeBooks = await _db.Books.CountAsync(b => b.IsActive, ct),
        };
        return Ok(ApiResponse<object>.Ok(summary));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}/status")]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] StatusRequest r, CancellationToken ct)
    {
        var order = await _db.Orders.Include(o => o.Items).Include(o => o.User).FirstOrDefaultAsync(o => o.Id == id, ct);
        if (order is null) return NotFound(ApiResponse<object>.Failure("Order not found."));
        if (r.Status is not (OrderStatus.Shipped or OrderStatus.Delivered or OrderStatus.Cancelled))
            return BadRequest(ApiResponse<object>.Failure("Status can only be set to Shipped, Delivered or Cancelled."));
        if (order.Status is OrderStatus.PendingPayment or OrderStatus.PaymentFailed)
            return BadRequest(ApiResponse<object>.Failure("Order has not been paid."));

        if (order.Status is OrderStatus.Cancelled or OrderStatus.Delivered)
            return BadRequest(ApiResponse<object>.Failure($"Order is already {order.Status}."));

        if (r.Status == OrderStatus.Cancelled)
        {
            await RestoreStock(order.Items, ct);
            await CancelAndRefund(order, "Cancelled by store", ct);
            await _db.SaveChangesAsync(ct);
            return Ok(ApiResponse<object>.Ok(new { order.Id, Status = order.Status.ToString(), order.RefundId }, "Order cancelled and refund initiated."));
        }

        order.Status = r.Status;
        if (r.Status == OrderStatus.Shipped)
        {
            order.ShippedAt = DateTime.UtcNow;
            order.Courier = r.Courier; order.TrackingNumber = r.TrackingNumber;
            SendEmail(order, $"Your order {order.OrderNumber} has shipped",
                Invoice.Simple(order, $"Your books are on the way via {WebUtility.HtmlEncode(r.Courier ?? "courier")}. Tracking no: <b>{WebUtility.HtmlEncode(r.TrackingNumber ?? "-")}</b>"));
        }
        else if (r.Status == OrderStatus.Delivered)
        {
            order.DeliveredAt = DateTime.UtcNow;
            order.ShippedAt ??= order.DeliveredAt;
            SendEmail(order, $"Invoice for order {order.OrderNumber}", Invoice.Build(order, isInvoice: true));
        }
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { order.Id, Status = order.Status.ToString() }, "Order updated."));
    }

    // ───────────── Helpers ─────────────

    private static readonly System.Linq.Expressions.Expression<Func<Order, object>> Projection = o => new
    {
        o.Id, o.OrderNumber, Status = o.Status.ToString(), o.Subtotal, o.ShippingFee, o.Total, o.CreatedAt, o.PaidAt,
        o.ShippedAt, o.DeliveredAt, o.CancelledAt, o.CancelReason, o.RefundId, o.Courier, o.TrackingNumber,
        Customer = o.User.FirstName + " " + o.User.LastName, CustomerEmail = o.User.Email,
        Address = new { o.ShipName, o.ShipPhone, o.ShipLine1, o.ShipLine2, o.ShipCity, o.ShipState, o.ShipPincode },
        Items = o.Items.Select(i => new { i.BookId, i.Title, i.UnitPrice, i.Quantity, i.Book.ImageUrl })
    };

    private async Task RestoreStock(IEnumerable<OrderItem> items, CancellationToken ct)
    {
        foreach (var i in items)
            await _db.Books.Where(b => b.Id == i.BookId).ExecuteUpdateAsync(s => s.SetProperty(b => b.Stock, b => b.Stock + i.Quantity), ct);
    }

    private async Task CancelAndRefund(Order order, string reason, CancellationToken ct)
    {
        order.Status = OrderStatus.Cancelled;
        order.CancelledAt = DateTime.UtcNow;
        order.CancelReason = reason;
        if (!string.IsNullOrEmpty(order.RazorpayPaymentId) && order.RefundId is null)
        {
            try { order.RefundId = await _razorpay.RefundAsync(order.RazorpayPaymentId, null, ct); }
            catch (Exception ex) { _log.LogError(ex, "Refund failed for {Order} - refund manually in Razorpay dashboard", order.OrderNumber); }
        }
        SendEmail(order, $"Order {order.OrderNumber} cancelled",
            Invoice.Simple(order, $"Your order was cancelled ({WebUtility.HtmlEncode(reason)}). A full refund of <b>Rs. {order.Total:N0}</b> has been initiated and will reach your account in 5-7 working days."));
    }

    private void SendEmail(Order order, string subject, string html)
    {
        var (to, name) = (order.User.Email, order.ShipName);
        _ = Task.Run(async () =>
        {
            try { await _email.SendHtmlAsync(to, name, subject, html); }
            catch (Exception ex) { _log.LogWarning(ex, "Order email failed for {Order}", order.OrderNumber); }
        });
    }

    private static class Invoice
    {
        private static string E(string? s) => WebUtility.HtmlEncode(s ?? "");
        private static string M(decimal d) => "₹" + d.ToString("N2", new System.Globalization.CultureInfo("en-IN"));

        public static string Simple(Order o, string message) => $"""
            <div style="font-family:Arial,sans-serif;max-width:560px;margin:auto;padding:24px">
              <h2 style="color:#0f172a">UPSC with Eshwar — Book Store</h2>
              <p>Hi {E(o.ShipName)},</p><p>{message}</p>
              <p style="color:#64748b">Order: <b>{E(o.OrderNumber)}</b></p>
            </div>
            """;

        private const string Css = "<style> body{font-family:Arial,Helvetica,sans-serif;color:#0f172a;max-width:800px;margin:24px auto;padding:0 16px;font-size:13px} h1{font-size:20px;margin:0} .m{color:#64748b;font-size:11px} .box{border:1px solid #e2e8f0;border-radius:8px;padding:12px} .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:12px;margin:16px 0} table.items{width:100%;border-collapse:collapse;margin-top:8px} .items th{background:#f1f5f9;text-align:left;padding:8px} .items td{padding:8px;border-bottom:1px solid #eef2f7;vertical-align:top} .c{text-align:center} .r{text-align:right} .tot td{border:none;padding:4px 8px} .grand td{font-size:15px;font-weight:bold;border-top:2px solid #0f172a;padding-top:8px} .btn{margin-top:16px;padding:10px 22px;background:#0f172a;color:#fff;border:0;border-radius:6px;cursor:pointer} @media print{.btn{display:none}} </style>";

        public static string Build(Order o, bool isInvoice)
        {
            var n = 0;
            var rows = string.Concat(o.Items.Select(i =>
                $"<tr><td>{++n}</td><td>{E(i.Title)}<div class='m'>HSN 4901 · GST 0% (exempt)</div></td><td class='c'>{i.Quantity}</td><td class='r'>{M(i.UnitPrice)}</td><td class='r'>{M(i.UnitPrice * i.Quantity)}</td></tr>"));
            var title = isInvoice ? "Tax Invoice / Bill of Supply" : "Order Confirmation";
            var addr = $"{E(o.ShipName)}<br>{E(o.ShipLine1)}{(string.IsNullOrWhiteSpace(o.ShipLine2) ? "" : "<br>" + E(o.ShipLine2))}<br>{E(o.ShipCity)}, {E(o.ShipState)} - {E(o.ShipPincode)}<br>Phone: {E(o.ShipPhone)}";
            var status = o.Status == OrderStatus.Delivered ? $"Delivered on {o.DeliveredAt:dd MMM yyyy}" : o.Status == OrderStatus.Shipped ? $"Shipped via {E(o.Courier)} ({E(o.TrackingNumber)})" : "Paid — preparing for dispatch";
            return $"""
                <!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{title} {E(o.OrderNumber)}</title>
                {Css}</head><body>
                  <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;border-bottom:3px solid #C9A84C;padding-bottom:12px">
                    <div><h1>UPSC with Eshwar</h1><div class="m">Book Store · upscwitheshwar.com · upscwitheshwar@gmail.com</div></div>
                    <div style="text-align:right"><b>{title}</b><div class="m">Original for recipient</div></div>
                  </div>
                  <div class="grid">
                    <div class="box"><b>Invoice details</b><br>Invoice no: INV-{E(o.OrderNumber)}<br>Order no: {E(o.OrderNumber)}<br>Order date: {o.CreatedAt:dd MMM yyyy}<br>Invoice date: {(o.PaidAt ?? o.CreatedAt):dd MMM yyyy}</div>
                    <div class="box"><b>Billing address</b><br>{addr}<br>Email: {E(o.User?.Email)}</div>
                    <div class="box"><b>Shipping address</b><br>{addr}</div>
                  </div>
                  <table class="items"><tr><th>#</th><th>Description</th><th class="c">Qty</th><th class="r">Unit price</th><th class="r">Amount</th></tr>{rows}</table>
                  <table style="margin-left:auto;margin-top:8px;min-width:260px" class="tot">
                    <tr><td>Subtotal</td><td class="r">{M(o.Subtotal)}</td></tr>
                    <tr><td>Shipping</td><td class="r">{(o.ShippingFee == 0 ? "FREE" : M(o.ShippingFee))}</td></tr>
                    <tr><td>GST</td><td class="r">{M(0)}</td></tr>
                    <tr class="grand"><td>Total paid</td><td class="r">{M(o.Total)}</td></tr>
                  </table>
                  <div class="grid">
                    <div class="box"><b>Payment</b><br>Method: Online (Razorpay)<br>Transaction ID: {E(o.RazorpayPaymentId)}<br>Paid on: {o.PaidAt:dd MMM yyyy, hh:mm tt} UTC</div>
                    <div class="box"><b>Status</b><br>{status}</div>
                  </div>
                  <p class="m">Printed books are exempt from GST under HSN 4901. This is a computer-generated document and does not require a signature.</p>
                  <button class="btn" onclick="window.print()">Download / Print PDF</button>
                </body></html>
                """;
        }
    }
}
