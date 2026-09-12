'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FiBell, FiSend } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function AdminNotificationsPage() {
  const [sent, setSent] = useState(false);

  const { register, handleSubmit, reset } = useForm<any>({
    defaultValues: { type: 'promotional', roles: ['customer'] },
  });

  const broadcastMutation = useMutation({
    mutationFn: (d: any) => api.post('/notifications/admin/broadcast', d),
    onSuccess: (data) => {
      toast.success(`Broadcast sent to ${data.data?.count || 'all'} users!`);
      setSent(true);
      reset();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to send broadcast'),
  });

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Notifications</h1>

      <div className="bg-white rounded-2xl shadow-soft p-7">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
          <FiBell className="text-primary-600" /> Broadcast Notification
        </h2>
        <p className="text-sm text-gray-500 mb-5">Send a notification to all users or a specific role group.</p>

        {sent && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-5 text-sm text-green-700">
            ✅ Broadcast sent successfully!
          </div>
        )}

        <form onSubmit={handleSubmit(d => broadcastMutation.mutate(d))} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Notification Type</label>
            <select {...register('type')} className="input-field text-sm">
              <option value="promotional">Promotional</option>
              <option value="system">System Update</option>
              <option value="coupon_expired">Coupon Alert</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
            <input {...register('title', { required: true })} placeholder="Notification title" className="input-field text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Message *</label>
            <textarea {...register('message', { required: true })} rows={3} placeholder="Notification message..." className="input-field text-sm resize-none" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Link (optional)</label>
            <input {...register('link')} placeholder="/products?isOnSale=true" className="input-field text-sm" />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 mb-2">Send To</label>
            <div className="flex gap-4">
              {['customer', 'staff', 'manager', 'admin'].map(role => (
                <label key={role} className="flex items-center gap-2 cursor-pointer">
                  <input {...register('roles')} type="checkbox" value={role} defaultChecked={role === 'customer'}
                    className="w-4 h-4 rounded text-primary-600" />
                  <span className="text-sm text-gray-700 capitalize">{role}</span>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={broadcastMutation.isPending}
            className="btn-primary py-3 px-7 flex items-center gap-2 disabled:opacity-70">
            {broadcastMutation.isPending
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FiSend />}
            Send Broadcast
          </button>
        </form>
      </div>

      <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5">
        <p className="font-medium text-amber-800 text-sm mb-1">⚠️ Important</p>
        <p className="text-amber-700 text-xs">Broadcast notifications are sent to all users of the selected roles. Use sparingly and only for important updates. Excessive notifications may cause users to disable them.</p>
      </div>
    </div>
  );
}
