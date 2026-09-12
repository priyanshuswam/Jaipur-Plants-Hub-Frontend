'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiAward, FiUsers, FiTrendingUp, FiHeart } from 'react-icons/fi';
import Breadcrumb from '@/components/common/Breadcrumb';

const TEAM = [
  { name: 'Rajiv Sharma', role: 'Founder & Chief Landscape Architect', image: 'https://i.pravatar.cc/300?img=51', bio: '20+ years in landscape architecture. Designed gardens for 5-star resorts and luxury villas.' },
  { name: 'Priya Mehta', role: 'Head Horticulturist', image: 'https://i.pravatar.cc/300?img=47', bio: 'Certified horticulturist specializing in rare tropical plants and sustainable garden design.' },
  { name: 'Arjun Nair', role: 'Senior Garden Designer', image: 'https://i.pravatar.cc/300?img=33', bio: 'Expert in terrace gardens, vertical walls, and contemporary landscape solutions.' },
  { name: 'Sneha Patel', role: 'Plant Care Specialist', image: 'https://i.pravatar.cc/300?img=44', bio: 'Plant enthusiast with expertise in indoor plant styling and care consultation.' },
];

const MILESTONES = [
  { year: '2009', title: 'Founded', desc: 'Jaipur Plants Hub started as a small nursery in Mumbai with a passion for plants.' },
  { year: '2012', title: 'Expanded Services', desc: 'Launched professional landscape design services for residential projects.' },
  { year: '2016', title: '500 Projects', desc: 'Completed 500+ successful landscape projects across Maharashtra.' },
  { year: '2019', title: 'Online Store', desc: 'Launched e-commerce platform to deliver premium plants across India.' },
  { year: '2022', title: 'National Expansion', desc: 'Extended services to 10+ cities with a team of 50+ professionals.' },
  { year: '2024', title: 'Award Winner', desc: 'Won Best Landscape Company of the Year at India Green Awards.' },
];

const VALUES = [
  { icon: FiHeart, title: 'Passion for Plants', desc: 'Every project begins with genuine love for nature and green living.' },
  { icon: FiCheckCircle, title: 'Quality Assurance', desc: 'We guarantee healthy plants and flawless installations every single time.' },
  { icon: FiUsers, title: 'Customer First', desc: 'Your satisfaction and vision are at the centre of every decision we make.' },
  { icon: FiTrendingUp, title: 'Continuous Growth', desc: 'We constantly innovate with new designs, plants, and sustainable practices.' },
];

export default function AboutClientPage() {
  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Hero */}
      <div className="relative bg-dark py-20 overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/images/plant-placeholder.svg" alt="About Hero" fill className="object-cover opacity-20" />
        </div>
        <div className="container-custom relative text-center">
          <Breadcrumb items={[{ label: 'About' }]} light className="justify-center mb-4" />
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="font-display text-4xl lg:text-6xl font-bold text-white mb-4">
            Our Story of <span className="text-accent">Growing Green</span>
          </motion.h1>
          <p className="text-primary-200 text-lg max-w-2xl mx-auto">
            Since 2009, we&apos;ve been transforming ordinary spaces into extraordinary green sanctuaries — one garden at a time.
          </p>
        </div>
      </div>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <span className="section-tag">🌿 Our Journey</span>
              <h2 className="section-heading mb-5">
                From a Small Nursery to India&apos;s Trusted Landscape Company
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Jaipur Plants Hub was born from a simple belief: everyone deserves to live surrounded by nature&apos;s beauty. Founded in 2009 by Rajiv Sharma, what started as a small nursery stall has grown into one of India&apos;s most trusted landscape design and plant delivery companies.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Today, our team of 50+ certified horticulturists, landscape architects, and garden designers have completed over 500 projects — from intimate balcony gardens to sprawling farmhouse estates — all united by our commitment to quality, sustainability, and customer joy.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-7">
                {[
                  { v: '500+', l: 'Projects Delivered' },
                  { v: '1,200+', l: 'Happy Customers' },
                  { v: '800+', l: 'Plant Varieties' },
                  { v: '15+', l: 'Years Experience' },
                ].map(s => (
                  <div key={s.l} className="bg-primary-50 rounded-xl p-3 text-center">
                    <p className="font-display text-2xl font-bold text-primary-700">{s.v}</p>
                    <p className="text-sm text-gray-500">{s.l}</p>
                  </div>
                ))}
              </div>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Get in Touch <FiArrowRight />
              </Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="grid grid-cols-2 gap-4">
              {[
                '/images/plant-placeholder.svg',
                '/images/plant-placeholder.svg',
                '/images/plant-placeholder.svg',
                '/images/plant-placeholder.svg',
              ].map((src, i) => (
                <div key={i} className="rounded-2xl overflow-hidden shadow-soft">
                  <Image src={src} alt={`Our work ${i + 1}`} width={300} height={220} className="w-full h-40 object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-tag">💚 Our Values</span>
            <h2 className="section-heading">What Drives Everything We Do</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-soft p-6 text-center hover:shadow-soft-lg transition-all">
                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon className="text-primary-600 text-xl" />
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{v.title}</h3>
                <p className="text-gray-500 text-sm">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-tag">📅 Our Milestones</span>
            <h2 className="section-heading">15 Years of Growing Together</h2>
          </div>
          <div className="relative max-w-3xl mx-auto">
            <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-0.5 bg-primary-100 lg:-translate-x-0.5" />
            {MILESTONES.map((m, i) => (
              <motion.div key={m.year} initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative flex gap-6 mb-8 ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} pl-12 lg:pl-0`}>
                <div className="absolute left-0 lg:left-1/2 w-8 h-8 bg-gradient-primary rounded-full border-4 border-white shadow-green flex items-center justify-center lg:-translate-x-4 flex-shrink-0 mt-1">
                  <span className="text-white text-[10px] font-bold">{i + 1}</span>
                </div>
                <div className={`flex-1 ${i % 2 === 0 ? 'lg:text-right lg:pr-12' : 'lg:pl-12'}`}>
                  <span className="text-primary-600 font-bold text-lg block mb-1">{m.year}</span>
                  <h3 className="font-semibold text-gray-800 mb-1">{m.title}</h3>
                  <p className="text-gray-500 text-sm">{m.desc}</p>
                </div>
                <div className="hidden lg:block flex-1" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-tag">👥 Our Team</span>
            <h2 className="section-heading">Meet the Green Experts</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {TEAM.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden group hover:shadow-soft-xl transition-all">
                <div className="h-56 overflow-hidden">
                  <Image src={member.image} alt={member.name} width={300} height={224} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-gray-800">{member.name}</h3>
                  <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-primary rounded-3xl p-10 lg:p-14 text-center">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Start Your Green Journey?</h2>
            <p className="text-primary-200 text-lg mb-7 max-w-xl mx-auto">
              Let&apos;s create something beautiful together. Book a free consultation or explore our plant collection.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/query?type=consultation" className="bg-white text-primary-800 font-semibold px-7 py-3.5 rounded-full hover:bg-primary-50 transition-all flex items-center gap-2">
                Book Consultation <FiArrowRight />
              </Link>
              <Link href="/products" className="border-2 border-white/40 text-white font-semibold px-7 py-3.5 rounded-full hover:bg-white/15 transition-all">
                Shop Plants
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
