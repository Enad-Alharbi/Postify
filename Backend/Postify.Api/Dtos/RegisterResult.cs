namespace Postify.Api.Dtos;

public record RegisterResult(
    bool Success,
    string? Message,
    UserDto? User
);