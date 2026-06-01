// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Application\Features\Auth\Commands\Register\RegisterCommandValidator.cs
using FluentValidation;

namespace UpscMentorship.Application.Features.Auth.Commands.Register;

public sealed class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
    public RegisterCommandValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");

        RuleFor(v => v.Password)
            .NotEmpty().WithMessage("Password is required.")
            .MinimumLength(8).WithMessage("Password must be at least 8 characters long.");

        RuleFor(v => v.FullName)
            .NotEmpty().WithMessage("Full Name is required.")
            .MaximumLength(200).WithMessage("Full Name must not exceed 200 characters.");
            
        RuleFor(v => v.Phone)
            .NotEmpty().WithMessage("Phone is required.");
    }
}
