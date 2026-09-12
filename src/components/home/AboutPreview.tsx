'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiCheckCircle, FiAward, FiUsers, FiDroplet } from 'react-icons/fi';

const FEATURES = [
  { icon: FiCheckCircle, title: '100% Healthy Plants', desc: 'Every plant is inspected before delivery' },
  { icon: FiAward, title: '15+ Years Experience', desc: 'Trusted by 1200+ happy customers' },
  { icon: FiUsers, title: 'Expert Team', desc: 'Certified horticulturists and designers' },
  { icon: FiDroplet, title: 'After-care Support', desc: 'Free guidance on plant care' },
];

export default function AboutPreview() {
  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="container-custom">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Images Collage */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="rounded-3xl overflow-hidden h-56 shadow-soft-lg">
                  <Image
                    src="/images/plant-placeholder.svg"
                    alt="Garden Design"
                    width={300} height={220}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden h-40 shadow-soft-lg">
                  <Image
                    src="/images/plant-placeholder.svg"
                    alt="Plant Care"
                    width={300} height={160}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="rounded-3xl overflow-hidden h-40 shadow-soft-lg">
                  <Image
                    src="/images/plant-placeholder.svg"
                    alt="Nursery"
                    width={300} height={160}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="rounded-3xl overflow-hidden h-56 shadow-soft-lg">
                  <Image
                    src="/images/plant-placeholder.svg"
                    alt="Landscape"
                    width={300} height={220}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <motion.div
              animate={{ y: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -bottom-4 -left-4 glass-card-white p-4 shadow-soft-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center">
                  <FiAward className="text-white text-lg" />
                </div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">Award Winning</p>
                  <p className="text-gray-400 text-xs">Best Landscape Company 2024</p>
                </div>
              </div>
            </motion.div>

            {/* Years badge */}
            <div className="absolute top-4 -right-4 w-20 h-20 bg-gradient-primary rounded-2xl flex flex-col items-center justify-center shadow-green">
              <span className="text-white font-display font-bold text-2xl leading-none">15+</span>
              <span className="text-primary-200 text-xs">Years</span>
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <span className="section-tag">🌿 About Jaipur Plants Hub</span>
            <h2 className="section-heading mb-5">
              India&apos;s Most Trusted<br />
              <span className="gradient-text">Nursery & Landscape</span><br />
              Company
            </h2>
            <p className="text-gray-500 leading-relaxed mb-6">
              Since 2009, Jaipur Plants Hub has been transforming ordinary spaces into extraordinary green sanctuaries. Our team of certified horticulturists and landscape designers brings 15+ years of expertise to every project.
            </p>
            <p className="text-gray-500 leading-relaxed mb-8">
              From a single plant delivery to a complete resort landscape — we approach every project with the same passion, precision, and commitment to quality.
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-3 p-3 rounded-xl hover:bg-primary-50 transition-colors"
                >
                  <div className="w-9 h-9 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <f.icon className="text-primary-700 text-sm" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">{f.title}</p>
                    <p className="text-gray-400 text-xs">{f.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <Link href="/about" className="btn-primary px-8 py-3.5">
              Our Story <FiArrowRight />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
