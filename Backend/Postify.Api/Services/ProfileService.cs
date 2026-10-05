using Microsoft.EntityFrameworkCore;
using Postify.Api.Data;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;

namespace Postify.Api.Services;

public class ProfileService(PostifyContext dbContext) : IProfileService
{
    public async Task<ProfileDto?> GetUserProfileAsync(Guid userId)
    {
        var profile = await dbContext.Profiles.Where(profile => profile.UserId == userId)
                                        .Select(profile => new ProfileDto(Bio: profile.Bio, ProfilePicturePath: profile.ProfilePicturePath))
                                        .FirstOrDefaultAsync();
        
        if(profile is null)
        {
            return null;
        }

        return profile;
    }
}
