using MediatR;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.DTOs.Quizzes;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Quizzes.Commands;

public class SubmitQuizCommandHandler : IRequestHandler<SubmitQuizCommand, ApiResponse<QuizResultDto>>
{
    private readonly IQuizRepository _quizRepository;

    public SubmitQuizCommandHandler(IQuizRepository quizRepository)
    {
        _quizRepository = quizRepository;
    }

    public async Task<ApiResponse<QuizResultDto>> Handle(SubmitQuizCommand request, CancellationToken cancellationToken)
    {
        var quiz = await _quizRepository.GetByIdWithDetailsAsync(request.QuizId, cancellationToken);
        if (quiz == null)
            return ApiResponse<QuizResultDto>.Failure("Quiz not found");

        var attempt = new QuizAttempt
        {
            Id = Guid.NewGuid(),
            QuizId = quiz.Id,
            UserId = request.UserId,
            TimeTakenSeconds = request.Data.TimeTakenSeconds,
            TotalQuestions = quiz.Questions.Count
        };

        var resultDto = new QuizResultDto
        {
            AttemptId = attempt.Id,
            TotalQuestions = attempt.TotalQuestions,
            TimeTakenSeconds = attempt.TimeTakenSeconds
        };

        foreach (var question in quiz.Questions)
        {
            var correctOption = question.Options.FirstOrDefault(o => o.IsCorrect);
            request.Data.Answers.TryGetValue(question.Id, out var selectedOptionId);

            var answer = new QuizAttemptAnswer
            {
                Id = Guid.NewGuid(),
                QuizAttemptId = attempt.Id,
                QuestionId = question.Id,
                SelectedOptionId = selectedOptionId,
                IsCorrect = selectedOptionId == correctOption?.Id
            };
            attempt.Answers.Add(answer);

            if (selectedOptionId == null) attempt.SkippedAnswers++;
            else if (answer.IsCorrect) attempt.CorrectAnswers++;
            else attempt.WrongAnswers++;

            attempt.Score += answer.IsCorrect ? question.Marks : (selectedOptionId != null ? -question.NegativeMarks : 0);

            // Populate DTO
            var qResult = new QuestionResultDto
            {
                QuestionId = question.Id,
                Content = question.Content,
                Explanation = question.Explanation,
                SelectedOptionId = selectedOptionId,
                CorrectOptionId = correctOption?.Id ?? Guid.Empty,
                IsCorrect = answer.IsCorrect,
                Options = question.Options.Select(o => new OptionResultDto
                {
                    Id = o.Id,
                    Content = o.Content,
                    IsCorrect = o.IsCorrect
                }).ToList()
            };
            resultDto.DetailedResults.Add(qResult);
        }

        resultDto.Score = attempt.Score;
        resultDto.CorrectAnswers = attempt.CorrectAnswers;
        resultDto.WrongAnswers = attempt.WrongAnswers;
        resultDto.SkippedAnswers = attempt.SkippedAnswers;

        await _quizRepository.AddAttemptAsync(attempt, cancellationToken);

        return ApiResponse<QuizResultDto>.Ok(resultDto, "Quiz submitted successfully");
    }
}
