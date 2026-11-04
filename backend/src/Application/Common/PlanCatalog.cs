namespace UpscMentorship.Application.Common;

/// <summary>Single source of truth for mentorship plan prices (INR). Keep frontend src/lib/plans.ts in sync.</summary>
public static class PlanCatalog
{
    public sealed record Plan(string Id, string Name, decimal Price);

    public static readonly IReadOnlyDictionary<string, Plan> All = new[]
    {
        new Plan("prelims-blueprint",    "Prelims Blueprint",                    299m),
        new Plan("mains-blueprint",      "Mains Mastery Blueprint",              499m),
        new Plan("current-affairs",      "Current Affairs Decoded (Monthly)",    399m),
        new Plan("sociology-circle",     "Sociology Mentorship Circle (Monthly)", 2999m),
        new Plan("personal-mentorship",  "Personal UPSC Mentorship (Monthly)",   4999m),
        new Plan("intensive-mentorship", "Intensive UPSC Mentorship (Monthly)",  9999m),
    }.ToDictionary(p => p.Id);
}
