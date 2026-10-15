namespace Postify.Api.Interfaces;

public interface IFileService
{
    public Task<string> UploadProfilePictureAsync(IFormFile image);
    public void DeletePicture(string picturePath);
    public Task<string> UploadPostImageAsync(IFormFile image);
}
