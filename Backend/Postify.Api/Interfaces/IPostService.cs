using System;
using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface IPostService
{
    public Task<CreatePostResultDto> CreatePostAsync(Guid userId, CreatePostDto request);
    public Task<PostDto?> GetPostAsync(Guid postId);
    public Task<List<PostDto>> GetAllPostsAsync();
    public Task<UpdatePostResultDto> UpdatePostAsync(Guid postId, Guid userId, UpdatePostDto request);
    public Task<DeletePostResultDto> DeletePostAsync(Guid postId, Guid userId);
}
