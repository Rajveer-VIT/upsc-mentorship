using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
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
    private readonly IConfiguration _config;
    private static readonly HttpClient _httpClient = new HttpClient();

    public PaymentsController(AppDbContext db, IConfiguration config)
    {
        _db = db;
        _config = config;
    }

    public class CreateOrderRequest
    {
        public string PlanId { get; set; } = string.Empty;
    }

    public class VerifyPaymentRequest
    {
        public string RazorpayOrderId { get; set; } = string.Empty;
        public string RazorpayPaymentId { get; set; } = string.Empty;
        public string RazorpaySignature { get; set; } = string.Empty;
    }

    [HttpPost("create-order")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderRequest request)
    {
        // 1. Authenticate user
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Failure("Unauthorized. Please log in."));
        }

        // Verify user exists
        var user = await _db.Users.FindAsync(userId);
        if (user == null)
        {
            return Unauthorized(ApiResponse<object>.Failure("User not found."));
        }

        // 2. Determine price in INR
        decimal amountInInr = request.PlanId switch
        {
            "study-plan" => 299m,
            "single-session" => 499m,
            "doubt-clearing" => 599m,
            "monthly-1on1" => 1999m,
            "intensive-1on1" => 3999m,
            "annual-plan" => 17999m,
            _ => 0m
        };

        if (amountInInr == 0m)
        {
            return BadRequest(ApiResponse<object>.Failure("Invalid plan selected."));
        }

        long amountInPaise = (long)(amountInInr * 100);

        // 3. Read Razorpay settings
        var keyId = _config["RazorpaySettings:KeyId"];
        var keySecret = _config["RazorpaySettings:KeySecret"];

        if (string.IsNullOrEmpty(keyId) || string.IsNullOrEmpty(keySecret))
        {
            return StatusCode(500, ApiResponse<object>.Failure("Razorpay payment gateway is not configured properly on the server."));
        }

        // 4. Create Order with Razorpay REST API
        var receiptId = Guid.NewGuid().ToString("N");
        var payload = new
        {
            amount = amountInPaise,
            currency = "INR",
            receipt = receiptId
        };

        var jsonPayload = JsonSerializer.Serialize(payload);
        var requestMessage = new HttpRequestMessage(HttpMethod.Post, "https://api.razorpay.com/v1/orders")
        {
            Content = new StringContent(jsonPayload, Encoding.UTF8, "application/json")
        };

        var authHeaderValue = Convert.ToBase64String(Encoding.ASCII.GetBytes($"{keyId}:{keySecret}"));
        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeaderValue);

        try
        {
            var response = await _httpClient.SendAsync(requestMessage);
            var responseContent = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, ApiResponse<object>.Failure($"Razorpay order creation failed: {responseContent}"));
            }

            using var doc = JsonDocument.Parse(responseContent);
            var root = doc.RootElement;
            if (!root.TryGetProperty("id", out var orderIdElement))
            {
                return StatusCode(500, ApiResponse<object>.Failure("Failed to retrieve order ID from payment gateway response."));
            }

            var razorpayOrderId = orderIdElement.GetString();
            if (string.IsNullOrEmpty(razorpayOrderId))
            {
                return StatusCode(500, ApiResponse<object>.Failure("Failed to retrieve valid order ID."));
            }

            // 5. Save pending Payment record in DB
            var payment = new Payment
            {
                UserId = userId,
                PlanId = request.PlanId,
                Amount = amountInInr,
                Currency = "INR",
                RazorpayOrderId = razorpayOrderId,
                Status = "Pending"
            };

            _db.Payments.Add(payment);
            await _db.SaveChangesAsync();

            // 6. Return parameters to frontend
            var responseData = new
            {
                orderId = razorpayOrderId,
                amount = amountInPaise,
                currency = "INR",
                keyId = keyId,
                userEmail = user.Email,
                userPhone = "", // placeholder as we don't store user phone by default
                userName = $"{user.FirstName} {user.LastName}".Trim()
            };

            return Ok(ApiResponse<object>.Ok(responseData, "Payment order created successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Failure($"An error occurred while preparing the payment: {ex.Message}"));
        }
    }

    [HttpPost("verify")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> VerifyPayment([FromBody] VerifyPaymentRequest request)
    {
        // 1. Authenticate user
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Failure("Unauthorized. Please log in."));
        }

        // 2. Validate parameters
        if (string.IsNullOrEmpty(request.RazorpayOrderId) ||
            string.IsNullOrEmpty(request.RazorpayPaymentId) ||
            string.IsNullOrEmpty(request.RazorpaySignature))
        {
            return BadRequest(ApiResponse<object>.Failure("Missing signature verification parameters."));
        }

        // Find the payment record matching order ID
        var payment = await _db.Payments
            .FirstOrDefaultAsync(p => p.RazorpayOrderId == request.RazorpayOrderId && p.UserId == userId);

        if (payment == null)
        {
            return NotFound(ApiResponse<object>.Failure("Transaction record not found."));
        }

        // 3. Read Key Secret
        var keySecret = _config["RazorpaySettings:KeySecret"];
        if (string.IsNullOrEmpty(keySecret))
        {
            return StatusCode(500, ApiResponse<object>.Failure("Razorpay credentials are not configured on the server."));
        }

        // 4. Compute Razorpay signature verification
        // formula: HMAC-SHA256(order_id + "|" + payment_id, key_secret)
        var message = $"{request.RazorpayOrderId}|{request.RazorpayPaymentId}";
        var keyBytes = Encoding.UTF8.GetBytes(keySecret);
        var messageBytes = Encoding.UTF8.GetBytes(message);

        using var hmac = new HMACSHA256(keyBytes);
        var hashBytes = hmac.ComputeHash(messageBytes);
        
        var sb = new StringBuilder();
        foreach (var b in hashBytes)
        {
            sb.Append(b.ToString("x2"));
        }
        var computedSignature = sb.ToString();

        if (computedSignature.Equals(request.RazorpaySignature, StringComparison.OrdinalIgnoreCase))
        {
            // Payment verified successfully
            payment.Status = "Success";
            payment.RazorpayPaymentId = request.RazorpayPaymentId;
            payment.RazorpaySignature = request.RazorpaySignature;
            
            await _db.SaveChangesAsync();

            return Ok(ApiResponse<object>.Ok(new { status = "Success" }, "Payment verified successfully. Plan activated!"));
        }
        else
        {
            // Verification failed
            payment.Status = "Failed";
            payment.RazorpayPaymentId = request.RazorpayPaymentId;
            payment.RazorpaySignature = request.RazorpaySignature;
            
            await _db.SaveChangesAsync();

            return BadRequest(ApiResponse<object>.Failure("Payment verification failed. Invalid signature."));
        }
    }
}
