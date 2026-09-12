'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiStar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import 'swiper/css';
import 'swiper/css/pagination';

const FALLBACK = [
  { _id: '1', customer: { name: 'Priya Sharma', designation: 'Homeowner', location: 'Mumbai', avatar: { url: 'https://i.pravatar.cc/100?img=47' } }, rating: 5, title: 'Absolutely stunning transformation!', content: 'Jaipur Plants Hub turned our boring backyard into a paradise. The team was professional and the results exceeded every expectation. Our guests always compliment the garden!', project: 'villa-garden' },
  { _id: '2', customer: { name: 'Rahul Mehta', designation: 'Resort Owner', location: 'Pune', avatar: { url: 'https://i.pravatar.cc/100?img=12' } }, rating: 5, title: 'Best investment for our resort', content: 'We hired Jaipur Plants Hub for our 5-star resort landscape. The design was creative, execution was flawless, and guests constantly ask about the beautiful gardens.', project: 'resort' },
  { _id: '3', customer: { name: 'Anita Patel', designation: 'IT Professional', location: 'Bangalore', avatar: { url: 'https://i.pravatar.cc/100?img=23' } }, rating: 5, title: 'Dream terrace garden!', content: 'My terrace was completely bare. In just 10 days, Jaipur Plants Hub transformed it into a lush green oasis. The irrigation system they installed is brilliant!', project: 'terrace-garden' },
  { _id: '4', customer: { name: 'Vikram Joshi', designation: 'Entrepreneur', location: 'Nashik', avatar: { url: 'https://i.pravatar.cc/100?img=68' } }, rating: 5, title: 'Plants delivered in perfect condition', content: 'Ordered 20+ plants for my farmhouse. Every single one arrived healthy, well-packaged, and exactly as described. The plant care guides were incredibly helpful.', project: 'other' },
  { _id: '5', customer: { name: 'Meera Nair', designation: 'Architect', location: 'Kochi', avatar: { url: 'https://i.pravatar.cc/100?img=44' } }, rating: 5, title: 'Outstanding landscape design service', content: 'As an architect, I have high standards. Jaipur Plants Hub matched and exceeded them. Their 3D design presentation was impressive and the execution was pixel-perfect.', project: 'office' },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map(s => (
        <FiStar key={s} className={`text-sm ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}`} />
      ))}
    </div>
  );
}

export default function TestimonialsSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const { data } = useQuery({
    queryKey: ['testimonials', 'featured'],
    queryFn: () => api.get('/testimonials/featured').then(r => r.data.testimonials),
    staleTime: 10 * 60 * 1000,
  });

  const testimonials = data?.length ? data : FALLBACK;

  return (
    <section className="py-20 bg-gradient-to-br from-dark to-dark-deep relative overflow-hidden">
      {/* BG mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="container-custom relative">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/10 text-primary-300 rounded-full text-sm font-semibold tracking-wide uppercase mb-4">
              ⭐ Testimonials
            </span>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight">
              What Our Customers Say
            </h2>
          </motion.div>

          {/* Navigation buttons */}
          <div className="flex gap-3">
            <button ref={prevRef} className="w-11 h-11 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition-all hover:border-primary-400">
              <FiChevronLeft className="text-lg" />
            </button>
            <button ref={nextRef} className="w-11 h-11 rounded-full border border-white/20 text-white hover:bg-white/10 flex items-center justify-center transition-all hover:border-primary-400">
              <FiChevronRight className="text-lg" />
            </button>
          </div>
        </div>

        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          pagination={{ clickable: true }}
          navigation={{ prevEl: prevRef.current, nextEl: nextRef.current }}
          onInit={(swiper) => {
            (swiper.params.navigation as any).prevEl = prevRef.current;
            (swiper.params.navigation as any).nextEl = nextRef.current;
            swiper.navigation.init();
            swiper.navigation.update();
          }}
          className="!pb-12"
        >
          {testimonials.map((t: any) => (
            <SwiperSlide key={t._id}>
              <div className="bg-white/8 backdrop-blur border border-white/10 rounded-2xl p-6 h-full flex flex-col hover:bg-white/12 transition-colors">
                <FaQuoteLeft className="text-primary-400 text-2xl mb-4 opacity-60" />

                <div className="mb-3">
                  <StarRating rating={t.rating} />
                </div>

                {t.title && (
                  <h4 className="text-white font-semibold mb-3 text-sm">{t.title}</h4>
                )}

                <p className="text-white/70 text-sm leading-relaxed flex-1 mb-5">
                  &quot;{t.content}&quot;
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-800 flex-shrink-0">
                    {t.customer?.avatar?.url ? (
                      <Image src={t.customer.avatar.url} alt={t.customer.name} width={40} height={40} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white font-bold text-sm">
                        {t.customer?.name?.[0]}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.customer?.name}</p>
                    <p className="text-primary-300 text-xs">{t.customer?.designation}{t.customer?.location ? ` · ${t.customer.location}` : ''}</p>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
