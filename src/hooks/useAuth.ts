import { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LoginCredentials } from '../types/auth.types';
import { authService } from '../services/auth.service';

export const useAuth = () => {
  const auth = useContext(AuthContext);

  const handleLogin = async (credentials: LoginCredentials) => {
    try {
      auth.clearError();
      
      // Use the auth service
      const response = await authService.login(credentials);
      
      auth.login(response.user, response.token);
      return true;
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to login';
      throw new Error(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the logout service
      await authService.logout();
      
      // Clear local state
      auth.logout();
    } catch (error) {
      console.error('Logout failed:', error);
      // Still clear local state even if server logout fails
      auth.logout();
    }
  };

  return {
    ...auth,
    handleLogin,
    handleLogout,
  };
};