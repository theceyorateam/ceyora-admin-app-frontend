import { LoginCredentials, AuthResponse } from '../../types/auth.types';
import users from '../data/users';

// Add a delay to simulate network request
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock authentication service
export const mockAuthService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Simulate API delay
    await delay(500);
    
    // Find user by email
    const user = users.find(u => u.email === credentials.email);
    
    // Validate credentials (simple check for demo)
    if (user && credentials.password === 'password') {
      return {
        user,
        token: `mock-jwt-token-${Date.now()}-${user.id}`,
      };
    }
    
    throw new Error('Invalid email or password');
  },
  
  logout: async (): Promise<void> => {
    // Simulate API delay
    await delay(300);
    
    // In a real app, this would invalidate the token on the server
    // Since this is a mock, we just return successfully
    return Promise.resolve();
  },
};