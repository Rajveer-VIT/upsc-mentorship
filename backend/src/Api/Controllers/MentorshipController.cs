using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using UpscMentorship.Application.Features.MentorshipApplications.Commands.Create;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[AllowAnonymous]
public class MentorshipController : BaseController
{
    public MentorshipController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Submits a new mentorship application.
    /// </summary>
    /// <param name="command">The application details.</param>
    /// <returns>The generated application ID.</returns>
    [HttpPost("apply")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Apply([FromBody] CreateMentorshipApplicationCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result);
    }
}
