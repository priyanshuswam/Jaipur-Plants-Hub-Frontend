'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiPhone, FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import toast from 'react-hot-toast';

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Enter a valid email address'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number').optional().or(z.literal('')),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Must contain at least one number'),
  confirmPassword: z.string(),
  agreeToTerms: z.literal(true, { errorMap: () => ({ message: 'You must accept the terms' }) }),
}).refine(d => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const PERKS = [
  'Exclusive discounts & offers',
  'Track orders in real-time',
  'Expert plant care guidance',
  'Early access to new arrivals',
];

export default function SignupPage() {
  const router = useRouter();
  const { setUser, setTokens } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const password = watch('password', '');
  const strength = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /[0-9]/.test(password),
  ].filter(Boolean).length;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const { data: res } = await authService.signup({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      setTokens(res.accessToken, res.refreshToken);
      setUser(res.user);
      toast.success(`Welcome to Jaipur Plants Hub, ${res.user.firstName}! 🌿`);
      router.replace('/');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      <h1 className="font-display text-3xl font-bold text-gray-900 mb-1">Create your account</h1>
      <p className="text-gray-500 text-sm mb-6">
        Already have an account?{' '}
        <Link href="/login" className="text-primary-600 font-semibold hover:underline">Sign in</Link>
      </p>

      {/* Perks */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {PERKS.map(p => (
          <div key={p} className="flex items-center gap-2 text-xs text-gray-600">
            <FiCheckCircle className="text-primary-500 flex-shrink-0 text-sm" /> {p}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Name Row */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { name: 'firstName', placeholder: 'First name', icon: FiUser },
            { name: 'lastName', placeholder: 'Last name', icon: FiUser },
          ].map(f => (
            <div key={f.name}>
              <div className="relative">
                <f.icon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  {...register(f.name as any)}
                  placeholder={f.placeholder}
                  className="input-field pl-10 py-3 text-sm"
                />
              </div>
              {(errors as any)[f.name] && (
                <p className="text-red-500 text-[11px] mt-1">{(errors as any)[f.name].message}</p>
              )}
            </div>
          ))}
        </div>

        {/* Email */}
        <div>
          <div className="relative">
            <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('email')} type="email" placeholder="Email address" className="input-field pl-11" />
          </div>
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        {/* Phone */}
        <div>
          <div className="relative">
            <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input {...register('phone')} type="tel" placeholder="Phone number (optional)" className="input-field pl-11" />
          </div>
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        {/* Password */}
        <div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              className="input-field pl-11 pr-11"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {/* Strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 flex gap-1">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className={`flex-1 h-1 rounded-full transition-colors ${i <= strength
                  ? strength <= 1 ? 'bg-red-400' : strength <= 2 ? 'bg-amber-400' : strength <= 3 ? 'bg-yellow-400' : 'bg-green-500'
                  : 'bg-gray-200'}`} />
              ))}
            </div>
          )}
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <div className="relative">
            <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              {...register('confirmPassword')}
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirm password"
              className="input-field pl-11 pr-11"
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
              {showConfirm ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2 cursor-pointer">
          <input {...register('agreeToTerms')} type="checkbox" className="w-4 h-4 rounded mt-0.5 border-gray-300 text-primary-600 flex-shrink-0" />
          <span className="text-xs text-gray-600">
            I agree to the{' '}
            <Link href="/terms" className="text-primary-600 hover:underline">Terms of Service</Link> and{' '}
            <Link href="/privacy-policy" className="text-primary-600 hover:underline">Privacy Policy</Link>
          </span>
        </label>
        {errors.agreeToTerms && <p className="text-red-500 text-xs">{errors.agreeToTerms.message}</p>}

        <button type="submit" disabled={isLoading} className="btn-primary w-full py-3.5 text-base disabled:opacity-70">
          {isLoading
            ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto" />
            : <><span>Create Account</span> <FiArrowRight /></>
          }
        </button>
      </form>
    </motion.div>
  );
}
