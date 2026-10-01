using Postify.Api.Dtos;


namespace Postify.Api.Interfaces;

public interface IAuthService
{   
    public Task<RegisterResult> RegisterAsync(RegisterDto request);
    public Task<LoginResult> LoginAsync(LoginDto request);
}
