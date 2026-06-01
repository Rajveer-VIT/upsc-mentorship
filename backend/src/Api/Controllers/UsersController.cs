// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Api\Controllers\UsersController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Security.Claims;
using System.Threading.Tasks;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[Authorize]
public class UsersController : BaseController
{
    public UsersController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Gets the profile of the currently authenticated user.
    /// </summary>
    /// <returns>The user profile.</returns>
    [HttpGet("me")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentProfile()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Failure("Invalid user token."));
        }

        // Stub for future GetUserProfileQuery(userId)
        var stubResult = ApiResponse<object>.Ok(new { Id = userId, Message = "Profile endpoint stub" }, "Success");
        return OkResponse(stubResult);
    }

    /// <summary>
    /// Updates the profile of the currently authenticated user.
    /// </summary>
    /// <returns>The updated user profile.</returns>
    [HttpPut("me")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> UpdateCurrentProfile()
    {
        var userIdClaim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        
        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized(ApiResponse<object>.Failure("Invalid user token."));
        }

        // Stub for future UpdateUserProfileCommand
        var stubResult = ApiResponse<object>.Failure("Update profile endpoint is not implemented yet.");
        return OkResponse(stubResult);
    }
}
