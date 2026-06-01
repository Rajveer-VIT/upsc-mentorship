using MediatR;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.DTOs.Auth;
using UpscMentorship.Domain.Enums;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Auth.Commands.AdminLogin;

public class AdminLoginCommand : IRequest<ApiResponse<AuthResponseDto>>
{
    public string Username { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
}
