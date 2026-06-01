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

namespace UpscMentorship.Application.Features.Auth.Commands.AdminRegister;

public class AdminRegisterCommandHandler : IRequestHandler<AdminRegisterCommand, ApiResponse<AuthResponseDto>>
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _config;

    public AdminRegisterCommandHandler(IUserRepository userRepository, IJwtService jwtService, IConfiguration config)
    {
        _userRepository = userRepository;
        _jwtService = jwtService;
        _config = config;
    }

    public async Task<ApiResponse<AuthResponseDto>> Handle(AdminRegisterCommand request, CancellationToken cancellationToken)
    {
        // 1. Verify Admin registration code
        var configAdminCode = _config["AdminSettings:RegistrationCode"] ?? "AdminSecured2026";
        if (request.AdminCode != configAdminCode)
        {
            return ApiResponse<AuthResponseDto>.Failure("Invalid admin registration verification code.");
        }

        // 2. Check if user already exists
        var existingUser = await _userRepository.GetByEmailAsync(request.Email, cancellationToken);
        if (existingUser != null)
        {
            return ApiResponse<AuthResponseDto>.Failure("User with this email already exists.");
        }

        var nameParts = request.FullName.Split(' ', 2, StringSplitOptions.RemoveEmptyEntries);
        var firstName = nameParts.Length > 0 ? nameParts[0] : request.FullName;
        var lastName = nameParts.Length > 1 ? nameParts[1] : string.Empty;

        // 3. Create Admin user in database
        var adminUser = new User
        {
            FirstName = firstName,
            LastName = lastName,
            Email = request.Email,
            PhoneNumber = request.Phone,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Role.Admin
        };

        await _userRepository.AddAsync(adminUser, cancellationToken);
        await _userRepository.SaveChangesAsync(cancellationToken);

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

        return ApiResponse<AuthResponseDto>.Ok(response, "Admin registered successfully.");
    }
}
