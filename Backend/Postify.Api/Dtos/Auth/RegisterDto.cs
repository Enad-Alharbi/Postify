using System.ComponentModel.DataAnnotations;

namespace Postify.Api.Dtos;

public record RegisterDto(
    [Required][StringLength(50)] string FirstName,
    [Required][StringLength(50)] string LastName,
    [Required][EmailAddress][StringLength(254)] string Email,
    [Required][StringLength(20)] string UserName,
    [Required] string Password
);
