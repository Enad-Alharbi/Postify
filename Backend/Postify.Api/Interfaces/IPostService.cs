using System;
using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface IPostService
{
    public Task<CreatePostResultDto> CreatePostAsync(Guid userId, CreatePostDto request);
}
