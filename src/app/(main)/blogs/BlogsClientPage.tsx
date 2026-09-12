'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiSearch, FiArrowRight, FiClock, FiUser, FiTag } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';

const CATEGORIES = [
  { value: '', label: 'All Posts' },
  { value: 'plant-care', label: 'Plant Care' },
  { value: 'gardening-tips', label: 'Gardening Tips' },
  { value: 'landscaping', label: 'Landscaping' },
  { value: 'indoor-plants', label: 'Indoor Plants' },
  { value: 'outdoor-plants', label: 'Outdoor Plants' },
  { value: 'seasonal-guide', label: 'Seasonal Guide' },
  { value: 'diy', label: 'DIY Projects' },
  { value: 'success-stories', label: 'Success Stories' },
];

export default function BlogsClientPage() {
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['blogs', category, search, page],
    queryFn: () => api.get('/blogs', { params: { category: category || undefined, search: search || undefined, page, limit: 9 } }).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const blogs = data?.blogs || [];
  const meta = data?.meta || {};
  const featured = blogs[0];
  const rest = blogs.slice(1);

  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-10 text-center">
          <Breadcrumb items={[{ label: 'Blog' }]} className="justify-center mb-4" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Garden Wisdom & Inspiration
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto">
            Expert tips, care guides, and landscape design ideas from our horticulturists.
          </p>
          {/* Search */}
          <div className="relative max-w-md mx-auto mt-6">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search articles..."
              className="w-full pl-11 pr-5 py-3.5 rounded-2xl border border-gray-200 focus:outline-none focus:border-primary-400 bg-white shadow-soft text-sm"
            />
          </div>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Category Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-10">
          {CATEGORIES.map(c => (
            <button key={c.value} onClick={() => { setCategory(c.value); setPage(1); }}
              className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                category === c.value ? 'bg-primary-600 text-white shadow-green' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}>
              {c.label}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-soft">
                <div className="h-48 skeleton" />
                <div className="p-5 space-y-2">
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded w-full" />
                  <div className="h-4 skeleton rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-5xl mb-4">📝</p>
            <p className="text-gray-500">No articles found</p>
            <button onClick={() => { setCategory(''); setSearch(''); }} className="btn-primary mt-4 inline-flex text-sm py-2.5 px-6">Clear Filters</button>
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && page === 1 && !search && !category && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
                <Link href={`/blogs/${featured.slug}`} className="group grid lg:grid-cols-2 gap-6 bg-white rounded-3xl shadow-soft overflow-hidden hover:shadow-soft-xl transition-all">
                  <div className="relative h-64 lg:h-auto overflow-hidden">
                    <Image src={featured.featuredImage?.url} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 1024px) 100vw, 50vw" />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent" />
                    <span className="absolute top-4 left-4 badge bg-primary-600 text-white capitalize">{featured.category?.replace(/-/g, ' ')}</span>
                  </div>
                  <div className="p-6 lg:p-8 flex flex-col justify-center">
                    <span className="text-xs text-primary-600 font-semibold uppercase tracking-wide mb-2">Featured Article</span>
                    <h2 className="font-display text-2xl lg:text-3xl font-bold text-gray-900 mb-3 group-hover:text-primary-700 transition-colors leading-tight">{featured.title}</h2>
                    <p className="text-gray-500 leading-relaxed mb-4 line-clamp-3">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1"><FiUser /> {featured.author?.firstName} {featured.author?.lastName}</span>
                      <span className="flex items-center gap-1"><FiClock /> {featured.readingTime} min read</span>
                      {featured.publishedAt && <span>{formatDate(featured.publishedAt, { dateStyle: 'medium' })}</span>}
                    </div>
                    <span className="inline-flex items-center gap-2 text-primary-700 font-semibold text-sm group-hover:gap-3 transition-all">
                      Read Article <FiArrowRight />
                    </span>
                  </div>
                </Link>
              </motion.div>
            )}

            {/* Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {(page === 1 && !search && !category ? rest : blogs).map((post: any, i: number) => (
                <motion.article key={post._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  className="bg-white rounded-2xl shadow-soft overflow-hidden group hover:shadow-soft-xl transition-all">
                  <Link href={`/blogs/${post.slug}`} className="block relative h-48 overflow-hidden">
                    <Image src={post.featuredImage?.url} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                    <span className="absolute top-3 left-3 badge bg-primary-700 text-white text-[10px] capitalize">{post.category?.replace(/-/g, ' ')}</span>
                  </Link>
                  <div className="p-5">
                    <div className="flex items-center gap-3 text-xs text-gray-400 mb-2.5">
                      <span className="flex items-center gap-1"><FiUser className="text-xs" /> {post.author?.firstName}</span>
                      <span className="flex items-center gap-1"><FiClock className="text-xs" /> {post.readingTime}m</span>
                      {post.publishedAt && <span>{formatDate(post.publishedAt, { dateStyle: 'medium' })}</span>}
                    </div>
                    <Link href={`/blogs/${post.slug}`}>
                      <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors mb-2">{post.title}</h3>
                    </Link>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{post.excerpt}</p>
                    <Link href={`/blogs/${post.slug}`} className="inline-flex items-center gap-1.5 text-primary-700 text-sm font-medium hover:gap-2.5 transition-all">
                      Read More <FiArrowRight className="text-xs" />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>

            {meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-10">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">← Previous</button>
                {Array.from({ length: Math.min(5, meta.totalPages) }, (_, i) => i + 1).map(p => (
                  <button key={p} onClick={() => setPage(p)} className={cn('w-10 h-10 rounded-xl text-sm font-medium transition-all', page === p ? 'bg-primary-600 text-white shadow-green' : 'border border-gray-200 hover:bg-gray-50')}>{p}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50 transition-colors">Next →</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
