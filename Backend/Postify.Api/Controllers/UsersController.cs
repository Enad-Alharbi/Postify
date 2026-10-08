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
    public class UsersController(IUserService userService) : ControllerBase
    {
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserDto?>> GetCurrentUser()
        {
            if (!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return BadRequest("Something Went Wrong!");
            }

            var user = await userService.GetCurrentUserAsync(userId);

            if (user is null)
            {
                return NotFound("User is not found");
            }

            return Ok(user);
        }
    }
}
