using UpscMentorship.Domain.Common;
using System;

namespace UpscMentorship.Domain.Entities;

public class Option : BaseEntity
{
    public Guid QuestionId { get; set; }
    public Question Question { get; set; } = null!;

    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}
