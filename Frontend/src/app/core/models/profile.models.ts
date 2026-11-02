export interface UserProfile {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePicturePath: string | null;
}

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  bio: string;
  profilePicture: File | null;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string | null;
  updatedProfile: UserProfile | null;
}

// Backend UpdateProfileDto limits and FileService rules for profile pictures.
export const NAME_MAX_LENGTH = 50;
export const BIO_MAX_LENGTH = 250;
export const PROFILE_PICTURE_MAX_BYTES = 5 * 1024 * 1024;
