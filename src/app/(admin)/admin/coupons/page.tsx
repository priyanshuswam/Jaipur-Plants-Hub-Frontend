'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiTag } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminCouponsPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-coupons'],
    queryFn: () => api.get('/coupons/admin').then(r => r.data),
    staleTime: 60 * 1000,
  });

  const { register, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: { discountType: 'percentage', perUserLimit: 1, isActive: true, isPublic: true },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-coupons'] });

  const saveMutation = useMutation({
    mutationFn: async (d: any) => {
      if (editId) return api.put(`/coupons/admin/${editId}`, d);
      return api.post('/coupons/admin', d);
    },
    onSuccess: () => { toast.success(editId ? 'Coupon updated!' : 'Coupon created!'); setShowForm(false); setEditId(null); reset(); refresh(); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to save coupon'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/coupons/admin/${id}`),
    onSuccess: () => { toast.success('Coupon deleted'); refresh(); },
    onError: () => toast.error('Failed to delete coupon'),
  });

  const coupons = data?.coupons || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Coupons</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); reset(); }}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiPlus /> Create Coupon
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-soft p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">{editId ? 'Edit Coupon' : 'New Coupon'}</h2>
              <button onClick={() => { setShowForm(false); reset(); }}><FiX className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Coupon Code *</label>
                <input {...register('code', { required: true })} placeholder="SUMMER20" className="input-field text-sm uppercase" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Discount Type *</label>
                <select {...register('discountType')} className="input-field text-sm">
                  <option value="percentage">Percentage (%)</option>
                  <option value="fixed">Fixed Amount (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Discount Value *</label>
                <input {...register('discountValue', { required: true, valueAsNumber: true })} type="number" placeholder="20" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Min Purchase (₹)</label>
                <input {...register('minPurchaseAmount', { valueAsNumber: true })} type="number" placeholder="0" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Max Discount (₹) – for % coupons</label>
                <input {...register('maxDiscountAmount', { valueAsNumber: true })} type="number" placeholder="500" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Usage Limit (blank = unlimited)</label>
                <input {...register('usageLimit', { valueAsNumber: true })} type="number" placeholder="100" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Per User Limit</label>
                <input {...register('perUserLimit', { valueAsNumber: true })} type="number" placeholder="1" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input {...register('startDate')} type="date" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date *</label>
                <input {...register('endDate', { required: true })} type="date" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input {...register('description')} placeholder="Summer sale 20% off" className="input-field text-sm" />
              </div>
              <div className="flex flex-wrap gap-4 items-center sm:col-span-2">
                {[
                  { name: 'isActive', label: 'Active' },
                  { name: 'isPublic', label: 'Public (visible to all)' },
                  { name: 'firstTimeUserOnly', label: 'First-time users only' },
                ].map(f => (
                  <label key={f.name} className="flex items-center gap-2 cursor-pointer">
                    <input {...register(f.name)} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </label>
                ))}
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2.5 px-6 text-sm disabled:opacity-70">
                  {saveMutation.isPending ? 'Saving...' : editId ? 'Update Coupon' : 'Create Coupon'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-ghost text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Code', 'Type', 'Value', 'Min Purchase', 'Used/Limit', 'Valid Until', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 8 }).map((_, j) => <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-16" /></td>)}</tr>
                ))
              ) : coupons.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No coupons yet</td></tr>
              ) : (
                coupons.map((coupon: any) => (
                  <tr key={coupon._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-primary-700 flex items-center gap-1.5">
                      <FiTag className="text-primary-400 text-xs" />{coupon.code}
                    </td>
                    <td className="px-4 py-3 capitalize text-gray-600">{coupon.discountType}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                    </td>
                    <td className="px-4 py-3 text-gray-500">₹{coupon.minPurchaseAmount || 0}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {coupon.usageCount}/{coupon.usageLimit ?? '∞'}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(coupon.endDate, { dateStyle: 'short' })}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', coupon.isActive && new Date(coupon.endDate) > new Date() ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                        {coupon.isActive && new Date(coupon.endDate) > new Date() ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => { setEditId(coupon._id); setShowForm(true); }} className="p-1.5 hover:bg-primary-50 rounded-lg text-gray-400 hover:text-primary-600">
                          <FiEdit2 className="text-sm" />
                        </button>
                        <button onClick={() => confirm('Delete this coupon?') && deleteMutation.mutate(coupon._id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
