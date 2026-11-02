export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  profilePicturePath: string | null;
  postId: string;
  createdAt: string;
}

export interface CreateCommentResponse {
  success: boolean;
  message: string | null;
  comment: Comment | null;
}

export interface UpdateCommentResponse {
  status: number;
  message: string | null;
  comment: Comment | null;
}

// Backend CreateCommentDto / UpdateCommentDto: [StringLength(250)].
export const COMMENT_MAX_LENGTH = 250;
