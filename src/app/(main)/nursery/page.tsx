import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { FiArrowRight } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Our Nursery – Premium Plant Collection',
  description: 'Visit or shop online from our premium nursery with 800+ plant varieties. Expert guidance included.',
};

const HIGHLIGHTS = [
  { icon: '🌿', title: '800+ Varieties', desc: 'Indoor, outdoor, rare, and exotic plants all under one roof.' },
  { icon: '🏆', title: 'Certified Healthy', desc: 'Every plant inspected by certified horticulturists before sale.' },
  { icon: '🚚', title: 'Pan-India Delivery', desc: 'Safe, express delivery to 500+ cities across India.' },
  { icon: '💬', title: 'Expert Guidance', desc: 'Free plant care consultation with every purchase.' },
];

const COLLECTIONS = [
  { name: 'Air-Purifying Plants', count: 45, img: '/images/plant-placeholder.svg', href: '/products?tags=air-purifier' },
  { name: 'Rare & Exotic', count: 30, img: '/images/plant-placeholder.svg', href: '/products?tags=rare' },
  { name: 'Easy Care Beginners', count: 60, img: '/images/plant-placeholder.svg', href: '/products?difficulty=easy' },
  { name: 'Pet-Friendly Plants', count: 35, img: '/images/plant-placeholder.svg', href: '/products?toxicity=non-toxic' },
];

export default function NurseryPage() {
  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Hero */}
      <div className="relative py-24 bg-dark overflow-hidden">
        <Image src="/images/plant-placeholder.svg" alt="Nursery" fill className="object-cover opacity-25" />
        <div className="container-custom relative text-center">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-primary-200 text-sm font-medium mb-4">🌱 Premium Plant Nursery Since 2009</span>
          <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-4">GreenScape Nursery</h1>
          <p className="text-primary-100 text-xl max-w-2xl mx-auto mb-8">Over 800 varieties of premium plants, carefully nurtured and delivered to your doorstep.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/products" className="btn-primary text-base px-8 py-4 shadow-green-lg flex items-center gap-2">Shop All Plants <FiArrowRight /></Link>
            <Link href="/contact" className="text-white border-2 border-white/40 px-7 py-4 rounded-full hover:bg-white/15 transition-all font-semibold">Visit Us In Person</Link>
          </div>
        </div>
      </div>

      {/* Highlights */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {HIGHLIGHTS.map((h, i) => (
              <div key={h.title} className="text-center p-6 rounded-2xl bg-primary-50 hover:bg-primary-100 transition-colors">
                <span className="text-4xl block mb-3">{h.icon}</span>
                <h3 className="font-semibold text-gray-800 mb-1">{h.title}</h3>
                <p className="text-gray-500 text-sm">{h.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Collections */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-10">
            <span className="section-tag">🌸 Curated Collections</span>
            <h2 className="section-heading">Shop by Collection</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {COLLECTIONS.map((col) => (
              <Link key={col.name} href={col.href} className="group block bg-white rounded-2xl shadow-soft overflow-hidden hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-44 overflow-hidden">
                  <Image src={col.img} alt={col.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent" />
                  <p className="absolute bottom-3 left-3 text-white font-semibold">{col.name}</p>
                  <p className="absolute bottom-3 right-3 text-white/80 text-xs">{col.count}+ plants</p>
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/products" className="btn-primary px-9 py-3.5 inline-flex items-center gap-2">Browse All 800+ Plants <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* Visit Us */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-primary rounded-3xl p-8 lg:p-12 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1">
              <h2 className="font-display text-2xl font-bold text-white mb-3">Visit Our Nursery</h2>
              <p className="text-primary-200 mb-4">Come see our collection in person. Our experts will help you find the perfect plants for your space.</p>
              <div className="space-y-2 text-primary-100 text-sm">
                <p>📍 123 Garden Street, Green City, Maharashtra – 400001</p>
                <p>🕐 Mon–Sat: 9:00 AM – 6:00 PM</p>
                <p>📞 +91 98765 43210</p>
              </div>
            </div>
            <div className="flex gap-4 flex-shrink-0">
              <Link href="/contact" className="bg-white text-primary-800 font-semibold px-6 py-3 rounded-full hover:bg-primary-50 transition-all">Get Directions</Link>
              <Link href="/products" className="border-2 border-white/40 text-white font-semibold px-6 py-3 rounded-full hover:bg-white/15 transition-all">Shop Online</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
