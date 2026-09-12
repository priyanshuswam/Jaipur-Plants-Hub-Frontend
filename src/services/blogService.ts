import api from '@/lib/axios';

export const blogService = {
  getAll: (params?: Record<string, any>) => api.get('/blogs', { params }),
  getFeatured: (limit?: number) => api.get('/blogs/featured', { params: { limit } }),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
  create: (data: FormData) => api.post('/blogs', data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  update: (id: string, data: FormData) => api.put(`/blogs/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),
  delete: (id: string) => api.delete(`/blogs/${id}`),
};
