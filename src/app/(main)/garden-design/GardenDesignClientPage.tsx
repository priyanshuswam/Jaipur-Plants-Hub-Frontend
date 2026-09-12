'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheck, FiCalendar, FiStar } from 'react-icons/fi';
import Breadcrumb from '@/components/common/Breadcrumb';

const DESIGN_TYPES = [
  { icon: '🏡', title: 'Villa Garden Design', desc: 'Complete landscape transformation for residential villas with lush lawns, water features, and themed gardens.', price: '₹15,000+', img: '/images/plant-placeholder.svg' },
  { icon: '🏨', title: 'Resort & Hotel Gardens', desc: 'Grand landscape designs that enhance guest experience with tropical gardens, poolside greenery, and walkways.', price: '₹50,000+', img: '/images/plant-placeholder.svg' },
  { icon: '🏢', title: 'Office & Corporate', desc: 'Professional green spaces that boost employee productivity and create impressive entrances for clients.', price: '₹25,000+', img: '/images/plant-placeholder.svg' },
  { icon: '🌿', title: 'Terrace & Balcony', desc: 'Transform unused terraces into beautiful gardens with the right plants, planters, and irrigation.', price: '₹8,000+', img: '/images/plant-placeholder.svg' },
  { icon: '🧱', title: 'Vertical Gardens', desc: 'Stunning living walls that maximize green space in small areas for homes and offices.', price: '₹12,000+', img: '/images/plant-placeholder.svg' },
  { icon: '🌾', title: 'Farmhouse Development', desc: 'End-to-end farmhouse landscape with orchards, vegetable patches, flower gardens, and seating.', price: '₹50,000+', img: '/images/plant-placeholder.svg' },
];

const PROCESS = [
  { step: 1, icon: '📋', title: 'Initial Consultation', desc: 'Free 30-minute call to understand your vision, requirements, and budget.' },
  { step: 2, icon: '🔍', title: 'Site Visit & Survey', desc: 'Our designer visits your property to assess the space and take measurements.' },
  { step: 3, icon: '🎨', title: '3D Design Proposal', desc: 'Receive a detailed 3D visualization and plant selection within 5 working days.' },
  { step: 4, icon: '✅', title: 'Design Approval', desc: 'Review the design, suggest changes, and finalize the plan with a quotation.' },
  { step: 5, icon: '🚜', title: 'Installation', desc: 'Expert team executes the project with precision and premium quality materials.' },
  { step: 6, icon: '🌱', title: 'Handover & Support', desc: 'Complete handover with plant care guide and 1-year maintenance guidance.' },
];

const TESTIMONIALS = [
  { name: 'Amit Kapoor', project: 'Villa Garden – Mumbai', rating: 5, text: 'The transformation was beyond my imagination. Jaipur Plants Hub delivered a world-class garden in just 2 weeks!' },
  { name: 'Sonia Gupta', project: 'Terrace Garden – Pune', rating: 5, text: 'My bare terrace is now my favorite place in the world. The team was professional and the plants are thriving!' },
  { name: 'Rahul Verma', project: 'Resort – Lonavala', rating: 5, text: 'Our resort guests always compliment the beautiful gardens. Best investment we made for the property.' },
];

export default function GardenDesignClientPage() {
  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Hero */}
      <div className="relative min-h-[55vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/plant-placeholder.svg" alt="Garden Design" fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/60 to-transparent" />
        </div>
        <div className="container-custom relative py-16">
          <Breadcrumb items={[{ label: 'Garden Design' }]} light />
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} className="max-w-xl mt-4">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-primary-200 text-sm font-medium mb-4">
              🏆 Award-Winning Landscape Design
            </span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white leading-tight mb-4">
              Professional Garden Design Services
            </h1>
            <p className="text-primary-100 text-lg mb-7">
              From 3D concept to complete installation — we transform your outdoor space into a breathtaking green paradise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/query?type=consultation&service=Garden Design" className="btn-primary text-base px-7 py-4 shadow-green-lg flex items-center gap-2">
                <FiCalendar /> Free Consultation
              </Link>
              <Link href="/gallery" className="flex items-center gap-2 text-white font-semibold border-2 border-white/40 px-6 py-4 rounded-full hover:bg-white/15 transition-all">
                View Portfolio <FiArrowRight />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Design Types */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-tag">🌳 Our Specializations</span>
            <h2 className="section-heading">Landscape Design for Every Space</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {DESIGN_TYPES.map((type, i) => (
              <motion.div key={type.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden group hover:shadow-soft-xl hover:-translate-y-1 transition-all duration-300">
                <div className="relative h-48 overflow-hidden">
                  <Image src={type.img} alt={type.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent" />
                  <span className="absolute top-3 left-3 text-2xl">{type.icon}</span>
                  <span className="absolute bottom-3 right-3 font-bold text-white text-sm bg-primary-600/80 backdrop-blur px-2.5 py-1 rounded-lg">{type.price}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2 group-hover:text-primary-700 transition-colors">{type.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{type.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-20 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-tag">⚙️ Our Process</span>
            <h2 className="section-heading">How We Work</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROCESS.map((p, i) => (
              <motion.div key={p.step} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="bg-white rounded-2xl shadow-soft p-6 hover:shadow-soft-lg transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl">{p.icon}</span>
                  <span className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-sm">{p.step}</span>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1.5">{p.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-tag">🌿 Why Jaipur Plants Hub</span>
              <h2 className="section-heading mb-5">India&apos;s Most Trusted Landscape Partner</h2>
              <p className="text-gray-600 mb-6">With 15+ years of experience and 500+ completed projects, we deliver landscape solutions that exceed expectations every time.</p>
              <ul className="space-y-3">
                {[
                  'Free site visit and initial consultation',
                  '3D design visualization before work begins',
                  'Certified horticulturists and designers',
                  '100% organic materials and sustainable practices',
                  '12-month plant health warranty',
                  'Transparent pricing — no hidden charges',
                ].map(pt => (
                  <li key={pt} className="flex items-center gap-3 text-gray-700 text-sm">
                    <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <FiCheck className="text-primary-600 text-xs" />
                    </div>
                    {pt}
                  </li>
                ))}
              </ul>
            </motion.div>
            <div className="space-y-4">
              {TESTIMONIALS.map((t, i) => (
                <motion.div key={t.name} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="bg-primary-50 rounded-2xl p-5">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: t.rating }).map((_, j) => <FiStar key={j} className="text-amber-400 fill-amber-400 text-sm" />)}
                  </div>
                  <p className="text-gray-700 text-sm mb-3 italic">&quot;{t.text}&quot;</p>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{t.name}</p>
                    <p className="text-primary-600 text-xs">{t.project}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <div className="bg-gradient-primary rounded-3xl p-10 text-center">
            <h2 className="font-display text-3xl font-bold text-white mb-3">Start Your Garden Transformation Today</h2>
            <p className="text-primary-200 mb-6 max-w-lg mx-auto">Book a free consultation and get a custom 3D design proposal within 5 working days.</p>
            <Link href="/query?type=consultation&service=Garden Design" className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-8 py-4 rounded-full hover:bg-primary-50 transition-all shadow-soft">
              <FiCalendar /> Book Free Consultation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
