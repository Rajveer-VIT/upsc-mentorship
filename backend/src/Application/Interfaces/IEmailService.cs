using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Application.Interfaces;

/// <summary>
/// Abstraction for sending transactional emails.
/// </summary>
public interface IEmailService
{
    /// <summary>
    /// Sends a payment invoice email to the user after successful payment.
    /// </summary>
    Task SendPaymentInvoiceAsync(User user, Payment payment, string planName);
}
