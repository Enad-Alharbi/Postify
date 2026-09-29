using Microsoft.EntityFrameworkCore;
using Postify.Api.Interfaces;
using Postify.Api.Models;

namespace Postify.Api.Data;

public class PostifyContext(DbContextOptions<PostifyContext> options) : DbContext(options)
{
    public DbSet<ApplicationUser> Users => Set<ApplicationUser>();
    public DbSet<Profile> Profiles => Set<Profile>();
    public DbSet<Post> Posts => Set<Post>();
    public DbSet<Comment> Comments => Set<Comment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Database Relationships: 

        // User 1:1 Profile Relationship
        modelBuilder.Entity<ApplicationUser>()
                    .HasOne(user => user.Profile)
                    .WithOne(profile => profile.User)
                    .HasForeignKey<Profile>(profile => profile.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
    
        // User 1:N Post Relationship
        modelBuilder.Entity<ApplicationUser>()
                    .HasMany(user => user.Posts)
                    .WithOne(post => post.User)
                    .HasForeignKey(post => post.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

        // User 1:N Comment Relationship
        modelBuilder.Entity<ApplicationUser>()
                    .HasMany(user => user.Comments)
                    .WithOne(comment => comment.User)
                    .HasForeignKey(comment => comment.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

        // Post 1:N Comment Relationship
        modelBuilder.Entity<Post>()
                    .HasMany(post => post.Comments)
                    .WithOne(comment => comment.Post)
                    .HasForeignKey(comment => comment.PostId)
                    .OnDelete(DeleteBehavior.Cascade);

        // Database Constraints: 

        // Unique Username Constraint
        modelBuilder.Entity<ApplicationUser>()
                    .HasIndex(user => user.UserName)
                    .IsUnique();
        
        // Unique Email Constraint
        modelBuilder.Entity<ApplicationUser>()
                    .HasIndex(user => user.Email)
                    .IsUnique();

        // Username Length Constraint
        modelBuilder.Entity<ApplicationUser>()
                    .Property(user => user.UserName)
                    .HasMaxLength(20);

        // Email Length Constraint
        modelBuilder.Entity<ApplicationUser>()
                    .Property(user => user.Email)
                    .HasMaxLength(254);

        // First Name Length Constraint
        modelBuilder.Entity<ApplicationUser>()
                    .Property(user => user.FirstName)
                    .HasMaxLength(50);

        // Last Name Length Constraint
        modelBuilder.Entity<ApplicationUser>()
                    .Property(user => user.LastName)
                    .HasMaxLength(50);

        // Bio Length Constraint
        modelBuilder.Entity<Profile>()
                    .Property(profile => profile.Bio)
                    .HasMaxLength(250);

        // Comment Content Length Constraint
        modelBuilder.Entity<Comment>()
                    .Property(comment => comment.Content)
                    .HasMaxLength(250);
    }

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        ApplyTimestamps();

        return await base.SaveChangesAsync(cancellationToken);
    }

    public override int SaveChanges()
    {
        ApplyTimestamps();

        return base.SaveChanges();
    }

    private void ApplyTimestamps()
    {
        var entries = ChangeTracker.Entries<ITimestampedEntity>();
        var now = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {   
                entry.Entity.CreatedAt = now;
                entry.Entity.UpdatedAt = now;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = now;
            }
        }
    }
}
