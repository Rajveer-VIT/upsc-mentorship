using MediatR;
using UpscMentorship.Application.DTOs.Auth;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Auth.Commands.AdminRegister;

public sealed record AdminRegisterCommand(
    string Email,
    string Password,
    string FullName,
    string Phone,
    string AdminCode) : IRequest<ApiResponse<AuthResponseDto>>;
