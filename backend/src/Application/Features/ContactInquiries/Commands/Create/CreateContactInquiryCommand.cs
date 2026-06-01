using MediatR;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Application.Features.ContactInquiries.Commands.Create;

public sealed record CreateContactInquiryCommand(
    string FullName,
    string Email,
    string Subject,
    string Message) : IRequest<ApiResponse<Guid>>;
