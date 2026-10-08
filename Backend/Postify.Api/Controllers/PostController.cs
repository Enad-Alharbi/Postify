using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;

namespace Postify.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PostController(IPostService postService) : ControllerBase
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
        [HttpPost]
        public async Task<ActionResult<CreatePostResultDto>> CreatePost([FromForm] CreatePostDto request)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return BadRequest("Something went wrong!");
            }

            var createPostResult = await postService.CreatePostAsync(userId, request);

            if(!createPostResult.Success)
            {
                return BadRequest(createPostResult);
            }

            return CreatedAtAction(nameof(GetPost), new {postId = createPostResult.Post!.Id}, createPostResult);
        }
    }
}
