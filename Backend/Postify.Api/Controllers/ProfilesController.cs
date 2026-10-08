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
    public class ProfilesController(IProfileService profileService) : ControllerBase
    {
        [Authorize]
        [HttpGet("me")]
        public async Task<ActionResult<UserProfileDto>> GetUserProfile()
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return BadRequest("Something Went Wrong!");
            }

            var profile = await profileService.GetUserProfileAsync(userId);

            if(profile is null)
            {
                return NotFound("Profile is not found");
            }

            return Ok(profile);
        }

        [Authorize]
        [HttpPut("me")]
        public async Task<ActionResult<UpdateProfileResultDto>> UpdateUserProfile([FromForm] UpdateProfileDto request)
        {
            if(!Guid.TryParse(User.FindFirstValue(ClaimTypes.NameIdentifier), out var userId))
            {
                return BadRequest("Something Went Wrong!");
            }

            var updateProfileResult = await profileService.UpdateUserProfileAsync(userId, request);

            if(!updateProfileResult.Success)
            {
                return BadRequest(updateProfileResult.Message);
            }
            return Ok(updateProfileResult);
        }
    };


}
