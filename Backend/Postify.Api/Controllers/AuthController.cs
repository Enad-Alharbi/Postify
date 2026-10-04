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
        const string GetUserEndpointName = "/api/auth/user/{id}";

        [HttpPost("register")]
        public async Task<ActionResult<RegisterResult>> Register(RegisterDto request)
        {
            var registerResult = await authService.RegisterAsync(request);

            if(!registerResult.Success && registerResult.Message == "Username Already Exists!")
            {
                return BadRequest("Username Already Exists!");
            } 

            if(!registerResult.Success && registerResult.Message == "Email Already Exists!")
            {
                return BadRequest("Email Already Exists!");
            }

            return Created(GetUserEndpointName, registerResult);
        }

        [HttpPost("login")]
        public async Task<ActionResult<LoginResult>> Login(LoginDto request)
        {
            var loginResult = await authService.LoginAsync(request);

            if (!loginResult.Success)
            {
                return BadRequest("Invalid Credentials!");
            }
            
            return Ok(loginResult);
        }

        [Authorize]
        [HttpGet("auth-test")]
        public ActionResult AuthTest()
        {
            return Ok("You are authenticated!");
        }
    }
}
