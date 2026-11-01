namespace Postify.Api.Dtos;

public record CommentDto(
    Guid Id,
    string Content,
    Guid UserId,
    string UserName,
    string FirstName,
    string LastName,
    string? ProfilePicturePath,
    Guid PostId,
    DateTime CreatedAt
);