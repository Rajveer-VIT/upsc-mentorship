using UpscMentorship.Domain.Common;

namespace UpscMentorship.Domain.Entities;

/// <summary>A physical book sold in the store.</summary>
public class Book : BaseEntity
{
    public string Title { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Author { get; set; } = string.Empty;
    public string? Publisher { get; set; }
    public string? Category { get; set; }
    public string? Description { get; set; }
    public string ImageUrl { get; set; } = string.Empty;
    public decimal Price { get; set; }   // selling price (INR)
    public decimal Mrp { get; set; }     // list price (INR)
    public int Stock { get; set; }
    public bool IsActive { get; set; } = true;
}
