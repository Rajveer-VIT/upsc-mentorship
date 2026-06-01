// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Application\Interfaces\IUserRepository.cs
using System;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Application.Interfaces;

public interface IUserRepository
{
    Task<User?> GetByEmailAsync(string email, CancellationToken cancellationToken = default);
    Task<User?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task AddAsync(User user, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
