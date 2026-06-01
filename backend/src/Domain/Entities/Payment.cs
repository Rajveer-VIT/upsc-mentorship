using System;
using UpscMentorship.Domain.Common;

namespace UpscMentorship.Domain.Entities;

/// <summary>
/// Represents a payment transaction made via Razorpay.
/// </summary>
public class Payment : BaseEntity
{
    public Guid UserId { get; set; }
    public string PlanId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = "INR";
    public string RazorpayOrderId { get; set; } = string.Empty;
    public string? RazorpayPaymentId { get; set; }
    public string? RazorpaySignature { get; set; }
    public string Status { get; set; } = "Pending"; // Pending, Success, Failed

    // Navigation property
    public User User { get; set; } = null!;
}
