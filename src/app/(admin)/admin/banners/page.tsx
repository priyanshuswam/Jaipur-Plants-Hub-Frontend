'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiToggleRight } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { cn, formatDate } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminBannersPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [desktopImage, setDesktopImage] = useState('');
  const [mobileImage, setMobileImage] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: () => api.get('/banners/admin').then(r => r.data),
    staleTime: 60 * 1000,
  });

  const { register, handleSubmit, reset, setValue } = useForm<any>({
    defaultValues: { type: 'hero', position: 'hero', isActive: true, animationType: 'fade' },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-banners'] });

  const saveMutation = useMutation({
    mutationFn: async (d: any) => {
      const payload = {
        ...d,
        image: {
          desktop: desktopImage ? { url: desktopImage } : undefined,
          mobile: mobileImage ? { url: mobileImage } : undefined,
        },
      };
      if (editId) return api.put(`/banners/admin/${editId}`, payload);
      return api.post('/banners/admin', payload);
    },
    onSuccess: () => { toast.success(editId ? 'Banner updated!' : 'Banner created!'); setShowForm(false); setEditId(null); reset(); setDesktopImage(''); setMobileImage(''); refresh(); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to save banner'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/banners/admin/${id}`),
    onSuccess: () => { toast.success('Banner deleted'); refresh(); },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) => api.put(`/banners/admin/${id}`, { isActive: !isActive }),
    onSuccess: () => refresh(),
  });

  const banners = data?.banners || [];

  const handleEdit = (banner: any) => {
    setEditId(banner._id);
    Object.entries({
      title: banner.title, subtitle: banner.subtitle || '', description: banner.description || '',
      type: banner.type, position: banner.position, isActive: banner.isActive,
      order: banner.order || 0,
    }).forEach(([k, v]) => setValue(k as any, v));
    setDesktopImage(banner.image?.desktop?.url || '');
    setMobileImage(banner.image?.mobile?.url || '');
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Banners & Sliders</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); reset(); setDesktopImage(''); setMobileImage(''); }}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiPlus /> New Banner
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-soft p-6 mb-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-gray-800">{editId ? 'Edit Banner' : 'New Banner'}</h2>
              <button onClick={() => { setShowForm(false); reset(); setDesktopImage(''); setMobileImage(''); }}><FiX className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                <input {...register('title', { required: true })} placeholder="Banner title" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Subtitle</label>
                <input {...register('subtitle')} placeholder="Subtitle text" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select {...register('type')} className="input-field text-sm">
                  {['hero', 'promotional', 'category', 'popup', 'announcement', 'sale'].map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Position</label>
                <select {...register('position')} className="input-field text-sm">
                  {['hero', 'home-top', 'home-middle', 'sidebar', 'category-page', 'checkout'].map(p => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
                <input {...register('order', { valueAsNumber: true })} type="number" placeholder="0" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Animation</label>
                <select {...register('animationType')} className="input-field text-sm">
                  {['fade', 'slide', 'zoom', 'flip', 'none'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-2">Desktop Image *</label>
                <ImageUpload
                  value={desktopImage}
                  onChange={setDesktopImage}
                  label=""
                  aspectRatio="aspect-[21/9]"
                  maxSize={10}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <label className="block text-xs font-medium text-gray-600 mb-2">Mobile Image (optional)</label>
                <ImageUpload
                  value={mobileImage}
                  onChange={setMobileImage}
                  label=""
                  aspectRatio="aspect-[9/16]"
                  maxSize={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                <input {...register('startDate')} type="date" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                <input {...register('endDate')} type="date" className="input-field text-sm" />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input {...register('isActive')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                  <span className="text-sm text-gray-700">Active</span>
                </label>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <button type="submit" disabled={saveMutation.isPending} className="btn-primary py-2.5 px-6 text-sm disabled:opacity-70">
                  {saveMutation.isPending ? 'Saving...' : editId ? 'Update Banner' : 'Create Banner'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-ghost text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Banners List */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 skeleton rounded-2xl" />)}
        </div>
      ) : banners.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft text-center py-12 text-gray-400">No banners yet</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {banners.map((banner: any) => (
            <div key={banner._id} className={cn('bg-white rounded-2xl shadow-soft overflow-hidden', !banner.isActive && 'opacity-60')}>
              <div className="relative h-36 bg-gray-100">
                {banner.image?.desktop?.url && (
                  <Image src={banner.image.desktop.url} alt={banner.title} fill className="object-cover" sizes="33vw" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                <div className="absolute bottom-2 left-3 right-3">
                  <p className="text-white font-semibold text-sm line-clamp-1">{banner.title}</p>
                  <p className="text-white/70 text-xs capitalize">{banner.type} · {banner.position}</p>
                </div>
                <span className={cn('absolute top-2 right-2 badge text-[10px]',
                  banner.isActive ? 'bg-green-500 text-white' : 'bg-gray-500 text-white')}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Order: {banner.order} · {banner.animationType}
                  {banner.endDate && <span> · Expires {formatDate(banner.endDate, { dateStyle: 'short' })}</span>}
                </div>
                <div className="flex gap-1">
                  <button onClick={() => toggleMutation.mutate({ id: banner._id, isActive: banner.isActive })}
                    className="p-1.5 hover:bg-primary-50 rounded-lg text-gray-400 hover:text-primary-600 transition-colors">
                    <FiToggleRight className="text-sm" />
                  </button>
                  <button onClick={() => handleEdit(banner)}
                    className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors">
                    <FiEdit2 className="text-sm" />
                  </button>
                  <button onClick={() => confirm('Delete this banner?') && deleteMutation.mutate(banner._id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
