import api from '@/lib/axios';

export const cartService = {
  getCart: () => api.get('/cart'),
  addItem: (productId: string, quantity: number, variantId?: string) =>
    api.post('/cart/items', { productId, quantity, variantId }),
  updateItem: (itemId: string, quantity: number) =>
    api.put(`/cart/items/${itemId}`, { quantity }),
  removeItem: (itemId: string) => api.delete(`/cart/items/${itemId}`),
  clearCart: () => api.delete('/cart'),
  validateCoupon: (code: string, subtotal: number) =>
    api.post('/cart/validate-coupon', { code, subtotal }),
};
