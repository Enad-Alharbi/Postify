using Postify.Api.Enums;

namespace Postify.Api.Dtos;

public record UpdatePostResultDto(
    ResultStatusEnum Status,
    string? Message,
    PostDto? Post
);