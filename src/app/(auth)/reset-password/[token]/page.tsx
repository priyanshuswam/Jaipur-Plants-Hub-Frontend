'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const schema = z.object({
  password: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'Needs uppercase').regex(/[a-z]/, 'Needs lowercase').regex(/[0-9]/, 'Needs number'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });
type FormData = z.infer<typeof schema>;

export default function ResetPasswordPage() {
  const params = useParams();
  const token = params.token as string;
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, data.password, data.confirmPassword);
      setDone(true);
      toast.success('Password reset successfully!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Reset link is invalid or expired.');
    } finally { setLoading(false); }
  };

  if (done) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <FiCheckCircle className="text-green-500 text-4xl" />
        </div>
        <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Password Reset!</h1>
        <p className="text-gray-500">Redirecting to login...</p>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Create new password</h1>
      <p className="text-gray-500 text-sm mb-8">Choose a strong password for your account.</p>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {[
          { name: 'password', label: 'New Password' },
          { name: 'confirmPassword', label: 'Confirm Password' },
        ].map(f => (
          <div key={f.name}>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">{f.label}</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                {...register(f.name as any)}
                type={showPw ? 'text' : 'password'}
                placeholder="••••••••"
                className="input-field pl-11 pr-11"
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {(errors as any)[f.name] && (
              <p className="text-red-500 text-xs mt-1">{(errors as any)[f.name].message}</p>
            )}
          </div>
        ))}
        <button type="submit" disabled={loading} className="btn-primary w-full py-3.5 disabled:opacity-70">
          {loading
            ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            : 'Reset Password'}
        </button>
      </form>
    </motion.div>
  );
}
