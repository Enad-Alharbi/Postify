using System;
using Microsoft.EntityFrameworkCore;
using Postify.Api.Data;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;
using Postify.Api.Models;
using Postify.Api.Enums;

namespace Postify.Api.Services;

public class PostService(PostifyContext dbContext, IFileService fileService) : IPostService
{
    public async Task<CreatePostResultDto> CreatePostAsync(Guid userId, CreatePostDto request)
    {
        var postImagePath = "";

        try
        {
            postImagePath = await fileService.UploadPostImageAsync(request.PostImage);
        } catch (ArgumentException e)
        {
            return new CreatePostResultDto(Success: false, Message: e.Message, Post: null);
        }
        
        Post post = new Post
        {
          PostImagePath = postImagePath,
          Caption = request.Caption,
          UserId = userId  
        };

        dbContext.Posts.Add(post);
        await dbContext.SaveChangesAsync();
        
        return new CreatePostResultDto(Success: true,
                                       Message: "Post Created Successfully!",
                                       Post: new PostDto(Id: post.Id,
                                                        PostImagePath: post.PostImagePath,
                                                        Caption: post.Caption,
                                                        UserId: userId,
                                                        CreatedAt: post.CreatedAt));
    }

    public async Task<PostDto?> GetPostAsync(Guid postId)
    {
        var post = await dbContext.Posts.Where(post => post.Id == postId)
                                        .Select(post => new PostDto(Id: post.Id,
                                                                    PostImagePath: post.PostImagePath,
                                                                    Caption: post.Caption,
                                                                    UserId: post.UserId,
                                                                    CreatedAt: post.CreatedAt))
                                        .FirstOrDefaultAsync();

        if(post is null)
        {
            return null;
        }

        return post;
    }

    public async Task<List<PostDto>> GetAllPostsAsync()
    {
        List<PostDto> posts = await dbContext.Posts.Select(post => new PostDto(Id: post.Id,
                                                                               PostImagePath: post.PostImagePath,
                                                                               Caption: post.Caption,
                                                                               UserId: post.UserId,
                                                                               CreatedAt: post.CreatedAt))
                                                    .ToListAsync();

        return posts;
    }

    public async Task<UpdatePostResultDto> UpdatePostAsync(Guid postId, Guid userId, UpdatePostDto request)
    {
        var post = await dbContext.Posts.FirstOrDefaultAsync(post => post.Id == postId);

        if(post is null)
        {
            return new UpdatePostResultDto(Status: ResultStatusEnum.NotFound, Message: "Post not found", Post: null);
        }

        if(!(post.UserId == userId))
        {
            return new UpdatePostResultDto(Status: ResultStatusEnum.Forbidden, Message: "You're not allowed to edit another user post", Post: null);
        }

        post.Caption = request.Caption;

        await dbContext.SaveChangesAsync();

        return new UpdatePostResultDto(Status: ResultStatusEnum.Success, Message: "Post edited successfully", Post: new PostDto(Id: post.Id,
                                                                                                                    PostImagePath: post.PostImagePath,
                                                                                                                    Caption: post.Caption,
                                                                                                                    UserId: post.UserId,
                                                                                                                    CreatedAt: post.CreatedAt));
    }
}
