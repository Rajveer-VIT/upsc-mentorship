using UpscMentorship.Domain.Common;
using System;
using System.Collections.Generic;

namespace UpscMentorship.Domain.Entities;

public class Question : BaseEntity
{
    public Guid QuizId { get; set; }
    public Quiz Quiz { get; set; } = null!;

    public string Content { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public int Marks { get; set; } = 2; // Default for UPSC prelims
    public int NegativeMarks { get; set; } = 1; // E.g., 0.66 represented properly or scaled

    public ICollection<Option> Options { get; set; } = new List<Option>();
}
