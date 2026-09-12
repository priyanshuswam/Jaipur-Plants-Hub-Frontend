'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiCalendar, FiCheck, FiArrowRight, FiStar, FiClock, FiUsers } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatPrice, cn } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';
import { PageLoader } from '@/components/common/LoadingSpinner';
import BookingModal from '@/components/service/BookingModal';

export default function ServiceDetailPage() {
  const params = useParams();
  const [showBooking, setShowBooking] = useState(false);
  const [selectedTier, setSelectedTier] = useState(0);

  const { data, isLoading } = useQuery({
    queryKey: ['service', params.slug],
    queryFn: () => api.get(`/services/${params.slug}`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const service = data?.service;

  if (isLoading) return <PageLoader />;
  if (!service) return (
    <div className="min-h-screen pt-24 text-center">
      <p className="text-gray-400">Service not found</p>
      <Link href="/services" className="btn-primary mt-4 inline-flex">Back to Services</Link>
    </div>
  );

  const getPrice = () => {
    if (service.pricingType === 'per_sqft') return `₹${service.basePrice}/sq ft`;
    if (service.pricingType === 'custom') return 'Custom Quote';
    if (service.pricingTiers?.length > 0) return `₹${service.pricingTiers[selectedTier]?.price?.toLocaleString('en-IN')}`;
    return formatPrice(service.basePrice || 0);
  };

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Breadcrumb items={[{ label: 'Services', href: '/services' }, { label: service.name }]} />
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image */}
            <div className="relative h-80 rounded-3xl overflow-hidden shadow-soft-lg">
              <Image
                src={service.thumbnail || service.images?.[0]?.url || '/images/plant-placeholder.svg'}
                alt={service.name}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent" />
              <div className="absolute bottom-6 left-6">
                <span className="text-4xl">{service.icon}</span>
                <h1 className="font-display text-3xl font-bold text-white mt-2">{service.name}</h1>
                {service.ratingsCount > 0 && (
                  <div className="flex items-center gap-2 mt-1">
                    <FiStar className="text-amber-400 fill-amber-400 text-sm" />
                    <span className="text-white text-sm">{service.ratingsAverage} ({service.ratingsCount} reviews)</span>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="font-semibold text-gray-800 text-xl mb-4">About This Service</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line">{service.description}</p>
            </div>

            {/* What's Included */}
            {service.includedFeatures?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-semibold text-gray-800 text-xl mb-4">What&apos;s Included</h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {service.includedFeatures.map((f: string) => (
                    <div key={f} className="flex items-center gap-3">
                      <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="text-primary-600 text-xs" />
                      </div>
                      <span className="text-sm text-gray-700">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Process Steps */}
            {service.process?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-semibold text-gray-800 text-xl mb-6">Our Process</h2>
                <div className="space-y-4">
                  {service.process.map((step: any, i: number) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center flex-shrink-0 text-white font-bold text-sm">
                        {step.step}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{step.title}</p>
                        <p className="text-sm text-gray-500 mt-0.5">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Portfolio gallery */}
            {service.images?.length > 1 && (
              <div className="bg-white rounded-2xl shadow-soft p-6">
                <h2 className="font-semibold text-gray-800 text-xl mb-4">Our Work</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {service.images.slice(1).map((img: any, i: number) => (
                    <div key={i} className="aspect-square rounded-xl overflow-hidden">
                      <Image src={img.url} alt={img.title || `Work ${i + 1}`} width={200} height={200}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right: Booking Card */}
          <div>
            <div className="sticky top-24 space-y-4">
              {/* Pricing Card */}
              <div className="bg-white rounded-2xl shadow-soft-lg p-6 border border-primary-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs text-gray-400">Starting from</p>
                    <p className="font-display text-3xl font-bold text-primary-700">{getPrice()}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1 text-sm text-gray-400">
                    {service.duration && (
                      <span className="flex items-center gap-1"><FiClock className="text-xs" /> {service.duration}</span>
                    )}
                    {service.bookingCount > 0 && (
                      <span className="flex items-center gap-1"><FiUsers className="text-xs" /> {service.bookingCount}+ booked</span>
                    )}
                  </div>
                </div>

                {/* Pricing Tiers */}
                {service.pricingTiers?.length > 0 && (
                  <div className="space-y-2 mb-4">
                    <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Select Package</p>
                    {service.pricingTiers.map((tier: any, i: number) => (
                      <button
                        key={i}
                        onClick={() => setSelectedTier(i)}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-xl border-2 text-sm transition-all',
                          selectedTier === i ? 'border-primary-600 bg-primary-50' : 'border-gray-100 hover:border-gray-200'
                        )}
                      >
                        <div className="text-left">
                          <p className={cn('font-semibold', selectedTier === i ? 'text-primary-700' : 'text-gray-700')}>{tier.name}</p>
                          {tier.duration && <p className="text-xs text-gray-400">{tier.duration}</p>}
                        </div>
                        <p className={cn('font-bold', selectedTier === i ? 'text-primary-700' : 'text-gray-600')}>
                          ₹{tier.price?.toLocaleString('en-IN')}
                        </p>
                      </button>
                    ))}
                  </div>
                )}

                {service.isBookable ? (
                  <button
                    onClick={() => setShowBooking(true)}
                    className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 text-base"
                  >
                    <FiCalendar /> Book Consultation
                  </button>
                ) : (
                  <Link href="/contact" className="btn-primary w-full py-3.5 text-center flex items-center justify-center gap-2">
                    Contact for Booking
                  </Link>
                )}

                <p className="text-xs text-gray-400 text-center mt-3">Free site visit included • No hidden charges</p>
              </div>

              {/* CTA to enquiry */}
              <div className="bg-primary-50 rounded-2xl p-5">
                <p className="font-semibold text-primary-800 text-sm mb-2">Have a custom requirement?</p>
                <p className="text-primary-600 text-xs mb-3">Tell us about your project and we&apos;ll create a custom plan.</p>
                <Link href={`/query?type=quote&service=${service.name}`}
                  className="text-primary-700 text-sm font-semibold hover:underline flex items-center gap-1">
                  Get Custom Quote <FiArrowRight className="text-xs" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal service={service} onClose={() => setShowBooking(false)} />
      )}
    </div>
  );
}
