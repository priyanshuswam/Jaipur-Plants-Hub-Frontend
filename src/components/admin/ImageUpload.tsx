'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLoader } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  aspectRatio?: string;
  className?: string;
}

export default function ImageUpload({
  value,
  onChange,
  label = 'Image',
  accept = 'image/*',
  maxSize = 5,
  aspectRatio = 'aspect-video',
  className,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(value || '');

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size must be less than ${maxSize}MB`);
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await api.post('/uploads/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const url = response.data.url;
      setPreview(url);
      onChange(url);
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  }, [maxSize, onChange]);

  const handleRemove = () => {
    setPreview('');
    onChange('');
  };

  return (
    <div className={cn('space-y-2', className)}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      
      <div className={cn('relative border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:border-primary-300 transition-colors', aspectRatio)}>
        {preview ? (
          <div className="relative w-full h-full">
            <Image src={preview} alt="Preview" fill className="object-cover" />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
              disabled={uploading}
            >
              <FiX className="text-sm" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center w-full h-full p-6">
            {uploading ? (
              <div className="flex flex-col items-center gap-2">
                <FiLoader className="text-2xl text-primary-600 animate-spin" />
                <span className="text-xs text-gray-500">Uploading...</span>
              </div>
            ) : (
              <>
                <FiUpload className="text-2xl text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 text-center">
                  Click or drag to upload
                </p>
                <p className="text-[10px] text-gray-400 mt-1">
                  Max {maxSize}MB
                </p>
              </>
            )}
          </div>
        )}
        
        <input
          type="file"
          accept={accept}
          onChange={handleFileSelect}
          disabled={uploading}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        />
      </div>
    </div>
  );
}
