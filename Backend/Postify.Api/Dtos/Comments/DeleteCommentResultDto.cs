using Postify.Api.Enums;

namespace Postify.Api.Dtos;

public record DeleteCommentResultDto
(
    ResultStatusEnum Status,
    string Message
);
