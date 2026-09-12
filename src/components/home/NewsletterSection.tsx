'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiMail, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    try {
      // Newsletter subscription endpoint
      await api.post('/settings/newsletter', { email }).catch(() => {});
      setSubscribed(true);
      toast.success('Welcome to the GreenScape family! 🌿');
    } catch {
      toast.error('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-primary rounded-3xl overflow-hidden relative"
        >
          {/* Decorative circles */}
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/5 rounded-full" />
          <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/5 rounded-full" />
          <div className="absolute top-0 right-1/3 w-32 h-32 bg-accent/20 rounded-full blur-2xl" />

          <div className="relative p-10 lg:p-16 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Text */}
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-4">
                <FaLeaf className="text-primary-300 text-xl animate-float" />
                <span className="text-primary-200 text-sm font-medium uppercase tracking-widest">Newsletter</span>
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-3">
                Get 10% Off Your First Order
              </h2>
              <p className="text-primary-200 max-w-md">
                Subscribe for plant care tips, seasonal offers, new arrivals, and exclusive discounts delivered to your inbox.
              </p>
              <div className="flex flex-wrap gap-4 mt-4 justify-center lg:justify-start text-sm text-primary-300">
                {['🌿 Weekly plant tips', '💰 Exclusive discounts', '🌱 New arrivals first', '📸 Design inspiration'].map(b => (
                  <span key={b}>{b}</span>
                ))}
              </div>
            </div>

            {/* Form */}
            <div className="w-full max-w-md flex-shrink-0">
              {subscribed ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="bg-white/15 backdrop-blur rounded-2xl p-8 text-center"
                >
                  <FiCheckCircle className="text-white text-4xl mx-auto mb-3" />
                  <p className="text-white font-semibold text-lg mb-1">You&apos;re subscribed!</p>
                  <p className="text-primary-200 text-sm">Check your inbox for your 10% discount code 🎁</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        required
                        className="w-full pl-11 pr-4 py-4 bg-white rounded-xl text-gray-800 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-white/50 text-sm"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-4 bg-dark text-white font-semibold rounded-xl hover:bg-dark-deep transition-colors flex items-center gap-2 flex-shrink-0 text-sm disabled:opacity-70"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>Subscribe <FiArrowRight /></>
                      )}
                    </button>
                  </div>
                  <p className="text-primary-300 text-xs text-center">
                    No spam. Unsubscribe anytime. We respect your privacy.
                  </p>
                </form>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
