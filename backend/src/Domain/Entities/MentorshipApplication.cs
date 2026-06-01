using UpscMentorship.Domain.Common;

namespace UpscMentorship.Domain.Entities;

/// <summary>
/// Represents a mentorship application request submitted by an aspirant.
/// </summary>
public class MentorshipApplication : BaseEntity
{
    public string Name { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Email { get; set; }
    public string Stage { get; set; } = null!;
    public string Goals { get; set; } = null!;
    public string Status { get; set; } = "Pending"; // e.g. Pending, Contacted, Enrolled, Rejected
}
