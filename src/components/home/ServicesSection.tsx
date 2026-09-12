'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiStar, FiCalendar } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatPrice } from '@/lib/utils';

const FALLBACK_SERVICES = [
  { _id: '1', name: 'Villa Garden Design', slug: 'villa-garden-design', shortDescription: 'Transform your villa into a lush green paradise.', icon: '🏡', thumbnail: '/images/plant-placeholder.svg', basePrice: 15000, pricingType: 'tiered', bookingCount: 48 },
  { _id: '2', name: 'Terrace Garden', slug: 'terrace-garden-setup', shortDescription: 'Convert your bare terrace into a stunning garden.', icon: '🌿', thumbnail: '/images/plant-placeholder.svg', basePrice: 350, pricingType: 'per_sqft', bookingCount: 62 },
  { _id: '3', name: 'Farmhouse Development', slug: 'farmhouse-garden-development', shortDescription: 'Complete farmhouse landscape with orchards & gardens.', icon: '🚜', thumbnail: '/images/plant-placeholder.svg', basePrice: 50000, pricingType: 'custom', bookingCount: 30 },
  { _id: '4', name: 'Garden Maintenance', slug: 'garden-maintenance', shortDescription: 'Regular professional care for your existing garden.', icon: '✂️', thumbnail: '/images/plant-placeholder.svg', basePrice: 1500, pricingType: 'tiered', bookingCount: 120 },
];

export default function ServicesSection() {
  const { data } = useQuery({
    queryKey: ['services', 'featured'],
    queryFn: () => api.get('/services/featured', { params: { limit: 4 } }).then(r => r.data.services),
    staleTime: 5 * 60 * 1000,
  });

  const services = (data?.length ? data : FALLBACK_SERVICES);

  const getPrice = (service: any) => {
    if (service.pricingType === 'per_sqft') return `₹${service.basePrice}/sq ft`;
    if (service.pricingType === 'custom') return 'Custom Quote';
    if (service.pricingType === 'tiered') return `Starts ₹${(service.basePrice || service.pricingTiers?.[0]?.price || 0).toLocaleString()}`;
    return formatPrice(service.basePrice || 0);
  };

  return (
    <section className="py-20 bg-surface relative overflow-hidden">
      {/* BG decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-100 rounded-full opacity-40 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-tag">🌳 Professional Services</span>
            <h2 className="section-heading mb-3">Expert Landscape Solutions</h2>
            <p className="text-gray-500 max-w-md">From design consultation to complete installation, we handle everything with passion and expertise.</p>
          </motion.div>
          <Link href="/services" className="btn-secondary shrink-0">
            All Services <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service: any, i: number) => (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link
                href={`/services/${service.slug}`}
                className="group block bg-white rounded-2xl overflow-hidden shadow-soft hover:shadow-soft-xl transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={service.thumbnail}
                    alt={service.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-2xl">{service.icon}</span>
                  <div className="absolute bottom-3 left-3 right-3">
                    <p className="text-white/80 text-xs flex items-center gap-1">
                      <FiCalendar className="text-xs" /> {service.bookingCount}+ bookings
                    </p>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 mb-1.5 group-hover:text-primary-700 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-gray-500 text-sm leading-snug mb-3 line-clamp-2">
                    {service.shortDescription}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-primary-700 font-bold text-sm">{getPrice(service)}</span>
                    <span className="text-primary-600 text-xs font-medium flex items-center gap-1 group-hover:gap-2 transition-all">
                      Book Now <FiArrowRight className="text-xs" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 bg-gradient-primary rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center justify-between gap-6"
        >
          <div>
            <h3 className="font-display text-2xl lg:text-3xl font-bold text-white mb-2">
              Not sure what you need?
            </h3>
            <p className="text-primary-200 max-w-lg">
              Book a free 30-minute consultation with our expert designers. We&apos;ll help you create the perfect garden plan.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/query?type=consultation"
              className="px-6 py-3.5 bg-white text-primary-800 font-semibold rounded-full hover:bg-primary-50 transition-all shadow-soft flex items-center gap-2"
            >
              <FiCalendar /> Free Consultation
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
