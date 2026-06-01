using UpscMentorship.Domain.Common;
using System.Collections.Generic;

namespace UpscMentorship.Domain.Entities;

/// <summary>
/// Represents a quiz or test.
/// </summary>
public class Quiz : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty; // e.g., History, Polity
    public int TotalMarks { get; set; }
    public int PassingMarks { get; set; }
    
    // New fields for PYQ & Attempt Tracking
    public int TimeLimitMinutes { get; set; }
    public int? Year { get; set; }
    public string ExamType { get; set; } = "Mock"; // e.g. "Prelims", "Mains", "Mock"

    // Navigation
    public ICollection<Question> Questions { get; set; } = new List<Question>();
    public ICollection<QuizAttempt> Attempts { get; set; } = new List<QuizAttempt>();
}
