using FluentValidation;

namespace UpscMentorship.Application.Features.MentorshipApplications.Commands.Create;

public sealed class CreateMentorshipApplicationCommandValidator : AbstractValidator<CreateMentorshipApplicationCommand>
{
    public CreateMentorshipApplicationCommandValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("Name is required.")
            .MinimumLength(2).WithMessage("Name must be at least 2 characters.");

        RuleFor(x => x.Phone)
            .NotEmpty().WithMessage("Phone number is required.")
            .MinimumLength(10).WithMessage("Valid phone number is required.");

        RuleFor(x => x.Email)
            .EmailAddress().WithMessage("A valid email address is required.")
            .When(x => !string.IsNullOrEmpty(x.Email));

        RuleFor(x => x.Stage)
            .NotEmpty().WithMessage("UPSC preparation stage selection is required.");

        RuleFor(x => x.Goals)
            .NotEmpty().WithMessage("Goals description is required.")
            .MinimumLength(10).WithMessage("Please describe your goals in at least 10 characters.");
    }
}
