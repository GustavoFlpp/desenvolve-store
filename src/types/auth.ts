export interface User {
  id: number;
  username: string;
  email: string;
  password?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
}

export interface UserProfile extends User {
  createdAt?: string;
  updatedAt?: string;
}
