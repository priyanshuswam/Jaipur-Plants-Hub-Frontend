'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  FiUser, FiShoppingBag, FiHeart, FiMapPin,
  FiBell, FiLock, FiLogOut, FiGrid, FiStar,
} from 'react-icons/fi';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV = [
  { href: '/account', label: 'Dashboard', icon: FiGrid, exact: true },
  { href: '/account/profile', label: 'Profile', icon: FiUser },
  { href: '/account/orders', label: 'My Orders', icon: FiShoppingBag },
  { href: '/account/wishlist', label: 'Wishlist', icon: FiHeart },
  { href: '/account/addresses', label: 'Addresses', icon: FiMapPin },
  { href: '/account/notifications', label: 'Notifications', icon: FiBell },
  { href: '/account/reviews', label: 'My Reviews', icon: FiStar },
  { href: '/account/security', label: 'Password & Security', icon: FiLock },
];

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login?redirect=/account');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch {}
    logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="container-custom py-8">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden sticky top-24">
              {/* User card */}
              <div className="bg-gradient-primary p-6 text-center">
                <div className="w-16 h-16 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center mx-auto mb-3 overflow-hidden relative">
                  {user?.avatar?.url ? (
                    <Image src={user.avatar.url} alt={user.firstName || 'User'} fill className="object-cover" sizes="64px" />
                  ) : (
                    <span className="font-bold text-white text-xl">{getInitials(user?.fullName || '')}</span>
                  )}
                </div>
                <p className="text-white font-semibold">{user?.fullName}</p>
                <p className="text-primary-200 text-xs mt-0.5">{user?.email}</p>
                <div className="mt-3 bg-white/15 rounded-lg px-3 py-1.5 inline-block">
                  <span className="text-white text-xs">🌿 {user?.loyaltyPoints || 0} loyalty points</span>
                </div>
              </div>

              {/* Nav */}
              <nav className="py-2">
                {NAV.map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-3 px-5 py-3 text-sm font-medium transition-all',
                        active
                          ? 'text-primary-700 bg-primary-50 border-r-2 border-primary-600'
                          : 'text-gray-600 hover:text-primary-700 hover:bg-gray-50'
                      )}
                    >
                      <Icon className={cn('text-base', active ? 'text-primary-600' : 'text-gray-400')} />
                      {label}
                    </Link>
                  );
                })}

                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-500 hover:bg-red-50 w-full transition-colors mt-1"
                >
                  <FiLogOut className="text-base" /> Logout
                </button>
              </nav>
            </div>
          </aside>

          {/* Main */}
          <main className="flex-1 min-w-0">
            {/* Mobile nav */}
            <div className="lg:hidden overflow-x-auto no-scrollbar mb-5">
              <div className="flex gap-2 min-w-max pb-2">
                {NAV.slice(0, 6).map(({ href, label, icon: Icon, exact }) => {
                  const active = exact ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      className={cn(
                        'flex items-center gap-1.5 px-3 py-2 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                        active ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
                      )}
                    >
                      <Icon className="text-sm" /> {label}
                    </Link>
                  );
                })}
              </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              {children}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
