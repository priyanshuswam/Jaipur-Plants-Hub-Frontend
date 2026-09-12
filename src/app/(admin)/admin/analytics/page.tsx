'use client';

import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatPrice } from '@/lib/utils';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

const COLORS = ['#2E7D32', '#4CAF50', '#8BC34A', '#AED581', '#C8E6C9'];

export default function AdminAnalyticsPage() {
  const [year, setYear] = useState(new Date().getFullYear());

  const { data, isLoading } = useQuery({
    queryKey: ['analytics', year],
    queryFn: () => api.get(`/dashboard/revenue?year=${year}`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const chartData = data?.chartData || [];
  const revenueByPayment = data?.revenueByPayment || [];
  const revenueByCategory = data?.revenueByCategory || [];

  const totalRevenue = chartData.reduce((s: number, m: any) => s + m.revenue, 0);
  const totalOrders = chartData.reduce((s: number, m: any) => s + m.orders, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
  const bestMonth = chartData.reduce((best: any, m: any) => (!best || m.revenue > best.revenue ? m : best), null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Analytics</h1>
        <select value={year} onChange={e => setYear(Number(e.target.value))}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary-400">
          {[2024, 2025, 2026].map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Annual Revenue', value: formatPrice(totalRevenue), sub: `${year}` },
          { label: 'Total Orders', value: totalOrders.toLocaleString(), sub: `${year}` },
          { label: 'Avg Order Value', value: formatPrice(avgOrderValue), sub: 'per order' },
          { label: 'Best Month', value: bestMonth?.month || '-', sub: bestMonth ? formatPrice(bestMonth.revenue) : '' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-white rounded-2xl shadow-soft p-5">
            <p className="text-xs text-gray-400 mb-1">{kpi.label}</p>
            <p className="font-display text-2xl font-bold text-gray-900">{kpi.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{kpi.sub}</p>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl shadow-soft p-5 mb-5">
        <h2 className="font-semibold text-gray-800 mb-5">Monthly Revenue & Orders — {year}</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={chartData} margin={{ top: 5, right: 10, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2E7D32" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#2E7D32" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="ordGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#4CAF50" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <YAxis yAxisId="revenue" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
            <YAxis yAxisId="orders" orientation="right" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
            <Tooltip formatter={(v: number, name: string) => [name === 'revenue' ? formatPrice(v) : v, name === 'revenue' ? 'Revenue' : 'Orders']}
              contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Area yAxisId="revenue" type="monotone" dataKey="revenue" stroke="#2E7D32" strokeWidth={2.5} fill="url(#revGrad)" name="revenue" />
            <Area yAxisId="orders" type="monotone" dataKey="orders" stroke="#4CAF50" strokeWidth={2} fill="url(#ordGrad)" name="orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Revenue by Payment Method */}
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <h2 className="font-semibold text-gray-800 mb-5">Revenue by Payment Method</h2>
          {revenueByPayment.length > 0 ? (
            <div className="flex items-center gap-8">
              <ResponsiveContainer width="50%" height={180}>
                <PieChart>
                  <Pie data={revenueByPayment} dataKey="revenue" nameKey="_id" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3}>
                    {revenueByPayment.map((_: any, i: number) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(v: number) => formatPrice(v)} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {revenueByPayment.map((item: any, i: number) => (
                  <div key={item._id} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-sm text-gray-600 capitalize">{item._id}</span>
                    </div>
                    <span className="font-semibold text-sm text-gray-800">{formatPrice(item.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No data available</p>
          )}
        </div>

        {/* Revenue by Category */}
        <div className="bg-white rounded-2xl shadow-soft p-5">
          <h2 className="font-semibold text-gray-800 mb-5">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={revenueByCategory.slice(0, 6)} margin={{ top: 5, right: 5, bottom: 5, left: 0 }} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
              <YAxis type="category" dataKey="_id" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80} />
              <Tooltip formatter={(v: number) => formatPrice(v)} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }} />
              <Bar dataKey="revenue" fill="#4CAF50" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
