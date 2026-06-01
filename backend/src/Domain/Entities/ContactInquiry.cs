using UpscMentorship.Domain.Common;

namespace UpscMentorship.Domain.Entities;

/// <summary>
/// Represents a general contact/inquiry request submitted by a visitor.
/// </summary>
public class ContactInquiry : BaseEntity
{
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Subject { get; set; } = null!;
    public string Message { get; set; } = null!;
    public string Status { get; set; } = "Pending"; // e.g. Pending, Resolved, Ignored
}
