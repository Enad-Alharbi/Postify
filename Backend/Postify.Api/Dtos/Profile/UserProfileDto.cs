namespace Postify.Api.Dtos;

public record class UserProfileDto(
    Guid UserId,
    string UserName,
    string FirstName,
    string LastName,
    string? Bio,
    string? ProfilePicturePath
);