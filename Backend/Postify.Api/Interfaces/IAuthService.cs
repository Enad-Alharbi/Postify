using Postify.Api.Dtos;


namespace Postify.Api.Interfaces;

public interface IAuthService
{   
    public Task<RegisterResultDto> RegisterAsync(RegisterDto request);
    public Task<LoginResultDto> LoginAsync(LoginDto request);
}
