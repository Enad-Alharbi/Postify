using Postify.Api.Enums;

namespace Postify.Api.Dtos;

public record UpdateCommentResultDto(
    ResultStatusEnum Status,
    string? Message,
    CommentDto? Comment
);