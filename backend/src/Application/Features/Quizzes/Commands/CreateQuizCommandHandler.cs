using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Quizzes.Commands;

public class CreateQuizCommandHandler : IRequestHandler<CreateQuizCommand, ApiResponse<Guid>>
{
    private readonly IQuizRepository _quizRepository;

    public CreateQuizCommandHandler(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<ApiResponse<Guid>> Handle(CreateQuizCommand request, CancellationToken cancellationToken)
    {
        var quiz = new Quiz
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Category = request.Category,
            TotalMarks = request.TotalMarks,
            PassingMarks = request.PassingMarks,
            TimeLimitMinutes = request.TimeLimitMinutes,
            Year = request.Year,
            ExamType = request.ExamType
        };

        foreach (var qDto in request.Questions)
        {
            var question = new Question
            {
                Id = Guid.NewGuid(),
                QuizId = quiz.Id,
                Content = qDto.Content,
                Explanation = qDto.Explanation,
                Marks = qDto.Marks,
                NegativeMarks = qDto.NegativeMarks
            };

            foreach (var oDto in qDto.Options)
            {
                question.Options.Add(new Option
                {
                    Id = Guid.NewGuid(),
                    QuestionId = question.Id,
                    Content = oDto.Content,
                    IsCorrect = oDto.IsCorrect
                });
            }

            quiz.Questions.Add(question);
        }

        await _quizRepository.AddAsync(quiz, cancellationToken);
        return ApiResponse<Guid>.Ok(quiz.Id, "Quiz created successfully");
    }
}
