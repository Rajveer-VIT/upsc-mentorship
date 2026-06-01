using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Persistence.Repositories;

public class ContactInquiryRepository : IContactInquiryRepository
{
    private readonly AppDbContext _context;

    public ContactInquiryRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ContactInquiry?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.ContactInquiries
            .FirstOrDefaultAsync(c => c.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<ContactInquiry>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.ContactInquiries.ToListAsync(cancellationToken);
    }

    public async Task AddAsync(ContactInquiry inquiry, CancellationToken cancellationToken = default)
    {
        await _context.ContactInquiries.AddAsync(inquiry, cancellationToken);
    }

    public async Task SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        await _context.SaveChangesAsync(cancellationToken);
    }
}
