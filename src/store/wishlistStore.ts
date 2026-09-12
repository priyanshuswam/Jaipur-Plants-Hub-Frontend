/**
 * Wishlist Store – Zustand
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { WishlistItem } from '@/types';

interface WishlistState {
  items: WishlistItem[];
  productIds: Set<string>;
  count: number;

  setWishlist: (items: WishlistItem[]) => void;
  isInWishlist: (productId: string) => boolean;
  toggleOptimistic: (productId: string) => void;
  reset: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      productIds: new Set<string>(),
      count: 0,

      setWishlist: (items) => {
        const ids = new Set(items.map((i) =>
          typeof i.product === 'object' ? (i.product as any)._id : i.product
        ));
        set({ items, productIds: ids, count: items.length });
      },

      isInWishlist: (productId) => get().productIds.has(productId),

      toggleOptimistic: (productId) => {
        const { productIds } = get();
        const newIds = new Set(productIds);
        if (newIds.has(productId)) {
          newIds.delete(productId);
        } else {
          newIds.add(productId);
        }
        set({ productIds: newIds, count: newIds.size });
      },

      reset: () => set({ items: [], productIds: new Set(), count: 0 }),
    }),
    {
      name: 'greenscape-wishlist',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        productIds: Array.from(state.productIds),
        count: state.count,
      }),
      onRehydrateStorage: () => (state) => {
        if (state && Array.isArray((state as any).productIds)) {
          state.productIds = new Set((state as any).productIds);
        }
      },
    }
  )
);

export const useWishlistCount = () => useWishlistStore((s) => s.count);
export const useIsInWishlist = (id: string) => useWishlistStore((s) => s.productIds.has(id));
