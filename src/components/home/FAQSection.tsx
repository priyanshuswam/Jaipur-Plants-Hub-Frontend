'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiPlus, FiMinus } from 'react-icons/fi';

const FAQS = [
  { q: 'Do you deliver plants all over India?', a: 'Yes! We deliver to 500+ cities across India. Delivery typically takes 2–5 business days. Free shipping on orders above ₹999.' },
  { q: 'Are the plants guaranteed to arrive healthy?', a: 'Absolutely. Every plant is inspected and carefully packaged before dispatch. We guarantee healthy plants or a free replacement within 7 days of delivery.' },
  { q: 'How do I book a landscape consultation?', a: 'You can book directly through our website by filling the consultation form, or WhatsApp us. We offer free 30-minute initial consultations for projects above ₹25,000.' },
  { q: 'What areas do you cover for garden services?', a: 'We currently serve Mumbai, Pune, Nashik, Bangalore, and surrounding areas for on-site garden services. Contact us for specific availability in your area.' },
  { q: 'Do you provide plant care guidance?', a: 'Yes! Every order includes a plant care card. We also offer free WhatsApp support for plant care queries, and our blog has 100+ care guides.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major payment methods: UPI, Net Banking, Credit/Debit Cards via Razorpay, and Cash on Delivery (COD) for orders below ₹5,000.' },
  { q: 'Do you do corporate or bulk orders?', a: 'Yes! We offer special pricing for corporate office plants, events, and bulk orders. Contact us at b2b@greenscapepro.com for a custom quote.' },
];

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-20 bg-surface">
      <div className="container-custom">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="section-tag">❓ FAQs</span>
            <h2 className="section-heading mb-4">Frequently Asked Questions</h2>
            <p className="text-gray-500">Everything you need to know about Jaipur Plants Hub.</p>
          </motion.div>

          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl shadow-soft overflow-hidden"
              >
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-primary-50/50 transition-colors"
                >
                  <span className="font-medium text-gray-800 text-sm leading-snug">{faq.q}</span>
                  <span className="w-7 h-7 rounded-full bg-primary-50 flex items-center justify-center flex-shrink-0">
                    {open === i
                      ? <FiMinus className="text-primary-700 text-sm" />
                      : <FiPlus className="text-primary-700 text-sm" />
                    }
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {open === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <p className="px-5 pb-5 text-gray-500 text-sm leading-relaxed border-t border-gray-50 pt-3">
                        {faq.a}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
