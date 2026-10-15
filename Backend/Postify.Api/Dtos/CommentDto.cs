namespace Postify.Api.Dtos;

public record CommentDto(
    Guid Id,
    string Content,
    Guid UserId,
    Guid PostId,
    DateTime CreatedAt
);