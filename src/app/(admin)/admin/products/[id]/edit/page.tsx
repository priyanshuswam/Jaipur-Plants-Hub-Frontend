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
import CategoryAutocomplete from '@/components/admin/CategoryAutocomplete';
import Link from 'next/link';

const getErrorMessage = (error: any) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Invalid input';
};

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<any>();

  const [thumbnail, setThumbnail] = useState('');
  const [images, setImages] = useState<any[]>([]);

  const { data: productData, isLoading } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => api.get(`/products/${productId}`).then(r => r.data),
    enabled: !!productId,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then(r => r.data.categories),
    staleTime: 60 * 1000,
  });

  useEffect(() => {
    if (productData) {
      const product = productData;
      
      setValue('name', product.name);
      setValue('sku', product.sku);
      setValue('category', product.category?._id);
      setValue('plantName', product.plantName);
      setValue('description', product.description);
      setValue('shortDescription', product.shortDescription);
      setValue('price', product.price);
      setValue('compareAtPrice', product.compareAtPrice);
      setValue('costPrice', product.costPrice);
      setValue('taxRate', product.taxRate);
      setValue('stock', product.stock);
      setValue('lowStockThreshold', product.lowStockThreshold);
      setValue('inStock', product.inStock);
      setValue('allowBackorder', product.allowBackorder);
      setValue('weight', product.weight);
      setValue('dimensions.length', product.dimensions?.length);
      setValue('dimensions.width', product.dimensions?.width);
      setValue('dimensions.height', product.dimensions?.height);
      setValue('isActive', product.isActive);
      setValue('isFeatured', product.isFeatured);
      setValue('isNew', product.isNew);
      setValue('isOnSale', product.isOnSale);
      setValue('seo.title', product.seo?.title);
      setValue('seo.keywords', product.seo?.keywords);
      setValue('seo.description', product.seo?.description);
      setValue('tags', product.tags?.join(', '));

      setThumbnail(product.thumbnail?.url || '');
      setImages(product.images || []);
    }
  }, [productData, setValue]);

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        thumbnail: thumbnail,
        images: images.map(img => ({ url: img.url })),
      };
      return api.put(`/products/${productId}`, payload);
    },
    onSuccess: () => {
      toast.success('Product updated successfully!');
      router.push('/admin/products');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update product');
    },
  });

  const onSubmit = (data: any) => {
    if (!thumbnail) {
      toast.error('Please upload a thumbnail image');
      return;
    }
    updateMutation.mutate(data);
  };

  const categories = categoriesData || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <FiLoader className="text-3xl text-primary-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/products" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <FiArrowLeft />
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Edit Product</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-gray-600 mb-1">Product Name *</label>
              <input
                {...register('name', { required: 'Product name is required' })}
                placeholder="e.g. Monstera Deliciosa"
                className="input-field text-sm"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.name)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">SKU *</label>
              <input
                {...register('sku', { required: 'SKU is required' })}
                placeholder="e.g. MON-001"
                className="input-field text-sm"
              />
              {errors.sku && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.sku)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
              <select
                {...register('category', { required: 'Category is required' })}
                className="input-field text-sm"
              >
                <option value="">Select category</option>
                {categories.map((cat: any) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
              {errors.category && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.category)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Plant Name (Autocomplete)</label>
              <CategoryAutocomplete
                value={watch('plantName') || ''}
                onChange={(val: string) => setValue('plantName', val)}
                placeholder="e.g. Indoor Plants"
              />
              <p className="text-[10px] text-gray-400 mt-1">Suggestions from categories</p>
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Description *</label>
              <textarea
                {...register('description', { required: 'Description is required' })}
                rows={4}
                placeholder="Detailed product description..."
                className="input-field text-sm resize-none"
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.description)}</p>}
            </div>

            <div className="sm:col-span-2 lg:col-span-3">
              <label className="block text-xs font-medium text-gray-600 mb-1">Short Description</label>
              <textarea
                {...register('shortDescription')}
                rows={2}
                placeholder="Brief description for listings..."
                className="input-field text-sm resize-none"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Pricing</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Price (₹) *</label>
              <input
                {...register('price', { required: 'Price is required', valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.price)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Compare at Price (₹)</label>
              <input
                {...register('compareAtPrice', { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Cost Price (₹)</label>
              <input
                {...register('costPrice', { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Tax (%)</label>
              <input
                {...register('taxRate', { valueAsNumber: true })}
                type="number"
                placeholder="18"
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Inventory</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Stock Quantity *</label>
              <input
                {...register('stock', { required: 'Stock is required', valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
              {errors.stock && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.stock)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Low Stock Threshold</label>
              <input
                {...register('lowStockThreshold', { valueAsNumber: true })}
                type="number"
                placeholder="5"
                className="input-field text-sm"
              />
            </div>

            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('inStock')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">In Stock</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('allowBackorder')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Allow Backorder</span>
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Shipping</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)</label>
              <input
                {...register('weight', { valueAsNumber: true })}
                type="number"
                step="0.1"
                placeholder="0.5"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Length (cm)</label>
              <input
                {...register('dimensions.length', { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Width (cm)</label>
              <input
                {...register('dimensions.width', { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Height (cm)</label>
              <input
                {...register('dimensions.height', { valueAsNumber: true })}
                type="number"
                placeholder="0"
                className="input-field text-sm"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Images</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <ImageUpload
              value={thumbnail}
              onChange={setThumbnail}
              label="Thumbnail Image *"
              aspectRatio="aspect-square"
              maxSize={5}
            />
            <MultiImageUpload
              value={images}
              onChange={setImages}
              label="Additional Images"
              maxCount={10}
              maxSize={5}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Settings</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                <input {...register('isNew')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">New Arrival</span>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('isOnSale')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">On Sale</span>
              </label>
            </div>

            <div className="sm:col-span-2 lg:col-span-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
              <input
                {...register('tags')}
                placeholder="indoor, outdoor, succulent"
                className="input-field text-sm"
              />
              <p className="text-[10px] text-gray-400 mt-1">Comma-separated tags</p>
            </div>
          </div>
        </div>

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

        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/products" className="btn-ghost">
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
            Update Product
          </button>
        </div>
      </form>
    </div>
  );
}
