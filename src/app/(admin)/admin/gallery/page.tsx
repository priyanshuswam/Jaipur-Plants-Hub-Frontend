'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiStar } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

const GALLERY_CATEGORIES = ['villa-garden','farmhouse','resort','hotel','office','terrace-garden','vertical-garden','indoor','landscape','before-after','other'];

export default function AdminGalleryPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [category, setCategory] = useState('');
  const [page, setPage] = useState(1);
  const [galleryImage, setGalleryImage] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-gallery', category, page],
    queryFn: () => api.get('/gallery', { params: { category: category || undefined, page, limit: 20 } }).then(r => r.data),
    staleTime: 30 * 1000,
  });

  const { register, handleSubmit, reset } = useForm<any>({
    defaultValues: { type: 'image', isActive: true, isFeatured: false },
  });

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-gallery'] });

  const createMutation = useMutation({
    mutationFn: (d: any) => {
      const payload = {
        ...d,
        image: galleryImage ? { url: galleryImage } : undefined,
      };
      return api.post('/gallery', payload);
    },
    onSuccess: () => { toast.success('Gallery item added'); setShowForm(false); reset(); setGalleryImage(''); refresh(); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to add item'),
  });

  const toggleFeatured = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) => api.put(`/gallery/${id}`, { isFeatured: !isFeatured }),
    onSuccess: () => refresh(),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/gallery/${id}`),
    onSuccess: () => { toast.success('Item deleted'); refresh(); },
    onError: () => toast.error('Failed to delete item'),
  });

  const items = data?.items || [];
  const meta = data?.meta || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Gallery</h1>
        <button onClick={() => setShowForm(true)} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiPlus /> Add Photo
        </button>
      </div>

      {/* Add Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="bg-white rounded-2xl shadow-soft p-6 mb-5">
            <div className="flex justify-between mb-4">
              <h2 className="font-semibold text-gray-800">Add Gallery Item</h2>
              <button onClick={() => { setShowForm(false); reset(); }}><FiX className="text-gray-400" /></button>
            </div>
            <form onSubmit={handleSubmit(d => createMutation.mutate(d))} className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                <input {...register('title', { required: true })} placeholder="Villa Garden – Mumbai" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                <select {...register('category', { required: true })} className="input-field text-sm">
                  <option value="">Select category</option>
                  {GALLERY_CATEGORIES.map(c => <option key={c} value={c}>{c.replace(/-/g, ' ')}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Image *</label>
                <ImageUpload
                  value={galleryImage}
                  onChange={setGalleryImage}
                  label=""
                  aspectRatio="aspect-square"
                  maxSize={10}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input {...register('description')} placeholder="Project description" className="input-field text-sm" />
              </div>
              <div className="flex items-center gap-4 pt-5">
                {[{ name: 'isActive', label: 'Active' }, { name: 'isFeatured', label: 'Featured' }, { name: 'showOnHome', label: 'Show on Home' }].map(f => (
                  <label key={f.name} className="flex items-center gap-1.5 cursor-pointer">
                    <input {...register(f.name)} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </label>
                ))}
              </div>
              <div className="sm:col-span-2 flex gap-3">
                <button type="submit" disabled={createMutation.isPending} className="btn-primary py-2.5 px-6 text-sm disabled:opacity-70">
                  {createMutation.isPending ? 'Adding...' : 'Add to Gallery'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-ghost text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Filters */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-5">
        {[{ value: '', label: 'All' }, ...GALLERY_CATEGORIES.map(c => ({ value: c, label: c.replace(/-/g, ' ') }))].map(c => (
          <button key={c.value} onClick={() => { setCategory(c.value); setPage(1); }}
            className={cn('px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 transition-all capitalize',
              category === c.value ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}>
            {c.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => <div key={i} className="aspect-square skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {items.map((item: any) => (
            <div key={item._id} className="relative group rounded-2xl overflow-hidden bg-gray-100" style={{ aspectRatio: '1' }}>
              {item.image?.url && (
                <Image src={item.image.url} alt={item.title} fill className="object-cover" sizes="25vw" />
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors">
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs font-medium text-center px-2">{item.title}</p>
                  <div className="flex gap-2">
                    <button onClick={() => toggleFeatured.mutate({ id: item._id, isFeatured: item.isFeatured })}
                      className={cn('p-1.5 rounded-lg transition-colors', item.isFeatured ? 'bg-amber-400 text-white' : 'bg-white/20 text-white hover:bg-amber-400')}>
                      <FiStar className="text-sm" />
                    </button>
                    <button onClick={() => confirm('Delete this item?') && deleteMutation.mutate(item._id)}
                      className="p-1.5 bg-white/20 text-white rounded-lg hover:bg-red-500 transition-colors">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="absolute top-2 left-2 flex gap-1">
                {item.isFeatured && <span className="badge bg-amber-400 text-white text-[10px]">Featured</span>}
                {!item.isActive && <span className="badge bg-red-500 text-white text-[10px]">Hidden</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      {meta.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">← Prev</button>
          <span className="px-4 py-2 text-sm text-gray-500">{page}/{meta.totalPages}</span>
          <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next →</button>
        </div>
      )}
    </div>
  );
}
