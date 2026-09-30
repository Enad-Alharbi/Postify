using Microsoft.AspNetCore.Identity;
using Postify.Api.Interfaces;
using Postify.Api.Models;

namespace Postify.Api.Services;

public class PasswordService : IPasswordService
{
    private readonly PasswordHasher<ApplicationUser> passwordHasher = new PasswordHasher<ApplicationUser>();
    public string HashPassword(ApplicationUser user, string password)
    {
        var hashedPassword = passwordHasher.HashPassword(user, password);

        return hashedPassword;
    }

    public bool VerifyPassword(ApplicationUser user, string password, string passwordHash)
    {
        var verificationResult = passwordHasher.VerifyHashedPassword(user, passwordHash, password);
        
        if (verificationResult == PasswordVerificationResult.Success)
        {
            return true;
        }

        return false;
    }
}
