using UpscMentorship.Domain.Common;
using System;
using System.Collections.Generic;

namespace UpscMentorship.Domain.Entities;

public class QuizAttempt : BaseEntity
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;

    public Guid UserId { get; set; }
    // Navigation to User omitted for brevity, assuming standard setup

    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public int SkippedAnswers { get; set; }
    public int TimeTakenSeconds { get; set; }

    public ICollection<QuizAttemptAnswer> Answers { get; set; } = new List<QuizAttemptAnswer>();
}
