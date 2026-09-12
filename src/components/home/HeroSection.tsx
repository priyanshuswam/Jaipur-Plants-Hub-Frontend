'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { FiArrowRight, FiPlay, FiStar } from 'react-icons/fi';
import { FaLeaf, FaSeedling } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';

const SLIDES = [
  {
    id: 1,
    tag: 'Premium Nursery & Landscape',
    title: 'Transform Your Space Into',
    highlight: 'A Living Paradise',
    description: 'From premium rare plants to complete landscape design — we bring nature to your doorstep with expert care and passion.',
    cta: { label: 'Explore Plants', href: '/products' },
    ctaSecondary: { label: 'Book Consultation', href: '/query?type=consultation' },
    image: '/images/plant-placeholder.svg',
    badge: '🌿 500+ Premium Plants',
  },
  {
    id: 2,
    tag: 'Expert Landscape Design',
    title: 'Award-Winning Gardens',
    highlight: 'Crafted For You',
    description: 'Our expert designers transform villas, farmhouses, resorts, and offices into breathtaking green sanctuaries.',
    cta: { label: 'View Services', href: '/services' },
    ctaSecondary: { label: 'See Portfolio', href: '/gallery' },
    image: '/images/plant-placeholder.svg',
    badge: '🏆 200+ Projects Completed',
  },
  {
    id: 3,
    tag: 'Farmhouse & Terrace Gardens',
    title: 'Create Your Own',
    highlight: 'Green Oasis',
    description: 'Terrace gardens, vertical walls, indoor jungles — our experts design and install your dream garden anywhere.',
    cta: { label: 'Garden Design', href: '/garden-design' },
    ctaSecondary: { label: 'Get Quote', href: '/query?type=quote' },
    image: '/images/plant-placeholder.svg',
    badge: '⭐ 4.9/5 Customer Rating',
  },
];

// Floating leaf component
function FloatingLeaf({ delay, x, size }: { delay: number; x: string; size: number }) {
  return (
    <motion.div
      className="absolute top-0 pointer-events-none opacity-30"
      style={{ left: x }}
      initial={{ y: -100, rotate: 0, opacity: 0 }}
      animate={{ y: '110vh', rotate: 720, opacity: [0, 0.5, 0.3, 0] }}
      transition={{ duration: 10 + Math.random() * 5, delay, repeat: Infinity, repeatDelay: Math.random() * 8 }}
    >
      <FaLeaf style={{ fontSize: size, color: '#8BC34A' }} />
    </motion.div>
  );
}

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setCurrent(c => (c + 1) % SLIDES.length), 6000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const goTo = (i: number) => { setCurrent(i); startTimer(); };

  const slide = SLIDES[current];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-dark">
      {/* Background slides */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2 }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="hero-gradient-overlay absolute inset-0" />
        </motion.div>
      </AnimatePresence>

      {/* Floating Leaves */}
      {[12, 8, 16, 10].map((size, i) => (
        <FloatingLeaf key={i} delay={i * 2.5} x={`${15 + i * 20}%`} size={size} />
      ))}

      {/* Particle dots */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-white rounded-full opacity-30"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
            transition={{ duration: 3 + Math.random() * 3, repeat: Infinity, delay: Math.random() * 3 }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative container-custom pt-24 pb-16 flex flex-col justify-center min-h-screen">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.7 }}
              className="space-y-6"
            >
              {/* Tag */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/20"
              >
                <FaSeedling className="text-accent text-sm animate-float" />
                <span className="text-white/90 text-sm font-medium">{slide.tag}</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.05]"
              >
                {slide.title}
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-300 via-accent to-primary-200">
                  {slide.highlight}
                </span>
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-white/75 text-lg max-w-xl leading-relaxed"
              >
                {slide.description}
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex flex-wrap gap-4 items-center"
              >
                <Link href={slide.cta.href} className="btn-primary text-base px-8 py-4 shadow-green-lg">
                  {slide.cta.label} <FiArrowRight />
                </Link>
                <Link
                  href={slide.ctaSecondary.href}
                  className="flex items-center gap-2 px-6 py-4 text-white font-semibold rounded-full border-2 border-white/40 hover:bg-white/15 hover:border-white/60 transition-all duration-300"
                >
                  {slide.ctaSecondary.label}
                </Link>
                <button
                  onClick={() => setIsVideoOpen(true)}
                  className="flex items-center gap-2 text-white/80 hover:text-white transition-colors group"
                >
                  <span className="w-10 h-10 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center group-hover:bg-white/30 transition-all">
                    <FiPlay className="ml-0.5 text-sm" />
                  </span>
                  <span className="text-sm font-medium">Watch Our Story</span>
                </button>
              </motion.div>

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur border border-accent/30 rounded-full"
              >
                <FiStar className="text-yellow-400 text-sm" />
                <span className="text-white text-sm font-medium">{slide.badge}</span>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Slide indicators */}
        <div className="absolute bottom-10 left-0 right-0 container-custom flex items-center gap-3">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goTo(i)} className="group" aria-label={`Slide ${i + 1}`}>
              <motion.div
                className="h-1 rounded-full bg-white/40 overflow-hidden"
                animate={{ width: i === current ? 40 : 16 }}
                transition={{ duration: 0.3 }}
              >
                {i === current && (
                  <motion.div
                    className="h-full bg-white"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 6, ease: 'linear' }}
                  />
                )}
              </motion.div>
            </button>
          ))}
        </div>

        {/* Scroll cue */}
        <motion.div
          className="absolute bottom-10 right-0 container-custom flex justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col items-center gap-2 text-white/50">
            <span className="text-xs tracking-widest uppercase rotate-90">Scroll</span>
            <motion.div
              className="w-0.5 h-10 bg-gradient-to-b from-white/50 to-transparent"
              animate={{ scaleY: [0, 1, 0], originY: 0 }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </motion.div>
      </div>

      {/* Cards floating bottom right (desktop) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.8 }}
        className="absolute bottom-24 right-8 hidden xl:flex flex-col gap-3"
      >
        {[
          { label: 'Plants Delivered', value: '10,000+', icon: '🌿' },
          { label: 'Happy Customers', value: '1,200+', icon: '😊' },
        ].map((card) => (
          <div key={card.label} className="glass-card-white px-4 py-3 flex items-center gap-3 w-48 animate-float">
            <span className="text-2xl">{card.icon}</span>
            <div>
              <p className="text-gray-900 font-bold text-lg leading-none">{card.value}</p>
              <p className="text-gray-500 text-xs">{card.label}</p>
            </div>
          </div>
        ))}
      </motion.div>

      {/* Video Modal */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }}
              className="w-full max-w-4xl aspect-video bg-black rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                width="100%" height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
