// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Api\Controllers\AuthController.cs
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using UpscMentorship.Application.DTOs.Auth;
using UpscMentorship.Application.Features.Auth.Commands.AdminLogin;
using UpscMentorship.Application.Features.Auth.Commands.AdminRegister;
using UpscMentorship.Application.Features.Auth.Commands.Login;
using UpscMentorship.Application.Features.Auth.Commands.Register;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[AllowAnonymous]
public class AuthController : BaseController
{
    public AuthController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Registers a new user.
    /// </summary>
    /// <param name="command">The registration details.</param>
    /// <returns>Authentication tokens and basic user profile.</returns>
    [HttpPost("register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Register([FromBody] RegisterCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result);
    }

    /// <summary>
    /// Authenticates a user and returns JWT tokens.
    /// </summary>
    /// <param name="command">The login credentials.</param>
    /// <returns>Authentication tokens and basic user profile.</returns>
    [HttpPost("login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Login([FromBody] LoginCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result);
    }

    /// <summary>
    /// Admin login with database credentials.
    /// </summary>
    /// <param name="command">The admin login credentials (username & password).</param>
    /// <returns>Authentication tokens with Admin role.</returns>
    [HttpPost("admin-login")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AdminLogin([FromBody] AdminLoginCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result);
    }

    /// <summary>
    /// Admin registration with verification code.
    /// </summary>
    /// <param name="command">The admin registration details.</param>
    /// <returns>Authentication tokens with Admin role.</returns>
    [HttpPost("admin-register")]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<AuthResponseDto>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> AdminRegister([FromBody] AdminRegisterCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result);
    }

    /// <summary>
    /// Refreshes the authentication tokens.
    /// </summary>
    /// <returns>New authentication tokens.</returns>
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<object>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Refresh()
    {
        // Stub for future RefreshTokenCommand
        var stubResult = ApiResponse<object>.Failure("Refresh token endpoint is not implemented yet.");
        return OkResponse(stubResult);
    }
}
