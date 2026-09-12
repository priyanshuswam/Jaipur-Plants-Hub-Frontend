'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin, FiCreditCard, FiPackage, FiTruck, FiCheckCircle, FiXCircle, FiDownload } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { orderService } from '@/services/orderService';
import { formatPrice, formatDate, cn } from '@/lib/utils';
import { ORDER_STATUS_COLORS, ORDER_STATUS_LABELS } from '@/constants';
import { PageLoader } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const TIMELINE = ['pending', 'confirmed', 'processing', 'packed', 'shipped', 'out_for_delivery', 'delivered'];

export default function OrderDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [cancelReason, setCancelReason] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => orderService.getById(id).then(r => r.data),
    enabled: !!id,
    staleTime: 30 * 1000,
  });

  if (!id) return <PageLoader />;

  const order = data?.order;

  const cancelMutation = useMutation({
    mutationFn: () => orderService.cancel(id, cancelReason),
    onSuccess: () => {
      toast.success('Order cancelled successfully');
      qc.invalidateQueries({ queryKey: ['order', id] });
      setShowCancel(false);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to cancel order'),
  });

  if (isLoading) return <PageLoader />;
  if (!order) return <div className="text-center py-20"><p className="text-gray-400">Order not found</p></div>;

  const currentStep = TIMELINE.indexOf(order.status);
  const isCancelled = ['cancelled', 'refunded'].includes(order.status);
  const canCancel = ['pending', 'confirmed', 'processing'].includes(order.status);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/account/orders" className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <FiArrowLeft className="text-gray-600" />
        </Link>
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Order #{order.orderNumber}</h1>
          <p className="text-gray-400 text-sm">Placed on {formatDate(order.createdAt, { dateStyle: 'long' })}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className={cn('badge text-sm py-1 px-3', ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600')}>
            {ORDER_STATUS_LABELS[order.status] || order.status}
          </span>
        </div>
      </div>

      {/* Timeline */}
      {!isCancelled && (
        <div className="bg-white rounded-2xl shadow-soft p-6 mb-5">
          <h2 className="font-semibold text-gray-800 mb-5">Order Status</h2>
          <div className="flex items-center justify-between overflow-x-auto no-scrollbar gap-1">
            {TIMELINE.map((step, i) => {
              const done = i <= currentStep;
              const active = i === currentStep;
              return (
                <div key={step} className="flex items-center flex-shrink-0">
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      animate={{ scale: active ? 1.15 : 1 }}
                      className={cn(
                        'w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all',
                        done ? 'bg-primary-600 border-primary-600' : 'bg-white border-gray-200'
                      )}
                    >
                      {done ? <FiCheckCircle className="text-white text-sm" /> : <span className="text-xs text-gray-400">{i + 1}</span>}
                    </motion.div>
                    <span className={cn('text-[10px] text-center w-16 leading-tight', active ? 'text-primary-700 font-semibold' : done ? 'text-gray-600' : 'text-gray-400')}>
                      {ORDER_STATUS_LABELS[step]}
                    </span>
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={cn('w-8 sm:w-12 h-0.5 mx-0.5 -mt-5', done && i < currentStep ? 'bg-primary-500' : 'bg-gray-200')} />
                  )}
                </div>
              );
            })}
          </div>

          {/* Tracking info */}
          {order.shipping?.trackingNumber && (
            <div className="mt-5 bg-primary-50 rounded-xl p-4 flex items-center gap-3">
              <FiTruck className="text-primary-600 text-xl flex-shrink-0" />
              <div>
                <p className="font-semibold text-primary-800 text-sm">{order.shipping.courier}</p>
                <p className="text-primary-600 text-xs">Tracking: {order.shipping.trackingNumber}</p>
              </div>
              {order.shipping.estimatedDelivery && (
                <p className="text-xs text-gray-500 ml-auto">
                  Expected: {formatDate(order.shipping.estimatedDelivery, { dateStyle: 'medium' })}
                </p>
              )}
            </div>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-5">
        {/* Items */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2">
              <FiPackage className="text-primary-600" /> Order Items
            </h2>
            <span className="text-sm text-gray-400">{order.items?.length} item{order.items?.length !== 1 ? 's' : ''}</span>
          </div>
          <div className="divide-y divide-gray-50">
            {order.items?.map((item: any) => (
              <div key={item._id} className="flex gap-4 p-4">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {item.image && <Image src={item.image} alt={item.name} width={64} height={64} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 text-sm line-clamp-2">{item.name}</p>
                  <p className="text-xs text-gray-400 mt-0.5">SKU: {item.sku}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatPrice(item.price)} × {item.quantity}</p>
                </div>
                <p className="font-semibold text-primary-700 text-sm flex-shrink-0">{formatPrice(item.total)}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary & Actions */}
        <div className="space-y-4">
          {/* Price Summary */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h2 className="font-semibold text-gray-800 mb-4">Payment Summary</h2>
            <div className="space-y-2.5 text-sm">
              {[
                ['Subtotal', formatPrice(order.subtotal)],
                ['Shipping', order.shippingCost === 0 ? 'FREE' : formatPrice(order.shippingCost)],
                ...(order.discount > 0 ? [['Discount', `-${formatPrice(order.discount)}`]] : []),
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between text-gray-500">
                  <span>{k}</span>
                  <span className={v === 'FREE' ? 'text-green-600 font-medium' : ''}>{v}</span>
                </div>
              ))}
              <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base">
                <span>Total Paid</span>
                <span className="text-primary-700">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm">
              <FiCreditCard className="text-gray-400" />
              <span className="text-gray-600 capitalize">{order.paymentMethod}</span>
              <span className={cn('badge ml-auto text-[10px]', order.payment?.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700')}>
                {order.payment?.status}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="bg-white rounded-2xl shadow-soft p-5">
            <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
              <FiMapPin className="text-primary-600" /> Shipping To
            </h2>
            <div className="text-sm text-gray-600 space-y-0.5">
              <p className="font-semibold text-gray-800">{order.shippingAddress?.fullName}</p>
              <p>{order.shippingAddress?.addressLine1}</p>
              {order.shippingAddress?.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
              <p>{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
              <p className="text-primary-600 mt-1">{order.shippingAddress?.phone}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
            {order.invoiceUrl && (
              <a href={order.invoiceUrl} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary-600 hover:underline">
                <FiDownload /> Download Invoice
              </a>
            )}
            {canCancel && !showCancel && (
              <button onClick={() => setShowCancel(true)} className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors">
                <FiXCircle /> Cancel Order
              </button>
            )}
            {showCancel && (
              <div className="space-y-2">
                <textarea
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  placeholder="Reason for cancellation (optional)"
                  rows={3}
                  className="input-field text-sm resize-none"
                />
                <div className="flex gap-2">
                  <button onClick={() => cancelMutation.mutate()} disabled={cancelMutation.isPending}
                    className="flex-1 py-2 bg-red-500 text-white text-sm font-semibold rounded-xl hover:bg-red-600 disabled:opacity-60">
                    {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancel'}
                  </button>
                  <button onClick={() => setShowCancel(false)} className="flex-1 py-2 border border-gray-200 text-sm rounded-xl hover:bg-gray-50">
                    Keep Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
