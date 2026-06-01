using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Persistence.Repositories;

public class CallBookingRepository : ICallBookingRepository
{
    private readonly AppDbContext _context;

    public CallBookingRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<CallBooking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Set<CallBooking>().FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<CallBooking>> GetRecentByPhoneOrEmailAsync(string phone, string? email, TimeSpan window, CancellationToken cancellationToken = default)
    {
        var cutoff = DateTime.UtcNow - window;
        var q = _context.Set<CallBooking>().Where(b => b.BookedAt >= cutoff && (b.Phone == phone || (email != null && b.Email == email)));
        return await q.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(CallBooking booking, CancellationToken cancellationToken = default)
    {
        await _context.Set<CallBooking>().AddAsync(booking, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
