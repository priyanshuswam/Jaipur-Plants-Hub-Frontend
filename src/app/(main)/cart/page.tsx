'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMinus, FiPlus, FiTrash2, FiArrowRight,
  FiShoppingBag, FiTag, FiTruck, FiShield,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { formatPrice, cn } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';
import { PageLoader } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function CartPage() {
  const { isAuthenticated } = useAuthStore();
  const {
    items, summary, couponCode, couponDiscount,
    setCart, updateQuantityOptimistic, removeItemOptimistic,
    setCoupon, clearCoupon,
  } = useCartStore();

  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);

  const { isLoading, refetch } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const { data } = await cartService.getCart();
      setCart(data.cart?.items || [], data.summary || {});
      return data;
    },
    enabled: isAuthenticated,
    staleTime: 30 * 1000,
  });

  const handleQtyChange = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    updateQuantityOptimistic(itemId, newQty);
    try {
      const { data } = await cartService.updateItem(itemId, newQty);
      setCart(data.cart?.items || [], data.summary || {});
    } catch { toast.error('Failed to update quantity'); refetch(); }
  };

  const handleRemove = async (itemId: string) => {
    removeItemOptimistic(itemId);
    try {
      const { data } = await cartService.removeItem(itemId);
      setCart(data.cart?.items || [], data.summary || {});
      toast.success('Item removed');
    } catch { toast.error('Failed to remove item'); refetch(); }
  };

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    try {
      const { data } = await cartService.validateCoupon(couponInput.trim().toUpperCase(), summary.subtotal);
      setCoupon(data.coupon.code, data.coupon.discount);
      toast.success(`Coupon "${data.coupon.code}" applied! You save ${formatPrice(data.coupon.discount)} 🎉`);
      setCouponInput('');
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Invalid coupon code');
    } finally {
      setCouponLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <FiShoppingBag className="text-5xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Please login to view your cart</h2>
          <Link href="/login?redirect=/cart" className="btn-primary mt-4 inline-flex">Login</Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <PageLoader />;

  const grandTotal = Math.max(0, summary.estimatedTotal - couponDiscount);

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-5">
          <Breadcrumb items={[{ label: 'Cart' }]} />
          <h1 className="font-display text-2xl font-bold text-gray-900 mt-2">
            Shopping Cart <span className="text-gray-400 text-lg font-normal">({summary.itemCount} items)</span>
          </h1>
        </div>
      </div>

      <div className="container-custom py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <FiShoppingBag className="text-7xl text-gray-200 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-400 mb-8">Add some beautiful plants to get started!</p>
            <Link href="/products" className="btn-primary px-8 py-3.5">Browse Plants</Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              <AnimatePresence initial={false}>
                {items.map(item => {
                  const product = item.product as any;
                  return (
                    <motion.div
                      key={item._id}
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20, height: 0 }}
                      className="bg-white rounded-2xl shadow-soft p-4 flex gap-4"
                    >
                      <Link href={`/products/${product?.slug}`} className="w-24 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                        <Image
                          src={product?.thumbnail || '/placeholder-product.jpg'}
                          alt={product?.name || ''}
                          width={96} height={96}
                          className="w-full h-full object-cover hover:scale-105 transition-transform"
                        />
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link href={`/products/${product?.slug}`} className="font-semibold text-gray-800 hover:text-primary-700 transition-colors line-clamp-2 text-sm">
                          {product?.name}
                        </Link>
                        <p className="text-xs text-gray-400 mt-0.5">{(product?.category as any)?.name}</p>

                        <div className="flex items-center justify-between mt-3">
                          {/* Qty */}
                          <div className="flex items-center bg-gray-100 rounded-xl overflow-hidden">
                            <button onClick={() => handleQtyChange(item._id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors">
                              <FiMinus className="text-xs text-gray-600" />
                            </button>
                            <span className="w-8 text-center text-sm font-semibold text-gray-800">{item.quantity}</span>
                            <button
                              onClick={() => handleQtyChange(item._id, item.quantity + 1)}
                              disabled={item.quantity >= (product?.stock || 99)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-gray-200 transition-colors disabled:opacity-40"
                            >
                              <FiPlus className="text-xs text-gray-600" />
                            </button>
                          </div>

                          {/* Price */}
                          <div className="text-right">
                            <p className="font-bold text-primary-700">{formatPrice(item.price * item.quantity)}</p>
                            <p className="text-xs text-gray-400">{formatPrice(item.price)} each</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleRemove(item._id)}
                        className="flex-shrink-0 w-8 h-8 rounded-full text-gray-400 hover:bg-red-50 hover:text-red-500 flex items-center justify-center transition-all"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {/* Continue Shopping */}
              <Link href="/products" className="inline-flex items-center gap-2 text-primary-600 text-sm font-medium hover:underline mt-2">
                ← Continue Shopping
              </Link>
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="bg-white rounded-2xl shadow-soft p-5">
                <p className="font-semibold text-gray-800 flex items-center gap-2 mb-3">
                  <FiTag className="text-primary-600" /> Apply Coupon
                </p>
                {couponCode ? (
                  <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-xl px-3 py-2.5">
                    <div>
                      <p className="font-semibold text-green-700 text-sm">{couponCode}</p>
                      <p className="text-green-600 text-xs">You save {formatPrice(couponDiscount)}</p>
                    </div>
                    <button onClick={clearCoupon} className="text-red-400 hover:text-red-600 text-xs font-medium">Remove</button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={e => setCouponInput(e.target.value.toUpperCase())}
                      onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                      placeholder="Enter coupon code"
                      className="input-field flex-1 py-2.5 text-sm uppercase"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      disabled={couponLoading || !couponInput}
                      className="btn-primary py-2.5 px-4 text-sm disabled:opacity-60"
                    >
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-2xl shadow-soft p-5 space-y-3">
                <p className="font-semibold text-gray-800 mb-4">Order Summary</p>

                <div className="space-y-2.5 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal ({summary.itemCount} items)</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span className="flex items-center gap-1.5">
                      <FiTruck className="text-xs" /> Shipping
                    </span>
                    <span className={summary.shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                      {summary.shippingCost === 0 ? 'FREE' : formatPrice(summary.shippingCost)}
                    </span>
                  </div>
                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Coupon ({couponCode})</span>
                      <span>-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}
                  {summary.savings > 0 && (
                    <div className="flex justify-between text-primary-600 text-xs">
                      <span>Product Savings</span>
                      <span>-{formatPrice(summary.savings)}</span>
                    </div>
                  )}
                  <div className="border-t border-gray-100 pt-2.5 flex justify-between font-bold text-base text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-700">{formatPrice(grandTotal)}</span>
                  </div>
                </div>

                {summary.remainingForFreeShipping > 0 && (
                  <div className="bg-primary-50 rounded-xl p-3 text-xs text-primary-700">
                    Add {formatPrice(summary.remainingForFreeShipping)} more for <strong>FREE shipping!</strong>
                  </div>
                )}

                <Link
                  href="/checkout"
                  className="btn-primary w-full py-4 text-center flex items-center justify-center gap-2 mt-2"
                >
                  Proceed to Checkout <FiArrowRight />
                </Link>

                {/* Trust */}
                <div className="flex items-center justify-center gap-2 text-xs text-gray-400 mt-2">
                  <FiShield className="text-green-500" /> Secure & Encrypted Checkout
                </div>
              </div>

              {/* Accepted payments */}
              <div className="bg-white rounded-2xl shadow-soft p-4">
                <p className="text-xs text-gray-400 text-center mb-3">We Accept</p>
                <div className="flex justify-center gap-3 flex-wrap">
                  {['💳 Cards', '🏦 Net Banking', '📱 UPI', '💰 COD'].map(m => (
                    <span key={m} className="text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-full">{m}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
