'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiCalendar, FiCheck } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatPrice, cn } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';

const CATEGORIES = [
  { value: '', label: 'All Services' },
  { value: 'landscape-design', label: 'Landscape Design' },
  { value: 'garden-maintenance', label: 'Maintenance' },
  { value: 'farmhouse-development', label: 'Farmhouse' },
  { value: 'terrace-garden', label: 'Terrace Garden' },
  { value: 'vertical-garden', label: 'Vertical Garden' },
  { value: 'consultation', label: 'Consultation' },
];

export default function ServicesClientPage() {
  const [cat, setCat] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['services', cat],
    queryFn: () => api.get('/services', { params: { category: cat || undefined } }).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const services = data?.services || [];

  const getPrice = (s: any) => {
    if (s.pricingType === 'per_sqft') return `₹${s.basePrice}/sq ft`;
    if (s.pricingType === 'custom') return 'Get Quote';
    const base = s.basePrice || s.pricingTiers?.[0]?.price || 0;
    return `Starting ₹${base.toLocaleString('en-IN')}`;
  };

  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Hero */}
      <div className="bg-gradient-primary py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        </div>
        <div className="container-custom relative text-center">
          <Breadcrumb items={[{ label: 'Services' }]} light />
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-display text-4xl lg:text-5xl font-bold text-white mt-4 mb-4"
          >
            Professional Garden Services
          </motion.h1>
          <p className="text-primary-100 text-lg max-w-2xl mx-auto">
            From design conception to full installation — we transform your space into a living paradise with expert care and passion.
          </p>
          <Link href="/query?type=consultation" className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-7 py-3.5 rounded-full mt-6 hover:bg-primary-50 transition-all shadow-soft">
            <FiCalendar /> Free Consultation
          </Link>
        </div>
      </div>

      <div className="container-custom py-10">
        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2 mb-8">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setCat(c.value)}
              className={cn(
                'px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all flex-shrink-0',
                cat === c.value ? 'bg-primary-600 text-white shadow-green' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300'
              )}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Services Grid */}
        {isLoading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="rounded-2xl overflow-hidden bg-white shadow-soft">
                <div className="h-52 skeleton" />
                <div className="p-5 space-y-2">
                  <div className="h-5 skeleton rounded w-3/4" />
                  <div className="h-4 skeleton rounded w-full" />
                  <div className="h-4 skeleton rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">🌿</p>
            <p className="text-gray-500">No services found for this category</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service: any, i: number) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden group hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={service.thumbnail || '/images/plant-placeholder.svg'}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent" />
                  <div className="absolute top-3 left-3">
                    <span className="text-2xl">{service.icon || '🌿'}</span>
                  </div>
                  {service.isPopular && (
                    <span className="absolute top-3 right-3 badge bg-amber-500 text-white text-[10px]">Popular</span>
                  )}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    {service.bookingCount > 0 && (
                      <span className="text-white/80 text-xs flex items-center gap-1">
                        <FiCalendar className="text-xs" /> {service.bookingCount}+ bookings
                      </span>
                    )}
                    {service.ratingsCount > 0 && (
                      <span className="flex items-center gap-1 text-white text-xs">
                        <FiStar className="text-amber-400 fill-amber-400 text-xs" />
                        {service.ratingsAverage}
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-primary-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed mb-3 line-clamp-2">{service.shortDescription}</p>

                  {/* Included features */}
                  {service.includedFeatures?.length > 0 && (
                    <ul className="space-y-1 mb-4">
                      {service.includedFeatures.slice(0, 3).map((f: string) => (
                        <li key={f} className="flex items-center gap-2 text-xs text-gray-500">
                          <FiCheck className="text-primary-500 flex-shrink-0" /> {f}
                        </li>
                      ))}
                    </ul>
                  )}

                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div>
                      <p className="text-xs text-gray-400">Starting from</p>
                      <p className="font-bold text-primary-700 text-lg">{getPrice(service)}</p>
                    </div>
                    <Link
                      href={`/services/${service.slug}`}
                      className="flex items-center gap-1.5 bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-primary-700 transition-colors"
                    >
                      View Details <FiArrowRight className="text-xs" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Why Choose Us */}
        <div className="mt-16 bg-white rounded-3xl shadow-soft p-8 lg:p-12">
          <h2 className="font-display text-2xl font-bold text-gray-900 text-center mb-8">Why Choose Jaipur Plants Hub?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🏆', title: '15+ Years Experience', desc: 'Trusted by 1,200+ happy customers across India' },
              { icon: '🎨', title: 'Custom Designs', desc: 'Every project is uniquely designed for your space' },
              { icon: '🌱', title: 'Quality Plants', desc: 'Premium nursery-grown plants with health guarantee' },
              { icon: '🔧', title: 'End-to-End Service', desc: 'From design to installation to maintenance' },
            ].map(w => (
              <div key={w.title} className="text-center">
                <span className="text-4xl block mb-3">{w.icon}</span>
                <h3 className="font-semibold text-gray-800 mb-1">{w.title}</h3>
                <p className="text-gray-500 text-sm">{w.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/query?type=consultation" className="btn-primary px-8 py-3.5 inline-flex items-center gap-2">
              <FiCalendar /> Book Free Consultation
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
