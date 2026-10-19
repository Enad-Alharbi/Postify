using Postify.Api.Enums;

namespace Postify.Api.Dtos;

public record CreateCommentResultDto(
    bool Success,
    string? Message,
    CommentDto? Comment
);