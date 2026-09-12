'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign,
  FiPackage, FiAlertTriangle, FiArrowUp, FiArrowDown,
  FiArrowRight, FiActivity,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants';

// Recharts for charts
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function AdminDashboard() {
  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/dashboard/stats').then(r => r.data.stats),
    staleTime: 60 * 1000,
    refetchInterval: 5 * 60 * 1000,
  });

  const { data: revenueData } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => api.get('/dashboard/revenue').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const { data: activityData } = useQuery({
    queryKey: ['admin-activity'],
    queryFn: () => api.get('/dashboard/recent-activity').then(r => r.data),
    staleTime: 60 * 1000,
  });

  const { data: lowStockData } = useQuery({
    queryKey: ['admin-low-stock'],
    queryFn: () => api.get('/dashboard/low-stock').then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const stats = statsData || {};
  const chartData = revenueData?.chartData || [];
  const recentOrders = activityData?.recentOrders || [];
  const recentUsers = activityData?.recentUsers || [];
  const lowStock = lowStockData?.products || [];

  const STAT_CARDS = [
    {
      label: 'Total Revenue',
      value: formatPrice(stats.revenue?.total || 0),
      sub: `${formatPrice(stats.revenue?.thisMonth || 0)} this month`,
      growth: stats.revenue?.growth,
      icon: FiDollarSign,
      color: 'bg-green-50 text-green-600',
      href: '/admin/analytics',
    },
    {
      label: 'Total Orders',
      value: stats.orders?.total || 0,
      sub: `${stats.orders?.today || 0} today`,
      growth: stats.orders?.growth,
      icon: FiShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      href: '/admin/orders',
    },
    {
      label: 'Total Customers',
      value: (stats.users?.total || 0).toLocaleString(),
      sub: `${stats.users?.thisMonth || 0} this month`,
      growth: null,
      icon: FiUsers,
      color: 'bg-purple-50 text-purple-600',
      href: '/admin/users',
    },
    {
      label: 'Pending Actions',
      value: (stats.pending?.reviews || 0) + (stats.pending?.queries || 0),
      sub: `${stats.pending?.reviews || 0} reviews · ${stats.pending?.queries || 0} queries`,
      growth: null,
      icon: FiActivity,
      color: 'bg-amber-50 text-amber-600',
      href: '/admin/queries',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-400 text-sm">
            {new Date().toLocaleDateString("en-IN", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
        <Link href="/admin/orders" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiShoppingBag className="text-sm" /> View Orders
        </Link>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <Link href={card.href} className="block bg-white rounded-2xl shadow-soft p-5 hover:shadow-soft-lg transition-all group">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                  <card.icon className="text-lg" />
                </div>
                {card.growth != null && (
                  <span className={cn(
                    'flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full',
                    Number(card.growth) >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                  )}>
                    {Number(card.growth) >= 0 ? <FiArrowUp className="text-xs" /> : <FiArrowDown className="text-xs" />}
                    {Math.abs(Number(card.growth))}%
                  </span>
                )}
              </div>
              <p className="font-display text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-xs text-gray-400 mt-1">{card.sub}</p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Revenue Chart + Top Stats */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft p-5">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-gray-800">Revenue Overview</h2>
            <span className="text-xs text-gray-400">{new Date().getFullYear()}</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <Tooltip formatter={(v: number) => [formatPrice(v), 'Revenue']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} fill="url(#revGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Orders Chart */}
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <h2 className="font-semibold text-gray-800 mb-5">Monthly Orders</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="orders" fill="#4CAF50" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Orders + Low Stock */}
      <div className="grid lg:grid-cols-3 gap-5">
        {/* Recent Orders */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">Recent Orders</h2>
            <Link href="/admin/orders" className="text-sm text-primary-600 hover:underline flex items-center gap-1">
              View All <FiArrowRight className="text-xs" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {recentOrders.slice(0, 6).map((order: any) => (
              <Link key={order._id} href={`/admin/orders/${order._id}`} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm">#{order.orderNumber}</p>
                  <p className="text-xs text-gray-400">{order.user?.firstName} {order.user?.lastName} · {formatDate(order.createdAt, { dateStyle: 'short' })}</p>
                </div>
                <span className="font-semibold text-sm text-primary-700">{formatPrice(order.totalAmount)}</span>
                <span className={cn('badge text-[10px]', ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600')}>
                  {ORDER_STATUS_LABELS[order.status]}
                </span>
              </Link>
            ))}
            {recentOrders.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">No recent orders</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiAlertTriangle className="text-amber-500" /> Low Stock
            </h2>
            <Link href="/admin/products?filter=low-stock" className="text-xs text-primary-600 hover:underline">View All</Link>
          </div>
          <div className="divide-y divide-gray-50">
            {lowStock.slice(0, 6).map((product: any) => (
              <div key={product._id} className="flex items-center gap-3 px-5 py-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                  {product.thumbnail && <Image src={product.thumbnail} alt="" width={36} height={36} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 font-medium truncate">{product.name}</p>
                  <p className="text-xs text-gray-400">{product.sku}</p>
                </div>
                <span className={cn('font-bold text-sm', product.stock === 0 ? 'text-red-500' : 'text-amber-500')}>
                  {product.stock}
                </span>
              </div>
            ))}
            {lowStock.length === 0 && (
              <p className="text-gray-400 text-sm text-center py-8">All products well stocked! 🌿</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Signups */}
      {recentUsers.length > 0 && (
        <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-semibold text-gray-800">New Customers</h2>
            <Link href="/admin/users" className="text-sm text-primary-600 hover:underline">View All</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-gray-50">
            {recentUsers.slice(0, 3).map((u: any) => (
              <div key={u._id} className="flex items-center gap-3 p-4">
                <div className="w-9 h-9 rounded-full bg-primary-100 flex items-center justify-center font-semibold text-primary-700 text-sm flex-shrink-0">
                  {u.firstName?.[0]}{u.lastName?.[0]}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-gray-800 text-sm truncate">{u.firstName} {u.lastName}</p>
                  <p className="text-xs text-gray-400 truncate">{u.email}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
