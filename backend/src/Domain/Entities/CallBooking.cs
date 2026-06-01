using System;
using UpscMentorship.Domain.Common;

namespace UpscMentorship.Domain.Entities;

public class CallBooking : BaseEntity
{
    public string FullName { get; set; } = null!;
    public string Phone { get; set; } = null!;
    public string? Email { get; set; }
    public string? PreferredTime { get; set; }
    public DateTime BookedAt { get; set; } = DateTime.UtcNow;
    public int DurationMinutes { get; set; }
    public string? Source { get; set; }
}
