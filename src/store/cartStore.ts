/**
 * Cart Store – Zustand
 * Client-side cart state sync with backend
 */

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { CartItem, Product } from '@/types';

interface CartSummary {
  itemCount: number;
  subtotal: number;
  shippingCost: number;
  estimatedTotal: number;
  freeShippingThreshold: number;
  remainingForFreeShipping: number;
  savings: number;
}

interface CartState {
  items: CartItem[];
  summary: CartSummary;
  couponCode: string | null;
  couponDiscount: number;
  isOpen: boolean;
  isLoading: boolean;

  // Actions
  setCart: (items: CartItem[], summary: CartSummary) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCoupon: (code: string, discount: number) => void;
  clearCoupon: () => void;
  setLoading: (loading: boolean) => void;
  reset: () => void;

  // Optimistic local operations
  addItemOptimistic: (product: Product, quantity: number) => void;
  removeItemOptimistic: (itemId: string) => void;
  updateQuantityOptimistic: (itemId: string, quantity: number) => void;
}

const defaultSummary: CartSummary = {
  itemCount: 0,
  subtotal: 0,
  shippingCost: 0,
  estimatedTotal: 0,
  freeShippingThreshold: 999,
  remainingForFreeShipping: 999,
  savings: 0,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      summary: defaultSummary,
      couponCode: null,
      couponDiscount: 0,
      isOpen: false,
      isLoading: false,

      setCart: (items, summary) => set({ items, summary }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      setCoupon: (code, discount) => set({ couponCode: code, couponDiscount: discount }),
      clearCoupon: () => set({ couponCode: null, couponDiscount: 0 }),
      setLoading: (loading) => set({ isLoading: loading }),

      reset: () => set({
        items: [],
        summary: defaultSummary,
        couponCode: null,
        couponDiscount: 0,
        isOpen: false,
      }),

      addItemOptimistic: (product, quantity) => {
        const items = [...get().items];
        const existing = items.find((i) => (i.product as any)._id === product._id);
        if (existing) {
          existing.quantity = Math.min(99, existing.quantity + quantity);
        } else {
          items.push({
            _id: `temp-${Date.now()}`,
            product: product as any,
            quantity,
            price: product.price,
            addedAt: new Date().toISOString(),
          });
        }
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        set({
          items,
          summary: {
            ...get().summary,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            subtotal,
            estimatedTotal: subtotal + (subtotal < 999 ? 99 : 0),
          },
        });
      },

      removeItemOptimistic: (itemId) => {
        const items = get().items.filter((i) => i._id !== itemId);
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        set({
          items,
          summary: {
            ...get().summary,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            subtotal,
            estimatedTotal: subtotal + (subtotal < 999 ? 99 : 0),
          },
        });
      },

      updateQuantityOptimistic: (itemId, quantity) => {
        const items = get().items.map((i) =>
          i._id === itemId ? { ...i, quantity } : i
        );
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        set({
          items,
          summary: {
            ...get().summary,
            itemCount: items.reduce((s, i) => s + i.quantity, 0),
            subtotal,
            estimatedTotal: subtotal + (subtotal < 999 ? 99 : 0),
          },
        });
      },
    }),
    {
      name: 'greenscape-cart',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        items: state.items,
        summary: state.summary,
        couponCode: state.couponCode,
        couponDiscount: state.couponDiscount,
      }),
    }
  )
);

// Selectors
export const useCartCount = () => useCartStore((s) => s.summary.itemCount);
export const useCartTotal = () => useCartStore((s) => s.summary.estimatedTotal);
export const useCartOpen = () => useCartStore((s) => s.isOpen);
