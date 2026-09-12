'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiEye } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

const FALLBACK = [
  { _id: '1', title: 'Villa Garden – Mumbai', category: 'villa-garden', image: { url: '/images/plant-placeholder.svg' } },
  { _id: '2', title: 'Terrace Garden – Pune', category: 'terrace-garden', image: { url: '/images/plant-placeholder.svg' } },
  { _id: '3', title: 'Farmhouse – Nashik', category: 'farmhouse', image: { url: '/images/plant-placeholder.svg' } },
  { _id: '4', title: 'Resort Garden – Goa', category: 'resort', image: { url: '/images/plant-placeholder.svg' } },
  { _id: '5', title: 'Office – Bangalore', category: 'office', image: { url: '/images/plant-placeholder.svg' } },
  { _id: '6', title: 'Indoor Plants Setup – Delhi', category: 'indoor', image: { url: '/images/plant-placeholder.svg' } },
];

const CATEGORY_LABELS: Record<string, string> = {
  'villa-garden': 'Villa Garden', terrace: 'Terrace Garden', farmhouse: 'Farmhouse',
  resort: 'Resort', office: 'Office Garden', indoor: 'Indoor Plants',
};

export default function GalleryPreview() {
  const { data } = useQuery({
    queryKey: ['gallery', 'home'],
    queryFn: () => api.get('/gallery/home').then(r => r.data.items),
    staleTime: 10 * 60 * 1000,
  });

  const items = (data?.length ? data : FALLBACK).slice(0, 6);

  return (
    <section className="py-20 bg-surface">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-10">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-tag">📸 Our Portfolio</span>
            <h2 className="section-heading">Transformations We&apos;ve Created</h2>
          </motion.div>
          <Link href="/gallery" className="btn-secondary shrink-0">
            Full Gallery <FiArrowRight />
          </Link>
        </div>

        {/* Masonry-style grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {items.map((item: any, i: number) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className={i === 0 ? 'row-span-2' : ''}
            >
              <Link href="/gallery" className="group relative block rounded-2xl overflow-hidden bg-gray-100 h-full min-h-[180px]">
                <Image
                  src={item.image?.url || item.image}
                  alt={item.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                  sizes="(max-width: 768px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="w-10 h-10 rounded-full bg-white/90 flex items-center justify-center">
                    <FiEye className="text-gray-700" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-semibold text-sm">{item.title}</p>
                  <p className="text-white/70 text-xs">{CATEGORY_LABELS[item.category] || item.category}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
