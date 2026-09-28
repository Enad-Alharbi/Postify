namespace Postify.Api.Models;

public class Post
{
    public Guid Id { get; set; }
    public required string PostImagePath { get; set; }
    public string? Caption { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public Guid UserId { get; set; }
    public List<Comment> Comments { get; set; } = [];
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
