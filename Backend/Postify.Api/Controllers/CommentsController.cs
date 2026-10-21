using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;
using Postify.Api.Enums;
using Postify.Api.Dtos.Common;

namespace Postify.Api.Controllers
{
    [Route("api/")]
    [ApiController]
    public class CommentsController(ICommentService commentService) : ControllerBase
    {
        [Authorize]
        [HttpPost("Posts/{postId}/Comments")]
        public async Task<ActionResult<CreateCommentResultDto>> CreateComment(Guid postId, CreateCommentDto request)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized();
            }

            var result = await commentService.CreateCommentAsync(postId, userId, request);

            if(!result.Success)
            {
                return NotFound(result);
            }

            return CreatedAtAction(nameof(GetCommentById), new {commentId = result.Comment!.Id}, result);
        }

        [Authorize]
        [HttpGet("Posts/{postId}/Comments")]
        public async Task<ActionResult<PaginatedResponseDto<CommentDto>>> GetCommentsByPostId(Guid postId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
        {
            if(pageNumber <= 0 || pageSize > 10 || pageSize <= 0)
            {
                return BadRequest("Please enter valid pageNumber/pageSize");
            }

            var result = await commentService.GetCommentsByPostIdAsync(postId, pageNumber, pageSize);

            if(result is null)
            {
                return NotFound("Post not found!");
            }

            return Ok(result);
        }
    
        [Authorize]
        [HttpGet("Comments/{commentId}")]
        public async Task<ActionResult<CommentDto>> GetCommentById(Guid commentId)
        {
            var comment = await commentService.GetCommentByIdAsync(commentId);

            if(comment is null)
            {
                return NotFound("Comment not found!");
            }

            return Ok(comment);
        }
    
        [Authorize]
        [HttpPut("Comments/{commentId}")]
        public async Task<ActionResult<UpdateCommentResultDto>> UpdateComment(Guid commentId, UpdateCommentDto request)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized();
            }

            var commentResult = await commentService.UpdateCommentAsync(commentId, userId, request);

            if(commentResult.Status == ResultStatusEnum.NotFound)
            {
                return NotFound(commentResult);
            }

            if(commentResult.Status == ResultStatusEnum.Forbidden)
            {
                return StatusCode(403, commentResult);
            }

            return Ok(commentResult);
        }
    
        [Authorize]
        [HttpDelete("Comments/{commentId}")]
        public async Task<ActionResult<DeleteCommentResultDto>> DeleteComment(Guid commentId)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized();
            }

            var deleteCommentResult = await commentService.DeleteCommentAsync(commentId, userId);

            if(deleteCommentResult.Status == ResultStatusEnum.NotFound)
            {
                return NotFound(deleteCommentResult);
            }

            if(deleteCommentResult.Status == ResultStatusEnum.Forbidden)
            {
                return StatusCode(403, deleteCommentResult);
            }

            return Ok(deleteCommentResult);
        }
    }
}
