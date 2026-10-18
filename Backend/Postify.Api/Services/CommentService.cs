using System;
using Microsoft.EntityFrameworkCore;
using Postify.Api.Data;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;
using Postify.Api.Enums;
using Postify.Api.Models;

namespace Postify.Api.Services;

public class CommentService(PostifyContext dbContext) : ICommentService
{
    public async Task<CreateCommentResultDto> CreateCommentAsync(Guid postId, Guid userId, CreateCommentDto request)
    {
        var post = await dbContext.Posts.FirstOrDefaultAsync(post => post.Id == postId);
        if(post is null)
        {
            return new CreateCommentResultDto(Success: false, Message: "Post not found!", Comment: null);
        }

        Comment comment = new Comment
        {
            Content = request.Content,
            UserId = userId,
            PostId = postId
        };

        dbContext.Comments.Add(comment);
        await dbContext.SaveChangesAsync();

        var commentResult = await dbContext.Comments.Where(commentResult => commentResult.Id == comment.Id)
                                                    .Select(comment => new CommentDto(Id: comment.Id,
                                                                                 Content: comment.Content,
                                                                                 UserId: comment.UserId,
                                                                                 UserName: comment.User.UserName,
                                                                                 PostId: comment.PostId,
                                                                                 CreatedAt: comment.CreatedAt))
                                                    .FirstOrDefaultAsync();


        return new CreateCommentResultDto(Success: true,
                                          Message: "Comment created successfully!",
                                          Comment: commentResult);
    }

    public async Task<List<CommentDto>?> GetCommentsByPostIdAsync(Guid postId)
    {
        var post = await dbContext.Posts.FirstOrDefaultAsync(post => post.Id == postId);

        if(post is null)
        {
            return null;
        }

        var comments = await dbContext.Comments.Where(comment => comment.PostId == postId)
                                               .OrderByDescending(comment => comment.CreatedAt)
                                               .Select(comment => new CommentDto(Id: comment.Id,
                                                                                 Content: comment.Content,
                                                                                 UserId: comment.UserId,
                                                                                 UserName: comment.User.UserName,
                                                                                 PostId: comment.PostId,
                                                                                 CreatedAt: comment.CreatedAt))
                                               .ToListAsync();

        return comments;
    }

    public async Task<CommentDto?> GetCommentByIdAsync(Guid commentId)
    {
        var comment = await dbContext.Comments.Where(comment => comment.Id == commentId)
                                              .Select(comment => new CommentDto(Id: comment.Id,
                                                                                Content: comment.Content,
                                                                                UserId: comment.UserId,
                                                                                UserName: comment.User.UserName,
                                                                                PostId: comment.PostId,
                                                                                CreatedAt: comment.CreatedAt))
                                              .FirstOrDefaultAsync();

        if(comment is null)
        {
            return null;
        }

        return comment;
    }
}
