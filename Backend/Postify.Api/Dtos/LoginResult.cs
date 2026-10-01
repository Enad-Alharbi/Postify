namespace Postify.Api.Dtos;

public record LoginResult
(
    bool Success,
    string? Message,
    string? AccessToken
);