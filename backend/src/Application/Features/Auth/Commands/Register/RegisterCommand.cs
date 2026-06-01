// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Application\Features\Auth\Commands\Register\RegisterCommand.cs
using MediatR;
using UpscMentorship.Application.DTOs.Auth;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Auth.Commands.Register;

public sealed record RegisterCommand(
    string Email,
    string Password,
    string FullName,
    string Phone) : IRequest<ApiResponse<AuthResponseDto>>;
