using System.ComponentModel.DataAnnotations;

namespace Postify.Api.Dtos;

public record UpdateCommentDto(
    [Required][StringLength(250)] string Content
);
