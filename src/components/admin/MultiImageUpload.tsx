'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { FiUpload, FiX, FiLoader, FiPlus } from 'react-icons/fi';
import { cn } from '@/lib/utils';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

interface ImageData {
  url: string;
  publicId?: string;
}

interface MultiImageUploadProps {
  value?: ImageData[];
  onChange: (images: ImageData[]) => void;
  label?: string;
  accept?: string;
  maxSize?: number; // in MB
  maxCount?: number;
  className?: string;
}

export default function MultiImageUpload({
  value = [],
  onChange,
  label = 'Images',
  accept = 'image/*',
  maxSize = 5,
  maxCount = 10,
  className,
}: MultiImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    if (value.length + files.length > maxCount) {
      toast.error(`Maximum ${maxCount} images allowed`);
      return;
    }

    // Validate files
    for (const file of files) {
      if (file.size > maxSize * 1024 * 1024) {
        toast.error(`File size must be less than ${maxSize}MB`);
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Only image files are allowed');
        return;
      }
    }

    setUploading(true);

    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      const response = await api.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const newImages: ImageData[] = response.data.files.map((f: any) => ({
        url: f.url,
        publicId: f.publicId,
      }));

      onChange([...value, ...newImages]);
      toast.success(`${files.length} image(s) uploaded successfully`);
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error?.response?.data?.message || 'Failed to upload images');
    } finally {
      setUploading(false);
    }
  }, [maxCount, maxSize, value, onChange]);

  const handleRemove = (index: number) => {
    const newImages = value.filter((_, i) => i !== index);
    onChange(newImages);
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    const newImages = [...value];
    const [removed] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, removed);
    onChange(newImages);
  };

  return (
    <div className={cn('space-y-3', className)}>
      {label && <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>}
      
      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {value.map((image, index) => (
          <div key={index} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-200">
            <Image src={image.url} alt={`Image ${index + 1}`} fill className="object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
            >
              <FiX className="text-sm" />
            </button>
            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
              {index + 1}
            </div>
          </div>
        ))}

        {/* Upload Button */}
        {value.length < maxCount && (
          <div className="relative aspect-square border-2 border-dashed border-gray-200 rounded-xl overflow-hidden bg-gray-50 hover:border-primary-300 transition-colors">
            <div className="flex flex-col items-center justify-center w-full h-full p-4">
              {uploading ? (
                <div className="flex flex-col items-center gap-2">
                  <FiLoader className="text-2xl text-primary-600 animate-spin" />
                  <span className="text-xs text-gray-500">Uploading...</span>
                </div>
              ) : (
                <>
                  <FiPlus className="text-2xl text-gray-400 mb-2" />
                  <p className="text-xs text-gray-500 text-center">Add Image</p>
                  <p className="text-[10px] text-gray-400 mt-1">{value.length}/{maxCount}</p>
                </>
              )}
            </div>
            
            <input
              type="file"
              accept={accept}
              multiple
              onChange={handleFileSelect}
              disabled={uploading}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            />
          </div>
        )}
      </div>

      <p className="text-[10px] text-gray-400">
        Max {maxCount} images, {maxSize}MB each. Drag to reorder (coming soon).
      </p>
    </div>
  );
}
