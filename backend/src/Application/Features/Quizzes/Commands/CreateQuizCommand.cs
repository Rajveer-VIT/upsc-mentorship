using MediatR;
using System;
using System.Collections.Generic;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Quizzes.Commands;

public class CreateQuizCommand : IRequest<ApiResponse<Guid>>
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string Category { get; set; } = string.Empty;
    public int TotalMarks { get; set; }
    public int PassingMarks { get; set; }
    public int TimeLimitMinutes { get; set; }
    public int? Year { get; set; }
    public string ExamType { get; set; } = string.Empty;
    public List<CreateQuestionDto> Questions { get; set; } = new();
}

public class CreateQuestionDto
{
    public string Content { get; set; } = string.Empty;
    public string? Explanation { get; set; }
    public int Marks { get; set; }
    public int NegativeMarks { get; set; }
    public List<CreateOptionDto> Options { get; set; } = new();
}

public class CreateOptionDto
{
    public string Content { get; set; } = string.Empty;
    public bool IsCorrect { get; set; }
}
