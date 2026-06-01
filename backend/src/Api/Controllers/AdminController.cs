using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Domain.Enums;
using UpscMentorship.Infrastructure.Persistence;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[Authorize(Roles = "Admin")]
[ApiController]
[Route("api/[controller]")]
public class AdminController : ControllerBase
{
    private readonly AppDbContext _db;

    public AdminController(AppDbContext db)
    {
        _db = db;
    }

    public class UpdateStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }

    public class ChangePasswordRequest
    {
        public string OldPassword { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }

    [HttpGet("users")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetAllUsers()
    {
        try
        {
            var users = await _db.Users
                .OrderByDescending(u => u.CreatedAt)
                .Select(u => new
                {
                    u.Id,
                    u.FirstName,
                    u.LastName,
                    u.Email,
                    u.PhoneNumber,
                    u.Address,
                    u.City,
                    Role = u.Role.ToString(),
                    u.CreatedAt
                })
                .ToListAsync();

            return Ok(ApiResponse<object>.Ok(users, "Users retrieved successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Failure($"An error occurred: {ex.Message}"));
        }
    }

    [HttpGet("payments")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllPayments()
    {
        try
        {
            var payments = await _db.Payments
                .Include(p => p.User)
                .OrderByDescending(p => p.CreatedAt)
                .Select(p => new
                {
                    p.Id,
                    p.UserId,
                    UserEmail = p.User != null ? p.User.Email : "n/a",
                    UserFullName = p.User != null ? $"{p.User.FirstName} {p.User.LastName}".Trim() : "Deleted User",
                    p.PlanId,
                    p.Amount,
                    p.Currency,
                    p.RazorpayOrderId,
                    p.RazorpayPaymentId,
                    p.Status,
                    p.CreatedAt
                })
                .ToListAsync();

            return Ok(ApiResponse<object>.Ok(payments, "Payments retrieved successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Failure($"An error occurred: {ex.Message}"));
        }
    }

    [HttpGet("contact-inquiries")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllContactInquiries()
    {
        try
        {
            var inquiries = await _db.ContactInquiries
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(ApiResponse<object>.Ok(inquiries, "Contact inquiries retrieved successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Failure($"An error occurred: {ex.Message}"));
        }
    }

    [HttpGet("call-bookings")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllCallBookings()
    {
        try
        {
            var bookings = await _db.CallBookings
                .OrderByDescending(c => c.CreatedAt)
                .ToListAsync();

            return Ok(ApiResponse<object>.Ok(bookings, "Call bookings retrieved successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Failure($"An error occurred: {ex.Message}"));
        }
    }

    [HttpGet("mentorship-applications")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetAllMentorshipApplications()
    {
        try
        {
            var applications = await _db.MentorshipApplications
                .OrderByDescending(m => m.CreatedAt)
                .ToListAsync();

            return Ok(ApiResponse<object>.Ok(applications, "Mentorship applications retrieved successfully."));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<object>.Failure($"An error occurred: {ex.Message}"));
        }
    }

    [HttpPut("mentorship-applications/{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateMentorshipApplicationStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(ApiResponse<object>.Failure("Status cannot be empty."));
        }

        var application = await _db.MentorshipApplications.FindAsync(id);
        if (application == null)
        {
            return NotFound(ApiResponse<object>.Failure("Mentorship application not found."));
        }

        application.Status = request.Status;
        await _db.SaveChangesAsync();

        return Ok(ApiResponse<object>.Ok(new { application.Id, application.Status }, "Mentorship application status updated successfully."));
    }

    [HttpPut("contact-inquiries/{id}/status")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateContactInquiryStatus(Guid id, [FromBody] UpdateStatusRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Status))
        {
            return BadRequest(ApiResponse<object>.Failure("Status cannot be empty."));
        }

        var inquiry = await _db.ContactInquiries.FindAsync(id);
        if (inquiry == null)
        {
            return NotFound(ApiResponse<object>.Failure("Contact inquiry not found."));
        }

        inquiry.Status = request.Status;
        await _db.SaveChangesAsync();

        return Ok(ApiResponse<object>.Ok(new { inquiry.Id, inquiry.Status }, "Contact inquiry status updated successfully."));
    }

    [HttpPost("change-password")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        var userIdClaim = User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Failure("Unauthorized."));
        }

        var user = await _db.Users.FindAsync(userId);
        if (user == null || user.Role != Role.Admin)
        {
            // If the user logs in using config, but isn't database seeded, they must seed first
            // To make it fully supportable, let's seed or find by email
            user = await _db.Users.FirstOrDefaultAsync(u => u.Email == "admin@upscmentorship.com");
            if (user == null)
            {
                return NotFound(ApiResponse<object>.Failure("Admin user account not found in database. Please log out and log in again to initialize."));
            }
        }

        if (string.IsNullOrWhiteSpace(request.NewPassword))
        {
            return BadRequest(ApiResponse<object>.Failure("New password cannot be empty."));
        }

        if (!BCrypt.Net.BCrypt.Verify(request.OldPassword, user.PasswordHash))
        {
            return BadRequest(ApiResponse<object>.Failure("Incorrect old password."));
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        await _db.SaveChangesAsync();

        return Ok(ApiResponse<object>.Ok(null, "Password changed successfully."));
    }
}
