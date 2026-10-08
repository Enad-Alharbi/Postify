using System;
using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface IPostService
{
    public Task<CreatePostResultDto> CreatePostAsync(Guid userId, CreatePostDto request);
    public Task<PostDto?> GetPostAsync(Guid postId);
    public Task<List<PostDto>> GetAllPostsAsync();
}
