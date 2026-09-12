'use client';

import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiFilter, FiX, FiGrid, FiList, FiChevronDown,
  FiSliders, FiSearch, FiRefreshCw,
} from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import api from '@/lib/axios';
import ProductCard from '@/components/product/ProductCard';
import Breadcrumb from '@/components/common/Breadcrumb';
import { cn } from '@/lib/utils';
import type { Product } from '@/types';

/* ── Constants ───────────────────────────────── */
const PLANT_TYPES = [
  { value: 'plant', label: 'Plants' },
  { value: 'seed', label: 'Seeds & Bulbs' },
  { value: 'pot', label: 'Pots & Planters' },
  { value: 'tool', label: 'Garden Tools' },
  { value: 'fertilizer', label: 'Fertilizers' },
  { value: 'soil', label: 'Soil & Compost' },
  { value: 'accessory', label: 'Accessories' },
];

const SUNLIGHT_OPTIONS = [
  { value: 'full-sun', label: '☀️ Full Sun' },
  { value: 'partial-sun', label: '⛅ Partial Sun' },
  { value: 'indirect-light', label: '🌤️ Indirect Light' },
  { value: 'shade', label: '🌑 Shade' },
];

const DIFFICULTY_OPTIONS = [
  { value: 'easy', label: '🟢 Easy' },
  { value: 'moderate', label: '🟡 Moderate' },
  { value: 'hard', label: '🔴 Advanced' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A to Z' },
];

/* ── Price Range ─────────────────────────────── */
function PriceRange({ min, max, onChange }: {
  min: number; max: number;
  onChange: (min: number, max: number) => void;
}) {
  return (
    <div className="flex items-center gap-3">
      <input type="number" value={min} min={0} max={max - 1}
        onChange={(e) => onChange(Number(e.target.value), max)}
        className="w-full input-field py-2 text-sm" placeholder="Min ₹" />
      <span className="text-gray-400 text-sm flex-shrink-0">–</span>
      <input type="number" value={max} min={min + 1} max={50000}
        onChange={(e) => onChange(min, Number(e.target.value))}
        className="w-full input-field py-2 text-sm" placeholder="Max ₹" />
    </div>
  );
}

/* ── Filter Accordion ────────────────────────── */
function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 pb-4 mb-4">
      <button onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full text-sm font-semibold text-gray-700 mb-3">
        {title}
        <FiChevronDown className={cn('transition-transform', open ? 'rotate-180' : '')} />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Filter Sidebar ──────────────────────────── */
function FilterSidebar({ filters, setFilter, onReset }: {
  filters: Record<string, any>;
  setFilter: (key: string, val: any) => void;
  onReset: () => void;
}) {
  const { data: categories } = useQuery({
    queryKey: ['categories', 'sidebar'],
    queryFn: () => api.get('/categories', { params: { active: true, level: 0 } }).then(r => r.data.categories),
    staleTime: 5 * 60 * 1000,
  });

  const Checkbox = ({ name, value, checked, label }: any) => (
    <label className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 cursor-pointer py-0.5">
      <input type="checkbox" checked={checked}
        onChange={(e) => setFilter(name, e.target.checked ? value : '')}
        className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
      {label}
    </label>
  );

  const activeCount = Object.values(filters).filter(v => v && v !== '' && v !== 0 && v !== 50000).length;

  return (
    <div className="bg-white rounded-2xl shadow-soft p-5">
      <div className="flex items-center justify-between mb-5">
        <span className="font-semibold text-gray-800 flex items-center gap-2">
          <FiSliders className="text-primary-600" /> Filters
          {activeCount > 0 && (
            <span className="w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
              {activeCount}
            </span>
          )}
        </span>
        {activeCount > 0 && (
          <button onClick={onReset} className="text-xs text-primary-600 hover:underline flex items-center gap-1">
            <FiRefreshCw className="text-xs" /> Reset
          </button>
        )}
      </div>

      <div className="relative mb-4">
        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
        <input type="text" value={filters.search || ''}
          onChange={(e) => setFilter('search', e.target.value)}
          placeholder="Search plants..."
          className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400" />
      </div>

      <FilterSection title="Category">
        <div className="space-y-1">
          {(categories || []).map((cat: any) => (
            <Checkbox key={cat._id} name="categoryId" value={cat._id}
              checked={filters.categoryId === cat._id}
              label={`${cat.icon || '🌿'} ${cat.name} (${cat.productCount || 0})`} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Product Type">
        <div className="space-y-1">
          {PLANT_TYPES.map((t) => (
            <Checkbox key={t.value} name="type" value={t.value}
              checked={filters.type === t.value} label={t.label} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Price Range">
        <PriceRange min={filters.minPrice || 0} max={filters.maxPrice || 50000}
          onChange={(min, max) => { setFilter('minPrice', min); setFilter('maxPrice', max); }} />
      </FilterSection>

      <FilterSection title="Sunlight" defaultOpen={false}>
        <div className="space-y-1">
          {SUNLIGHT_OPTIONS.map((o) => (
            <Checkbox key={o.value} name="sunlight" value={o.value}
              checked={filters.sunlight === o.value} label={o.label} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Difficulty" defaultOpen={false}>
        <div className="space-y-1">
          {DIFFICULTY_OPTIONS.map((o) => (
            <Checkbox key={o.value} name="difficulty" value={o.value}
              checked={filters.difficulty === o.value} label={o.label} />
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Quick Filters" defaultOpen={false}>
        {[
          { name: 'isFeatured', label: '⭐ Featured' },
          { name: 'isNewArrival', label: '🆕 New Arrivals' },
          { name: 'isBestSeller', label: '🔥 Best Sellers' },
          { name: 'isOnSale', label: '🏷️ On Sale' },
          { name: 'inStock', label: '✅ In Stock Only' },
        ].map((q) => (
          <Checkbox key={q.name} name={q.name} value="true"
            checked={filters[q.name] === 'true'} label={q.label} />
        ))}
      </FilterSection>

      <FilterSection title="Minimum Rating" defaultOpen={false}>
        {[4, 3, 2, 1].map(r => (
          <label key={r} className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary-700 cursor-pointer py-0.5">
            <input type="radio" name="minRating" checked={filters.minRating === String(r)}
              onChange={() => setFilter('minRating', String(r))} className="text-primary-600" />
            {'⭐'.repeat(r)} & above
          </label>
        ))}
      </FilterSection>
    </div>
  );
}

/* ── Inner Component — direct Suspense child ─── */
// useSearchParams() lives here, safely inside the Suspense boundary.
// All state is initialized with SAFE DEFAULTS (no synchronous searchParams access).
// URL params are read inside useEffect, after hydration.
function ProductsInner() {
  const searchParams = useSearchParams();

  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<Record<string, any>>({});
  const [sort, setSort] = useState('newest');
  const [hydrated, setHydrated] = useState(false);
  const LIMIT = 20;

  // Safely read URL params AFTER hydration — never during initial render
  useEffect(() => {
    const f: Record<string, any> = {};
    searchParams.forEach((v, k) => { f[k] = v; });
    const urlSort = searchParams.get('sort');
    setFilters(f);
    if (urlSort) setSort(urlSort);
    setHydrated(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const setFilter = useCallback((key: string, val: any) => {
    setFilters(prev => {
      if (!val || val === '') {
        const n = { ...prev };
        delete n[key];
        return n;
      }
      return { ...prev, [key]: val };
    });
    setPage(1);
  }, []);

  const resetFilters = () => { setFilters({}); setSort('newest'); setPage(1); };

  const queryParams = { ...filters, sort, page, limit: LIMIT };

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ['products', queryParams],
    queryFn: () => productService.getAll(queryParams).then(r => r.data),
    staleTime: 60 * 1000,
    placeholderData: (prev: any) => prev,
    enabled: hydrated,
  });

  const products: Product[] = data?.products || [];
  const meta = data?.meta || {};
  const totalPages = meta.totalPages || 1;
  const total = meta.total || 0;

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-6">
          <Breadcrumb items={[{ label: 'Products' }]} />
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">
            {filters.search ? `Results for "${filters.search}"` : 'All Plants & Products'}
          </h1>
          <p className="text-gray-400 text-sm mt-1">{total} products found</p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="flex gap-7">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar filters={filters} setFilter={setFilter} onReset={resetFilters} />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 mb-6 bg-white rounded-xl p-3 shadow-soft">
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden flex items-center gap-2 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-medium">
                  <FiFilter /> Filters
                  {Object.keys(filters).length > 0 && (
                    <span className="w-4 h-4 bg-primary-600 text-white text-[10px] rounded-full flex items-center justify-center">
                      {Object.keys(filters).length}
                    </span>
                  )}
                </button>
                <span className="hidden sm:block text-sm text-gray-400">
                  {isFetching ? 'Updating...' : `${total} results`}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }}
                  className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary-400 text-gray-700">
                  {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <div className="hidden sm:flex border border-gray-200 rounded-lg overflow-hidden">
                  {([{ v: 'grid' as const, Icon: FiGrid }, { v: 'list' as const, Icon: FiList }]).map(({ v, Icon }) => (
                    <button key={v} onClick={() => setView(v)}
                      className={cn('p-2 transition-colors', view === v ? 'bg-primary-600 text-white' : 'text-gray-500 hover:bg-gray-50')}>
                      <Icon className="text-sm" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filter Tags */}
            {Object.keys(filters).length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {Object.entries(filters).map(([key, val]) => (
                  <span key={key}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary-50 text-primary-700 text-xs font-medium rounded-full">
                    {key}: {String(val).slice(0, 20)}
                    <button onClick={() => setFilter(key, '')} className="hover:text-red-500 transition-colors">
                      <FiX className="text-xs" />
                    </button>
                  </span>
                ))}
                <button onClick={resetFilters} className="text-xs text-gray-400 hover:text-red-500 px-2">Clear all</button>
              </div>
            )}

            {/* Product Grid */}
            {isLoading ? (
              <div className={cn('grid gap-4',
                view === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1')}>
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-soft">
                    <div className="aspect-square skeleton" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="h-3 skeleton rounded w-1/2" />
                      <div className="h-8 skeleton rounded-full mt-2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🌿</p>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No products found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters or search term</p>
                <button onClick={resetFilters} className="btn-primary px-8">Clear Filters</button>
              </div>
            ) : (
              <motion.div layout
                className={cn('grid gap-4',
                  view === 'grid' ? 'grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2')}>
                <AnimatePresence mode="popLayout">
                  {products.map((product, i) => (
                    <motion.div key={product._id} layout
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }} transition={{ delay: i * 0.02 }}>
                      <ProductCard product={product} compact={view === 'list'} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const p = Math.max(1, Math.min(page - 2, totalPages - 4)) + i;
                  return (
                    <button key={p} onClick={() => setPage(p)}
                      className={cn('w-9 h-9 rounded-lg text-sm font-medium transition-all',
                        page === p ? 'bg-primary-600 text-white shadow-green' : 'border border-gray-200 text-gray-600 hover:bg-gray-50')}>
                      {p}
                    </button>
                  );
                })}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium disabled:opacity-40 hover:bg-gray-50 transition-colors">
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-[160] lg:hidden"
              onClick={() => setIsSidebarOpen(false)} />
            <motion.div initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 30 }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-white z-[161] overflow-y-auto p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-gray-800">Filters</span>
                <button onClick={() => setIsSidebarOpen(false)}>
                  <FiX className="text-gray-500 text-xl" />
                </button>
              </div>
              <FilterSidebar filters={filters} setFilter={setFilter} onReset={resetFilters} />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ── Exported shell — wraps inner in Suspense ─── */
export default function ProductsClientPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-surface pt-20 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" />
      </div>
    }>
      <ProductsInner />
    </Suspense>
  );
}
