'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiShoppingBag, FiHeart, FiStar, FiTruck, FiGift, FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants';

export default function AccountDashboard() {
  const { user } = useAuthStore();

  const { data } = useQuery({
    queryKey: ['account-dashboard'],
    queryFn: () => api.get('/users/me/dashboard').then(r => r.data),
    staleTime: 60 * 1000,
  });

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];

  const STATS_CARDS = [
    { label: 'Total Orders', value: stats.totalOrders || 0, icon: FiShoppingBag, href: '/account/orders', color: 'bg-blue-50 text-blue-600' },
    { label: 'Active Orders', value: stats.activeOrders || 0, icon: FiTruck, href: '/account/orders?status=active', color: 'bg-amber-50 text-amber-600' },
    { label: 'Wishlist Items', value: stats.wishlistCount || 0, icon: FiHeart, href: '/wishlist', color: 'bg-red-50 text-red-500' },
    { label: 'Loyalty Points', value: stats.loyaltyPoints || 0, icon: FiGift, href: '/account/profile', color: 'bg-purple-50 text-purple-600' },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-primary rounded-2xl p-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-white mb-1">
            Hello, {user?.firstName}! 👋
          </h1>
          <p className="text-primary-200 text-sm">
            Welcome back to your Jaipur Plants Hub dashboard
          </p>
          {stats.totalSpent > 0 && (
            <p className="text-primary-300 text-xs mt-1">
              Total spent: <span className="text-white font-semibold">{formatPrice(stats.totalSpent)}</span>
            </p>
          )}
        </div>
        <div className="hidden sm:flex flex-col items-end gap-1">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
            🌿 {stats.loyaltyPoints || 0} points
          </span>
          {!user?.isEmailVerified && (
            <Link href="/account/profile" className="text-amber-300 text-xs hover:underline">
              ⚠️ Verify email
            </Link>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link href={card.href} className="block bg-white rounded-2xl shadow-soft p-5 hover:shadow-soft-lg transition-all group">
              <div className={`w-11 h-11 ${card.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <card.icon className="text-lg" />
              </div>
              <p className="font-display text-2xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mt-0.5">{card.label}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <h2 className="font-semibold text-gray-800 flex items-center gap-2">
            <FiShoppingBag className="text-primary-600" /> Recent Orders
          </h2>
          <Link href="/account/orders" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
            View All <FiArrowRight className="text-xs" />
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="text-center py-10">
            <FiShoppingBag className="text-4xl text-gray-200 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No orders yet</p>
            <Link href="/products" className="btn-primary mt-4 inline-flex text-sm py-2 px-5">Start Shopping</Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentOrders.map((order: any) => (
              <Link key={order._id} href={`/account/orders/${order._id}`} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{formatDate(order.createdAt, { dateStyle: 'medium' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary-700 text-sm">{formatPrice(order.totalAmount)}</p>
                  <span className={cn('badge text-[10px] mt-0.5', ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600')}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                </div>
                <FiArrowRight className="text-gray-300 flex-shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Edit Profile', desc: 'Update your personal info', href: '/account/profile', icon: '👤' },
          { label: 'Manage Addresses', desc: 'Add or edit delivery addresses', href: '/account/addresses', icon: '📍' },
          { label: 'Book Consultation', desc: 'Free garden design session', href: '/query?type=consultation', icon: '🌿' },
        ].map(a => (
          <Link key={a.label} href={a.href} className="bg-white rounded-xl shadow-soft p-4 hover:shadow-soft-lg transition-all flex items-start gap-3 group">
            <span className="text-2xl">{a.icon}</span>
            <div>
              <p className="font-semibold text-gray-800 text-sm group-hover:text-primary-700 transition-colors">{a.label}</p>
              <p className="text-xs text-gray-400">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
