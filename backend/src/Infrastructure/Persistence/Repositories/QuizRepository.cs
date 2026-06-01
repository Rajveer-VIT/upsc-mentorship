using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Persistence.Repositories;

public class QuizRepository : IQuizRepository
{
    private readonly AppDbContext _context;

    public QuizRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Quiz?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Quizzes
            .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);
    }

    public async Task<Quiz?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await _context.Quizzes
            .Include(q => q.Questions)
                .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(q => q.Id == id, cancellationToken);
    }

    public async Task<IEnumerable<Quiz>> GetAllAsync(CancellationToken cancellationToken = default)
    {
        return await _context.Quizzes.ToListAsync(cancellationToken);
    }

    public async Task<Quiz> AddAsync(Quiz quiz, CancellationToken cancellationToken = default)
    {
        await _context.Quizzes.AddAsync(quiz, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return quiz;
    }

    public async Task UpdateAsync(Quiz quiz, CancellationToken cancellationToken = default)
    {
        _context.Quizzes.Update(quiz);
        await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task<QuizAttempt> AddAttemptAsync(QuizAttempt attempt, CancellationToken cancellationToken = default)
    {
        await _context.QuizAttempts.AddAsync(attempt, cancellationToken);
        await _context.SaveChangesAsync(cancellationToken);
        return attempt;
    }

    public async Task<QuizAttempt?> GetAttemptWithDetailsAsync(Guid attemptId, CancellationToken cancellationToken = default)
    {
        return await _context.QuizAttempts
            .Include(a => a.Answers)
                .ThenInclude(ans => ans.Question)
                    .ThenInclude(q => q.Options)
            .FirstOrDefaultAsync(a => a.Id == attemptId, cancellationToken);
    }
}
