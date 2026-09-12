import api from '@/lib/axios';

export const orderService = {
  create: (data: any) => api.post('/orders', data),
  getMyOrders: (params?: Record<string, any>) => api.get('/orders', { params }),
  getById: (id: string) => api.get(`/orders/${id}`),
  cancel: (id: string, reason?: string) => api.post(`/orders/${id}/cancel`, { reason }),
  requestReturn: (id: string, reason: string) => api.post(`/orders/${id}/return`, { reason }),
  createPaymentOrder: (orderId: string, amount: number) =>
    api.post('/payments/create-order', { orderId, amount }),
  verifyPayment: (data: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string; orderId: string }) =>
    api.post('/payments/verify', data),
  // Admin
  getAllAdmin: (params?: Record<string, any>) => api.get('/orders/admin/all', { params }),
  getAdminById: (id: string) => api.get(`/orders/admin/${id}`),
  updateStatus: (id: string, data: any) => api.put(`/orders/admin/${id}/status`, data),
  refund: (id: string, data: any) => api.post(`/payments/refund/${id}`, data),
};
