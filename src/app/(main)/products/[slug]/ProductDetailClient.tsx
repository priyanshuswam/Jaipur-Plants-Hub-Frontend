'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiHeart, FiShoppingCart, FiMinus, FiPlus, FiShare2,
  FiTruck, FiShield, FiRefreshCw, FiStar, FiCheckCircle,
  FiPackage, FiArrowRight, FiChevronDown,
} from 'react-icons/fi';
import { FaHeart, FaLeaf } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { cartService } from '@/services/cartService';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { formatPrice, discountPercent, cn } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';
import StarRating from '@/components/common/StarRating';
import ProductCard from '@/components/product/ProductCard';
import ReviewSection from '@/components/product/ReviewSection';
import { PageLoader } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import type { Product } from '@/types';

const CARE_ICONS: Record<string, string> = {
  wateringFrequency: '💧', sunlight: '☀️', difficulty: '🌱',
  growthRate: '📈', matureHeight: '📏', toxicity: '⚠️',
  temperature: '🌡️', humidity: '💦',
};

export default function ProductDetailClient({ slug }: { slug: string }) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQty] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'desc' | 'care' | 'shipping' | 'reviews'>('desc');
  const [addingToCart, setAddingToCart] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });

  const { isAuthenticated } = useAuthStore();
  const { addItemOptimistic, setCart, openCart } = useCartStore();
  const { isInWishlist, toggleOptimistic } = useWishlistStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => productService.getBySlug(slug).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const product: Product | undefined = data?.product;
  const related: Product[] = data?.related || [];

  if (isLoading) return <PageLoader />;
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <p className="text-6xl mb-4">🌿</p>
          <h2 className="text-2xl font-bold text-gray-700 mb-2">Product Not Found</h2>
          <p className="text-gray-400 mb-6">This product may have been removed or the link is incorrect.</p>
          <Link href="/products" className="btn-primary">Browse All Products</Link>
        </div>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const discount = discountPercent(product.price, product.compareAtPrice || 0);
  const isOutOfStock = product.stock === 0 && !product.allowBackorder;
  const isLowStock = product.stock > 0 && product.stock <= product.lowStockThreshold;

  const currentVariant = selectedVariant
    ? product.variants?.find(v => v._id === selectedVariant)
    : null;
  const currentPrice = currentVariant?.price ?? product.price;
  const currentStock = currentVariant?.stock ?? product.stock;

  const handleImageMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setZoomPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error('Please login to add to cart'); return; }
    if (isOutOfStock) { toast.error('Product is out of stock'); return; }
    if (quantity > currentStock && !product.allowBackorder) {
      toast.error(`Only ${currentStock} units available`); return;
    }
    setAddingToCart(true);
    addItemOptimistic(product, quantity);
    try {
      const { data } = await cartService.addItem(product._id, quantity, selectedVariant || undefined);
      setCart(data.cart?.items || [], data.summary || {});
      toast.success(`${quantity} × ${product.name} added to cart! 🌿`);
      openCart();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  const handleWishlist = async () => {
    if (!isAuthenticated) { toast.error('Please login to use wishlist'); return; }
    toggleOptimistic(product._id);
    try {
      const { data } = await api.post(`/wishlist/${product._id}`);
      toast.success(data.inWishlist ? 'Added to wishlist ❤️' : 'Removed from wishlist');
    } catch {
      toggleOptimistic(product._id);
      toast.error('Failed to update wishlist');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: product.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Breadcrumb items={[
            { label: 'Products', href: '/products' },
            { label: (product.category as any)?.name || 'Category', href: `/categories/${(product.category as any)?.slug}` },
            { label: product.name },
          ]} />
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid lg:grid-cols-2 gap-10 xl:gap-16 mb-16">

          {/* ── Left: Images ─────────────────── */}
          <div className="space-y-4">
            {/* Main image */}
            <div
              className="relative rounded-3xl overflow-hidden bg-white shadow-soft cursor-zoom-in aspect-square"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleImageMouseMove}
            >
              <Image
                src={product.images[selectedImage]?.url || product.thumbnail}
                alt={product.images[selectedImage]?.alt || product.name}
                fill
                priority
                className={cn('object-cover transition-transform duration-300', isZoomed ? 'scale-150' : 'scale-100')}
                style={isZoomed ? { transformOrigin: `${zoomPos.x}% ${zoomPos.y}%` } : undefined}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2 flex-col">
                {discount > 0 && (
                  <span className="badge bg-red-500 text-white text-xs font-bold">-{discount}% OFF</span>
                )}
                {product.isNewArrival && (
                  <span className="badge bg-blue-600 text-white text-xs">New Arrival</span>
                )}
                {product.isBestSeller && (
                  <span className="badge bg-amber-500 text-white text-xs">Best Seller</span>
                )}
              </div>
              {isZoomed && (
                <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  Hover to zoom
                </div>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
                {product.images.map((img, i) => (
                  <button
                    key={img._id}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      'relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all',
                      selectedImage === i ? 'border-primary-600 shadow-green' : 'border-gray-200 hover:border-primary-300'
                    )}
                  >
                    <Image src={img.url} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="80px" />
                  </button>
                ))}
              </div>
            )}

            {/* Trust badges */}
            <div className="grid grid-cols-2 gap-3 mt-2">
              {[
                { icon: FiTruck, text: 'Free Shipping above ₹999', color: 'text-blue-600 bg-blue-50' },
                { icon: FiPackage, text: 'Secure Packaging', color: 'text-purple-600 bg-purple-50' },
              ].map(({ icon: Icon, text, color }) => (
                <div key={text} className={`rounded-xl p-3 flex flex-col items-center text-center gap-1.5 ${color.split(' ')[1]}`}>
                  <Icon className={`text-lg ${color.split(' ')[0]}`} />
                  <p className="text-xs text-gray-600 leading-tight">{text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Info ──────────────────── */}
          <div className="space-y-5">
            {/* Category & Brand */}
            <div className="flex items-center gap-2 text-sm">
              <Link
                href={`/categories/${(product.category as any)?.slug}`}
                className="text-primary-600 hover:underline font-medium"
              >
                {(product.category as any)?.name}
              </Link>
              {product.brand && (
                <>
                  <span className="text-gray-300">·</span>
                  <span className="text-gray-500">{product.brand}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>

            {/* Botanical name */}
            {product.plantInfo?.botanicalName && (
              <p className="text-gray-400 text-sm italic">{product.plantInfo.botanicalName}</p>
            )}

            {/* Rating */}
            {product.ratingsCount > 0 && (
              <div className="flex items-center gap-3">
                <StarRating rating={product.ratingsAverage} size="md" />
                <span className="font-semibold text-gray-700">{product.ratingsAverage}</span>
                <a href="#reviews" className="text-sm text-primary-600 hover:underline">
                  ({product.ratingsCount} reviews)
                </a>
              </div>
            )}

            {/* Price */}
            <div className="flex items-end gap-3">
              <span className="font-display text-4xl font-bold text-primary-700">
                {formatPrice(currentPrice)}
              </span>
              {product.compareAtPrice && product.compareAtPrice > currentPrice && (
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl text-gray-400 line-through">{formatPrice(product.compareAtPrice)}</span>
                  <span className="badge bg-red-100 text-red-600 font-bold">Save {formatPrice(product.compareAtPrice - currentPrice)}</span>
                </div>
              )}
            </div>

            {/* Short description */}
            {product.shortDescription && (
              <p className="text-gray-600 leading-relaxed">{product.shortDescription}</p>
            )}

            {/* Variants */}
            {product.hasVariants && product.variants && product.variants.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Select Option: {currentVariant ? <span className="text-primary-600">{currentVariant.name}</span> : 'Choose'}
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.variants.filter(v => v.isActive).map(v => (
                    <button
                      key={v._id}
                      onClick={() => setSelectedVariant(selectedVariant === v._id ? null : v._id)}
                      disabled={v.stock === 0 && !product.allowBackorder}
                      className={cn(
                        'px-4 py-2 rounded-xl text-sm font-medium border-2 transition-all',
                        selectedVariant === v._id
                          ? 'border-primary-600 bg-primary-50 text-primary-700'
                          : v.stock === 0
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-200 text-gray-600 hover:border-primary-300'
                      )}
                    >
                      {v.name}
                      {v.price !== product.price && (
                        <span className="ml-1 text-xs text-gray-400">({formatPrice(v.price)})</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Stock status */}
            <div className="flex items-center gap-2">
              {isOutOfStock ? (
                <span className="flex items-center gap-1.5 text-red-500 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-red-500" /> Out of Stock
                </span>
              ) : isLowStock ? (
                <span className="flex items-center gap-1.5 text-orange-500 text-sm font-medium">
                  <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                  Only {currentStock} left — Order soon!
                </span>
              ) : (
                <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                  <FiCheckCircle className="text-green-500" /> In Stock
                </span>
              )}
            </div>

            {/* Quantity + CTA */}
            <div className="flex items-center gap-4">
              {/* Quantity selector */}
              <div className="flex items-center gap-0 bg-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setQty(q => Math.max(1, q - 1))}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600"
                >
                  <FiMinus className="text-sm" />
                </button>
                <span className="w-12 text-center font-semibold text-gray-800">{quantity}</span>
                <button
                  onClick={() => setQty(q => Math.min(currentStock, q + 1))}
                  disabled={quantity >= currentStock && !product.allowBackorder}
                  className="w-10 h-12 flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-600 disabled:opacity-40"
                >
                  <FiPlus className="text-sm" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                disabled={addingToCart || isOutOfStock}
                className={cn(
                  'flex-1 py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all duration-300',
                  isOutOfStock
                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-primary text-white hover:shadow-green-lg hover:scale-[1.02] active:scale-[0.98]'
                )}
              >
                {addingToCart ? (
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <FiShoppingCart />
                )}
                {isOutOfStock ? 'Out of Stock' : addingToCart ? 'Adding...' : 'Add to Cart'}
              </button>

              {/* Wishlist */}
              <button
                onClick={handleWishlist}
                className={cn(
                  'w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all hover:scale-110',
                  inWishlist
                    ? 'border-red-300 bg-red-50 text-red-500'
                    : 'border-gray-200 text-gray-500 hover:border-red-300 hover:text-red-500'
                )}
              >
                {inWishlist ? <FaHeart /> : <FiHeart />}
              </button>

              {/* Share */}
              <button
                onClick={handleShare}
                className="w-12 h-12 rounded-xl border-2 border-gray-200 flex items-center justify-center text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-all"
              >
                <FiShare2 />
              </button>
            </div>

            {/* Buy Now */}
            {!isOutOfStock && (
              <Link
                href={`/checkout?buyNow=${product._id}&qty=${quantity}`}
                className="btn-secondary w-full py-3.5 text-center"
                onClick={(e) => {
                  if (!isAuthenticated) {
                    e.preventDefault();
                    toast.error('Please login to proceed');
                  }
                }}
              >
                Buy Now — {formatPrice(currentPrice * quantity)}
              </Link>
            )}

            {/* Quick plant care summary */}
            {product.plantInfo && Object.values(product.plantInfo).some(Boolean) && (
              <div className="bg-primary-50 rounded-2xl p-4">
                <p className="text-sm font-semibold text-primary-700 flex items-center gap-2 mb-3">
                  <FaLeaf /> Quick Care Guide
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    ['wateringFrequency', 'Watering', product.plantInfo.wateringFrequency],
                    ['sunlight', 'Sunlight', product.plantInfo.sunlight?.replace(/-/g, ' ')],
                    ['difficulty', 'Difficulty', product.plantInfo.difficulty],
                    ['growthRate', 'Growth', product.plantInfo.growthRate],
                  ].filter(([, , val]) => val).map(([key, label, val]) => (
                    <div key={key as string} className="flex items-start gap-2 text-sm">
                      <span>{CARE_ICONS[key as string]}</span>
                      <div>
                        <p className="text-gray-400 text-xs">{label}</p>
                        <p className="text-gray-700 font-medium capitalize">{val}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <Link
                    key={tag}
                    href={`/products?search=${tag}`}
                    className="px-3 py-1 bg-gray-100 text-gray-500 text-xs rounded-full hover:bg-primary-50 hover:text-primary-600 transition-colors"
                  >
                    #{tag}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs: Description / Care / Shipping / Reviews ── */}
        <div className="bg-white rounded-3xl shadow-soft overflow-hidden mb-16" id="reviews">
          <div className="flex overflow-x-auto no-scrollbar border-b border-gray-100">
            {[
              { key: 'desc', label: 'Description' },
              { key: 'care', label: 'Plant Care' },
              { key: 'shipping', label: 'Shipping Info' },
              { key: 'reviews', label: `Reviews (${product.ratingsCount})` },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={cn(
                  'px-6 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
                  activeTab === tab.key
                    ? 'border-primary-600 text-primary-700 bg-primary-50/50'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6 lg:p-8">
            {activeTab === 'desc' && (
              <div className="prose prose-green max-w-none">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">{product.description}</p>
                {product.additionalInfo && product.additionalInfo.length > 0 && (
                  <div className="mt-6 grid sm:grid-cols-2 gap-3">
                    {product.additionalInfo.map((info: any) => (
                      <div key={info.key} className="flex gap-2 text-sm">
                        <span className="text-gray-400 w-32 flex-shrink-0">{info.key}:</span>
                        <span className="text-gray-700 font-medium">{info.value}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'care' && product.plantInfo && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { key: 'wateringFrequency', label: 'Watering Frequency', icon: '💧' },
                  { key: 'sunlight', label: 'Sunlight Requirement', icon: '☀️' },
                  { key: 'difficulty', label: 'Care Difficulty', icon: '🌱' },
                  { key: 'growthRate', label: 'Growth Rate', icon: '📈' },
                  { key: 'matureHeight', label: 'Mature Height', icon: '📏' },
                  { key: 'temperature', label: 'Ideal Temperature', icon: '🌡️' },
                  { key: 'humidity', label: 'Humidity', icon: '💦' },
                  { key: 'soilType', label: 'Soil Type', icon: '🪨' },
                  { key: 'toxicity', label: 'Toxicity', icon: '⚠️' },
                  { key: 'origin', label: 'Origin', icon: '🌍' },
                ].filter(f => (product.plantInfo as any)?.[f.key]).map(f => (
                  <div key={f.key} className="bg-gray-50 rounded-xl p-4">
                    <span className="text-2xl block mb-2">{f.icon}</span>
                    <p className="text-xs text-gray-400 mb-1">{f.label}</p>
                    <p className="font-semibold text-gray-700 capitalize">
                      {String((product.plantInfo as any)[f.key]).replace(/-/g, ' ')}
                    </p>
                  </div>
                ))}
                {product.plantInfo.careInstructions && (
                  <div className="sm:col-span-2 lg:col-span-3 bg-primary-50 rounded-xl p-4">
                    <p className="text-sm font-semibold text-primary-700 mb-2">🌿 Care Instructions</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{product.plantInfo.careInstructions}</p>
                  </div>
                )}
                {product.plantInfo.benefits && product.plantInfo.benefits.length > 0 && (
                  <div className="sm:col-span-2 lg:col-span-3">
                    <p className="text-sm font-semibold text-gray-700 mb-2">✅ Benefits</p>
                    <div className="flex flex-wrap gap-2">
                      {product.plantInfo.benefits.map((b: string) => (
                        <span key={b} className="badge bg-green-100 text-green-700">{b}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-5 max-w-2xl">
                {[
                  { icon: FiTruck, title: 'Free Shipping', desc: 'On all orders above ₹999. Standard delivery in 2–5 business days.' },
                  { icon: FiPackage, title: 'Secure Packaging', desc: 'All plants are carefully packed with moisture-retaining materials to ensure safe delivery.' },
                  { icon: FiShield, title: 'Healthy Plant Guarantee', desc: 'We guarantee every plant arrives healthy. If it doesn\'t, we\'ll replace it free of charge.' },
                ].map(({ icon: Icon, title, desc }) => (
                  <div key={title} className="flex gap-4">
                    <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon className="text-primary-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-0.5">{title}</p>
                      <p className="text-sm text-gray-500">{desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <ReviewSection productId={product._id} ratingsAverage={product.ratingsAverage} ratingsCount={product.ratingsCount} />
            )}
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {related.slice(0, 5).map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
