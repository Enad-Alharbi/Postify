// Mirrors the backend FileService rules (extensions are compared case-insensitively there too).
export const IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
export const IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

// Returns an error message, or '' when the file is acceptable.
export function validateImage(file: File, maxBytes: number): string {
  const dot = file.name.lastIndexOf('.');
  const extension = dot >= 0 ? file.name.slice(dot).toLowerCase() : '';

  if (!IMAGE_EXTENSIONS.includes(extension) || !IMAGE_TYPES.includes(file.type)) {
    return 'Choose a .jpg, .jpeg or .png image.';
  }
  if (file.size === 0) {
    return 'That file is empty. Choose another image.';
  }
  if (file.size > maxBytes) {
    return `Images must be ${Math.round(maxBytes / (1024 * 1024))}MB or less.`;
  }

  return '';
}
