'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

const FALLBACK = [
  { _id: '1', name: 'Indoor Plants', slug: 'indoor-plants', icon: '🪴', color: '#4CAF50', productCount: 120,
    image: { url: '/images/plant-placeholder.svg' } },
  { _id: '2', name: 'Outdoor Plants', slug: 'outdoor-plants', icon: '🌳', color: '#2E7D32', productCount: 95,
    image: { url: '/images/plant-placeholder.svg' } },
  { _id: '3', name: 'Flowering Plants', slug: 'flowering-plants', icon: '🌸', color: '#E91E63', productCount: 80,
    image: { url: '/images/plant-placeholder.svg' } },
  { _id: '4', name: 'Succulents & Cacti', slug: 'succulents-cacti', icon: '🌵', color: '#8BC34A', productCount: 60,
    image: { url: '/images/plant-placeholder.svg' } },
  { _id: '5', name: 'Fruit Plants', slug: 'fruit-plants', icon: '🍋', color: '#FF9800', productCount: 45,
    image: { url: '/images/plant-placeholder.svg' } },
  { _id: '6', name: 'Herbal & Medicinal', slug: 'herbal-medicinal', icon: '🌿', color: '#009688', productCount: 55,
    image: { url: '/images/plant-placeholder.svg' } },
];

export default function FeaturedCategories() {
  const { data } = useQuery({
    queryKey: ['categories', 'home'],
    queryFn: () => api.get('/categories', { params: { showOnHome: true, active: true } }).then(r => r.data.categories),
    staleTime: 5 * 60 * 1000,
  });

  const categories = (data?.length ? data : FALLBACK).slice(0, 6);

  return (
    <section className="py-20 bg-surface">
      <div className="container-custom">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="section-tag">🌱 Browse by Category</span>
          <h2 className="section-heading mb-4">Find Your Perfect Plant</h2>
          <p className="section-subheading mx-auto">
            Explore our curated collection of 800+ plants across all categories
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat: any, i: number) => (
            <motion.div
              key={cat._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
            >
              <Link
                href={`/categories/${cat.slug}`}
                className="group block rounded-2xl overflow-hidden bg-white shadow-soft hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={cat.image?.url || `/images/plant-placeholder.svg`}
                    alt={cat.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div
                    className="absolute inset-0 opacity-40 group-hover:opacity-50 transition-opacity"
                    style={{ background: `linear-gradient(135deg, ${cat.color || '#2E7D32'}88, ${cat.color || '#2E7D32'}22)` }}
                  />
                  <span className="absolute top-3 left-3 text-2xl">{cat.icon || '🌿'}</span>
                </div>

                {/* Info */}
                <div className="p-3">
                  <h3 className="font-semibold text-gray-800 text-sm group-hover:text-primary-700 transition-colors line-clamp-1">
                    {cat.name}
                  </h3>
                  <p className="text-gray-400 text-xs mt-0.5">{cat.productCount || 0}+ plants</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/products" className="btn-ghost text-primary-700 hover:bg-primary-50 font-semibold">
            View All Categories <FiArrowRight className="inline ml-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
