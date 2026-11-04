using Microsoft.EntityFrameworkCore;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Persistence;

/// <summary>Seeds the starter catalogue once (only when the Books table is empty). Edit/replace from Admin → Book Store.</summary>
public static class BookSeed
{
    public static async Task SeedAsync(AppDbContext db)
    {
        if (await db.Books.IgnoreQueryFilters().AnyAsync()) return;

        db.Books.AddRange(
            new Book
            {
                Title = "McGraw Hill Indian Polity Courseware (English)", Slug = "indian-polity-courseware",
                Author = "M Laxmikanth", Publisher = "McGraw Hill", Category = "Polity",
                ImageUrl = "/books/polity.svg", Price = 532, Mrp = 764, Stock = 50,
                Description = "The most trusted book for Indian Polity for UPSC Prelims & Mains. Covers constitutional framework, system of government, central & state government, local government, constitutional & non-constitutional bodies, with 13 years of previous year questions."
            },
            new Book
            {
                Title = "Authentic NCERT Summary (Class 6 to 12)", Slug = "authentic-ncert-summary",
                Author = "Disha Experts", Publisher = "Disha Publication", Category = "NCERT",
                ImageUrl = "/books/ncert.svg", Price = 250, Mrp = 438, Stock = 50,
                Description = "Gist of 20+ old & new NCERTs in one-liner format: History, Geography, Political Science, Economics and Science. 2000+ concepts, 21000+ facts across 191 chapters — ideal for quick revision."
            },
            new Book
            {
                Title = "McGraw Hill Indian Art and Culture Courseware", Slug = "indian-art-and-culture-courseware",
                Author = "Nitin Singhania", Publisher = "McGraw Hill", Category = "Art & Culture",
                ImageUrl = "/books/art-culture.svg", Price = 713, Mrp = 1025, Stock = 50,
                Description = "Comprehensive coverage of Indian architecture, sculpture, painting, music, dance, theatre, literature, religion and philosophy, with integrated UPSC PYQs and practice questions."
            },
            new Book
            {
                Title = "Certificate Physical and Human Geography", Slug = "certificate-physical-and-human-geography",
                Author = "Goh Cheng Leong", Publisher = "Oxford University Press", Category = "Geography",
                ImageUrl = "/books/geography.svg", Price = 300, Mrp = 360, Stock = 50,
                Description = "The classic text for physical geography fundamentals — landforms, climate, natural vegetation and world regions — with clear maps and diagrams."
            });

        await db.SaveChangesAsync();
    }
}
