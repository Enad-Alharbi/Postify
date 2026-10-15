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

        return new CreateCommentResultDto(Success: true,
                                          Message: "Comment created successfully!",
                                          Comment: new CommentDto(Id: comment.Id,
                                                                  Content: comment.Content,
                                                                  UserId: comment.UserId,
                                                                  PostId: comment.PostId,
                                                                  CreatedAt: comment.CreatedAt));
    }
}
