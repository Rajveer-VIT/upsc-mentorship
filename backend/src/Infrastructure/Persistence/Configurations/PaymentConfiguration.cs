using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using UpscMentorship.Domain.Entities;

namespace UpscMentorship.Infrastructure.Persistence.Configurations;

/// <summary>
/// Entity Framework Core configuration for the Payment entity.
/// </summary>
public class PaymentConfiguration : IEntityTypeConfiguration<Payment>
{
    public void Configure(EntityTypeBuilder<Payment> builder)
    {
        // Configure decimal precision for Amount (suitable for currency with 2 decimal places)
        builder.Property(p => p.Amount)
            .HasPrecision(18, 2) // Total 18 digits, 2 decimal places (e.g., 999999999999999999.99)
            .IsRequired();

        // Configure string properties
        builder.Property(p => p.PlanId)
            .HasMaxLength(100)
            .IsRequired();

        builder.Property(p => p.Currency)
            .HasMaxLength(10)
            .IsRequired()
            .HasDefaultValue("INR");

        builder.Property(p => p.RazorpayOrderId)
            .HasMaxLength(255)
            .IsRequired();

        builder.Property(p => p.RazorpayPaymentId)
            .HasMaxLength(255);

        builder.Property(p => p.RazorpaySignature)
            .HasMaxLength(500);

        builder.Property(p => p.Status)
            .HasMaxLength(50)
            .IsRequired()
            .HasDefaultValue("Pending");

        // Configure foreign key
        builder.HasOne(p => p.User)
            .WithMany()
            .HasForeignKey(p => p.UserId)
            .OnDelete(DeleteBehavior.NoAction);
    }
}
