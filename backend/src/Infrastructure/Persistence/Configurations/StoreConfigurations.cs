using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Persistence.Configurations;

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> b)
    {
        b.Property(x => x.Title).HasMaxLength(300).IsRequired();
        b.Property(x => x.Slug).HasMaxLength(320).IsRequired();
        b.HasIndex(x => x.Slug).IsUnique();
        b.Property(x => x.Author).HasMaxLength(200);
        b.Property(x => x.Publisher).HasMaxLength(200);
        b.Property(x => x.Category).HasMaxLength(100);
        b.Property(x => x.Description).HasMaxLength(4000);
        b.Property(x => x.ImageUrl).HasMaxLength(1000);
        b.Property(x => x.Price).HasPrecision(18, 2);
        b.Property(x => x.Mrp).HasPrecision(18, 2);
        b.HasIndex(x => new { x.IsActive, x.Category });
    }
}

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> b)
    {
        b.Property(x => x.OrderNumber).HasMaxLength(30).IsRequired();
        b.HasIndex(x => x.OrderNumber).IsUnique();
        b.Property(x => x.Status).HasConversion<string>().HasMaxLength(30);
        b.HasIndex(x => new { x.UserId, x.CreatedAt });
        b.HasIndex(x => x.Status);
        b.Property(x => x.RazorpayOrderId).HasMaxLength(255);
        b.HasIndex(x => x.RazorpayOrderId);
        b.Property(x => x.RazorpayPaymentId).HasMaxLength(255);
        b.Property(x => x.Subtotal).HasPrecision(18, 2);
        b.Property(x => x.ShippingFee).HasPrecision(18, 2);
        b.Property(x => x.Total).HasPrecision(18, 2);
        b.Property(x => x.ShipName).HasMaxLength(150);
        b.Property(x => x.ShipPhone).HasMaxLength(20);
        b.Property(x => x.ShipLine1).HasMaxLength(300);
        b.Property(x => x.ShipLine2).HasMaxLength(300);
        b.Property(x => x.ShipCity).HasMaxLength(100);
        b.Property(x => x.ShipState).HasMaxLength(100);
        b.Property(x => x.ShipPincode).HasMaxLength(10);
        b.Property(x => x.Courier).HasMaxLength(100);
        b.Property(x => x.TrackingNumber).HasMaxLength(100);
        b.Property(x => x.RefundId).HasMaxLength(100);
        b.Property(x => x.CancelReason).HasMaxLength(300);
        b.HasOne(x => x.User).WithMany().HasForeignKey(x => x.UserId);
        b.HasMany(x => x.Items).WithOne(i => i.Order).HasForeignKey(i => i.OrderId);
    }
}

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> b)
    {
        b.Property(x => x.Title).HasMaxLength(300);
        b.Property(x => x.UnitPrice).HasPrecision(18, 2);
        b.HasOne(x => x.Book).WithMany().HasForeignKey(x => x.BookId);
    }
}
