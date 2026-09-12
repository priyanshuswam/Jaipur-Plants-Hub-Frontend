'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiPackage, FiArrowRight, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants';
import { PageLoader } from '@/components/common/LoadingSpinner';

const STATUS_TABS = [
  { value: '', label: 'All Orders' },
  { value: 'pending', label: 'Pending' },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped', label: 'Shipped' },
  { value: 'delivered', label: 'Delivered' },
  { value: 'cancelled', label: 'Cancelled' },
];

export default function OrdersPage() {
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['my-orders', status, page],
    queryFn: () => orderService.getMyOrders({ status: status || undefined, page, limit: 10 }).then(r => r.data),
    staleTime: 30 * 1000,
  });

  const orders = data?.orders || [];
  const meta = data?.meta || {};

  if (isLoading) return <PageLoader />;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Orders</h1>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="flex gap-1 overflow-x-auto no-scrollbar">
          {STATUS_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => { setStatus(tab.value); setPage(1); }}
              className={cn(
                'px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all',
                status === tab.value ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="relative ml-auto">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search order #..."
            className="pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400 w-44"
          />
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft text-center py-16">
          <FiPackage className="text-5xl text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">No orders found</p>
          <Link href="/products" className="btn-primary mt-5 inline-flex text-sm py-2.5 px-6">Shop Now</Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order: any) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft overflow-hidden"
            >
              {/* Order Header */}
              <div className="flex flex-wrap items-center gap-3 px-5 py-4 border-b border-gray-50 bg-gray-50/50">
                <div>
                  <p className="text-xs text-gray-400">Order</p>
                  <p className="font-bold text-gray-800 text-sm">#{order.orderNumber}</p>
                </div>
                <div className="hidden sm:block">
                  <p className="text-xs text-gray-400">Placed</p>
                  <p className="text-sm text-gray-700">{formatDate(order.createdAt, { dateStyle: 'medium' })}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total</p>
                  <p className="font-semibold text-primary-700 text-sm">{formatPrice(order.totalAmount)}</p>
                </div>
                <div className="ml-auto flex items-center gap-3">
                  <span className={cn('badge', ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600')}>
                    {ORDER_STATUS_LABELS[order.status] || order.status}
                  </span>
                  <Link href={`/account/orders/${order._id}`} className="text-primary-600 hover:text-primary-700">
                    <FiArrowRight />
                  </Link>
                </div>
              </div>

              {/* Items preview */}
              <div className="px-5 py-4 flex items-center gap-3">
                <div className="flex -space-x-2">
                  {(order.items || []).slice(0, 3).map((item: any, i: number) => (
                    <div key={i} className="w-12 h-12 rounded-lg border-2 border-white overflow-hidden bg-gray-100">
                      {item.image && (
                        <Image src={item.image} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                  {order.items?.length > 3 && (
                    <div className="w-12 h-12 rounded-lg border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-medium">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-sm text-gray-700 line-clamp-1">
                    {order.items?.map((i: any) => i.name).join(', ')}
                  </p>
                  <p className="text-xs text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</p>
                </div>
                <Link href={`/account/orders/${order._id}`} className="ml-auto text-sm text-primary-600 font-medium hover:underline whitespace-nowrap">
                  View Details →
                </Link>
              </div>
            </motion.div>
          ))}

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <span className="px-4 py-2 text-sm text-gray-500">{page} / {meta.totalPages}</span>
              <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="px-4 py-2 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
