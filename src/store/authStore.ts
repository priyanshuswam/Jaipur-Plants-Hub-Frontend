/**
 * Auth Store – Zustand
 * Manages authentication state and user profile
 * SECURITY: Tokens are stored in httpOnly cookies, NOT in localStorage
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setUser: (user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void; // Legacy - tokens handled by backend cookies
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => {
        set({ user, isAuthenticated: true });
      },

      setTokens: (accessToken, refreshToken) => {
        // Tokens are now managed by backend via httpOnly cookies
        // This function is kept for backward compatibility but doesn't store tokens
        set({ isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
        // Cookies will be cleared by backend logout endpoint
      },

      updateUser: (updates) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...updates } });
        }
      },

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'greenscape-auth',
      storage: createJSONStorage(() => localStorage),
      // Only persist user data and auth status - NO tokens
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Convenience selectors
export const useUser = () => useAuthStore((s) => s.user);
export const useIsAuthenticated = () => useAuthStore((s) => s.isAuthenticated);
export const useIsAdmin = () => useAuthStore((s) => ['admin', 'manager'].includes(s.user?.role || ''));
