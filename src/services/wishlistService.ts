import api from '@/lib/axios';

export const wishlistService = {
  getWishlist: () => api.get('/wishlist'),
  toggle: (productId: string) => api.post(`/wishlist/${productId}`),
  remove: (productId: string) => api.delete(`/wishlist/${productId}`),
  clear: () => api.delete('/wishlist'),
};
