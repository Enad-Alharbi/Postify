using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface IProfileService
{
    public Task<ProfileDto?> GetUserProfileAsync(Guid userId);
}
