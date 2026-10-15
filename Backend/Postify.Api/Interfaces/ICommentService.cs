using System;
using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface ICommentService
{
    public Task<CreateCommentResultDto> CreateCommentAsync(Guid postId, Guid userId, CreateCommentDto request);
}
