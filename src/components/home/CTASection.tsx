'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiArrowRight, FiPhone } from 'react-icons/fi';
import { FaWhatsapp } from 'react-icons/fa';
import { CONTACT_INFO } from '@/constants';

export default function CTASection() {
  return (
    <section className="py-16 bg-surface">
      <div className="container-custom">
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              title: 'Ready to Transform Your Garden?',
              desc: 'Book a free consultation with our expert landscape designers today.',
              cta: 'Book Consultation',
              href: '/query?type=consultation',
              icon: '🌳',
              variant: 'primary',
            },
            {
              title: 'Need Help Choosing Plants?',
              desc: 'Chat with our plant experts on WhatsApp for instant advice.',
              cta: 'Chat on WhatsApp',
              href: `https://wa.me/${CONTACT_INFO.whatsapp}`,
              icon: '💬',
              variant: 'whatsapp',
              external: true,
            },
            {
              title: 'Corporate & Bulk Orders',
              desc: 'Special pricing for offices, events, hotels, and large projects.',
              cta: 'Get Quote',
              href: '/query?type=quote',
              icon: '🏢',
              variant: 'dark',
            },
          ].map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-7 rounded-2xl flex flex-col gap-4 ${
                card.variant === 'primary' ? 'bg-gradient-primary text-white' :
                card.variant === 'whatsapp' ? 'bg-[#25D366] text-white' :
                'bg-dark text-white'
              }`}
            >
              <span className="text-4xl">{card.icon}</span>
              <div>
                <h3 className="font-semibold text-lg mb-1">{card.title}</h3>
                <p className="text-white/70 text-sm">{card.desc}</p>
              </div>
              {card.external ? (
                <a
                  href={card.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-full transition-all text-sm w-fit"
                >
                  {card.variant === 'whatsapp' && <FaWhatsapp />}
                  {card.cta} <FiArrowRight />
                </a>
              ) : (
                <Link
                  href={card.href}
                  className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white font-semibold px-5 py-2.5 rounded-full transition-all text-sm w-fit"
                >
                  {card.cta} <FiArrowRight />
                </Link>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
