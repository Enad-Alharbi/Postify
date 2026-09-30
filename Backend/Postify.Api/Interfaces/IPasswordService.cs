using Postify.Api.Models;

namespace Postify.Api.Interfaces;

public interface IPasswordService
{
    public string HashPassword(ApplicationUser user, string password);
    public bool VerifyPassword(ApplicationUser user, string password, string passwordHash);
}
