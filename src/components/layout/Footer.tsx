'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  FaLeaf, FaWhatsapp,
} from 'react-icons/fa';
import { FiArrowRight } from 'react-icons/fi';
import { FOOTER_LINKS, CONTACT_INFO } from '@/constants';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.5 } }),
};

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-dark-deep text-white relative overflow-hidden">
      {/* Top decorative wave */}
      <div className="absolute top-0 left-0 right-0 h-16 overflow-hidden">
        <svg viewBox="0 0 1440 64" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path d="M0 64L60 58.7C120 53 240 43 360 37.3C480 32 600 32 720 37.3C840 43 960 53 1080 58.7C1200 64 1320 64 1380 64H1440V0H0V64Z" fill="#F8FFF5" />
        </svg>
      </div>

      {/* Background mesh */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent rounded-full blur-3xl" />
      </div>

      <div className="relative container-custom pt-24 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">

          {/* Brand Column */}
          <motion.div
            custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            className="lg:col-span-2"
          >
            <Link href="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center shadow-green group-hover:shadow-green-lg transition-shadow">
                <FaLeaf className="text-white text-xl" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white block leading-none">Jaipur Plants Hub</span>
                <span className="text-primary-400 text-xs tracking-widest uppercase">Premium Landscape Solutions</span>
              </div>
            </Link>

            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-sm">
              Transforming spaces into breathtaking green paradises since 2009. From premium plants to complete landscape design, we bring nature to your doorstep.
            </p>
          </motion.div>

          {/* Link Columns */}
          {[
            { title: 'Company', links: FOOTER_LINKS.company },
            { title: 'Services', links: FOOTER_LINKS.services },
            { title: 'Shop', links: FOOTER_LINKS.shop },
          ].map((col, i) => (
            <motion.div
              key={col.title}
              custom={i + 1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
            >
              <h4 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-gray-400 hover:text-primary-400 text-sm transition-colors flex items-center gap-2 group"
                    >
                      <FiArrowRight className="text-xs opacity-0 group-hover:opacity-100 -ml-4 group-hover:ml-0 transition-all duration-200" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* WhatsApp CTA Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="bg-gradient-to-r from-primary-800 to-primary-600 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mb-12"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
              <FaWhatsapp className="text-white text-2xl" />
            </div>
            <div>
              <p className="text-white font-semibold">Get Instant Garden Advice on WhatsApp</p>
              <p className="text-primary-200 text-sm">Chat with our experts · Mon–Sat 9AM–6PM</p>
            </div>
          </div>
          <a
            href={`https://wa.me/${CONTACT_INFO.whatsapp}?text=Hi! I need help with my garden.`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-white text-primary-800 font-semibold px-5 py-2.5 rounded-full hover:bg-primary-50 transition-all whitespace-nowrap"
          >
            <FaWhatsapp className="text-green-600" /> Chat Now
          </a>
        </motion.div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm text-center sm:text-left">
            © {year} Jaipur Plants Hub. All rights reserved. Made with 🌿 in India.
          </p>
          <div className="flex items-center gap-6">
            {FOOTER_LINKS.support.slice(-3).map((link) => (
              <Link key={link.href} href={link.href} className="text-gray-500 hover:text-primary-400 text-sm transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
