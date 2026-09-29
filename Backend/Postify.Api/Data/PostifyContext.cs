using Microsoft.EntityFrameworkCore;
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
        // User 1-----1 Profile Relationship
        modelBuilder.Entity<ApplicationUser>()
                    .HasOne(user => user.Profile)
                    .WithOne(profile => profile.User)
                    .HasForeignKey<Profile>(profile => profile.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
    
        // User 1-----N Post Relationship
        modelBuilder.Entity<ApplicationUser>()
                    .HasMany(user => user.Posts)
                    .WithOne(post => post.User)
                    .HasForeignKey(post => post.UserId)
                    .OnDelete(DeleteBehavior.Cascade);

        // User 1-----N Comment Relationship
        modelBuilder.Entity<ApplicationUser>()
                    .HasMany(user => user.Comments)
                    .WithOne(comment =>)
    }
}
