// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Api\Controllers\BaseController.cs
using MediatR;
using Microsoft.AspNetCore.Mvc;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public abstract class BaseController : ControllerBase
{
    protected readonly IMediator Mediator;

    protected BaseController(IMediator mediator)
    {
        Mediator = mediator;
    }

    protected IActionResult OkResponse<T>(ApiResponse<T> result)
    {
        if (result.Success)
        {
            return Ok(result);
        }

        return BadRequest(result);
    }
}
