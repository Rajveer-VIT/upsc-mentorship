using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using UpscMentorship.Application.DTOs.Auth;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Domain.Enums;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Auth.Commands.AdminLogin;

public sealed class AdminLoginCommandHandler : IRequestHandler<AdminLoginCommand, ApiResponse<AuthResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _config;

    public AdminLoginCommandHandler(IUserRepository userRepository, IJwtService jwtService, IConfiguration config)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _config = config;
    }

    public async Task<ApiResponse<AuthResponseDto>> Handle(AdminLoginCommand request, CancellationToken cancellationToken)
    {
        var configUsername = _config["AdminSettings:Username"] ?? "admin";
        var configPassword = _config["AdminSettings:Password"] ?? "Admin@123";

        string inputUsername = request.Username.Trim();
        string email = inputUsername.Contains("@") ? inputUsername : "admin@upscmentorship.com";

        // Find existing admin in database
        var adminUser = await _userRepository.GetByEmailAsync(email, cancellationToken);

        if (adminUser == null)
        {
            // If admin doesn't exist in DB, check if input matches config credentials
            if (inputUsername == configUsername && request.Password == configPassword)
            {
                adminUser = new User
                {
                    Id = Guid.NewGuid(),
                    FirstName = "Admin",
                    LastName = "System",
                    Email = "admin@upscmentorship.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(configPassword),
                    Role = Role.Admin
                };
                await _userRepository.AddAsync(adminUser, cancellationToken);
                await _userRepository.SaveChangesAsync(cancellationToken);
            }
            else
            {
                return ApiResponse<AuthResponseDto>.Failure("Invalid admin credentials.");
            }
        }
        else
        {
            // If admin exists, verify password against the database hashed password
            bool isPasswordValid = BCrypt.Net.BCrypt.Verify(request.Password, adminUser.PasswordHash);
            if (!isPasswordValid)
            {
                // Extra safety: If they updated appsettings.json to reset, check if matches config
                if (inputUsername == configUsername && request.Password == configPassword)
                {
                    adminUser.PasswordHash = BCrypt.Net.BCrypt.HashPassword(configPassword);
                    await _userRepository.SaveChangesAsync(cancellationToken);
                }
                else
                {
                    return ApiResponse<AuthResponseDto>.Failure("Invalid admin credentials.");
                }
            }
        }

        if (adminUser.Role != Role.Admin)
        {
            return ApiResponse<AuthResponseDto>.Failure("Access denied. Only administrators are allowed to login here.");
        }

        // Generate JWT token with Admin role
        var token = _jwtService.GenerateToken(adminUser);
        var refreshToken = _jwtService.GenerateRefreshToken();

        var response = new AuthResponseDto
        {
            AccessToken = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId = adminUser.Id,
            Email = adminUser.Email,
            FullName = $"{adminUser.FirstName} {adminUser.LastName}".Trim(),
            Role = adminUser.Role.ToString()
        };

        return ApiResponse<AuthResponseDto>.Ok(response, "Admin login successful.");
    }
}
