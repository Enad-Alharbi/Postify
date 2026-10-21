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
    [Route("api/[controller]")]
    [ApiController]
    public class PostsController(IPostService postService) : ControllerBase
    {
        [Authorize]
        [HttpGet("{postId}")]
        public async Task<ActionResult<PostDto>> GetPost(Guid postId)
        {
            var post = await postService.GetPostAsync(postId);

            if(post is null)
            {
                return NotFound("There's no post with this id");
            }

            return Ok(post);
        }

        [Authorize]
        [HttpGet]
        public async Task<ActionResult<PaginatedResponseDto<PostDto>>> GetAllPosts([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10 )
        {
            if(pageNumber <= 0 || pageSize > 10 || pageSize <= 0)
            {
                return BadRequest("Please enter valid pageNumber/pageSize");
            }

            var result = await postService.GetAllPostsAsync(pageNumber, pageSize);

            return Ok(result);
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<CreatePostResultDto>> CreatePost([FromForm] CreatePostDto request)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized();
            }

            var createPostResult = await postService.CreatePostAsync(userId, request);

            if(!createPostResult.Success)
            {
                return BadRequest(createPostResult);
            }

            return CreatedAtAction(nameof(GetPost), new {postId = createPostResult.Post!.Id}, createPostResult);
        }

        [Authorize]
        [HttpPut("{postId}")]
        public async Task<ActionResult<UpdatePostResultDto>> UpdatePost(Guid postId, UpdatePostDto request)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized();
            }

            var post = await postService.UpdatePostAsync(postId, userId, request);

            if (post.Status == ResultStatusEnum.NotFound)
            {
                return NotFound(post);
            }

            if(post.Status == ResultStatusEnum.Forbidden)
            {
                return StatusCode(403, post);
            }

            return Ok(post);
        }

        [Authorize]
        [HttpDelete("{postId}")]
        public async Task<ActionResult<DeletePostResultDto>> DeletePost(Guid postId)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return Unauthorized();
            }

            var result = await postService.DeletePostAsync(postId, userId);

            if(result.Status == ResultStatusEnum.NotFound)
            {
                return NotFound(result);
            }

            if(result.Status == ResultStatusEnum.Forbidden)
            {
                return StatusCode(403, result);
            }

            return Ok(result);
        } 
    }
}
