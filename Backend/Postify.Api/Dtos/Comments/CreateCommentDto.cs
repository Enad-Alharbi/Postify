using System.ComponentModel.DataAnnotations;

namespace Postify.Api.Dtos;

public record class CreateCommentDto(
    [Required][StringLength(250)] string Content
);