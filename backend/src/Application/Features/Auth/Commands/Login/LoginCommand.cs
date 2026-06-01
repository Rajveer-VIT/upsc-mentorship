// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Application\Features\Auth\Commands\Login\LoginCommand.cs
using MediatR;
using UpscMentorship.Application.DTOs.Auth;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Auth.Commands.Login;

public sealed record LoginCommand(
    string Email,
    string Password) : IRequest<ApiResponse<AuthResponseDto>>;
