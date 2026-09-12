'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter, useParams } from 'next/navigation';
import { FiSave, FiArrowLeft, FiLoader } from 'react-icons/fi';
import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import MultiImageUpload from '@/components/admin/MultiImageUpload';
import Link from 'next/link';

const getErrorMessage = (error: any) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Invalid input';
};

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = params.id as string;

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<any>();

  const [thumbnail, setThumbnail] = useState('');
  const [images, setImages] = useState<any[]>([]);

  const { data: serviceData, isLoading } = useQuery({
    queryKey: ['service', serviceId],
    queryFn: () => api.get(`/services/${serviceId}`).then(r => r.data),
    enabled: !!serviceId,
  });

  useEffect(() => {
    if (serviceData) {
      const service = serviceData;
      
      setValue('name', service.name);
      setValue('icon', service.icon);
      setValue('category', service.category);
      setValue('shortDescription', service.shortDescription);
      setValue('description', service.description);
      setValue('price', service.price);
      setValue('priceUnit', service.priceUnit);
      setValue('duration', service.duration);
      setValue('isActive', service.isActive);
      setValue('isFeatured', service.isFeatured);
      setValue('requiresConsultation', service.requiresConsultation);
      setValue('availableOnline', service.availableOnline);
      setValue('seo.title', service.seo?.title);
      setValue('seo.keywords', service.seo?.keywords);
      setValue('seo.description', service.seo?.description);

      setThumbnail(service.thumbnail?.url || '');
      setImages(service.images || []);
    }
  }, [serviceData, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        thumbnail: thumbnail || undefined,
        images: images.map(img => ({ url: img.url })),
      };
      return api.put(`/services/${serviceId}`, payload);
    },
    onSuccess: () => {
      toast.success('Service updated successfully!');
      router.push('/admin/services');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update service');
    },
  });

  const onSubmit = (data: any) => {
    if (!data.name) {
      toast.error('Service name is required');
      return;
    }
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <FiLoader className="text-3xl text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/services" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <FiArrowLeft />
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Edit Service</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Service Name *</label>
              <input
                {...register('name', { required: 'Service name is required' })}
                placeholder="e.g. Garden Maintenance"
                className="input-field text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{String(errors.name?.message || errors.name)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Icon (emoji)</label>
              <input
                {...register('icon')}
                placeholder="🌿"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
              <select {...register('category')} className="input-field text-sm">
                <option value="">Select category</option>
                <option value="garden-maintenance">Garden Maintenance</option>
                <option value="landscaping">Landscaping</option>
                <option value="plant-care">Plant Care</option>
                <option value="consultation">Consultation</option>
                <option value="installation">Installation</option>
                <option value="rental">Plant Rental</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Short Description *</label>
              <input
                {...register('shortDescription', { required: 'Short description is required' })}
                placeholder="Brief description for listings..."
                className="input-field text-sm"
              />
              {errors.shortDescription && <p className="text-red-500 text-xs mt-1">{String(errors.shortDescription?.message || errors.shortDescription)}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Full Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={6}
                placeholder="Detailed service description..."
                className="input-field text-sm resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{String(errors.description?.message || errors.description)}</p>}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Pricing</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Base Price (₹) *</label>
              <input
                {...register('price', { required: 'Price is required', valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.price)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price Unit</label>
              <select {...register('priceUnit')} className="input-field text-sm">
                <option value="per-hour">Per Hour</option>
                <option value="per-visit">Per Visit</option>
                <option value="per-sqft">Per Sq. Ft.</option>
                <option value="fixed">Fixed Price</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Duration (minutes)</label>
              <input
                {...register('duration', { valueAsNumber: true })}
                type="number"
                placeholder="60"
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Images</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <ImageUpload
              value={thumbnail}
              onChange={setThumbnail}
              label="Thumbnail Image"
              aspectRatio="aspect-video"
              maxSize={5}
            />
            <MultiImageUpload
              value={images}
              onChange={setImages}
              label="Gallery Images"
              maxCount={15}
              maxSize={5}
            />
          </div>
        </div>

        {/* Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('isActive')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Active</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('requiresConsultation')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Requires Consultation</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('availableOnline')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Available Online</span>
              </label>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">SEO (Optional)</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
              <input
                {...register('seo.title')}
                placeholder="SEO title"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Keywords</label>
              <input
                {...register('seo.keywords')}
                placeholder="comma, separated, keywords"
                className="input-field text-sm"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
              <textarea
                {...register('seo.description')}
                rows={2}
                placeholder="SEO description"
                className="input-field text-sm resize-none"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/services" className="btn-ghost">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="btn-primary py-2.5 px-6 flex items-center gap-2 disabled:opacity-70"
          >
            {updateMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave />
            )}
            Update Service
          </button>
        </div>
      </form>
    </div>
  );
}
