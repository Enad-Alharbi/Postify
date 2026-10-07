using System;
using Postify.Api.Data;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;

namespace Postify.Api.Services;

public class PostService(PostifyContext dbContext, IFileService fileService) : IPostService
{
    public async Task<CreatePostResultDto> CreatePostAsync(Guid userId, CreatePostDto request)
    {
        
    }
}
