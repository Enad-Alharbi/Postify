namespace Postify.Api.Dtos;

public record CreatePostDto
(
    IFormFile PostImage,
    string? Caption
);
