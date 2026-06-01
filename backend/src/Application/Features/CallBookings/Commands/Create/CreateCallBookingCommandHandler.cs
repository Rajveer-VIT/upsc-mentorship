using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.CallBookings.Commands.Create;

public sealed class CreateCallBookingCommandHandler : IRequestHandler<CreateCallBookingCommand, ApiResponse<Guid>>
{
    private readonly ICallBookingRepository _repository;
    private static readonly TimeSpan Window = TimeSpan.FromDays(7);
    private const int MaxCalls = 1;

    public CreateCallBookingCommandHandler(ICallBookingRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<Guid>> Handle(CreateCallBookingCommand request, CancellationToken cancellationToken)
    {
        var recent = await _repository.GetRecentByPhoneOrEmailAsync(request.Phone, request.Email, Window, cancellationToken);
        if (recent != null)
        {
            var count = 0;
            foreach (var r in recent) count++;
            if (count >= MaxCalls)
            {
                return ApiResponse<Guid>.Failure("Rate limit exceeded for free calls. Please try later.");
            }
        }

        var booking = new CallBooking
        {
            FullName = request.FullName,
            Phone = request.Phone,
            Email = request.Email,
            PreferredTime = request.PreferredTime,
            DurationMinutes = request.DurationMinutes,
            Source = request.Source
        };

        await _repository.AddAsync(booking, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return ApiResponse<Guid>.Ok(booking.Id, "Call booked successfully.");
    }
}
