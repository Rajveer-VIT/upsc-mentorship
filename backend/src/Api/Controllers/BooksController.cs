using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using UpscMentorship.Domain.Entities;
using UpscMentorship.Infrastructure.Persistence;
using UpscMentorship.Shared.Responses;

namespace UpscMentorship.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BooksController : ControllerBase
{
    private readonly AppDbContext _db;
    public BooksController(AppDbContext db) => _db = db;

    public record BookRequest(string Title, string Author, string? Publisher, string? Category, string? Description,
        string ImageUrl, decimal Price, decimal Mrp, int Stock, bool IsActive = true);

    [HttpGet]
    public async Task<IActionResult> List([FromQuery] string? q, [FromQuery] string? category, [FromQuery] bool all, CancellationToken ct)
    {
        var query = _db.Books.AsNoTracking();
        if (!(all && User.IsInRole("Admin"))) query = query.Where(b => b.IsActive);
        if (!string.IsNullOrWhiteSpace(category)) query = query.Where(b => b.Category == category);
        if (!string.IsNullOrWhiteSpace(q)) query = query.Where(b => b.Title.Contains(q) || b.Author.Contains(q));
        return Ok(ApiResponse<object>.Ok(await query.OrderByDescending(b => b.CreatedAt).ToListAsync(ct)));
    }

    [HttpGet("{idOrSlug}")]
    public async Task<IActionResult> Get(string idOrSlug, CancellationToken ct)
    {
        var book = Guid.TryParse(idOrSlug, out var id)
            ? await _db.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Id == id, ct)
            : await _db.Books.AsNoTracking().FirstOrDefaultAsync(b => b.Slug == idOrSlug, ct);
        return book is null || (!book.IsActive && !User.IsInRole("Admin"))
            ? NotFound(ApiResponse<object>.Failure("Book not found."))
            : Ok(ApiResponse<object>.Ok(book));
    }

    [Authorize(Roles = "Admin")]
    [HttpPost]
    public async Task<IActionResult> Create([FromBody] BookRequest r, CancellationToken ct)
    {
        if (Validate(r) is { } err) return BadRequest(ApiResponse<object>.Failure(err));
        var book = Apply(new Book(), r);
        book.Slug = await UniqueSlug(r.Title, null, ct);
        _db.Books.Add(book);
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(book, "Book created."));
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id, [FromBody] BookRequest r, CancellationToken ct)
    {
        if (Validate(r) is { } err) return BadRequest(ApiResponse<object>.Failure(err));
        var book = await _db.Books.FindAsync(new object[] { id }, ct);
        if (book is null) return NotFound(ApiResponse<object>.Failure("Book not found."));
        if (book.Title != r.Title.Trim()) book.Slug = await UniqueSlug(r.Title, id, ct);
        Apply(book, r);
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(book, "Book updated."));
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var book = await _db.Books.FindAsync(new object[] { id }, ct);
        if (book is null) return NotFound(ApiResponse<object>.Failure("Book not found."));
        _db.Books.Remove(book); // soft delete via AppDbContext
        await _db.SaveChangesAsync(ct);
        return Ok(ApiResponse<object>.Ok(new { id }, "Book deleted."));
    }

    private static string? Validate(BookRequest r) =>
        string.IsNullOrWhiteSpace(r.Title) ? "Title is required." :
        string.IsNullOrWhiteSpace(r.ImageUrl) ? "Cover image URL is required." :
        r.Price <= 0 ? "Price must be greater than 0." :
        r.Mrp < r.Price ? "MRP cannot be less than price." :
        r.Stock < 0 ? "Stock cannot be negative." : null;

    private static Book Apply(Book b, BookRequest r)
    {
        b.Title = r.Title.Trim(); b.Author = r.Author?.Trim() ?? ""; b.Publisher = r.Publisher; b.Category = r.Category;
        b.Description = r.Description; b.ImageUrl = r.ImageUrl.Trim(); b.Price = r.Price; b.Mrp = r.Mrp;
        b.Stock = r.Stock; b.IsActive = r.IsActive;
        return b;
    }

    private async Task<string> UniqueSlug(string title, Guid? excludeId, CancellationToken ct)
    {
        var baseSlug = Regex.Replace(title.ToLowerInvariant(), "[^a-z0-9]+", "-").Trim('-');
        if (baseSlug.Length > 280) baseSlug = baseSlug[..280];
        if (baseSlug.Length == 0) baseSlug = "book";
        var slug = baseSlug; var i = 2;
        while (await _db.Books.IgnoreQueryFilters().AnyAsync(b => b.Slug == slug && b.Id != excludeId, ct)) slug = $"{baseSlug}-{i++}";
        return slug;
    }
}
