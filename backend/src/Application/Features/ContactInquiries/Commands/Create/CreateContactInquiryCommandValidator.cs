using FluentValidation;

namespace UpscMentorship.Application.Features.ContactInquiries.Commands.Create;

public sealed class CreateContactInquiryCommandValidator : AbstractValidator<CreateContactInquiryCommand>
{
    public CreateContactInquiryCommandValidator()
    {
        RuleFor(x => x.FullName)
            .NotEmpty().WithMessage("Full Name is required.")
            .MinimumLength(2).WithMessage("Full Name must be at least 2 characters.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email address is required.")
            .EmailAddress().WithMessage("A valid email address is required.");

        RuleFor(x => x.Subject)
            .NotEmpty().WithMessage("Subject is required.")
            .MinimumLength(5).WithMessage("Subject must be at least 5 characters.");

        RuleFor(x => x.Message)
            .NotEmpty().WithMessage("Message is required.")
            .MinimumLength(20).WithMessage("Message must be at least 20 characters.");
    }
}
