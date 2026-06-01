using MediatR;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.CallBookings.Commands.Create;

public sealed record CreateCallBookingCommand(
    string FullName,
    string Phone,
    string? Email,
    string? PreferredTime,
    int DurationMinutes,
    string? Source
) : IRequest<ApiResponse<System.Guid>>;
