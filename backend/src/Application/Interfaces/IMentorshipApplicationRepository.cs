using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Application.Interfaces;

public interface IMentorshipApplicationRepository
{
    Task<MentorshipApplication?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<MentorshipApplication>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(MentorshipApplication application, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
