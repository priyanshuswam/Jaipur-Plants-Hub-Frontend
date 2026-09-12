import api from '@/lib/axios';

export const serviceService = {
  getAll: (params?: Record<string, any>) => api.get('/services', { params }),
  getFeatured: (limit?: number) => api.get('/services/featured', { params: { limit } }),
  getBySlug: (slug: string) => api.get(`/services/${slug}`),
  book: (id: string, data: any) => api.post(`/services/${id}/book`, data),
  create: (data: any) => api.post('/services', data),
  update: (id: string, data: any) => api.put(`/services/${id}`, data),
  delete: (id: string) => api.delete(`/services/${id}`),
};
