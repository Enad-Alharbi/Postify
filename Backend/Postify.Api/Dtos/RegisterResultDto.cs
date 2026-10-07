namespace Postify.Api.Dtos;

public record RegisterResultDto(
    bool Success,
    string? Message,
    UserDto? User
);