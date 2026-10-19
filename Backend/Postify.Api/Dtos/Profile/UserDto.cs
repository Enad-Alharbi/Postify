namespace Postify.Api.Dtos;

public record UserDto(
    Guid Id,
    string UserName,
    string Email,
    string FirstName,
    string LastName
);