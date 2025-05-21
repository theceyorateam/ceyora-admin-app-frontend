import { LoginCredentials, AuthResponse } from '../types/auth.types';
import { mockAuthService } from '../mocks';

// When connecting to a real backend, uncomment this import
// import apiClient from '../api/apiClient';

/**
 * Authentication Service
 * 
 * This service acts as the interface between your frontend components and your
 * authentication data source (either mock data or a real backend API).
 * 
 * CONNECTING TO A REAL BACKEND:
 * 1. Create an API client (axios instance) in src/api/apiClient.ts
 * 2. Uncomment the apiClient import above
 * 3. Set REACT_APP_USE_MOCK_API to 'false' in your .env file
 * 4. Uncomment the "real API" code sections below
 * 5. Ensure your backend endpoints match the paths used in the API calls
 */
export const authService = {
  /**
   * Log in a user
   * 
   * @param credentials User credentials (email and password)
   * @returns Promise with user data and authentication token
   */
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      // MOCK IMPLEMENTATION
      // Currently using mock data for development
      return await mockAuthService.login(credentials);
      
      // REAL API IMPLEMENTATION
      // To connect to a real backend, comment out the line above
      // and uncomment the code below:
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        // Use mocks in development or when specifically configured
        return await mockAuthService.login(credentials);
      } else {
        // Make a real API call
        const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
        return response.data;
      }
      */
    } catch (error: any) {
      // Standardize error handling
      throw new Error(error.message || 'Authentication failed');
    }
  },

  /**
   * Log out a user
   * 
   * - Invalidates the token on the server (in real implementation)
   * - The actual removal of the token from storage is handled by the auth context
   */
  logout: async (): Promise<void> => {
    try {
      // MOCK IMPLEMENTATION
      // Currently using mock data for development
      return await mockAuthService.logout();
      
      // REAL API IMPLEMENTATION
      // To connect to a real backend, comment out the line above
      // and uncomment the code below:
      /*
      if (process.env.REACT_APP_USE_MOCK_API === 'true') {
        // Use mocks in development or when specifically configured
        return await mockAuthService.logout();
      } else {
        // Make a real API call to invalidate the token on the server
        await apiClient.post('/auth/logout');
      }
      */
    } catch (error: any) {
      throw new Error(error.message || 'Logout failed');
    }
  },
};