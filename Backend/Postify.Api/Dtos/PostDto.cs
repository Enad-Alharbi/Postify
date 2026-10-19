namespace Postify.Api.Dtos;

public record PostDto(
    Guid Id,
    string PostImagePath,
    string? Caption,
    Guid UserId,
    string UserName,
    DateTime CreatedAt
);
