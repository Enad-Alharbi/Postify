using Postify.Api.Models;

namespace Postify.Api.Dtos;

public record PostDto(
    Guid Id,
    string PostImagePath,
    string? Caption,
    Guid UserId
    // List of comments
);
