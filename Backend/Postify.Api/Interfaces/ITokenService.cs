using Postify.Api.Models;

namespace Postify.Api.Interfaces;

public interface ITokenService
{
    public string CreateToken(ApplicationUser user);
}
