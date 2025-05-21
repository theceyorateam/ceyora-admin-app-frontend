import React, { createContext, useReducer, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // Make sure to use the named import
import { AuthState, User } from '../types/auth.types';
import { getStoredAuth, setStoredAuth, removeStoredAuth } from '../utils/localStorage';

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'CLEAR_ERROR' };

interface AuthContextType extends AuthState {
  login: (user: User, token: string) => void;
  logout: () => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: () => {},
  logout: () => {},
  clearError: () => {},
});

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const initAuth = async () => {
      const storedAuth = getStoredAuth();
      
      if (storedAuth && storedAuth.token) {
        try {
          // Note: For demo purposes, we're checking token expiration
          // In a real app, you might want to use a more sophisticated approach
          // or rely on backend validation
          try {
            const decodedToken: any = jwtDecode(storedAuth.token);
            const currentTime = Date.now() / 1000;
            
            if (decodedToken.exp && decodedToken.exp < currentTime) {
              // Token expired
              removeStoredAuth();
              return;
            }
          } catch (error) {
            // If token can't be decoded, assume it's invalid
            removeStoredAuth();
            return;
          }
          
          dispatch({ 
            type: 'LOGIN_SUCCESS', 
            payload: { user: storedAuth.user, token: storedAuth.token } 
          });
        } catch (error) {
          removeStoredAuth();
        }
      }
    };

    initAuth();
  }, []);

  const login = (user: User, token: string) => {
    setStoredAuth({ user, token });
    dispatch({ type: 'LOGIN_SUCCESS', payload: { user, token } });
  };

  const logout = () => {
    removeStoredAuth();
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;