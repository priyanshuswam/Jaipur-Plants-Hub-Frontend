'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FiLock, FiEye, FiEyeOff, FiShield, FiLogOut } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[a-z]/).regex(/[0-9]/),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });
type FormData = z.infer<typeof schema>;

export default function SecurityPage() {
  const router = useRouter();
  const { logout } = useAuthStore();
  const [show, setShow] = useState({ current: false, new: false, confirm: false });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const changePwMutation = useMutation({
    mutationFn: (d: FormData) => authService.changePassword(d.currentPassword, d.newPassword, d.confirmPassword),
    onSuccess: () => {
      toast.success('Password changed! Please log in again.');
      logout();
      router.push('/login');
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to change password'),
  });

  const logoutAllMutation = useMutation({
    mutationFn: () => authService.logoutAll(),
    onSuccess: () => {
      toast.success('Logged out from all devices');
      logout();
      router.push('/login');
    },
  });

  return (
    <div className="max-w-xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-900">Password & Security</h1>

      {/* Change Password */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <FiLock className="text-primary-600" /> Change Password
        </h2>
        <form onSubmit={handleSubmit(d => changePwMutation.mutate(d))} className="space-y-4">
          {[
            { name: 'currentPassword', label: 'Current Password', key: 'current' as const },
            { name: 'newPassword', label: 'New Password', key: 'new' as const },
            { name: 'confirmPassword', label: 'Confirm New Password', key: 'confirm' as const },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  {...register(f.name as any)}
                  type={show[f.key] ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="input-field pl-11 pr-11 text-sm"
                />
                <button type="button" onClick={() => setShow(s => ({ ...s, [f.key]: !s[f.key] }))}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show[f.key] ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {(errors as any)[f.name] && <p className="text-red-500 text-xs mt-1">{(errors as any)[f.name].message}</p>}
            </div>
          ))}
          <button type="submit" disabled={changePwMutation.isPending} className="btn-primary py-2.5 px-6 text-sm disabled:opacity-70">
            {changePwMutation.isPending ? 'Updating...' : 'Update Password'}
          </button>
        </form>
      </div>

      {/* Active Sessions */}
      <div className="bg-white rounded-2xl shadow-soft p-6">
        <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-4">
          <FiShield className="text-primary-600" /> Active Sessions
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Sign out from all other devices where you&apos;re currently logged in.
        </p>
        <button
          onClick={() => logoutAllMutation.mutate()}
          disabled={logoutAllMutation.isPending}
          className="flex items-center gap-2 px-5 py-2.5 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors text-sm font-medium disabled:opacity-70"
        >
          <FiLogOut /> {logoutAllMutation.isPending ? 'Signing out...' : 'Sign Out All Devices'}
        </button>
      </div>
    </div>
  );
}
