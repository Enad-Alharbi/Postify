using System.ComponentModel.DataAnnotations;

namespace Postify.Api.Dtos;

public record UpdateProfileDto(
    [Required][StringLength(50)] string FirstName,
    [Required][StringLength(50)] string LastName,
    [StringLength(250)] string? Bio,
    IFormFile? ProfilePicture
);
