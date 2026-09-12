'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';
import Link from 'next/link';

const CATS = [
  { value: '', label: 'All Projects' },
  { value: 'villa-garden', label: 'Villa Gardens' },
  { value: 'farmhouse', label: 'Farmhouse' },
  { value: 'resort', label: 'Resort & Hotel' },
  { value: 'terrace-garden', label: 'Terrace Gardens' },
  { value: 'vertical-garden', label: 'Vertical Gardens' },
  { value: 'indoor', label: 'Indoor Plants' },
  { value: 'before-after', label: 'Before & After' },
];

export default function GalleryPage() {
  const [category, setCategory] = useState('');
  const [lightbox, setLightbox] = useState<{ items: any[]; index: number } | null>(null);
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['gallery', category, page],
    queryFn: () => api.get('/gallery', { params: { category: category || undefined, page, limit: 24 } }).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const items = data?.items || [];
  const meta = data?.meta || {};

  const openLightbox = (index: number) => setLightbox({ items, index });
  const closeLightbox = () => setLightbox(null);
  const prev = () => setLightbox(l => l && { ...l, index: (l.index - 1 + l.items.length) % l.items.length });
  const next = () => setLightbox(l => l && { ...l, index: (l.index + 1) % l.items.length });

  const currentItem = lightbox ? lightbox.items[lightbox.index] : null;

  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Hero */}
      <div className="bg-gradient-primary py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -right-20 w-80 h-80 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white rounded-full blur-3xl" />
        </div>
        <div className="container-custom relative">
          <Breadcrumb items={[{ label: 'Gallery' }]} light className="justify-center mb-4" />
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">Our Project Portfolio</h1>
          <p className="text-primary-200 max-w-xl mx-auto">Stunning transformations created by our expert landscape designers.</p>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {CATS.map(c => (
            <button key={c.value} onClick={() => { setCategory(c.value); setPage(1); }}
              className={cn('px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap flex-shrink-0 transition-all',
                category === c.value ? 'bg-primary-600 text-white shadow-green' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}>
              {c.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square skeleton rounded-2xl" />)}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">📸</p>
            <p className="text-gray-500">No photos in this category yet</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              <AnimatePresence>
                {items.map((item: any, i: number) => (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.03 }}
                    className={cn('relative overflow-hidden rounded-2xl cursor-pointer group bg-gray-100', i % 7 === 0 ? 'row-span-2' : '')}
                    style={{ aspectRatio: i % 7 === 0 ? 'auto' : '1' }}
                    onClick={() => openLightbox(i)}
                  >
                    <Image
                      src={item.image?.url || item.image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(max-width: 640px) 50vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center p-3">
                        <FiEye className="text-white text-2xl mx-auto mb-1" />
                        <p className="text-white text-xs font-medium line-clamp-2">{item.title}</p>
                      </div>
                    </div>
                    {item.isBeforeAfter && (
                      <span className="absolute top-2 left-2 badge bg-primary-600 text-white text-[10px]">Before/After</span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {meta.totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">← Prev</button>
                <span className="px-4 py-2.5 text-sm text-gray-500">{page}/{meta.totalPages}</span>
                <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm disabled:opacity-40 hover:bg-gray-50">Next →</button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && currentItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] bg-black/95 flex items-center justify-center"
            onClick={closeLightbox}
          >
            <button onClick={closeLightbox} className="absolute top-5 right-5 text-white/70 hover:text-white z-10 p-2">
              <FiX className="text-2xl" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); prev(); }} className="absolute left-4 text-white/70 hover:text-white z-10 p-3 rounded-full hover:bg-white/10">
              <FiChevronLeft className="text-3xl" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); next(); }} className="absolute right-4 text-white/70 hover:text-white z-10 p-3 rounded-full hover:bg-white/10">
              <FiChevronRight className="text-3xl" />
            </button>

            <motion.div
              key={lightbox.index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative max-w-4xl max-h-[85vh] w-full mx-8"
              onClick={e => e.stopPropagation()}
            >
              <Image
                src={currentItem.image?.url || currentItem.image}
                alt={currentItem.title}
                width={1200}
                height={800}
                className="rounded-2xl object-contain max-h-[85vh] w-full"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 p-4 rounded-b-2xl">
                <p className="text-white font-semibold">{currentItem.title}</p>
                {currentItem.description && <p className="text-white/70 text-sm">{currentItem.description}</p>}
                <p className="text-white/50 text-xs mt-1">{lightbox.index + 1} / {lightbox.items.length}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CTA */}
      <div className="container-custom pb-16">
        <div className="bg-gradient-primary rounded-3xl p-8 text-center">
          <h2 className="font-display text-2xl font-bold text-white mb-2">Ready to Transform Your Space?</h2>
          <p className="text-primary-200 mb-5">Let our expert designers create your dream garden.</p>
          <Link href="/query?type=consultation" className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-7 py-3 rounded-full hover:bg-primary-50 transition-all">
            Book Free Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
