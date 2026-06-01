using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using UpscMentorship.Application.Features.CallBookings.Commands.Create;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[AllowAnonymous]
public class CallsController : BaseController
{
    public CallsController(IMediator mediator) : base(mediator)
    {
    }

    [HttpPost("book")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Book([FromBody] CreateCallBookingCommand command)
    {
        var result = await Mediator.Send(command);
        if (!result.Success)
            return BadRequest(result);
        return OkResponse(result);
    }
}
