namespace Postify.Api.Dtos;

public record LoginResultDto
(
    bool Success,
    string? Message,
    string? AccessToken
);