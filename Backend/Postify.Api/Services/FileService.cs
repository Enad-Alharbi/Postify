using Postify.Api.Interfaces;

namespace Postify.Api.Services;

public class FileService(IWebHostEnvironment webHostEnvironment) : IFileService
{
    readonly List<string> allowedExtensions = new List<string>{".jpg", ".jpeg", ".png"};
    readonly List<string> allowedContentTypes = new List<string>{"image/png", "image/jpg", "image/jpeg"};

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
        

        if(!allowedExtensions.Contains(pictureExtension))
        {
             throw new ArgumentException("The uploaded file must match one of these extensions: .jpg, .jpeg, .png");
        }
        
        
        if(!allowedContentTypes.Contains(picture.ContentType))
        {
            throw new ArgumentException("The uploaded file content type must match one of these content types: image/jpg, image/jpeg, image/png");
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

    public void DeleteOldProfilePicture(string picturePath)
    {
        var relativePath = picturePath.TrimStart('/');
        var physicalPath = Path.Combine(webHostEnvironment.WebRootPath, relativePath);

        if(File.Exists(physicalPath))
        {
            File.Delete(physicalPath);
        }
    }

    public async Task<string> UploadPostImageAsync(IFormFile image)
    {
        if(image.Length == 0)
        {
            throw new ArgumentException("The uploaded file is empty!");
        }

        var imageExtension = Path.GetExtension(image.FileName);

        if(!allowedExtensions.Contains(imageExtension))
        {
            throw new ArgumentException("The uploaded file must match one of these extensions: .jpg, .jpeg, .png");
        }

        var imageContentType = image.ContentType;

        if(!allowedContentTypes.Contains(imageContentType))
        {
            throw new ArgumentException("The uploaded file content type must match one of these content types: image/jpg, image/jpeg, image/png");
        }
        
        const int PostImageMaxSize = 50 * 1024 * 1024;

        if(image.Length > PostImageMaxSize)
        {
            throw new ArgumentException("The uploaded file must be 50MB or less");
        }

        var folderPath = Path.Combine(webHostEnvironment.WebRootPath, "uploads", "posts");

        var webPath = "/uploads/posts/";

        if(!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }

        var newImageName = $"{Guid.NewGuid()}{imageExtension}";

        var imagePath = Path.Combine(folderPath, newImageName);

        using var stream = new FileStream(imagePath, FileMode.Create);
        await image.CopyToAsync(stream);

        return $"{webPath}{newImageName}";
    } 
}
