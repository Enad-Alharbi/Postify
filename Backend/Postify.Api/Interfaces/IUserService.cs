using Postify.Api.Dtos;

namespace Postify.Api.Interfaces;

public interface IUserService
{
    public Task<UserDto?> GetCurrentUserAsync(Guid userId);
}
