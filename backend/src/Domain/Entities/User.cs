using UpscMentorship.Domain.Common;
using UpscMentorship.Domain.Enums;

namespace UpscMentorship.Domain.Entities;

/// <summary>
/// Represents a user in the system.
/// </summary>
public class User : BaseEntity
{
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public string? Address { get; set; }
    public string? City { get; set; }

    public string PasswordHash { get; set; } = string.Empty;
    public Role Role { get; set; }
}
