using Microsoft.EntityFrameworkCore;
using Postify.Api.Data;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;
using Postify.Api.Models;

namespace Postify.Api.Services;

public class AuthService(PostifyContext dbContext, IPasswordService passwordService) : IAuthService
{
    public async Task<RegisterResult> RegisterAsync(RegisterDto request)
    {
        if (await dbContext.Users.AnyAsync(user => user.UserName == request.UserName))
        {
            return new RegisterResult(Success: false, Message: "Username Already Exists!", User: null);
        }
        if (await dbContext.Users.AnyAsync(user => user.Email == request.Email))
        {
            return new RegisterResult(Success: false, Message: "Email Already Exists!", User: null);
        }

        Profile newUserProfile = new Profile
        {
            Bio = null,
            ProfilePicturePath = null,
        };

        ApplicationUser newUser = new ApplicationUser
        {
            UserName = request.UserName,
            Email = request.Email,
            PasswordHash = "",
            FirstName = request.FirstName,
            LastName = request.LastName,
            Profile = newUserProfile
        };
        
        var hashedPassword = passwordService.HashPassword(newUser, request.Password);

        newUser.PasswordHash = hashedPassword;

        dbContext.Users.Add(newUser);
        await dbContext.SaveChangesAsync();

        return new RegisterResult(Success: true,
                                  Message: null,
                                  User: new UserDto(Id:newUser.Id,
                                                    UserName: newUser.UserName,
                                                    Email: newUser.Email, FirstName:
                                                    newUser.FirstName, LastName:
                                                    newUser.LastName));
    }
}
