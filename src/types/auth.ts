// src/types/auth.ts
// Description: TypeScript interfaces for authentication
// Location: src/types/auth.ts

export interface User {
    id: string;
    username: string;
    roles: string[];
  }
  
  export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
  }
  
  export interface LoginResponse {
    token: string;
    user: User;
  }