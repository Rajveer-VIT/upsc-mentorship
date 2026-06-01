using MediatR;
using System;
using System.Threading;
using System.Threading.Tasks;
using UpscMentorship.Application.Interfaces;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.ContactInquiries.Commands.Create;

public sealed class CreateContactInquiryCommandHandler : IRequestHandler<CreateContactInquiryCommand, ApiResponse<Guid>>
{
    private readonly IContactInquiryRepository _repository;

    public CreateContactInquiryCommandHandler(IContactInquiryRepository repository)
    {
        _repository = repository;
    }

    public async Task<ApiResponse<Guid>> Handle(CreateContactInquiryCommand request, CancellationToken cancellationToken)
    {
        var inquiry = new ContactInquiry
        {
            FullName = request.FullName,
            Email = request.Email,
            Subject = request.Subject,
            Message = request.Message,
            Status = "Pending"
        };

        await _repository.AddAsync(inquiry, cancellationToken);
        await _repository.SaveChangesAsync(cancellationToken);

        return ApiResponse<Guid>.Ok(inquiry.Id, "Contact inquiry submitted successfully.");
    }
}
