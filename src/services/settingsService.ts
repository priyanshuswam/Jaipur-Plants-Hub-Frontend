import api from '@/lib/axios';

export const settingsService = {
  getPublic: () => api.get('/settings/public'),
  getAll: () => api.get('/settings/admin'),
  update: (data: Record<string, any>) => api.put('/settings/admin', data),
  updateOne: (key: string, value: any) => api.put(`/settings/admin/${key}`, { value }),
  init: () => api.post('/settings/admin/init'),
};
