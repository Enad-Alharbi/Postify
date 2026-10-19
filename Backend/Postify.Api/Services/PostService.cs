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

        var newPost = await dbContext.Posts.Where(p => p.Id == post.Id)
                                           .Select(post => new PostDto(Id: post.Id,
                                                                           PostImagePath: post.PostImagePath,
                                                                           Caption: post.Caption,
                                                                           UserId: post.UserId,
                                                                           UserName: post.User.UserName,
                                                                           CreatedAt: post.CreatedAt))
                                            .SingleAsync();
        
        return new CreatePostResultDto(Success: true,
                                       Message: "Post Created Successfully!",
                                       Post: newPost);
    }

    public async Task<PostDto?> GetPostAsync(Guid postId)
    {
        var post = await dbContext.Posts.Where(post => post.Id == postId)
                                        .Select(post => new PostDto(Id: post.Id,
                                                                    PostImagePath: post.PostImagePath,
                                                                    Caption: post.Caption,
                                                                    UserId: post.UserId,
                                                                    UserName: post.User.UserName,
                                                                    CreatedAt: post.CreatedAt))
                                        .FirstOrDefaultAsync();

        if(post is null)
        {
            return null;
        }

        return post;
    }

    public async Task<List<PostDto>> GetAllPostsAsync(int pageNumber, int pageSize)
    {
        List<PostDto> posts = await dbContext.Posts.OrderByDescending(post => post.CreatedAt)
                                                   .Skip(CalculateSkip(pageNumber, pageSize))
                                                   .Take(pageSize)
                                                   .Select(post => new PostDto(Id: post.Id,
                                                                               PostImagePath: post.PostImagePath,
                                                                               Caption: post.Caption,
                                                                               UserId: post.UserId,
                                                                               UserName: post.User.UserName,
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

        var updatedPost = await dbContext.Posts.Where(post => post.Id == postId)
                                               .Select(post => new PostDto(Id: post.Id,
                                                                           PostImagePath: post.PostImagePath,
                                                                           Caption: post.Caption,
                                                                           UserId: post.UserId,
                                                                           UserName: post.User.UserName,
                                                                           CreatedAt: post.CreatedAt))
                                                .SingleAsync();

        return new UpdatePostResultDto(Status: ResultStatusEnum.Success, Message: "Post edited successfully", Post: updatedPost);
    }

    public async Task<DeletePostResultDto> DeletePostAsync(Guid postId, Guid userId)
    {
        var post = await dbContext.Posts.FirstOrDefaultAsync(post => post.Id == postId);

        if(post is null)
        {
            return new DeletePostResultDto(Status: ResultStatusEnum.NotFound, Message: "Post is not found!");
        }

        if(post.UserId != userId)
        {
            return new DeletePostResultDto(Status: ResultStatusEnum.Forbidden, Message: "You are not allowed to remove this post");
        }

        dbContext.Posts.Remove(post);
        await dbContext.SaveChangesAsync();

        fileService.DeletePicture(post.PostImagePath);

        return new DeletePostResultDto(Status: ResultStatusEnum.Success, Message: "Post deleted successfully!");
    }

    // Helper methods
    private int CalculateSkip(int pageNumber, int pageSize)
    {
        return (pageNumber - 1) * pageSize;
    }
}
