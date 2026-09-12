/**
 * useAuth — convenience hook for auth state + actions
 */

import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

export function useAuth() {
  const router = useRouter();
  const store = useAuthStore();

  const signout = async (redirect = '/') => {
    try {
      await authService.logout();
    } catch {
      // ignore
    }
    store.logout();
    toast.success('Logged out successfully');
    router.push(redirect);
  };

  return {
    ...store,
    signout,
    isAdmin: ['admin', 'manager'].includes(store.user?.role || ''),
    isStaff: ['admin', 'manager', 'staff'].includes(store.user?.role || ''),
  };
}
