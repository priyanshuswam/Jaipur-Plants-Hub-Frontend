'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSearch, FiX, FiTrendingUp, FiClock, FiArrowRight } from 'react-icons/fi';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { debounce, formatPrice } from '@/lib/utils';

const TRENDING = ['Monstera', 'Peace Lily', 'Succulents', 'Rose Plant', 'Areca Palm', 'Terrace Garden'];

interface Props { isOpen: boolean; onClose: () => void; }

export default function SearchModal({ isOpen, onClose }: Props) {
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      const stored = JSON.parse(localStorage.getItem('recentSearches') || '[]');
      setRecentSearches(stored);
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  const debouncedQuery = useRef(debounce((q: string) => setQuery(q), 300));

  const { data, isLoading } = useQuery({
    queryKey: ['autocomplete', query],
    queryFn: () => productService.autocomplete(query).then(r => r.data.suggestions),
    enabled: query.length >= 2,
    staleTime: 30000,
  });

  const handleSearch = (term: string) => {
    const recent = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    localStorage.setItem('recentSearches', JSON.stringify(recent));
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[200] flex items-start justify-center pt-20 px-4"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-2xl bg-white rounded-2xl shadow-soft-xl overflow-hidden"
          >
            {/* Input */}
            <div className="flex items-center gap-3 p-4 border-b border-gray-100">
              <FiSearch className="text-gray-400 text-xl flex-shrink-0" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search plants, services, garden designs..."
                className="flex-1 text-gray-800 placeholder:text-gray-400 outline-none text-base"
                onChange={(e) => debouncedQuery.current(e.target.value)}
              />
              <button onClick={onClose} className="p-1.5 rounded-full hover:bg-gray-100 transition-colors">
                <FiX className="text-gray-400 text-lg" />
              </button>
            </div>

            {/* Results */}
            <div className="max-h-[60vh] overflow-y-auto">
              {query.length >= 2 ? (
                <div className="p-3">
                  {isLoading ? (
                    <div className="space-y-3 p-2">
                      {[1, 2, 3].map(i => (
                        <div key={i} className="flex gap-3 animate-pulse">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg" />
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                            <div className="h-3 bg-gray-100 rounded w-1/2" />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : data?.length ? (
                    <>
                      <p className="text-xs text-gray-400 font-medium uppercase tracking-wide px-2 mb-2">Products</p>
                      {data.map((product: any) => (
                        <Link
                          key={product._id}
                          href={`/products/${product.slug}`}
                          onClick={() => handleSearch(product.name)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-primary-50 transition-colors group"
                        >
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                            {product.thumbnail && (
                              <Image src={product.thumbnail} alt={product.name} width={48} height={48} className="w-full h-full object-cover" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate group-hover:text-primary-700">{product.name}</p>
                            <p className="text-xs text-gray-400">{product.category?.name}</p>
                          </div>
                          <span className="text-sm font-semibold text-primary-700">{formatPrice(product.price)}</span>
                        </Link>
                      ))}
                      <Link
                        href={`/products?search=${encodeURIComponent(query)}`}
                        onClick={() => handleSearch(query)}
                        className="flex items-center justify-center gap-2 p-3 mt-2 text-sm text-primary-700 font-medium hover:bg-primary-50 rounded-xl transition-colors"
                      >
                        View all results for &quot;{query}&quot; <FiArrowRight />
                      </Link>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-sm">No results found for &quot;{query}&quot;</p>
                      <Link href={`/products?search=${encodeURIComponent(query)}`} onClick={onClose} className="text-primary-600 text-sm mt-2 hover:underline inline-block">
                        Search in all products
                      </Link>
                    </div>
                  )}
                </div>
              ) : (
                <div className="p-4 space-y-5">
                  {recentSearches.length > 0 && (
                    <div>
                      <p className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
                        <FiClock className="text-sm" /> Recent Searches
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map(s => (
                          <button key={s} onClick={() => { setQuery(s); inputRef.current && (inputRef.current.value = s); }} className="px-3 py-1.5 bg-gray-100 hover:bg-primary-50 hover:text-primary-700 text-gray-600 text-sm rounded-full transition-colors">
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="flex items-center gap-1.5 text-xs text-gray-400 font-medium uppercase tracking-wide mb-2">
                      <FiTrendingUp className="text-sm" /> Trending
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {TRENDING.map(s => (
                        <Link key={s} href={`/products?search=${encodeURIComponent(s)}`} onClick={() => handleSearch(s)} className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-full hover:bg-primary-100 transition-colors">
                          {s}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
