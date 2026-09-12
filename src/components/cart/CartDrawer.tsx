'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag, FiArrowRight } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { useCartStore, useCartOpen } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { cartService } from '@/services/cartService';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function CartDrawer() {
  const isOpen = useCartOpen();
  const { items, summary, closeCart, updateQuantityOptimistic, removeItemOptimistic, setCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleQuantityChange = async (itemId: string, newQty: number) => {
    if (newQty < 1) return;
    updateQuantityOptimistic(itemId, newQty);
    try {
      const { data } = await cartService.updateItem(itemId, newQty);
      setCart(data.cart?.items || [], data.summary || {});
    } catch {
      toast.error('Failed to update quantity');
    }
  };

  const handleRemove = async (itemId: string) => {
    removeItemOptimistic(itemId);
    try {
      const { data } = await cartService.removeItem(itemId);
      setCart(data.cart?.items || [], data.summary || {});
    } catch {
      toast.error('Failed to remove item');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]"
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[151] flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiShoppingBag className="text-primary-700 text-xl" />
                <h2 className="font-display font-semibold text-lg text-gray-900">
                  Your Cart
                  {summary.itemCount > 0 && (
                    <span className="ml-2 text-sm font-normal text-gray-400">({summary.itemCount} items)</span>
                  )}
                </h2>
              </div>
              <button onClick={closeCart} className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                <FiX className="text-gray-500 text-xl" />
              </button>
            </div>

            {/* Free shipping bar */}
            {summary.remainingForFreeShipping > 0 && (
              <div className="px-5 py-3 bg-primary-50 border-b border-primary-100">
                <div className="flex justify-between text-xs text-primary-700 mb-1.5">
                  <span>Add {formatPrice(summary.remainingForFreeShipping)} more for FREE shipping!</span>
                  <span>{Math.round((1 - summary.remainingForFreeShipping / summary.freeShippingThreshold) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-primary-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary-600 to-accent rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (1 - summary.remainingForFreeShipping / summary.freeShippingThreshold) * 100)}%` }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            )}
            {summary.remainingForFreeShipping === 0 && (
              <div className="px-5 py-2.5 bg-green-50 border-b border-green-100 flex items-center gap-2">
                <FaLeaf className="text-green-600 text-sm" />
                <span className="text-xs text-green-700 font-medium">🎉 You&apos;ve unlocked FREE shipping!</span>
              </div>
            )}

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                  <div className="w-20 h-20 bg-primary-50 rounded-full flex items-center justify-center">
                    <FiShoppingBag className="text-primary-400 text-3xl" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700 mb-1">Your cart is empty</p>
                    <p className="text-sm text-gray-400">Add some beautiful plants to get started!</p>
                  </div>
                  <button onClick={closeCart}>
                    <Link href="/products" className="btn-primary py-2.5 px-6 text-sm">
                      Browse Plants
                    </Link>
                  </button>
                </div>
              ) : (
                <div className="divide-y divide-gray-50">
                  <AnimatePresence initial={false}>
                    {items.map((item) => {
                      const product = item.product as any;
                      return (
                        <motion.div
                          key={item._id}
                          layout
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20, height: 0 }}
                          className="flex gap-4 p-4"
                        >
                          {/* Image */}
                          <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                            <Image
                              src={product?.thumbnail || '/placeholder-product.jpg'}
                              alt={product?.name || ''}
                              width={80} height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/products/${product?.slug}`}
                              onClick={closeCart}
                              className="text-sm font-medium text-gray-800 hover:text-primary-700 line-clamp-2 transition-colors"
                            >
                              {product?.name}
                            </Link>
                            <p className="text-primary-700 font-semibold text-sm mt-0.5">{formatPrice(item.price)}</p>

                            {/* Qty + Remove */}
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2 bg-gray-50 rounded-full px-2 py-1">
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                                  disabled={item.quantity <= 1}
                                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 disabled:opacity-40 transition-colors"
                                >
                                  <FiMinus className="text-xs" />
                                </button>
                                <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                                <button
                                  onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                                  className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
                                >
                                  <FiPlus className="text-xs" />
                                </button>
                              </div>
                              <button
                                onClick={() => handleRemove(item._id)}
                                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                              >
                                <FiTrash2 className="text-sm" />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-gray-100 p-5 space-y-3 bg-white">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>{formatPrice(summary.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-500">
                    <span>Shipping</span>
                    <span className={summary.shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                      {summary.shippingCost === 0 ? 'FREE' : formatPrice(summary.shippingCost)}
                    </span>
                  </div>
                  {summary.savings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>You Save</span>
                      <span>-{formatPrice(summary.savings)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100 text-gray-900">
                    <span>Total</span>
                    <span className="text-primary-700">{formatPrice(summary.estimatedTotal)}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={closeCart}
                    className="btn-secondary text-sm py-3 text-center"
                  >
                    View Cart
                  </Link>
                  <Link
                    href={isAuthenticated ? '/checkout' : '/login?redirect=/checkout'}
                    onClick={closeCart}
                    className="btn-primary text-sm py-3 text-center flex items-center justify-center gap-2"
                  >
                    Checkout <FiArrowRight />
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
