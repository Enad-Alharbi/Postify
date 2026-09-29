namespace Postify.Api.Interfaces;

public interface ITimestampedEntity
{
    DateTime CreatedAt { get; set; }
    DateTime UpdatedAt { get; set; }
}
