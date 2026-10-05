namespace Postify.Api.Dtos;

public record class ProfileDto(
    string? Bio,
    string? ProfilePicturePath
);