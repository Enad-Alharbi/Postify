namespace Postify.Api.Dtos;

public record PostDto(
    Guid Id,
    string PostImagePath,
    string? Caption,
    Guid UserId,
    string UserName,
    string FirstName,
    string LastName,
    string? ProfilePicturePath,
    DateTime CreatedAt
);
