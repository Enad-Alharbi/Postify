namespace Postify.Api.Dtos;

public record class UserProfileDto(
    string FirstName,
    string LastName,
    string? Bio,
    string? ProfilePicturePath
);