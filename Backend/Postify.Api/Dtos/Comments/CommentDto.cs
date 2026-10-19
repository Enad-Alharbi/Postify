namespace Postify.Api.Dtos;

public record CommentDto(
    Guid Id,
    string Content,
    Guid UserId,
    string UserName,
    Guid PostId,
    DateTime CreatedAt
);