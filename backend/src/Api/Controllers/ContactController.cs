using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using UpscMentorship.Application.Features.ContactInquiries.Commands.Create;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[AllowAnonymous]
public class ContactController : BaseController
{
    public ContactController(IMediator mediator) : base(mediator)
    {
    }

    /// <summary>
    /// Submits a general contact/inquiry.
    /// </summary>
    /// <param name="command">The inquiry details.</param>
    /// <returns>The generated inquiry ID.</returns>
    [HttpPost("submit")]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ApiResponse<Guid>), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Submit([FromBody] CreateContactInquiryCommand command)
    {
        var result = await Mediator.Send(command);
        return OkResponse(result);
    }
}
