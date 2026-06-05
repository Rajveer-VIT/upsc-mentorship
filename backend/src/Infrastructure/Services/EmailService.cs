using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Configuration;
using MimeKit;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Services;

/// <summary>
/// Sends transactional emails via SMTP (Gmail/Outlook) using MailKit.
/// </summary>
public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendPaymentInvoiceAsync(User user, Payment payment, string planName)
    {
        var smtpHost     = _config["EmailSettings:SmtpHost"]     ?? "smtp.gmail.com";
        var smtpPort     = int.Parse(_config["EmailSettings:SmtpPort"] ?? "587");
        var senderEmail  = _config["EmailSettings:SenderEmail"]  ?? "";
        var senderPass   = _config["EmailSettings:SenderPassword"] ?? "";
        var senderName   = _config["EmailSettings:SenderName"]   ?? "UPSC with Eshwar";

        if (string.IsNullOrEmpty(senderEmail) || string.IsNullOrEmpty(senderPass))
            return; // Email not configured — skip silently

        var fullName   = $"{user.FirstName} {user.LastName}".Trim();
        var invoiceNo  = $"INV-{payment.Id.ToString("N")[..8].ToUpper()}";
        var paidDate   = payment.CreatedAt.ToString("dd MMMM yyyy");
        var amount     = payment.Amount.ToString("N0");
        var txnId      = payment.RazorpayPaymentId ?? "N/A";

        var html = BuildInvoiceHtml(fullName, user.Email, invoiceNo, planName, amount, paidDate, txnId);

        var message = new MimeMessage();
        message.From.Add(new MailboxAddress(senderName, senderEmail));
        message.To.Add(new MailboxAddress(fullName, user.Email));
        message.Subject = $"Payment Confirmation — {planName} | UPSC with Eshwar";

        var bodyBuilder = new BodyBuilder { HtmlBody = html };
        message.Body = bodyBuilder.ToMessageBody();

        using var client = new SmtpClient();
        await client.ConnectAsync(smtpHost, smtpPort, SecureSocketOptions.StartTls);
        await client.AuthenticateAsync(senderEmail, senderPass);
        await client.SendAsync(message);
        await client.DisconnectAsync(true);
    }

    // ─── Beautiful HTML Invoice Template ─────────────────────────────────────
    private static string BuildInvoiceHtml(
        string name, string email, string invoiceNo,
        string planName, string amount, string date, string txnId)
    {
        return $"""
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
          <title>Payment Invoice</title>
        </head>
        <body style="margin:0;padding:0;background:#f0f0f0;font-family:'Segoe UI',Arial,sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="background:#f0f0f0;padding:40px 0;">
            <tr>
              <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">

                  <!-- HEADER -->
                  <tr>
                    <td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);padding:40px 48px;text-align:center;">
                      <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:#C9A84C;font-weight:700;">UPSC WITH ESHWAR</p>
                      <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:800;">Payment Invoice</h1>
                      <p style="margin:12px 0 0;font-size:13px;color:rgba(255,255,255,0.5);">Thank you for joining the mentorship circle!</p>
                    </td>
                  </tr>

                  <!-- STATUS BANNER -->
                  <tr>
                    <td style="background:#059669;padding:14px 48px;text-align:center;">
                      <p style="margin:0;color:#ffffff;font-size:14px;font-weight:700;letter-spacing:1px;">
                        ✅ &nbsp; PAYMENT SUCCESSFUL
                      </p>
                    </td>
                  </tr>

                  <!-- INVOICE BODY -->
                  <tr>
                    <td style="padding:40px 48px;">

                      <!-- Greeting -->
                      <p style="font-size:16px;color:#1e293b;margin:0 0 24px;">
                        Dear <strong>{name}</strong>,
                      </p>
                      <p style="font-size:14px;color:#64748b;line-height:1.7;margin:0 0 32px;">
                        Your payment has been verified and your mentorship plan is now <strong>active</strong>.
                        Please keep this email as your receipt. Below are your transaction details.
                      </p>

                      <!-- Invoice Meta -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Invoice No</td>
                          <td align="right" style="font-size:13px;color:#0f172a;font-weight:700;">{invoiceNo}</td>
                        </tr>
                        <tr><td colspan="2" style="padding:6px 0;"><hr style="border:none;border-top:1px solid #f1f5f9;"/></td></tr>
                        <tr>
                          <td style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Date</td>
                          <td align="right" style="font-size:13px;color:#0f172a;font-weight:700;">{date}</td>
                        </tr>
                        <tr><td colspan="2" style="padding:6px 0;"><hr style="border:none;border-top:1px solid #f1f5f9;"/></td></tr>
                        <tr>
                          <td style="font-size:12px;color:#94a3b8;text-transform:uppercase;letter-spacing:1px;">Transaction ID</td>
                          <td align="right" style="font-size:12px;color:#0f172a;font-weight:600;font-family:monospace;">{txnId}</td>
                        </tr>
                      </table>

                      <!-- Plan Card -->
                      <table width="100%" cellpadding="0" cellspacing="0"
                             style="background:#fafafa;border:1px solid #e2e8f0;border-radius:12px;margin-bottom:32px;">
                        <tr>
                          <td style="padding:20px 24px;">
                            <p style="margin:0 0 4px;font-size:11px;color:#C9A84C;text-transform:uppercase;letter-spacing:2px;font-weight:700;">Plan Purchased</p>
                            <p style="margin:0;font-size:20px;color:#0f172a;font-weight:800;">{planName}</p>
                          </td>
                          <td align="right" style="padding:20px 24px;">
                            <p style="margin:0;font-size:28px;color:#0f172a;font-weight:900;">₹{amount}</p>
                            <p style="margin:4px 0 0;font-size:11px;color:#94a3b8;text-transform:uppercase;">INR</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Total Row -->
                      <table width="100%" cellpadding="0" cellspacing="0"
                             style="background:#0f172a;border-radius:10px;margin-bottom:36px;">
                        <tr>
                          <td style="padding:18px 24px;">
                            <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5);text-transform:uppercase;letter-spacing:1px;">Total Paid</p>
                          </td>
                          <td align="right" style="padding:18px 24px;">
                            <p style="margin:0;font-size:24px;color:#C9A84C;font-weight:900;">₹{amount}</p>
                          </td>
                        </tr>
                      </table>

                      <!-- Subscriber Info -->
                      <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                        <tr>
                          <td style="font-size:12px;color:#94a3b8;padding:6px 0;">Subscriber Name</td>
                          <td align="right" style="font-size:13px;color:#0f172a;font-weight:600;">{name}</td>
                        </tr>
                        <tr>
                          <td style="font-size:12px;color:#94a3b8;padding:6px 0;">Email</td>
                          <td align="right" style="font-size:13px;color:#0f172a;">{email}</td>
                        </tr>
                      </table>

                      <!-- CTA -->
                      <div style="text-align:center;margin-top:8px;">
                        <a href="https://upsc-mentorship-mcqh.vercel.app/dashboard"
                           style="display:inline-block;background:#C9A84C;color:#0f172a;padding:14px 40px;border-radius:50px;font-size:13px;font-weight:800;text-decoration:none;letter-spacing:1px;text-transform:uppercase;">
                          Access Your Dashboard →
                        </a>
                      </div>

                    </td>
                  </tr>

                  <!-- FOOTER -->
                  <tr>
                    <td style="background:#f8fafc;padding:28px 48px;border-top:1px solid #e2e8f0;text-align:center;">
                      <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.8;">
                        For any queries, contact us at
                        <a href="mailto:support@upsc-mentor.com" style="color:#C9A84C;text-decoration:none;">support@upsc-mentor.com</a><br/>
                        © 2026 UPSC with Eshwar. All rights reserved.
                      </p>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
        """;
    }
}
