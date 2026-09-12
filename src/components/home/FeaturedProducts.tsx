'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import ProductCard from '@/components/product/ProductCard';

const TABS = [
  { label: 'Featured', key: 'featured' },
  { label: 'New Arrivals', key: 'new' },
  { label: 'Best Sellers', key: 'bestseller' },
  { label: 'On Sale', key: 'sale' },
];

export default function FeaturedProducts() {
  const [activeTab, setActiveTab] = useState('featured');

  // OPTIMIZED: Only fetch data for the active tab using enabled flag
  const { data: featuredData, isLoading: featuredLoading } = useQuery({
    queryKey: ['products', 'featured'],
    queryFn: () => productService.getFeatured(8).then(r => r.data.products),
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === 'featured',
  });

  const { data: newData, isLoading: newLoading } = useQuery({
    queryKey: ['products', 'new'],
    queryFn: () => productService.getAll({ isNewArrival: true, limit: 8 }).then(r => r.data.products),
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === 'new',
  });

  const { data: bestData, isLoading: bestLoading } = useQuery({
    queryKey: ['products', 'bestseller'],
    queryFn: () => productService.getAll({ isBestSeller: true, limit: 8 }).then(r => r.data.products),
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === 'bestseller',
  });

  const { data: saleData, isLoading: saleLoading } = useQuery({
    queryKey: ['products', 'sale'],
    queryFn: () => productService.getOnSale({ limit: 8 }).then(r => r.data.products),
    staleTime: 5 * 60 * 1000,
    enabled: activeTab === 'sale',
  });

  const productMap: Record<string, any[]> = {
    featured: featuredData || [],
    new: newData || [],
    bestseller: bestData || [],
    sale: saleData || [],
  };

  const loadingMap: Record<string, boolean> = {
    featured: featuredLoading,
    new: newLoading,
    bestseller: bestLoading,
    sale: saleLoading,
  };

  const products = productMap[activeTab] || [];
  const isLoading = loadingMap[activeTab];

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-tag">🛍️ Our Collection</span>
            <h2 className="section-heading">Premium Plants & Products</h2>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {TABS.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? 'bg-white text-primary-700 shadow-soft'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6"
        >
          {isLoading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden">
                  <div className="h-56 skeleton" />
                  <div className="p-4 space-y-2">
                    <div className="h-4 skeleton rounded w-3/4" />
                    <div className="h-4 skeleton rounded w-1/2" />
                    <div className="h-8 skeleton rounded-full mt-2" />
                  </div>
                </div>
              ))
            : products.length > 0
            ? products.map((product: any, i: number) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-400">No products found in this category.</p>
              </div>
            )
          }
        </motion.div>

        <div className="text-center mt-10">
          <Link href="/products" className="btn-primary px-8 py-3.5">
            View All Products <FiArrowRight />
          </Link>
        </div>
      </div>
    </section>
  );
}
