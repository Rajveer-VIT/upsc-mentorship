using UpscMentorship.Domain.Common;
using System;

namespace UpscMentorship.Domain.Entities;

public class QuizAttemptAnswer : BaseEntity
{
    public Guid QuizAttemptId { get; set; }
    public QuizAttempt QuizAttempt { get; set; } = null!;

    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    public Guid? SelectedOptionId { get; set; } // Null means skipped
    public Option? SelectedOption { get; set; }

    public bool IsCorrect { get; set; }
}
