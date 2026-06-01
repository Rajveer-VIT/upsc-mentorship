using MediatR;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.MentorshipApplications.Commands.Create;

public sealed record CreateMentorshipApplicationCommand(
    string Name,
    string Phone,
    string? Email,
    string Stage,
    string Goals) : IRequest<ApiResponse<Guid>>;
