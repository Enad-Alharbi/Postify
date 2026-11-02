export interface UserProfile {
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  profilePicturePath: string | null;
}
