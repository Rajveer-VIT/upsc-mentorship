using System.Net.Http.Headers;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;
using UpscMentorship.Application.Interfaces;

namespace UpscMentorship.Infrastructure.Services;

public class RazorpayService : IRazorpayService
{
    private static readonly HttpClient Http = new() { Timeout = TimeSpan.FromSeconds(20) };
    private readonly string _baseUrl;
    private readonly string _keyId;
    private readonly string _keySecret;

    public RazorpayService(IConfiguration config)
    {
        _keyId = config["RazorpaySettings:KeyId"] ?? "";
        _keySecret = config["RazorpaySettings:KeySecret"] ?? "";
        // Overridable only for automated tests; defaults to the real Razorpay API.
        _baseUrl = (config["RazorpaySettings:BaseUrl"] ?? "https://api.razorpay.com/v1/").TrimEnd('/') + "/";
    }

    public string KeyId => _keyId;
    public bool IsConfigured => _keyId.Length > 0 && _keySecret.Length > 0;

    public async Task<string> CreateOrderAsync(decimal amountInr, string receipt, CancellationToken ct = default)
    {
        var payload = JsonSerializer.Serialize(new { amount = (long)Math.Round(amountInr * 100), currency = "INR", receipt });
        using var req = new HttpRequestMessage(HttpMethod.Post, _baseUrl + "orders") { Content = new StringContent(payload, Encoding.UTF8, "application/json") };
        req.Headers.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_keyId}:{_keySecret}")));
        using var res = await Http.SendAsync(req, ct);
        var body = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode) throw new InvalidOperationException($"Razorpay order creation failed: {body}");
        using var doc = JsonDocument.Parse(body);
        return doc.RootElement.GetProperty("id").GetString() ?? throw new InvalidOperationException("Razorpay returned no order id.");
    }

    public async Task<string> RefundAsync(string paymentId, decimal? amountInr = null, CancellationToken ct = default)
    {
        object payload = amountInr is { } a ? new { amount = (long)Math.Round(a * 100) } : new { };
        using var req = new HttpRequestMessage(HttpMethod.Post, $"{_baseUrl}payments/{paymentId}/refund")
        { Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json") };
        req.Headers.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.ASCII.GetBytes($"{_keyId}:{_keySecret}")));
        using var res = await Http.SendAsync(req, ct);
        var body = await res.Content.ReadAsStringAsync(ct);
        if (!res.IsSuccessStatusCode) throw new InvalidOperationException($"Razorpay refund failed: {body}");
        using var doc = JsonDocument.Parse(body);
        return doc.RootElement.GetProperty("id").GetString() ?? "";
    }

    public bool VerifySignature(string orderId, string paymentId, string signature)
    {
        using var hmac = new HMACSHA256(Encoding.UTF8.GetBytes(_keySecret));
        var expected = Convert.ToHexString(hmac.ComputeHash(Encoding.UTF8.GetBytes($"{orderId}|{paymentId}"))).ToLowerInvariant();
        return CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(expected), Encoding.UTF8.GetBytes(signature.ToLowerInvariant()));
    }
}
