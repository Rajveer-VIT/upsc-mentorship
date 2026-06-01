// c:\Users\HP\.gemini\antigravity\scratch\upsc-mentorship\backend\src\Application\Features\Auth\Commands\Login\LoginCommandValidator.cs
using FluentValidation;

namespace UpscMentorship.Application.Features.Auth.Commands.Login;

public sealed class LoginCommandValidator : AbstractValidator<LoginCommand>
{
    public LoginCommandValidator()
    {
        RuleFor(v => v.Email)
            .NotEmpty().WithMessage("Email is required.")
            .EmailAddress().WithMessage("Email must be a valid email address.");

        RuleFor(v => v.Password)
            .NotEmpty().WithMessage("Password is required.");
    }
}
