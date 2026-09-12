'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiCamera, FiSave, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
  bio: z.string().max(500).optional(),
  gender: z.enum(['male', 'female', 'other', 'prefer_not_to_say']).optional(),
  dateOfBirth: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { user, updateUser } = useAuthStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      gender: user?.gender as any,
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    },
  });

  const updateMutation = useMutation({
    mutationFn: (d: FormData) => api.put('/users/me', d).then(r => r.data),
    onSuccess: (data) => {
      updateUser(data.user);
      toast.success('Profile updated successfully 🌿');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('avatar', file);
      const { data } = await api.post('/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      updateUser({ avatar: data.avatar });
      toast.success('Avatar updated!');
    } catch {
      toast.error('Failed to upload avatar');
    } finally {
      setUploadingAvatar(false);
      e.target.value = '';
    }
  };

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      {/* Email verification banner */}
      {!user?.isEmailVerified && (
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 mb-5">
          <FiAlertCircle className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-amber-800 text-sm">Email not verified</p>
            <p className="text-amber-600 text-xs mt-0.5">Please verify your email to unlock all features.</p>
            <button onClick={() => api.post('/auth/resend-verification').then(() => toast.success('Verification email sent!'))}
              className="text-amber-700 text-xs font-semibold hover:underline mt-1">
              Resend verification email →
            </button>
          </div>
        </div>
      )}

      {/* Avatar */}
      <div className="flex items-center gap-5 mb-8 bg-white rounded-2xl shadow-soft p-5">
        <div className="relative">
          <div className="w-20 h-20 rounded-2xl overflow-hidden bg-primary-100 flex-shrink-0">
            {user?.avatar?.url ? (
              <Image src={user.avatar.url} alt={user.firstName} width={80} height={80} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-bold text-2xl text-primary-700">
                {getInitials(user?.fullName || '')}
              </div>
            )}
          </div>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploadingAvatar}
            className="absolute -bottom-1 -right-1 w-7 h-7 bg-primary-600 rounded-full flex items-center justify-center text-white hover:bg-primary-700 transition-colors shadow-soft"
          >
            {uploadingAvatar
              ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              : <FiCamera className="text-xs" />}
          </button>
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div>
          <p className="font-semibold text-gray-800">{user?.fullName}</p>
          <p className="text-gray-500 text-sm">{user?.email}</p>
          {user?.isEmailVerified && (
            <span className="inline-flex items-center gap-1 text-green-600 text-xs mt-1">
              <FiCheckCircle className="text-xs" /> Email verified
            </span>
          )}
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(d => updateMutation.mutate(d))} className="bg-white rounded-2xl shadow-soft p-6 space-y-4">
        <h2 className="font-semibold text-gray-800 mb-2">Personal Information</h2>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { name: 'firstName', label: 'First Name *' },
            { name: 'lastName', label: 'Last Name *' },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <input {...register(f.name as any)} className="input-field text-sm" />
              {(errors as any)[f.name] && <p className="text-red-500 text-xs mt-1">{(errors as any)[f.name].message}</p>}
            </div>
          ))}
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Phone Number</label>
          <input {...register('phone')} placeholder="10-digit mobile number" className="input-field text-sm" />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Gender</label>
            <select {...register('gender')} className="input-field text-sm">
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Date of Birth</label>
            <input {...register('dateOfBirth')} type="date" className="input-field text-sm" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
          <textarea {...register('bio')} rows={3} placeholder="Tell us a bit about yourself..." className="input-field text-sm resize-none" />
          {errors.bio && <p className="text-red-500 text-xs mt-1">{errors.bio.message}</p>}
        </div>

        <button type="submit" disabled={!isDirty || updateMutation.isPending} className="btn-primary py-3 px-7 disabled:opacity-60 flex items-center gap-2">
          {updateMutation.isPending
            ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            : <FiSave />}
          Save Changes
        </button>
      </form>
    </div>
  );
}
