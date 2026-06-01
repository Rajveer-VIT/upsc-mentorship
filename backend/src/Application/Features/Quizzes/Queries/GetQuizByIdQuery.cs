using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.DTOs.Quizzes;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Quizzes.Queries;

public class GetQuizByIdQuery : IRequest<ApiResponse<QuizDto>>
{
    public Guid Id { get; set; }
}

public class GetQuizByIdQueryHandler : IRequestHandler<GetQuizByIdQuery, ApiResponse<QuizDto>>
{
    private readonly IQuizRepository _quizRepository;

    public GetQuizByIdQueryHandler(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<ApiResponse<QuizDto>> Handle(GetQuizByIdQuery request, CancellationToken cancellationToken)
    {
        var quiz = await _quizRepository.GetByIdWithDetailsAsync(request.Id, cancellationToken);
        if (quiz == null)
            return ApiResponse<QuizDto>.Failure("Quiz not found");

        var dto = new QuizDto
        {
            Id = quiz.Id,
            Title = quiz.Title,
            Description = quiz.Description,
            Category = quiz.Category,
            TotalMarks = quiz.TotalMarks,
            PassingMarks = quiz.PassingMarks,
            TimeLimitMinutes = quiz.TimeLimitMinutes,
            Year = quiz.Year,
            ExamType = quiz.ExamType,
            Questions = quiz.Questions.Select(q => new QuestionDto
            {
                Id = q.Id,
                Content = q.Content,
                Marks = q.Marks,
                NegativeMarks = q.NegativeMarks,
                Options = q.Options.Select(o => new OptionDto
                {
                    Id = o.Id,
                    Content = o.Content
                }).ToList()
            }).ToList()
        };

        return ApiResponse<QuizDto>.Ok(dto, "Quiz retrieved successfully");
    }
}
