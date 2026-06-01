// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Application\Features\Auth\Commands\Login\LoginCommandHandler.cs
using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.DTOs.Auth;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Exceptions;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandHandler : IRequestHandler<LoginCommand, ApiResponse<AuthResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;

    public LoginCommandHandler(IUserRepository userRepository, IJwtService jwtService)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
    }

    public async Task<ApiResponse<AuthResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        
        if (user == null)
        {
            return ApiResponse<AuthResponseDto>.Failure("Invalid email or password.");
        }

        if (user.Role == Domain.Enums.Role.Admin)
        {
            return ApiResponse<AuthResponseDto>.Failure("Admins must login through the admin portal.");
        }

        bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return ApiResponse<AuthResponseDto>.Failure("Invalid email or password.");
        }

        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        var response = new AuthResponseDto
        {
            AccessToken = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId = user.Id,
            Email = user.Email,
            FullName = $"{user.FirstName} {user.LastName}".Trim(),
            Role = user.Role.ToString()
        };

        return ApiResponse<AuthResponseDto>.Ok(response, "Login successful.");
    }
}
