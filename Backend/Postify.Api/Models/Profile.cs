namespace Postify.Api.Models;

public class Profile
{
    public Guid Id { get; set; }
    public string? Bio { get; set; }
    public string? ProfilePicturePath { get; set; }
    public ApplicationUser User { get; set; } = null!;
    public Guid UserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
