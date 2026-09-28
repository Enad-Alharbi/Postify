namespace Postify.Api.Models;

public class ApplicationUser
{
    public Guid Id { get; set; }
    public required string UserName { get; set; }
    public required string Email { get; set; }
    public required string PasswordHash { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public Profile Profile { get; set; } = null!;
    public List<Post> Posts { get; set; } = [];
    public List<Comment> Comments { get; set; } = [];
    public DateTime CreatedAt { get; set; }
}
