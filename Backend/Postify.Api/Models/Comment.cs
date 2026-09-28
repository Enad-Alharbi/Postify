namespace Postify.Api.Models;

public class Comment
{
    public Guid Id { get; set; }
    public required string Content { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public Guid UserId { get; set; }
    public Post Post { get; set; } = null!;
    public Guid PostId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
