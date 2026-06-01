using MediatR;
using System;
using UpscMentorship.Application.DTOs.Quizzes;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.Quizzes.Commands;

public class SubmitQuizCommand : IRequest<ApiResponse<QuizResultDto>>
{
    public Guid QuizId { get; set; }
    public Guid UserId { get; set; }
    public SubmitQuizRequestDto Data { get; set; } = null!;
}
