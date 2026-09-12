'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FiSearch, FiFilter, FiChevronDown, FiEye,
  FiEdit2, FiDownload, FiRefreshCw,
} from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants';
import toast from 'react-hot-toast';

const STATUSES = ['', 'pending', 'confirmed', 'processing', 'packed', 'shipped', 'delivered', 'cancelled', 'refunded'];

export default function AdminOrdersPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState('');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-orders', status, search, page],
    queryFn: () => orderService.getAllAdmin({ status: status || undefined, search: search || undefined, page, limit: 20 }).then(r => r.data),
    staleTime: 30 * 1000,
  });

  const orders = data?.orders || [];
  const meta = data?.meta || {};

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => orderService.updateStatus(id, { status }),
    onSuccess: () => {
      toast.success('Order status updated');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
      setUpdatingId(null);
    },
    onError: () => toast.error('Failed to update status'),
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Orders</h1>
        <button onClick={() => refetch()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary-600 transition-colors">
          <FiRefreshCw className="text-sm" /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-40">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search order #, customer..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary-400">
          {STATUSES.map(s => <option key={s} value={s}>{s ? ORDER_STATUS_LABELS[s] : 'All Statuses'}</option>)}
        </select>
        <div className="ml-auto text-sm text-gray-400">{meta.total || 0} orders</div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-20" /></td>
                    ))}
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr><td colSpan={8} className="text-center py-12 text-gray-400">No orders found</td></tr>
              ) : (
                orders.map((order: any) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 font-semibold text-primary-700">#{order.orderNumber}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-800">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{order.items?.length} items</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">{formatPrice(order.totalAmount)}</td>
                    <td className="px-4 py-3">
                      <span className={cn('badge text-[10px]', order.payment?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700')}>
                        {order.payment?.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {updatingId === order._id ? (
                        <div className="flex items-center gap-1">
                          <select value={newStatus} onChange={e => setNewStatus(e.target.value)}
                            className="text-xs border border-gray-200 rounded-lg px-2 py-1">
                            {STATUSES.slice(1).map(s => <option key={s} value={s}>{ORDER_STATUS_LABELS[s]}</option>)}
                          </select>
                          <button onClick={() => updateMutation.mutate({ id: order._id, status: newStatus })}
                            disabled={updateMutation.isPending}
                            className="text-xs bg-primary-600 text-white px-2 py-1 rounded-lg hover:bg-primary-700 disabled:opacity-60">
                            {updateMutation.isPending ? '...' : 'Save'}
                          </button>
                          <button onClick={() => setUpdatingId(null)} className="text-xs text-gray-400 px-1 hover:text-gray-600">✕</button>
                        </div>
                      ) : (
                        <span className={cn('badge', ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600')}>
                          {ORDER_STATUS_LABELS[order.status] || order.status}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(order.createdAt, { dateStyle: 'short' })}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/admin/orders/${order._id}`} className="p-1.5 hover:bg-primary-50 rounded-lg text-gray-400 hover:text-primary-600 transition-colors" title="View">
                          <FiEye className="text-sm" />
                        </Link>
                        <button onClick={() => { setUpdatingId(order._id); setNewStatus(order.status); }}
                          className="p-1.5 hover:bg-amber-50 rounded-lg text-gray-400 hover:text-amber-600 transition-colors" title="Update Status">
                          <FiEdit2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">Page {page} of {meta.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
