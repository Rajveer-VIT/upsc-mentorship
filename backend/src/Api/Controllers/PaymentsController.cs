using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpscMentorship.Application.Common;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Infrastructure.Persistence;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PaymentsController : ControllerBase
{
    private readonly AppDbContext _db;
    private readonly IRazorpayService _razorpay;
    private readonly IEmailService _email;
    private readonly ILogger<PaymentsController> _log;

    public PaymentsController(AppDbContext db, IRazorpayService razorpay, IEmailService email, ILogger<PaymentsController> log)
    { _db = db; _razorpay = razorpay; _email = email; _log = log; }

    public record CreateOrderRequest(string PlanId);
    public record VerifyPaymentRequest(string RazorpayOrderId, string RazorpayPaymentId, string RazorpaySignature);

    private Guid? CurrentUserId => Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var id) ? id : null;

    [AllowAnonymous]
    [HttpGet("plans")]
    public IActionResult Plans() => Ok(ApiResponse<object>.Ok(PlanCatalog.All.Values));

    [HttpPost("create-order")]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request, CancellationToken ct)
    {
        if (CurrentUserId is not { } userId) return Unauthorized(ApiResponse<object>.Failure("Please log in."));
        if (!PlanCatalog.All.TryGetValue(request.PlanId ?? "", out var plan)) return BadRequest(ApiResponse<object>.Failure("Invalid plan selected."));
        if (!_razorpay.IsConfigured) return StatusCode(500, ApiResponse<object>.Failure("Payment gateway is not configured."));

        var user = await _db.Users.AsNoTracking().FirstOrDefaultAsync(u => u.Id == userId, ct);
        if (user == null) return Unauthorized(ApiResponse<object>.Failure("User not found."));

        try
        {
            var rzpOrderId = await _razorpay.CreateOrderAsync(plan.Price, Guid.NewGuid().ToString("N"), ct);
            _db.Payments.Add(new Payment { UserId = userId, PlanId = plan.Id, Amount = plan.Price, RazorpayOrderId = rzpOrderId });
            await _db.SaveChangesAsync(ct);

            return Ok(ApiResponse<object>.Ok(new
            {
                orderId = rzpOrderId,
                amount = (long)(plan.Price * 100),
                currency = "INR",
                keyId = _razorpay.KeyId,
                userEmail = user.Email,
                userPhone = user.PhoneNumber ?? "",
                userName = $"{user.FirstName} {user.LastName}".Trim()
            }, "Payment order created successfully."));
        }
        catch (Exception ex)
        {
            _log.LogError(ex, "Plan order creation failed");
            return StatusCode(502, ApiResponse<object>.Failure("Could not reach the payment gateway. Please try again."));
        }
    }

    [HttpPost("verify")]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest r, CancellationToken ct)
    {
        if (CurrentUserId is not { } userId) return Unauthorized(ApiResponse<object>.Failure("Please log in."));
        if (string.IsNullOrEmpty(r.RazorpayOrderId) || string.IsNullOrEmpty(r.RazorpayPaymentId) || string.IsNullOrEmpty(r.RazorpaySignature))
            return BadRequest(ApiResponse<object>.Failure("Missing signature verification parameters."));

        var payment = await _db.Payments.Include(p => p.User)
            .FirstOrDefaultAsync(p => p.RazorpayOrderId == r.RazorpayOrderId && p.UserId == userId, ct);
        if (payment == null) return NotFound(ApiResponse<object>.Failure("Transaction record not found."));
        if (payment.Status == "Success") return Ok(ApiResponse<object>.Ok(new { status = "Success" }, "Payment already verified."));

        var valid = _razorpay.VerifySignature(r.RazorpayOrderId, r.RazorpayPaymentId, r.RazorpaySignature);
        payment.Status = valid ? "Success" : "Failed";
        payment.RazorpayPaymentId = r.RazorpayPaymentId;
        payment.RazorpaySignature = r.RazorpaySignature;
        await _db.SaveChangesAsync(ct);

        if (!valid) return BadRequest(ApiResponse<object>.Failure("Payment verification failed. Invalid signature."));

        var planName = PlanCatalog.All.TryGetValue(payment.PlanId, out var p) ? p.Name : payment.PlanId;
        var user = payment.User;
        _ = Task.Run(async () =>
        {
            try { await _email.SendPaymentInvoiceAsync(user, payment, planName); }
            catch (Exception ex) { _log.LogWarning(ex, "Invoice email failed"); }
        });

        return Ok(ApiResponse<object>.Ok(new { status = "Success" }, "Payment verified successfully. Plan activated!"));
    }
}
