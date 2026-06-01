using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Application.Interfaces;

public interface ICallBookingRepository
{
    Task<CallBooking?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<CallBooking>> GetRecentByPhoneOrEmailAsync(string phone, string? email, TimeSpan window, CancellationToken cancellationToken = default);
    Task AddAsync(CallBooking booking, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
