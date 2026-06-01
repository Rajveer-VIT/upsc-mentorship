using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Application.Interfaces;

public interface IQuizRepository
{
    Task<Quiz?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Quiz?> GetByIdWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<IEnumerable<Quiz>> GetAllAsync(CancellationToken cancellationToken = default);
    Task<Quiz> AddAsync(Quiz quiz, CancellationToken cancellationToken = default);
    Task UpdateAsync(Quiz quiz, CancellationToken cancellationToken = default);
    
    Task<QuizAttempt> AddAttemptAsync(QuizAttempt attempt, CancellationToken cancellationToken = default);
    Task<QuizAttempt?> GetAttemptWithDetailsAsync(Guid attemptId, CancellationToken cancellationToken = default);
}
