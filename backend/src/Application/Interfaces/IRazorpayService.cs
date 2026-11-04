namespace UpscMentorship.Application.Interfaces;

public interface IRazorpayService
{
    string KeyId { get; }
    bool IsConfigured { get; }
    /// <summary>Creates a Razorpay order and returns its id. Throws on gateway error.</summary>
    Task<string> CreateOrderAsync(decimal amountInr, string receipt, CancellationToken ct = default);
    /// <summary>Refunds a captured payment (full refund when amount is null). Returns refund id.</summary>
    Task<string> RefundAsync(string paymentId, decimal? amountInr = null, CancellationToken ct = default);
    bool VerifySignature(string orderId, string paymentId, string signature);
}
