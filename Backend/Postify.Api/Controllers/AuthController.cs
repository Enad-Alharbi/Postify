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

            if(registerResult.Success == false && registerResult.Message == "Username Already Exists!")
            {
                return BadRequest("Username Already Exists!");
            } 

            if(registerResult.Success == false && registerResult.Message == "Email Already Exists!")
            {
                return BadRequest("Email Already Exists!");
            }

            return Created(GetUserEndpointName, registerResult);
        }

    }
}
