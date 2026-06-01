// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Application\Interfaces\IJwtService.cs
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Application.Interfaces;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
}
