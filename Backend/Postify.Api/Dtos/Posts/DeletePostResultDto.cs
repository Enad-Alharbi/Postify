using Postify.Api.Enums;

namespace Postify.Api.Dtos;

public record DeletePostResultDto(
    ResultStatusEnum Status,
    string? Message
);