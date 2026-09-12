import api from '@/lib/axios';

export const productService = {
  getAll: (params?: Record<string, any>) => api.get('/products', { params }),
  getFeatured: (limit?: number) => api.get('/products/featured', { params: { limit } }),
  getTrending: (limit?: number) => api.get('/products/trending', { params: { limit } }),
  getOnSale: (params?: Record<string, any>) => api.get('/products/on-sale', { params }),
  getBySlug: (slug: string) => api.get(`/products/${slug}`),
  autocomplete: (q: string) => api.get('/products/search/autocomplete', { params: { q } }),
  create: (data: FormData) => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) => api.put(`/products/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/products/${id}`),
  updateStock: (id: string, quantity: number, operation: string) => api.patch(`/products/${id}/stock`, { quantity, operation }),
  deleteImage: (id: string, imageId: string) => api.delete(`/products/${id}/images/${imageId}`),
  getLowStock: () => api.get('/products/admin/low-stock'),
};
