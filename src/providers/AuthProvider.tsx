'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import api from '@/lib/axios';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, setUser, logout, setLoading } = useAuthStore();
  const setCart = useCartStore((s) => s.setCart);
  const setWishlist = useWishlistStore((s) => s.setWishlist);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initAuth = async () => {
      setLoading(true);
      try {
        // Always try to fetch current user on mount
        // Backend will check httpOnly cookie
        const { data } = await authService.getMe();
        
        if (data.user) {
          setUser(data.user);

          // Load cart and wishlist if authenticated
          const [cartRes, wishlistRes] = await Promise.allSettled([
            cartService.getCart(),
            api.get('/wishlist'),
          ]);

          if (cartRes.status === 'fulfilled') {
            const { cart, summary } = cartRes.value.data;
            setCart(cart?.items || [], summary || {});
          }
          if (wishlistRes.status === 'fulfilled') {
            setWishlist(wishlistRes.value.data.wishlist?.items || []);
          }
        }
      } catch (error: any) {
        // If 401, user is not authenticated - clear state
        if (error?.response?.status === 401) {
          logout();
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}
