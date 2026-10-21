using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;

namespace Postify.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController(IAuthService authService) : ControllerBase
    {
        const string GetUserEndpointName = "/api/Users/me";

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResultDto>> Register(RegisterDto request)
        {
            var registerResult = await authService.RegisterAsync(request);

            if(!registerResult.Success)
            {
                return BadRequest(registerResult.Message);
            }

            return Created(GetUserEndpointName, registerResult);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResultDto>> Login(LoginDto request)
        {
            var loginResult = await authService.LoginAsync(request);

            if (!loginResult.Success)
            {
                return Unauthorized("Invalid Credentials!");
            }
            
            return Ok(loginResult);
        }

    }
}
