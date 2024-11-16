// src/services/auth/authService.ts
// Description: Authentication service singleton for managing user sessions
// Location: src/services/auth/authService.ts

export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface AuthResponse {
    token: string;
    user: {
      id: string;
      username: string;
      roles: string[];
    };
  }
  
  export class AuthService {
    private static instance: AuthService;
    private token: string | null = null;
  
    private constructor() {}
  
    public static getInstance(): AuthService {
      if (!AuthService.instance) {
        AuthService.instance = new AuthService();
      }
      return AuthService.instance;
    }
  
    public async login(credentials: LoginCredentials): Promise<AuthResponse> {
      try {
        // TODO: Replace with actual API call
        const response = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(credentials),
        });
  
        if (!response.ok) {
          throw new Error('Login failed');
        }
  
        const data = await response.json();
        this.token = data.token;
        return data;
      } catch (error) {
        throw new Error(error instanceof Error ? error.message : 'Authentication failed');
      }
    }
  
    public getToken(): string | null {
      return this.token;
    }
  
    public isAuthenticated(): boolean {
      return !!this.token;
    }
  
    public logout(): void {
      this.token = null;
      // TODO: Add any additional cleanup needed
    }
  }
  
  export default AuthService;