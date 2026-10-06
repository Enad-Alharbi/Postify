using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface IProfileService
{
    public Task<UserProfileDto?> GetUserProfileAsync(Guid userId);
    public Task<UpdateProfileResultDto> UpdateUserProfileAsync(Guid userId, UpdateProfileDto request);
}
