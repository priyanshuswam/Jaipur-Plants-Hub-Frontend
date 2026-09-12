'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiGrid, FiList } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { productService } from '@/services/productService';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumb from '@/components/common/Breadcrumb';
import { cn } from '@/lib/utils';
import { PageLoader } from '@/components/common/LoadingSpinner';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('newest');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const { data: catData, isLoading: catLoading } = useQuery({
    queryKey: ['category', slug],
    queryFn: () => api.get(`/categories/${slug}`).then(r => r.data),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
  });

  const { data: productsData, isLoading: productsLoading } = useQuery({
    queryKey: ['products-by-category', slug, page, sort],
    queryFn: () => productService.getAll({ category: slug, page, limit: 20, sort }).then(r => r.data),
    enabled: !!slug,
    staleTime: 60 * 1000,
  });

  if (!slug) return <PageLoader />;

  if (catLoading) return <PageLoader />;
  if (!catData?.category) {
    return (
      <div className="min-h-screen pt-24 text-center">
        <p className="text-5xl mb-4">🌿</p>
        <p className="text-gray-500 mb-4">Category not found</p>
        <Link href="/products" className="btn-primary inline-flex">Browse All Products</Link>
      </div>
    );
  }

  const category = catData.category;
  const subcategories = catData.subcategories || [];
  const products = productsData?.products || [];
  const meta = productsData?.meta || {};

  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Hero */}
      <div className="relative bg-gradient-primary py-14 overflow-hidden">
        {category.image?.url && (
          <Image src={category.image.url} alt={category.name} fill className="object-cover opacity-20" />
        )}
        <div className="container-custom relative">
          <Breadcrumb
            items={[{ label: 'Products', href: '/products' }, { label: category.name }]}
            light
          />
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mt-4">
            <span className="text-5xl block mb-3">{category.icon || '🌿'}</span>
            <h1 className="font-display text-4xl font-bold text-white mb-2">{category.name}</h1>
            {category.description && <p className="text-primary-200 max-w-xl">{category.description}</p>}
            <p className="text-primary-300 text-sm mt-2">{catData.productCount || 0} products available</p>
          </motion.div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Subcategories */}
        {subcategories.length > 0 && (
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2 mb-8">
            {subcategories.map((sub: any) => (
              <Link
                key={sub._id}
                href={`/categories/${sub.slug}`}
                className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 text-sm font-medium text-gray-600 hover:border-primary-400 hover:text-primary-700 transition-all whitespace-nowrap flex-shrink-0 shadow-soft"
              >
                {sub.icon && <span>{sub.icon}</span>}
                {sub.name}
              </Link>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="flex items-center justify-between gap-4 mb-6 bg-white rounded-xl p-3 shadow-soft">
          <span className="text-sm text-gray-400">{meta.total || 0} products</span>
          <div className="flex items-center gap-3">
            <select
              value={sort}
              onChange={e => { setSort(e.target.value); setPage(1); }}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-400"
            >
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Top Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
            <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
              {([{ v: 'grid', Icon: FiGrid }, { v: 'list', Icon: FiList }] as const).map(({ v, Icon }) => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={cn('p-2', view === v ? 'bg-primary-600 text-white' : 'text-gray-400 hover:bg-gray-50')}
                >
                  <Icon className="text-sm" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Products */}
        {productsLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-soft">
                <div className="aspect-square skeleton" />
                <div className="p-4 space-y-2">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🌿</p>
            <p className="text-gray-500 mb-4">No products in this category yet</p>
            <Link href="/products" className="btn-primary inline-flex">Browse All Products</Link>
          </div>
        ) : (
          <>
            <div className={cn(
              'grid gap-4',
              view === 'grid'
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2'
            )}>
              {products.map((product: any, i: number) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <ProductCard product={product} compact={view === 'list'} />
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  ← Previous
                </button>
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, meta.totalPages - 4)) + i;
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={cn(
                        'w-9 h-9 rounded-lg text-sm font-medium transition-all',
                        page === p
                          ? 'bg-primary-600 text-white shadow-green'
                          : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                      )}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                  disabled={page === meta.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
