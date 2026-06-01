using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Application.Interfaces;

public interface IContactInquiryRepository
{
    Task<ContactInquiry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<ContactInquiry>> GetAllAsync(CancellationToken cancellationToken = default);
    Task AddAsync(ContactInquiry inquiry, CancellationToken cancellationToken = default);
    Task SaveChangesAsync(CancellationToken cancellationToken = default);
}
