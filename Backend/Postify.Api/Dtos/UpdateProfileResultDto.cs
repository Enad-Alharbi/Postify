namespace Postify.Api.Dtos;

public record class UpdateProfileResultDto(
    bool Success,
    string? Message,
    UserProfileDto? UpdatedProfile
);