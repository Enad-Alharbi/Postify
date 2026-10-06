using Microsoft.EntityFrameworkCore;
using Postify.Api.Data;
using Postify.Api.Dtos;
using Postify.Api.Interfaces;

namespace Postify.Api.Services;

public class ProfileService(PostifyContext dbContext, IFileService fileService) : IProfileService
{
    public async Task<UserProfileDto?> GetUserProfileAsync(Guid userId)
    {
        var profile = await GetUserProfile(userId);
        
        if(profile is null)
        {
            return null;
        }

        return profile;
    }

    public async Task<UpdateProfileResultDto> UpdateUserProfileAsync(Guid userId, UpdateProfileDto request)
    {
        var profile = await dbContext.Profiles.Where(profile => profile.UserId == userId)
                                              .FirstOrDefaultAsync();
        var user = await dbContext.Users.Where(user => user.Id == userId)
                                        .FirstOrDefaultAsync();
        
        if(profile is null || user is null)
        {
            return new UpdateProfileResultDto(Success: false, Message: "Something Went Wrong!", UpdatedProfile: null);
        }

        user.FirstName = request.FirstName;
        user.LastName = request.LastName;
        profile.Bio = request.Bio;

        if(request.ProfilePicture is not null)
        {
            try
            {
                profile.ProfilePicturePath = await SavePicture(request.ProfilePicture);
            } catch (ArgumentException e)
            {
                 return new UpdateProfileResultDto(Success: false, Message: e.Message, UpdatedProfile: null);
            }
        }

        await dbContext.SaveChangesAsync();

        return new UpdateProfileResultDto(Success: true,
                    Message: "Profile Updated Successfully!",
                    UpdatedProfile: new UserProfileDto(
                                    FirstName: user.FirstName,
                                    LastName: user.LastName,
                                    Bio: profile.Bio,
                                    ProfilePicturePath: profile.ProfilePicturePath));
    }

    private async Task<UserProfileDto?> GetUserProfile(Guid userId)
    {
        var userProfile = await dbContext.Profiles.Where(profile => profile.UserId == userId)
                                .Select(profile => new UserProfileDto(FirstName: profile.User.FirstName,
                                                                      LastName: profile.User.LastName,
                                                                      Bio: profile.Bio,
                                                                      ProfilePicturePath: profile.ProfilePicturePath))
                                .FirstOrDefaultAsync();
        
        return userProfile;
    }

    private async Task<string> SavePicture(IFormFile picture)
    {
        var webPath = await fileService.UploadProfilePictureAsync(picture);
        return webPath;
    }
}
