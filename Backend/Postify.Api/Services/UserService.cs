using Microsoft.EntityFrameworkCore;
using Postify.Api.Data;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;

namespace Postify.Api.Services;

public class UserService(PostifyContext dbContext) : IUserService
{
    public async Task<UserDto?> GetCurrentUserAsync(Guid userId)
    {
        var user = await dbContext.Users.Where(user => user.Id == userId)
                                        .Select(user => new UserDto
                                        (
                                            Id: user.Id,
                                            UserName: user.UserName,
                                            Email: user.Email,
                                            FirstName: user.FirstName,
                                            LastName: user.LastName
                                        ))
                                        .FirstOrDefaultAsync();
        
        if (user is null)
        {
            return null;
        }
        
        return user;
    }
}
