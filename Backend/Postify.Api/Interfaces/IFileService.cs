namespace Postify.Api.Interfaces;

public interface IFileService
{
    public Task<string> UploadProfilePictureAsync(IFormFile image);
    public void DeleteOldProfilePicture(string picturePath);
}
