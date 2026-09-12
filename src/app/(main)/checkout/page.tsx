'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  FiTruck, FiCreditCard, FiCheckCircle, FiAlertCircle,
  FiChevronDown, FiLock,
} from 'react-icons/fi';
import { FaMoneyBillWave } from 'react-icons/fa';
import { useCartStore } from '@/store/cartStore';
import { useAuthStore } from '@/store/authStore';
import { orderService } from '@/services/orderService';
import { formatPrice } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';
import { INDIAN_STATES } from '@/constants';
import toast from 'react-hot-toast';
import Image from 'next/image';

const addressSchema = z.object({
  fullName: z.string().min(2, 'Full name required'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Valid 10-digit phone required'),
  email: z.string().email('Valid email required').optional().or(z.literal('')),
  addressLine1: z.string().min(5, 'Address required'),
  addressLine2: z.string().optional(),
  city: z.string().min(2, 'City required'),
  state: z.string().min(2, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, '6-digit pincode required'),
  country: z.string().default('India'),
});

const checkoutSchema = z.object({
  shippingAddress: addressSchema,
  sameAsBilling: z.boolean(),
  paymentMethod: z.enum(['razorpay', 'cod']),
  customerNote: z.string().optional(),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

const STEPS = ['Cart Review', 'Shipping', 'Payment', 'Confirmation'];

export default function CheckoutPage() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const { items, summary, couponCode, couponDiscount, reset: resetCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<any>(null);

  const {
    register, handleSubmit, watch, setValue,
    formState: { errors },
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      sameAsBilling: true,
      paymentMethod: 'razorpay',
      shippingAddress: {
        fullName: user?.fullName || '',
        phone: user?.phone || '',
        country: 'India',
      },
    },
  });

  const paymentMethod = watch('paymentMethod');
  const grandTotal = Math.max(0, summary.estimatedTotal - couponDiscount);

  useEffect(() => {
    if (!isAuthenticated) router.push('/login?redirect=/checkout');
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  if (items.length === 0 && !placedOrder) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <p className="text-6xl mb-4">🛒</p>
          <h2 className="text-xl font-bold text-gray-700 mb-4">Your cart is empty</h2>
          <button onClick={() => router.push('/products')} className="btn-primary">Shop Now</button>
        </div>
      </div>
    );
  }

  const loadRazorpay = (): Promise<boolean> =>
    new Promise(resolve => {
      if (typeof window !== 'undefined' && (window as any).Razorpay) { resolve(true); return; }
      const s = document.createElement('script');
      s.src = 'https://checkout.razorpay.com/v1/checkout.js';
      s.onload = () => resolve(true);
      s.onerror = () => resolve(false);
      document.body.appendChild(s);
    });

  const onSubmit = async (formData: CheckoutFormData) => {
    setIsSubmitting(true);
    try {
      // 1. Create order
      const orderPayload = {
        items: items.map(i => ({
          product: (i.product as any)._id,
          quantity: i.quantity,
          variant: i.variant || undefined,
        })),
        shippingAddress: formData.shippingAddress,
        paymentMethod: formData.paymentMethod,
        couponCode: couponCode || undefined,
        customerNote: formData.customerNote,
        sameAsBilling: formData.sameAsBilling,
      };

      const { data: orderData } = await orderService.create(orderPayload);
      const order = orderData.order;

      if (formData.paymentMethod === 'cod') {
        // COD — done!
        setPlacedOrder(order);
        resetCart();
        setCurrentStep(3);
        return;
      }

      // 2. Razorpay online payment
      const loaded = await loadRazorpay();
      if (!loaded) { toast.error('Failed to load payment gateway. Please try again.'); return; }

      const { data: rpData } = await orderService.createPaymentOrder(order._id, grandTotal);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: rpData.amount,
        currency: rpData.currency,
        name: 'Jaipur Plants Hub',
        description: `Order #${order.orderNumber}`,
        image: '/images/logo.png',
        order_id: rpData.orderId,
        prefill: {
          name: user?.fullName,
          email: user?.email,
          contact: user?.phone,
        },
        theme: { color: '#2E7D32' },
        handler: async (response: any) => {
          try {
            await orderService.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              orderId: order._id,
            });
            setPlacedOrder(order);
            resetCart();
            setCurrentStep(3);
            toast.success('Payment successful! 🎉');
          } catch {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        modal: { ondismiss: () => toast.error('Payment cancelled.') },
      };

      const rz = new (window as any).Razorpay(options);
      rz.open();
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // ── Step 3: Order Confirmed ──────────────────────
  if (currentStep === 3 && placedOrder) {
    return (
      <div className="min-h-screen bg-surface pt-20 flex items-center justify-center py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-lg w-full mx-4 text-center"
        >
          <div className="bg-white rounded-3xl shadow-soft-xl p-10">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <FiCheckCircle className="text-green-500 text-4xl" />
            </motion.div>

            <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Order Placed! 🌿</h1>
            <p className="text-gray-500 mb-6">
              Thank you for your order. We&apos;ve sent a confirmation to {user?.email}.
            </p>

            <div className="bg-primary-50 rounded-2xl p-4 mb-6 text-left space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Order Number</span>
                <span className="font-bold text-primary-700">#{placedOrder.orderNumber}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total Amount</span>
                <span className="font-bold">{formatPrice(placedOrder.totalAmount)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Payment</span>
                <span className="font-medium capitalize">{placedOrder.paymentMethod}</span>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => router.push(`/account/orders/${placedOrder._id}`)} className="btn-primary flex-1 py-3">
                Track Order
              </button>
              <button onClick={() => router.push('/products')} className="btn-secondary flex-1 py-3">
                Continue Shopping
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ── Checkout Form ────────────────────────────────
  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-5">
          <Breadcrumb items={[{ label: 'Cart', href: '/cart' }, { label: 'Checkout' }]} />
          {/* Progress Steps */}
          <div className="flex items-center gap-2 mt-4 overflow-x-auto no-scrollbar">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-2 flex-shrink-0">
                <div className={`flex items-center gap-2 text-sm font-medium ${i <= currentStep ? 'text-primary-700' : 'text-gray-400'}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${i < currentStep ? 'bg-primary-600 text-white' : i === currentStep ? 'bg-primary-100 text-primary-700 border-2 border-primary-600' : 'bg-gray-100 text-gray-400'}`}>
                    {i < currentStep ? '✓' : i + 1}
                  </div>
                  <span className="hidden sm:inline">{step}</span>
                </div>
                {i < STEPS.length - 1 && <div className={`w-8 h-0.5 ${i < currentStep ? 'bg-primary-400' : 'bg-gray-200'}`} />}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
                  <FiTruck className="text-primary-600" /> Shipping Address
                </h2>

                {/* Use saved address */}
                {user?.addresses && user.addresses.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-2">Select a saved address:</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {user.addresses.map(addr => (
                        <button
                          key={addr._id}
                          type="button"
                          onClick={() => {
                            setValue('shippingAddress.fullName', addr.fullName);
                            setValue('shippingAddress.phone', addr.phone);
                            setValue('shippingAddress.addressLine1', addr.addressLine1);
                            setValue('shippingAddress.addressLine2', addr.addressLine2 || '');
                            setValue('shippingAddress.city', addr.city);
                            setValue('shippingAddress.state', addr.state);
                            setValue('shippingAddress.pincode', addr.pincode);
                          }}
                          className="text-left p-3 rounded-xl border-2 border-gray-200 hover:border-primary-400 text-xs transition-colors"
                        >
                          <p className="font-semibold text-gray-700">{addr.label}</p>
                          <p className="text-gray-500 mt-0.5 line-clamp-2">
                            {addr.addressLine1}, {addr.city} - {addr.pincode}
                          </p>
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">Or fill in a new address below:</p>
                  </div>
                )}

                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { name: 'shippingAddress.fullName', label: 'Full Name *', placeholder: 'John Doe', sm: 1 },
                    { name: 'shippingAddress.phone', label: 'Phone *', placeholder: '9876543210', sm: 1 },
                    { name: 'shippingAddress.addressLine1', label: 'Address Line 1 *', placeholder: 'House/Flat, Street', sm: 2 },
                    { name: 'shippingAddress.addressLine2', label: 'Address Line 2', placeholder: 'Landmark, Area (optional)', sm: 2 },
                    { name: 'shippingAddress.city', label: 'City *', placeholder: 'Mumbai', sm: 1 },
                    { name: 'shippingAddress.pincode', label: 'PIN Code *', placeholder: '400001', sm: 1 },
                  ].map(f => (
                    <div key={f.name} className={f.sm === 2 ? 'sm:col-span-2' : ''}>
                      <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                      <input
                        {...register(f.name as any)}
                        placeholder={f.placeholder}
                        className="input-field text-sm"
                      />
                      {(errors as any)?.[f.name.split('.')[0]]?.[f.name.split('.')[1]]?.message && (
                        <p className="text-red-500 text-xs mt-1">
                          {(errors as any)?.[f.name.split('.')[0]]?.[f.name.split('.')[1]]?.message}
                        </p>
                      )}
                    </div>
                  ))}

                  {/* State */}
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">State *</label>
                    <select {...register('shippingAddress.state')} className="input-field text-sm">
                      <option value="">Select State</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.shippingAddress?.state && (
                      <p className="text-red-500 text-xs mt-1">{errors.shippingAddress.state.message}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Order Note (optional)</label>
                  <textarea
                    {...register('customerNote')}
                    placeholder="Special delivery instructions, gift message..."
                    rows={2}
                    className="input-field text-sm resize-none"
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-semibold text-gray-800 flex items-center gap-2 mb-5">
                  <FiCreditCard className="text-primary-600" /> Payment Method
                </h2>

                <div className="space-y-3">
                  {[
                    {
                      id: 'razorpay',
                      title: 'Online Payment',
                      desc: 'Cards, UPI, Net Banking, Wallets — All secured by Razorpay',
                      icon: <FiCreditCard className="text-blue-600 text-xl" />,
                      badge: 'Recommended',
                    },
                    {
                      id: 'cod',
                      title: 'Cash on Delivery',
                      desc: 'Pay when your order arrives. ₹49 COD charges apply.',
                      icon: <FaMoneyBillWave className="text-green-600 text-xl" />,
                      badge: null,
                    },
                  ].map(pm => (
                    <label key={pm.id} className={`flex gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === pm.id ? 'border-primary-600 bg-primary-50' : 'border-gray-200 hover:border-gray-300'}`}>
                      <input type="radio" value={pm.id} {...register('paymentMethod')} className="hidden" />
                      <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-soft flex-shrink-0">
                        {pm.icon}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-gray-800 text-sm">{pm.title}</p>
                          {pm.badge && <span className="badge bg-primary-100 text-primary-700 text-[10px]">{pm.badge}</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5">{pm.desc}</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${paymentMethod === pm.id ? 'border-primary-600' : 'border-gray-300'}`}>
                        {paymentMethod === pm.id && <div className="w-3 h-3 rounded-full bg-primary-600" />}
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Summary */}
            <div>
              <div className="sticky top-24 space-y-4">
                <div className="bg-white rounded-2xl shadow-soft p-5">
                  <p className="font-semibold text-gray-800 mb-4">Order Summary ({items.length} items)</p>

                  {/* Items */}
                  <div className="space-y-3 mb-4 max-h-48 overflow-y-auto no-scrollbar">
                    {items.map(item => {
                      const product = item.product as any;
                      return (
                        <div key={item._id} className="flex gap-3">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            <Image src={product?.thumbnail || ''} alt={product?.name} fill className="object-cover" sizes="48px" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center">
                              {item.quantity}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 line-clamp-1">{product?.name}</p>
                            <p className="text-xs text-primary-700 font-semibold">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 text-sm border-t border-gray-100 pt-3">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span><span>{formatPrice(summary.subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Shipping</span>
                      <span className={summary.shippingCost === 0 ? 'text-green-600' : ''}>
                        {summary.shippingCost === 0 ? 'FREE' : formatPrice(summary.shippingCost)}
                      </span>
                    </div>
                    {paymentMethod === 'cod' && (
                      <div className="flex justify-between text-gray-500">
                        <span>COD Charges</span><span>{formatPrice(49)}</span>
                      </div>
                    )}
                    {couponDiscount > 0 && (
                      <div className="flex justify-between text-green-600">
                        <span>Coupon ({couponCode})</span><span>-{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-100">
                      <span>Total</span>
                      <span className="text-primary-700">
                        {formatPrice(grandTotal + (paymentMethod === 'cod' ? 49 : 0))}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-primary w-full py-4 mt-4 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <FiLock className="text-sm" />
                    )}
                    {isSubmitting ? 'Processing...' : paymentMethod === 'cod' ? 'Place Order (COD)' : 'Pay & Place Order'}
                  </button>

                  <p className="text-xs text-gray-400 text-center mt-3 flex items-center justify-center gap-1">
                    <FiLock className="text-green-500" /> 256-bit SSL secured checkout
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
