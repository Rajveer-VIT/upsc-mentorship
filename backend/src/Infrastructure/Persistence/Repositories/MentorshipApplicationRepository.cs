using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Persistence.Repositories;

public class MentorshipApplicationRepository : IMentorshipApplicationRepository
{
    private readonly AppDbContext _context;

    public MentorshipApplicationRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<MentorshipApplication?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.MentorshipApplications
            .FirstOrDefaultAsync(m => m.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<MentorshipApplication>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.MentorshipApplications.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(MentorshipApplication application, CancellationToken cancellationToken = default)
    {
        await _context.MentorshipApplications.AddAsync(application, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
