'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiHeart, FiShoppingCart, FiStar, FiEye } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { cartService } from '@/services/cartService';
import api from '@/lib/axios';
import { formatPrice, discountPercent, cn } from '@/lib/utils';
import type { Product } from '@/types';

interface Props {
  product: Product;
  compact?: boolean;
}

export default function ProductCard({ product, compact }: Props) {
  const [addingToCart, setAddingToCart] = useState(false);
  const [togglingWishlist, setTogglingWishlist] = useState(false);
  const [imgError, setImgError] = useState(false);

  const { isAuthenticated } = useAuthStore();
  const { addItemOptimistic, setCart } = useCartStore();
  const { isInWishlist, toggleOptimistic, setWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product._id);
  const discount = discountPercent(product.price, product.compareAtPrice || 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to add to cart');
      return;
    }
    if (product.stock === 0 && !product.allowBackorder) {
      toast.error('Product is out of stock');
      return;
    }
    setAddingToCart(true);
    addItemOptimistic(product, 1);
    try {
      const { data } = await cartService.addItem(product._id, 1);
      setCart(data.cart?.items || [], data.summary || {});
      toast.success('Added to cart! 🌿');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error('Please login to use wishlist');
      return;
    }
    setTogglingWishlist(true);
    toggleOptimistic(product._id);
    try {
      const { data } = await api.post(`/wishlist/${product._id}`);
      toast.success(data.inWishlist ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch {
      toggleOptimistic(product._id); // Revert
      toast.error('Failed to update wishlist');
    } finally {
      setTogglingWishlist(false);
    }
  };

  const isOutOfStock = product.stock === 0 && !product.allowBackorder;

  return (
    <div className={cn('card-product group', compact ? 'rounded-xl' : 'rounded-2xl')}>
      {/* Image Container */}
      <Link href={`/products/${product.slug}`} className="block relative overflow-hidden" style={{ aspectRatio: '1' }}>
        <Image
          src={imgError ? '/images/plant-placeholder.svg' : (product.thumbnail || '/images/plant-placeholder.svg')}
          alt={product.name}
          fill
          className={cn(
            'object-cover transition-transform duration-500 group-hover:scale-108',
            isOutOfStock && 'opacity-60 grayscale'
          )}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImgError(true)}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock ? (
            <span className="badge bg-gray-700 text-white text-[10px]">Out of Stock</span>
          ) : (
            <>
              {product.isNewArrival && <span className="badge bg-blue-600 text-white text-[10px]">New</span>}
              {product.isBestSeller && <span className="badge bg-amber-500 text-white text-[10px]">Best Seller</span>}
              {discount > 0 && <span className="badge bg-red-500 text-white text-[10px]">-{discount}%</span>}
            </>
          )}
        </div>

        {/* Actions overlay */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-300">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleWishlist}
            disabled={togglingWishlist}
            className="w-9 h-9 bg-white rounded-full shadow-soft flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Wishlist"
          >
            {inWishlist
              ? <FaHeart className="text-red-500 text-sm" />
              : <FiHeart className="text-gray-600 text-sm" />
            }
          </motion.button>
          <Link
            href={`/products/${product.slug}`}
            className="w-9 h-9 bg-white rounded-full shadow-soft flex items-center justify-center hover:scale-110 transition-transform"
            aria-label="Quick view"
          >
            <FiEye className="text-gray-600 text-sm" />
          </Link>
        </div>

        {/* Add to cart overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || isOutOfStock}
            className={cn(
              'w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all',
              isOutOfStock
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'bg-primary-700 text-white hover:bg-primary-800 shadow-green'
            )}
          >
            {addingToCart ? (
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiShoppingCart className="text-sm" />
            )}
            {isOutOfStock ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}
          </button>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <Link href={`/products/${product.slug}`} className="block">
          <p className="text-xs text-gray-400 mb-1 capitalize">{(product.category as any)?.name || product.type}</p>
          <h3 className="font-medium text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.ratingsCount > 0 && (
          <div className="flex items-center gap-1 mb-2">
            <FiStar className="text-amber-400 text-xs fill-amber-400" />
            <span className="text-xs font-medium text-gray-600">{product.ratingsAverage}</span>
            <span className="text-xs text-gray-400">({product.ratingsCount})</span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-primary-700 text-base">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-sm text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        {/* Stock indicator */}
        {!isOutOfStock && product.stock <= product.lowStockThreshold && (
          <p className="text-xs text-orange-500 mt-1 font-medium">Only {product.stock} left!</p>
        )}
      </div>
    </div>
  );
}
