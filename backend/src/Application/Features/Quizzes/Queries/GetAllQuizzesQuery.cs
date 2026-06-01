using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.DTOs.Quizzes;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Quizzes.Queries;

public class GetAllQuizzesQuery : IRequest<ApiResponse<List<QuizDto>>>
{
    public string? Subject { get; set; }
    public int? Year { get; set; }
}

public class GetAllQuizzesQueryHandler : IRequestHandler<GetAllQuizzesQuery, ApiResponse<List<QuizDto>>>
{
    private readonly IQuizRepository _quizRepository;

    public GetAllQuizzesQueryHandler(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<ApiResponse<List<QuizDto>>> Handle(GetAllQuizzesQuery request, CancellationToken cancellationToken)
    {
        var quizzes = await _quizRepository.GetAllAsync(cancellationToken);
        
        if (!string.IsNullOrEmpty(request.Subject))
            quizzes = quizzes.Where(q => q.Category.Contains(request.Subject, StringComparison.OrdinalIgnoreCase));
        if (request.Year.HasValue)
            quizzes = quizzes.Where(q => q.Year == request.Year.Value);

        var dtos = quizzes.Select(q => new QuizDto
        {
            Id = q.Id,
            Title = q.Title,
            Description = q.Description,
            Category = q.Category,
            TotalMarks = q.TotalMarks,
            PassingMarks = q.PassingMarks,
            TimeLimitMinutes = q.TimeLimitMinutes,
            Year = q.Year,
            ExamType = q.ExamType
        }).ToList();

        return ApiResponse<List<QuizDto>>.Ok(dtos, "Quizzes retrieved successfully");
    }
}
