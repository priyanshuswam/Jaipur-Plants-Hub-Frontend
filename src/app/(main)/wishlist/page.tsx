'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiTrash2, FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useCartStore } from '@/store/cartStore';
import { cartService } from '@/services/cartService';
import { formatPrice, discountPercent } from '@/lib/utils';
import Image from 'next/image';
import Breadcrumb from '@/components/common/Breadcrumb';
import StarRating from '@/components/common/StarRating';
import toast from 'react-hot-toast';
import { PageLoader } from '@/components/common/LoadingSpinner';

export default function WishlistPage() {
  const { isAuthenticated } = useAuthStore();
  const { setWishlist, toggleOptimistic } = useWishlistStore();
  const { addItemOptimistic, setCart, openCart } = useCartStore();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then(r => r.data),
    enabled: isAuthenticated,
  });

  // Sync wishlist store when data loads
  useEffect(() => {
    if (data?.wishlist?.items) {
      setWishlist(data.wishlist.items);
    }
  }, [data, setWishlist]);

  const items = data?.wishlist?.items || [];

  const handleRemove = async (productId: string) => {
    toggleOptimistic(productId);
    try {
      await api.delete(`/wishlist/${productId}`);
      refetch();
      toast.success('Removed from wishlist');
    } catch {
      toggleOptimistic(productId);
      toast.error('Failed to remove item');
    }
  };

  const handleMoveToCart = async (item: any) => {
    const product = item.product;
    if (product.stock === 0 && !product.allowBackorder) {
      toast.error('Product is out of stock');
      return;
    }
    addItemOptimistic(product, 1);
    try {
      const { data } = await cartService.addItem(product._id, 1);
      setCart(data.cart?.items || [], data.summary || {});
      await handleRemove(product._id);
      openCart();
      toast.success('Moved to cart! 🌿');
    } catch {
      toast.error('Failed to add to cart');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="text-center">
          <FiHeart className="text-5xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-700 mb-2">Please login to view your wishlist</h2>
          <Link href="/login?redirect=/wishlist" className="btn-primary mt-4 inline-flex">Login</Link>
        </div>
      </div>
    );
  }

  if (isLoading) return <PageLoader />;

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-5">
          <Breadcrumb items={[{ label: 'Wishlist' }]} />
          <div className="flex items-center justify-between mt-2">
            <h1 className="font-display text-2xl font-bold text-gray-900 flex items-center gap-2">
              <FiHeart className="text-red-500" /> My Wishlist
              <span className="text-gray-400 text-lg font-normal">({items.length} items)</span>
            </h1>
            {items.length > 0 && (
              <button
                onClick={async () => {
                  await api.delete('/wishlist');
                  refetch();
                  toast.success('Wishlist cleared');
                }}
                className="text-sm text-gray-400 hover:text-red-500 transition-colors"
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {items.length === 0 ? (
          <div className="text-center py-20">
            <FiHeart className="text-7xl text-gray-200 mx-auto mb-5" />
            <h2 className="text-2xl font-bold text-gray-700 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8">Save plants you love to buy them later</p>
            <Link href="/products" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2">
              Discover Plants <FiArrowRight />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence initial={false}>
              {items.map((item: any) => {
                const product = item.product;
                if (!product) return null;
                const discount = discountPercent(product.price, product.compareAtPrice || 0);
                const isOOS = product.stock === 0 && !product.allowBackorder;

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-white rounded-2xl shadow-soft overflow-hidden group"
                  >
                    <div className="relative aspect-square">
                      <Link href={`/products/${product.slug}`}>
                        <Image
                          src={product.thumbnail}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 640px) 50vw, 25vw"
                        />
                      </Link>
                      {discount > 0 && (
                        <span className="absolute top-2 left-2 badge bg-red-500 text-white text-[10px]">-{discount}%</span>
                      )}
                      {isOOS && (
                        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                          <span className="badge bg-gray-700 text-white">Out of Stock</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleRemove(product._id)}
                        className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 className="text-sm" />
                      </button>
                    </div>

                    <div className="p-3">
                      <Link href={`/products/${product.slug}`} className="text-sm font-medium text-gray-800 hover:text-primary-700 transition-colors line-clamp-2 block mb-1">
                        {product.name}
                      </Link>
                      {product.ratingsCount > 0 && (
                        <StarRating rating={product.ratingsAverage} size="sm" className="mb-1.5" />
                      )}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-primary-700 text-sm">{formatPrice(product.price)}</span>
                        {product.compareAtPrice > product.price && (
                          <span className="text-xs text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        disabled={isOOS}
                        className={`w-full py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${isOOS ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white hover:bg-primary-700'}`}
                      >
                        <FiShoppingCart className="text-xs" />
                        {isOOS ? 'Out of Stock' : 'Add to Cart'}
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
