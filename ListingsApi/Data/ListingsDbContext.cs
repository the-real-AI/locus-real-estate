using ListingsApi.Models;
using Microsoft.EntityFrameworkCore;

namespace ListingsApi.Data;

public class ListingsDbContext : DbContext
{
    public ListingsDbContext(DbContextOptions<ListingsDbContext> options) : base(options)
    {
    }

    public DbSet<Listing> Listings => Set<Listing>();
    public DbSet<District> Districts => Set<District>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<District>(entity =>
        {
            entity.HasKey(d => d.Id);
            entity.Property(d => d.Name).IsRequired().HasMaxLength(100);
            entity.HasIndex(d => d.Name).IsUnique();
        });

        modelBuilder.Entity<Listing>(entity =>
        {
            entity.HasKey(e => e.Id);
            entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
            entity.Property(e => e.Price).HasPrecision(18, 2);
            entity.Property(e => e.District).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Address).IsRequired().HasMaxLength(250);
            entity.Property(e => e.ImageUrl).HasMaxLength(500);
            entity.Property(e => e.OwnerId).HasMaxLength(100);
        });
    }
}
