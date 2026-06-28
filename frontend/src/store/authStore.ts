import { create } from 'zustand';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

const getInitialUser = (): User | null => {
  const stored = localStorage.getItem('task_tracker_user');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return null;
    }
  }
  return null;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  isAuthenticated: !!getInitialUser(),
  setUser: (user) => {
    if (user) {
      localStorage.setItem('task_tracker_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('task_tracker_user');
    }
    set({ user, isAuthenticated: !!user });
  },
  clearUser: () => {
    localStorage.removeItem('task_tracker_user');
    set({ user: null, isAuthenticated: false });
  },
}));
