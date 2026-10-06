using Postify.Api.Interfaces;

namespace Postify.Api.Services;

public class FileService(IWebHostEnvironment webHostEnvironment) : IFileService
{
    public async Task<string> UploadProfilePictureAsync(IFormFile picture)
    {
        var folderPath = Path.Combine(
            webHostEnvironment.WebRootPath,
            "uploads",
            "profiles"
            );
        
        var webPath = "/uploads/profiles/"; 

        if(!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var pictureExtension = Path.GetExtension(picture.FileName);

        var newPictureName = $"{Guid.NewGuid()}{pictureExtension}";

        var picturePath = Path.Combine(folderPath, newPictureName);

        using var stream = new FileStream(picturePath, FileMode.Create);
        await picture.CopyToAsync(stream);

        return $"{webPath}{newPictureName}";
    }
}
