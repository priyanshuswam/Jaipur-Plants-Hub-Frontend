'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { FaLeaf, FaAward, FaUsers, FaStar } from 'react-icons/fa';
import { FiCheckCircle } from 'react-icons/fi';

const STATS = [
  { icon: FaLeaf, value: 800, suffix: '+', label: 'Plant Varieties', color: 'text-primary-600', bg: 'bg-primary-50' },
  { icon: FaUsers, value: 1200, suffix: '+', label: 'Happy Customers', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: FaAward, value: 500, suffix: '+', label: 'Projects Completed', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: FaStar, value: 15, suffix: '+', label: 'Years Experience', color: 'text-amber-600', bg: 'bg-amber-50' },
];

function Counter({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    const duration = 2000;
    const steps = 60;
    const stepTime = duration / steps;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, stepTime);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function StatsSection() {
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* Top gradient */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-200 to-transparent" />

      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {STATS.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="text-center group"
            >
              <div className={`w-14 h-14 ${stat.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <stat.icon className={`text-2xl ${stat.color}`} />
              </div>
              <div className={`font-display text-4xl font-bold ${stat.color} mb-1`}>
                <Counter target={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-gray-500 text-sm font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-12 pt-8 border-t border-gray-100">
          <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
            {[
              '🌿 100% Healthy Plants Guaranteed',
              '🚚 Free Shipping Above ₹999',
              '💬 Expert Plant Care Support',
              '🔒 Secure Payment',
            ].map((badge) => (
              <div key={badge} className="flex items-center gap-2 text-sm text-gray-600">
                <FiCheckCircle className="text-primary-500 text-base flex-shrink-0" />
                <span>{badge.slice(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
