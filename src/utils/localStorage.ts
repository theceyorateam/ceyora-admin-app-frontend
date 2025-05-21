import { User } from '../types/auth.types';

interface StoredAuth {
  user: User;
  token: string;
}

const AUTH_KEY = 'ceyora_auth';

export const getStoredAuth = (): StoredAuth | null => {
  const storedAuth = localStorage.getItem(AUTH_KEY);
  if (storedAuth) {
    try {
      return JSON.parse(storedAuth);
    } catch (error) {
      removeStoredAuth();
    }
  }
  return null;
};

export const setStoredAuth = (auth: StoredAuth): void => {
  localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
};

export const removeStoredAuth = (): void => {
  localStorage.removeItem(AUTH_KEY);
};