'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { FaGoogle } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const schema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});
type FormData = z.infer<typeof schema>;

export default function LoginClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const sessionExpired = searchParams.get('session') === 'expired';

  const { setUser, setTokens, isAuthenticated } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (isAuthenticated) router.replace(redirect);
  }, [isAuthenticated, redirect, router]);

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: res } = await authService.login({ email: data.email, password: data.password });
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      toast.success(`Welcome back, ${res.user.firstName}! 🌿`);
      router.replace(redirect);
    } catch (e: any) {
      const msg = e?.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      {sessionExpired && (
        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-6 text-sm">
          <FiAlertCircle className="flex-shrink-0" />
          Your session has expired. Please log in again.
        </div>
      )}

      <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Welcome back</h1>
      <p className="text-gray-500 text-sm mb-8">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="text-primary-600 font-semibold hover:underline">Create one</Link>
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('email')}
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              className="input-field pl-11"
            />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-sm font-medium text-gray-700">Password</label>
            <Link href="/forgot-password" className="text-xs text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              className="input-field pl-11 pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input {...register('rememberMe')} type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary-600" />
          <span className="text-sm text-gray-600">Remember me for 30 days</span>
        </label>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full py-3.5 text-base disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
          ) : (
            <>Sign In <FiArrowRight /></>
          )}
        </button>
      </form>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
        <div className="relative flex justify-center">
          <span className="bg-surface px-4 text-xs text-gray-400 uppercase tracking-wide">Or continue with</span>
        </div>
      </div>

      <button
        type="button"
        className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all"
        onClick={() => toast('Google login coming soon')}
      >
        <FaGoogle className="text-red-500" /> Continue with Google
      </button>

      <p className="text-xs text-gray-400 text-center mt-6">
        By signing in, you agree to our{' '}
        <Link href="/terms" className="text-primary-600 hover:underline">Terms</Link> and{' '}
        <Link href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link>
      </p>
    </motion.div>
  );
}
