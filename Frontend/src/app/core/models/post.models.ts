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

export interface UpdatePostResponse {
  status: number;
  message: string;
  post: Post | null;
}

// Backend FileService limit for post images (shared type rules live in core/utils/image-validation.ts).
export const POST_IMAGE_MAX_BYTES = 50 * 1024 * 1024;
export const CAPTION_MAX_LENGTH = 500;
