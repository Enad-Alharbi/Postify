using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;

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
                return BadRequest("Something went wrong");
            }

            var result = await commentService.CreateCommentAsync(postId, userId, request);

            if(!result.Success)
            {
                return NotFound(result);
            }

            // Should be CreatedAtRoute after implementing GetComment
            return Ok(result);
        }

        [Authorize]
        [HttpGet("Posts/{postId}/Comments")]
        public async Task<ActionResult<List<CommentDto>>> GetCommentsByPostId(Guid postId)
        {
            var comments = await commentService.GetCommentsByPostIdAsync(postId);

            if(comments is null)
            {
                return NotFound("Post not found!");
            }

            return Ok(comments);
        }
    }
}
