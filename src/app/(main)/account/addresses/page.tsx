'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiMapPin, FiCheck } from 'react-icons/fi';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { INDIAN_STATES } from '@/constants';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Address } from '@/types';

const schema = z.object({
  label: z.string().default('Home'),
  fullName: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone required'),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/),
  isDefault: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function AddressesPage() {
  const qc = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const { data } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get('/users/me/addresses').then(r => r.data),
    initialData: { addresses: user?.addresses || [] },
  });

  const addresses: Address[] = data?.addresses || [];

  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ['addresses'] });

  const saveMutation = useMutation({
    mutationFn: async (d: FormData) => {
      if (editId) return api.put(`/users/me/addresses/${editId}`, d).then(r => r.data);
      return api.post('/users/me/addresses', d).then(r => r.data);
    },
    onSuccess: (data) => {
      updateUser({ addresses: data.addresses });
      toast.success(editId ? 'Address updated!' : 'Address added!');
      setShowForm(false);
      setEditId(null);
      reset();
      refresh();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to save address'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/me/addresses/${id}`).then(r => r.data),
    onSuccess: (data) => {
      updateUser({ addresses: data.addresses });
      toast.success('Address deleted');
      refresh();
    },
    onError: () => toast.error('Failed to delete address'),
  });

  const setDefaultMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/me/addresses/${id}/set-default`).then(r => r.data),
    onSuccess: (data) => {
      updateUser({ addresses: data.addresses });
      toast.success('Default address updated');
      refresh();
    },
  });

  const handleEdit = (addr: Address) => {
    setEditId(addr._id);
    Object.entries(addr).forEach(([k, v]) => setValue(k as any, v));
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setShowForm(false); setEditId(null); reset(); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">My Addresses</h1>
        {!showForm && addresses.length < 5 && (
          <button onClick={() => setShowForm(true)} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
            <FiPlus /> Add New Address
          </button>
        )}
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-soft p-6 mb-5"
          >
            <h2 className="font-semibold text-gray-800 mb-4">{editId ? 'Edit Address' : 'Add New Address'}</h2>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="space-y-4">
              {/* Label */}
              <div className="flex gap-2">
                {['Home', 'Office', 'Other'].map(l => (
                  <button key={l} type="button"
                    onClick={() => setValue('label', l)}
                    className="px-3 py-1.5 text-xs rounded-full border-2 border-gray-200 hover:border-primary-400 transition-colors">
                    {l}
                  </button>
                ))}
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'fullName', label: 'Full Name *', placeholder: 'Full name' },
                  { name: 'phone', label: 'Phone *', placeholder: '9876543210' },
                  { name: 'addressLine1', label: 'Address Line 1 *', placeholder: 'House/Flat, Street', full: true },
                  { name: 'addressLine2', label: 'Landmark (optional)', placeholder: 'Near landmark', full: true },
                  { name: 'city', label: 'City *', placeholder: 'City' },
                  { name: 'pincode', label: 'PIN Code *', placeholder: '400001' },
                ].map(f => (
                  <div key={f.name} className={f.full ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input {...register(f.name as any)} placeholder={f.placeholder} className="input-field text-sm" />
                    {(errors as any)[f.name] && <p className="text-red-500 text-xs mt-1">{(errors as any)[f.name]?.message}</p>}
                  </div>
                ))}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                  <select {...register('state')} className="input-field text-sm">
                    <option value="">Select State</option>
                    {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message}</p>}
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('isDefault')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Set as default address</span>
              </label>

              <div className="flex gap-3">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2.5 px-6 text-sm disabled:opacity-70">
                  {saveMutation.isPending ? 'Saving...' : editId ? 'Update Address' : 'Save Address'}
                </button>
                <button type="button" onClick={handleCancel} className="btn-ghost text-sm text-gray-600">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address List */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft text-center py-16">
          <FiMapPin className="text-5xl text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No addresses saved yet</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mt-4 inline-flex text-sm gap-2 py-2.5 px-5">
            <FiPlus /> Add Address
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <motion.div
              key={addr._id}
              layout
              className={cn(
                'bg-white rounded-2xl shadow-soft p-5 border-2 transition-all',
                addr.isDefault ? 'border-primary-400' : 'border-transparent hover:border-gray-200'
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="badge bg-gray-100 text-gray-600 text-xs">{addr.label}</span>
                  {addr.isDefault && (
                    <span className="badge bg-primary-100 text-primary-700 text-xs flex items-center gap-1">
                      <FiCheck className="text-xs" /> Default
                    </span>
                  )}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(addr)} className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors">
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button onClick={() => deleteMutation.mutate(addr._id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
              <p className="font-semibold text-gray-800 text-sm">{addr.fullName}</p>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed">
                {addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}<br />
                {addr.city}, {addr.state} - {addr.pincode}
              </p>
              <p className="text-primary-600 text-sm mt-1">{addr.phone}</p>
              {!addr.isDefault && (
                <button onClick={() => setDefaultMutation.mutate(addr._id)} className="text-xs text-primary-600 hover:underline mt-3 block">
                  Set as Default
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
