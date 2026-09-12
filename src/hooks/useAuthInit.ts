/**
 * useAuthInit Hook
 * Initializes auth state on app load by fetching current user from backend
 * Backend will use the httpOnly cookie to authenticate
 */

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';

export function useAuthInit() {
  const { setUser, logout, setLoading } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      setLoading(true);
      try {
        // Try to fetch current user - backend will use httpOnly cookie
        const { data } = await authService.getMe();
        if (data.success && data.user) {
          setUser(data.user);
        }
      } catch (error: any) {
        // If 401, user is not authenticated - clear local state
        if (error?.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
        setInitialized(true);
      }
    };

    initAuth();
  }, [setUser, logout, setLoading]);

  return { initialized };
}
