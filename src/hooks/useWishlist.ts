/**
 * useWishlist — convenience hook for wishlist actions
 */

import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export function useWishlist() {
  const { isAuthenticated } = useAuthStore();
  const wishlistStore = useWishlistStore();

  const toggle = async (productId: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return false;
    }

    wishlistStore.toggleOptimistic(productId);
    try {
      const { data } = await api.post(`/wishlist/${productId}`);
      toast.success(data.inWishlist ? 'Added to wishlist ❤️' : 'Removed from wishlist');
      return data.inWishlist as boolean;
    } catch {
      wishlistStore.toggleOptimistic(productId); // revert
      toast.error('Failed to update wishlist');
      return false;
    }
  };

  return {
    ...wishlistStore,
    toggle,
  };
}
