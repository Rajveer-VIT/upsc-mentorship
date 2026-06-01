using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Security.Claims;
using System.Threading.Tasks;
using UpscMentorship.Application.DTOs.Quizzes;
using UpscMentorship.Application.Features.Quizzes.Commands;
using UpscMentorship.Application.Features.Quizzes.Queries;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[Authorize]
public class QuizController : BaseController
{
    public QuizController(IMediator mediator) : base(mediator)
    {
    }

    [HttpGet]
    [ProducesResponseType(typeof(ApiResponse<List<QuizDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] string? subject, [FromQuery] int? year)
    {
        var query = new GetAllQuizzesQuery { Subject = subject, Year = year };
        return OkResponse(await Mediator.Send(query));
    }

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ApiResponse<QuizDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var query = new GetQuizByIdQuery { Id = id };
        return OkResponse(await Mediator.Send(query));
    }

    [HttpPost]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Create([FromBody] CreateQuizCommand command)
    {
        return OkResponse(await Mediator.Send(command));
    }

    [HttpPost("{id}/submit")]
    [ProducesResponseType(typeof(ApiResponse<QuizResultDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Submit(Guid id, [FromBody] SubmitQuizRequestDto requestDto)
    {
        var userIdString = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(userIdString, out var userId))
        {
            // Fallback for missing token during dev
            userId = Guid.NewGuid();
        }

        var command = new SubmitQuizCommand
        {
            QuizId = id,
            UserId = userId,
            Data = requestDto
        };
        return OkResponse(await Mediator.Send(command));
    }
}
