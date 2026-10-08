namespace Postify.Api.Dtos;

public record CreatePostResultDto(
    bool Success,
    string Message,
    PostDto? Post
);
