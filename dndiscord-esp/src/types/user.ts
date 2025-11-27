// User types
export interface User {
  id: string;
  username: string;
  email: string;
  discordId?: string;
  avatar?: string;
  isAuthenticated: boolean;
  createdAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}
