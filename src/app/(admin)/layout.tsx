'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiGrid, FiShoppingBag, FiPackage, FiUsers, FiTag,
  FiImage, FiMessageSquare, FiSettings, FiBarChart2,
  FiPercent, FiBell, FiLayers, FiFileText, FiLogOut,
  FiMenu, FiX, FiStar, FiChevronDown, FiAlertTriangle,
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { authService } from '@/services/authService';
import { cn, getInitials } from '@/lib/utils';
import toast from 'react-hot-toast';

const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [
      { href: '/admin', label: 'Dashboard', icon: FiGrid, exact: true },
      { href: '/admin/analytics', label: 'Analytics', icon: FiBarChart2 },
    ],
  },
  {
    label: 'Catalog',
    items: [
      { href: '/admin/products', label: 'Products', icon: FiPackage },
      { href: '/admin/categories', label: 'Categories', icon: FiLayers },
      { href: '/admin/services', label: 'Services', icon: FiTag },
    ],
  },
  {
    label: 'Orders',
    items: [
      { href: '/admin/orders', label: 'All Orders', icon: FiShoppingBag },
      { href: '/admin/coupons', label: 'Coupons', icon: FiPercent },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/blogs', label: 'Blog Posts', icon: FiFileText },
      { href: '/admin/gallery', label: 'Gallery', icon: FiImage },
      { href: '/admin/banners', label: 'Banners', icon: FiImage },
      { href: '/admin/testimonials', label: 'Testimonials', icon: FiStar },
      { href: '/admin/reviews', label: 'Reviews', icon: FiStar },
    ],
  },
  {
    label: 'Users',
    items: [
      { href: '/admin/users', label: 'Users', icon: FiUsers },
      { href: '/admin/queries', label: 'Queries', icon: FiMessageSquare },
      { href: '/admin/notifications', label: 'Notifications', icon: FiBell },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/settings', label: 'Settings', icon: FiSettings },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount (allows Zustand to rehydrate)
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Only check auth after mount
    if (isMounted && (!isAuthenticated || !['admin', 'manager'].includes(user?.role || ''))) {
      router.replace('/login?redirect=/admin');
    }
  }, [isAuthenticated, user, router, isMounted]);

  // Show loading while mounting
  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-primary flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated || !['admin', 'manager'].includes(user?.role || '')) return null;

  const handleLogout = async () => {
    try { await authService.logout(); } catch {}
    logout();
    router.push('/');
    toast.success('Logged out');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-9 h-9 bg-accent/30 rounded-xl flex items-center justify-center flex-shrink-0">
          <FaLeaf className="text-accent text-lg" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-display font-bold text-white text-sm">Jaipur Plants Hub</p>
            <p className="text-primary-300 text-[10px]">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 space-y-5 px-2 dark-scroll">
        {NAV_GROUPS.map(group => (
          <div key={group.label}>
            {!collapsed && (
              <p className="text-[10px] font-semibold text-primary-400 uppercase tracking-widest px-3 mb-1.5">{group.label}</p>
            )}
            <div className="space-y-0.5">
              {group.items.map(item => {
                const active = item.exact ? pathname === item.href : pathname.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    title={collapsed ? item.label : undefined}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
                      active
                        ? 'bg-white/15 text-white'
                        : 'text-primary-200 hover:bg-white/8 hover:text-white',
                      collapsed ? 'justify-center' : ''
                    )}
                  >
                    <item.icon className="text-base flex-shrink-0" />
                    {!collapsed && item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/10 p-3">
        <div className={cn('flex items-center gap-3', collapsed ? 'justify-center' : '')}>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {getInitials(user?.fullName || '')}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-white text-xs font-medium truncate">{user?.fullName}</p>
              <p className="text-primary-300 text-[10px] capitalize">{user?.role}</p>
            </div>
          )}
          <button onClick={handleLogout} className="text-primary-300 hover:text-white p-1 transition-colors flex-shrink-0" title="Logout">
            <FiLogOut className="text-sm" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={cn(
        'hidden lg:flex flex-col bg-dark transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-60'
      )}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute left-full top-1/2 -translate-y-1/2 w-5 h-8 bg-dark rounded-r-lg flex items-center justify-center text-primary-300 hover:text-white z-10"
        >
          <FiChevronDown className={cn('text-xs transition-transform', collapsed ? '-rotate-90' : 'rotate-90')} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[100] lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-dark z-[101] lg:hidden flex flex-col"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 lg:px-6 py-3 flex items-center gap-4 flex-shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600">
            <FiMenu />
          </button>
          <div className="flex-1" />
          {/* Front-site link */}
          <Link href="/" target="_blank" className="text-xs text-gray-400 hover:text-primary-600 transition-colors hidden sm:block">
            View Site →
          </Link>
          <div className="flex items-center gap-2 bg-primary-50 rounded-xl px-3 py-1.5">
            <span className="text-xs font-medium text-primary-700 capitalize">{user?.role}</span>
            <div className="w-6 h-6 rounded-full bg-primary-600 flex items-center justify-center text-white text-[10px] font-bold">
              {getInitials(user?.fullName || '')}
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
