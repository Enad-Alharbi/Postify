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

            return Created($"/api/Post/{createPostResult.Post!.Id}", createPostResult);
        }
    }
}
