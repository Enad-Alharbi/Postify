using System;
using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface ICommentService
{
    public Task<CreateCommentResultDto> CreateCommentAsync(Guid postId, Guid userId, CreateCommentDto request);
    public Task<List<CommentDto>?> GetCommentsByPostIdAsync(Guid postId);
    public Task<CommentDto?> GetCommentByIdAsync(Guid commentId);
}
