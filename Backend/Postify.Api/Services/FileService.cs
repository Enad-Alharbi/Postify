using Postify.Api.Interfaces;

namespace Postify.Api.Services;

public class FileService(IWebHostEnvironment webHostEnvironment) : IFileService
{
    public async Task<string> UploadProfilePictureAsync(IFormFile picture)
    {
        if(picture.Length == 0)
        {
            throw new ArgumentException("The uploaded file is empty!");
        }

        // 5 MB
        const int MaxPictureSize = 5 * 1024 * 1024;

        if(picture.Length > MaxPictureSize)
        {
            throw new ArgumentException("The uploaded file must be 5MB or less");
        }

        var pictureExtension = Path.GetExtension(picture.FileName);
        var allowedExtensions = new List<string>{".jpg", ".jpeg", ".png"};

            if(!allowedExtensions.Contains(pictureExtension))
            {
                throw new ArgumentException("The uploaded file must match one of these extensions: .jpg, .jpeg, .png");
            }
            

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


        var newPictureName = $"{Guid.NewGuid()}{pictureExtension}";

        var picturePath = Path.Combine(folderPath, newPictureName);

        using var stream = new FileStream(picturePath, FileMode.Create);
        await picture.CopyToAsync(stream);

        return $"{webPath}{newPictureName}";
    }
}
