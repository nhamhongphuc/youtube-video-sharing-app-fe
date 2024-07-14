// src/store/authStore.ts
import create from 'zustand';
import api from '../services/api';
import { jwtDecode, JwtPayload } from "jwt-decode";
interface AuthState {
  user: any | null;
  loading: boolean;
  error: string | null;
  signIn: (username: string, password: string) => Promise<void>;
  signUp: (username: string, password: string) => Promise<void>;
  signOut: () => void;
}
interface Auth0JwtPayload extends JwtPayload {
  username: string;
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,
  signIn: async (username, password) => {
    set({ loading: true });
    try {
      const response = await api.post('/auth/signin', { username, password });
      const { accessToken } = response.data;
      const user = jwtDecode<Auth0JwtPayload>(accessToken);
      localStorage.setItem('token', accessToken);
      localStorage.setItem('username', user.username);
      set({ user: user.username, loading: false, error: null });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Sign in failed', loading: false });
      throw error;
    }
  },
  signUp: async (username, password) => {
    set({ loading: true });
    try {
      await api.post('/auth/signup', { username, password });
    } catch (error: any) {
      set({ error: error.response?.data?.message || 'Sign up failed', loading: false });
      throw error;
    }
  },
  signOut: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    set({ user: null });
  },
}));

export default useAuthStore;
