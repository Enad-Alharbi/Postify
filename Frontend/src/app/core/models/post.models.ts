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
