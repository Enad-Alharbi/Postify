using System;
using Postify.Api.Dtos;
using Postify.Api.Dtos.Common;

namespace Postify.Api.Interfaces;

public interface ICommentService
{
    public Task<CreateCommentResultDto> CreateCommentAsync(Guid postId, Guid userId, CreateCommentDto request);
    public Task<PaginatedResponseDto<CommentDto>?> GetCommentsByPostIdAsync(Guid postId, int pageNumber, int pageSize);
    public Task<CommentDto?> GetCommentByIdAsync(Guid commentId);
    public Task<UpdateCommentResultDto> UpdateCommentAsync(Guid commentId, Guid userId, UpdateCommentDto request);
    public Task<DeleteCommentResultDto> DeleteCommentAsync(Guid commentId, Guid userId);
}
