'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiSave } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';

export default function AdminCategoriesPage() {
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [categoryImage, setCategoryImage] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.get('/categories', { params: { active: 'false' } }).then(r => r.data),
    staleTime: 60 * 1000,
  });

  const { register, handleSubmit, reset, setValue } = useForm<any>();

  const refresh = () => qc.invalidateQueries({ queryKey: ['admin-categories'] });

  const saveMutation = useMutation({
    mutationFn: async (d: any) => {
      const payload = {
        ...d,
        image: categoryImage ? { url: categoryImage } : undefined,
      };
      if (editId) return api.put(`/categories/${editId}`, payload);
      return api.post('/categories', payload);
    },
    onSuccess: () => {
      toast.success(editId ? 'Category updated!' : 'Category created!');
      setShowForm(false); setEditId(null); reset(); setCategoryImage(''); refresh();
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to save category'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/categories/${id}`),
    onSuccess: () => { toast.success('Category deleted'); refresh(); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to delete category'),
  });

  const handleEdit = (cat: any) => {
    setEditId(cat._id);
    setValue('name', cat.name);
    setValue('description', cat.description || '');
    setValue('icon', cat.icon || '');
    setValue('color', cat.color || '#2E7D32');
    setValue('order', cat.order || 0);
    setValue('isActive', cat.isActive);
    setValue('isFeatured', cat.isFeatured);
    setValue('showOnHome', cat.showOnHome);
    setCategoryImage(cat.image?.url || '');
    setShowForm(true);
  };

  const categories = data?.categories || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Categories</h1>
        <button onClick={() => { setShowForm(true); setEditId(null); reset(); setCategoryImage(''); }}
          className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiPlus /> Add Category
        </button>
      </div>

      {/* Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="bg-white rounded-2xl shadow-soft p-6 mb-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-800">{editId ? 'Edit Category' : 'New Category'}</h2>
              <button onClick={() => { setShowForm(false); setEditId(null); reset(); setCategoryImage(''); }} className="text-gray-400 hover:text-gray-600">
                <FiX />
              </button>
            </div>
            <form onSubmit={handleSubmit(d => saveMutation.mutate(d))} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category Name *</label>
                <input {...register('name', { required: true })} placeholder="e.g. Indoor Plants" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Icon (emoji)</label>
                <input {...register('icon')} placeholder="🪴" className="input-field text-sm" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Brand Color</label>
                <input {...register('color')} type="color" className="input-field text-sm h-10 cursor-pointer" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Display Order</label>
                <input {...register('order')} type="number" placeholder="0" className="input-field text-sm" />
              </div>
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                <input {...register('description')} placeholder="Short description" className="input-field text-sm" />
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex flex-wrap gap-4">
                {[
                  { name: 'isActive', label: 'Active' },
                  { name: 'isFeatured', label: 'Featured' },
                  { name: 'showOnHome', label: 'Show on Homepage' },
                ].map(f => (
                  <label key={f.name} className="flex items-center gap-2 cursor-pointer">
                    <input {...register(f.name)} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                    <span className="text-sm text-gray-700">{f.label}</span>
                  </label>
                ))}
              </div>
              <div className="sm:col-span-2 lg:col-span-3 flex gap-3">
                <button type="submit" disabled={saveMutation.isPending}
                  className="btn-primary py-2.5 px-6 text-sm disabled:opacity-70 flex items-center gap-2">
                  {saveMutation.isPending ? '...' : <><FiSave />{editId ? 'Update' : 'Create'}</>}
                </button>
                <button type="button" onClick={() => { setShowForm(false); reset(); }} className="btn-ghost text-sm">Cancel</button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {categories.map((cat: any) => (
            <motion.div key={cat._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={cn('bg-white rounded-2xl shadow-soft p-4 border-2 transition-all', cat.isActive ? 'border-transparent' : 'border-gray-100 opacity-60')}>
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{cat.icon || '🌿'}</span>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{cat.name}</p>
                    <p className="text-xs text-gray-400">{cat.productCount || 0} products</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => handleEdit(cat)} className="p-1.5 hover:bg-primary-50 rounded-lg text-gray-400 hover:text-primary-600 transition-colors">
                    <FiEdit2 className="text-xs" />
                  </button>
                  <button onClick={() => confirm(`Delete "${cat.name}"?`) && deleteMutation.mutate(cat._id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                    <FiTrash2 className="text-xs" />
                  </button>
                </div>
              </div>
              <div className="flex gap-1.5 flex-wrap">
                {cat.isActive && <span className="badge bg-green-100 text-green-700 text-[10px]">Active</span>}
                {cat.isFeatured && <span className="badge bg-amber-100 text-amber-700 text-[10px]">Featured</span>}
                {cat.showOnHome && <span className="badge bg-blue-100 text-blue-700 text-[10px]">Homepage</span>}
                <span className="badge bg-gray-100 text-gray-500 text-[10px]">Order: {cat.order}</span>
              </div>
              {cat.image?.url && (
                <div className="mt-2 h-16 rounded-lg overflow-hidden">
                  <Image src={cat.image.url} alt={cat.name} width={200} height={64} className="w-full h-full object-cover" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
