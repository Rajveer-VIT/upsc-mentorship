using FluentValidation;

namespace UpscMentorship.Application.Features.CallBookings.Commands.Create;

public sealed class CreateCallBookingCommandValidator : AbstractValidator<CreateCallBookingCommand>
{
    public CreateCallBookingCommandValidator()
    {
        RuleFor(x => x.FullName).NotEmpty().MinimumLength(2);
        RuleFor(x => x.Phone).NotEmpty().MinimumLength(10);
        RuleFor(x => x.Email).EmailAddress().When(x => !string.IsNullOrEmpty(x.Email));
    }
}
