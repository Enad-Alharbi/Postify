export interface Post {
  id: string;
  postImagePath: string;
  caption: string | null;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  profilePicturePath: string | null;
  createdAt: string;
}

export interface CreatePostResponse {
  success: boolean;
  message: string;
  post: Post | null;
}

// Mirrors the backend FileService rules for post images (the extension check is case-sensitive).
export const POST_IMAGE_EXTENSIONS = ['.jpg', '.jpeg', '.png'];
export const POST_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
export const POST_IMAGE_MAX_BYTES = 50 * 1024 * 1024;
export const CAPTION_MAX_LENGTH = 500;
