using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.MentorshipApplications.Commands.Create;

public sealed class CreateMentorshipApplicationCommandHandler : IRequestHandler<CreateMentorshipApplicationCommand, ApiResponse<Guid>>
{
    private readonly IMentorshipApplicationRepository _repository;

    public CreateMentorshipApplicationCommandHandler(IMentorshipApplicationRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<Guid>> Handle(CreateMentorshipApplicationCommand request, CancellationToken cancellationToken)
    {
        var application = new MentorshipApplication
        {
            Name = request.Name,
            Phone = request.Phone,
            Email = request.Email,
            Stage = request.Stage,
            Goals = request.Goals,
            Status = "Pending"
        };

        await _repository.AddAsync(application, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return ApiResponse<Guid>.Ok(application.Id, "Mentorship application submitted successfully.");
    }
}
