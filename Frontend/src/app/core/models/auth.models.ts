export interface User {
  id: string;
  userName: string;
  email: string;
  firstName: string;
  lastName: string;
}

export interface LoginRequest {
  emailOrUserName: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string | null;
  accessToken: string | null;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  userName: string;
  password: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string | null;
  user: User | null;
}
