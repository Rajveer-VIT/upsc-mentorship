using UpscMentorship.Domain.Common;

namespace UpscMentorship.Domain.Entities;

public enum OrderStatus { PendingPayment, Paid, Shipped, Delivered, Cancelled, PaymentFailed }

/// <summary>A book order. Shipping address and prices are snapshotted at purchase time.</summary>
public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;
    public OrderStatus Status { get; set; } = OrderStatus.PendingPayment;

    public decimal Subtotal { get; set; }
    public decimal ShippingFee { get; set; }
    public decimal Total { get; set; }

    // Shipping address snapshot
    public string ShipName { get; set; } = string.Empty;
    public string ShipPhone { get; set; } = string.Empty;
    public string ShipLine1 { get; set; } = string.Empty;
    public string? ShipLine2 { get; set; }
    public string ShipCity { get; set; } = string.Empty;
    public string ShipState { get; set; } = string.Empty;
    public string ShipPincode { get; set; } = string.Empty;

    // Payment
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string? RazorpayPaymentId { get; set; }
    public DateTime? PaidAt { get; set; }

    // Fulfilment
    public string? Courier { get; set; }
    public string? TrackingNumber { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }
    public DateTime? CancelledAt { get; set; }
    public string? RefundId { get; set; }
    public string? CancelReason { get; set; }

    public List<OrderItem> Items { get; set; } = new();
}

public class OrderItem : BaseEntity
{
    public Guid OrderId { get; set; }
    public Order Order { get; set; } = null!;
    public Guid BookId { get; set; }
    public Book Book { get; set; } = null!;
    public string Title { get; set; } = string.Empty; // snapshot
    public decimal UnitPrice { get; set; }             // snapshot
    public int Quantity { get; set; }
}
