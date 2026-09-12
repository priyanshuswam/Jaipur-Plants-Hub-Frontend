/**
 * useCart — convenience hook for cart actions with API sync
 */

import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cartService';
import type { Product } from '@/types';
import toast from 'react-hot-toast';

export function useCart() {
  const { isAuthenticated } = useAuthStore();
  const cartStore = useCartStore();

  const addToCart = async (product: Product, quantity = 1, variantId?: string) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return false;
    }
    if (product.stock === 0 && !product.allowBackorder) {
      toast.error('Product is out of stock');
      return false;
    }

    cartStore.addItemOptimistic(product, quantity);
    try {
      const { data } = await cartService.addItem(product._id, quantity, variantId);
      cartStore.setCart(data.cart?.items || [], data.summary || {});
      return true;
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  };

  const removeFromCart = async (itemId: string) => {
    cartStore.removeItemOptimistic(itemId);
    try {
      const { data } = await cartService.removeItem(itemId);
      cartStore.setCart(data.cart?.items || [], data.summary || {});
    } catch {
      toast.error('Failed to remove item');
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    cartStore.updateQuantityOptimistic(itemId, quantity);
    try {
      const { data } = await cartService.updateItem(itemId, quantity);
      cartStore.setCart(data.cart?.items || [], data.summary || {});
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const clearCart = async () => {
    try {
      await cartService.clearCart();
      cartStore.reset();
    } catch {
      toast.error('Failed to clear cart');
    }
  };

  return {
    ...cartStore,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };
}
