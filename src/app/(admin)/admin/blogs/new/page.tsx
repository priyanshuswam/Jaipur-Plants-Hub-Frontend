'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';
import ImageUpload from '@/components/admin/ImageUpload';
import Link from 'next/link';

const getErrorMessage = (error: any) => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  return 'Invalid input';
};

export default function NewBlogPage() {
  const router = useRouter();
  const { register, handleSubmit, formState: { errors } } = useForm<any>({
    defaultValues: {
      status: 'draft',
      isFeatured: false,
      tags: '',
    },
  });

  const [featuredImage, setFeaturedImage] = useState('');

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      const payload = {
        ...data,
        featuredImage: { url: featuredImage },
        tags: data.tags ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean) : [],
      };
      return api.post('/blogs', payload);
    },
    onSuccess: () => {
      toast.success('Blog post created successfully!');
      router.push('/admin/blogs');
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to create blog post');
    },
  });

  const onSubmit = (data: any) => {
    if (!featuredImage) {
      toast.error('Please upload a featured image');
      return;
    }
    createMutation.mutate(data);
  };

  return (
    <div className="max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link href="/admin/blogs" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">
            <FiArrowLeft />
          </Link>
          <h1 className="font-display text-2xl font-bold text-gray-900">Create New Blog Post</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Basic Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
              <input
                {...register('title', { required: 'Title is required' })}
                placeholder="e.g. 10 Best Indoor Plants for Beginners"
                className="input-field text-sm w-full"
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.title)}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Excerpt</label>
              <textarea
                {...register('excerpt')}
                rows={2}
                placeholder="Brief summary of the blog post..."
                className="input-field text-sm resize-none w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Content *</label>
              <textarea
                {...register('content', { required: 'Content is required' })}
                rows={12}
                placeholder="Write your blog post content here..."
                className="input-field text-sm resize-none w-full"
              />
              {errors.content && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.content)}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Category *</label>
                <select
                  {...register('category', { required: 'Category is required' })}
                  className="input-field text-sm"
                >
                  <option value="">Select category</option>
                  <option value="plant-care">Plant Care</option>
                  <option value="gardening-tips">Gardening Tips</option>
                  <option value="landscape-design">Landscape Design</option>
                  <option value="seasonal-guides">Seasonal Guides</option>
                  <option value="news">News</option>
                </select>
                {errors.category && <p className="text-red-500 text-xs mt-1">{getErrorMessage(errors.category)}</p>}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
                <input
                  {...register('tags')}
                  placeholder="indoor, beginner, care-tips"
                  className="input-field text-sm"
                />
                <p className="text-[10px] text-gray-400 mt-1">Comma-separated tags</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Image */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Featured Image</h2>
          <ImageUpload
            value={featuredImage}
            onChange={setFeaturedImage}
            label="Featured Image *"
            aspectRatio="aspect-video"
            maxSize={5}
          />
        </div>

        {/* Publishing Settings */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">Publishing Settings</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Status *</label>
              <select
                {...register('status')}
                className="input-field text-sm"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="scheduled">Scheduled</option>
                <option value="archived">Archived</option>
              </select>
            </div>

            <div className="flex items-center gap-4 pt-5">
              <label className="flex items-center gap-2 cursor-pointer">
                <input {...register('isFeatured')} type="checkbox" className="w-4 h-4 rounded text-primary-600" />
                <span className="text-sm text-gray-700">Featured Post</span>
              </label>
            </div>
          </div>
        </div>

        {/* SEO */}
        <div className="bg-white rounded-2xl shadow-soft p-6">
          <h2 className="font-semibold text-gray-800 mb-4">SEO (Optional)</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Title</label>
              <input
                {...register('seo.metaTitle')}
                placeholder="SEO title"
                className="input-field text-sm w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Description</label>
              <textarea
                {...register('seo.metaDescription')}
                rows={2}
                placeholder="SEO description"
                className="input-field text-sm resize-none w-full"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Meta Keywords</label>
              <input
                {...register('seo.metaKeywords')}
                placeholder="comma, separated, keywords"
                className="input-field text-sm w-full"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3">
          <Link href="/admin/blogs" className="btn-ghost">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={createMutation.isPending}
            className="btn-primary py-2.5 px-6 flex items-center gap-2 disabled:opacity-70"
          >
            {createMutation.isPending ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSave />
            )}
            Create Blog Post
          </button>
        </div>
      </form>
    </div>
  );
}
