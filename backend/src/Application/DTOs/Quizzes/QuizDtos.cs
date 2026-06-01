using System;
using System.Collections.Generic;

namespace UpscMentorship.Application.DTOs.Quizzes;

public class QuizDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public int TotalMarks { get; set; }
    public int PassingMarks { get; set; }
    public int TimeLimitMinutes { get; set; }
    public int? Year { get; set; }
    public string ExamType { get; set; } = string.Empty;
    public List<QuestionDto> Questions { get; set; } = new();
}

public class QuestionDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public int Marks { get; set; }
    public int NegativeMarks { get; set; }
    public List<OptionDto> Options { get; set; } = new();
}

public class OptionDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    // Intentionally omit IsCorrect to prevent cheating
}

public class SubmitQuizRequestDto
{
    public Dictionary<Guid, Guid?> Answers { get; set; } = new(); // QuestionId -> OptionId
    public int TimeTakenSeconds { get; set; }
}

public class QuizResultDto
{
    public Guid AttemptId { get; set; }
    public int Score { get; set; }
    public int TotalQuestions { get; set; }
    public int CorrectAnswers { get; set; }
    public int WrongAnswers { get; set; }
    public int SkippedAnswers { get; set; }
    public int TimeTakenSeconds { get; set; }
    public List<QuestionResultDto> DetailedResults { get; set; } = new();
}

public class QuestionResultDto
{
    public Guid QuestionId { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public Guid? SelectedOptionId { get; set; }
    public Guid CorrectOptionId { get; set; }
    public bool IsCorrect { get; set; }
    public List<OptionResultDto> Options { get; set; } = new();
}

public class OptionResultDto
{
    public Guid Id { get; set; }
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}
