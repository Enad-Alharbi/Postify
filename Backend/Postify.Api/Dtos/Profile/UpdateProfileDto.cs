namespace Postify.Api.Dtos;

public record UpdateProfileDto(
    string FirstName,
    string LastName,
    string? Bio,
    IFormFile? ProfilePicture
);
