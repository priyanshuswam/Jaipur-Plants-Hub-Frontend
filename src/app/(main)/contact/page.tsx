'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiPhone, FiMail, FiSend, FiCheckCircle, FiUser, FiMessageSquare } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

const schema = z.object({
  type: z.enum(['contact', 'consultation']).default('contact'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Enter a valid email'),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit phone number'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  serviceType: z.string().optional(),
  propertyType: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const { register, handleSubmit, watch, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'contact' },
  });
  const type = watch('type');

  const submitMutation = useMutation({
    mutationFn: (d: FormData) => api.post('/queries', d).then(r => r.data),
    onSuccess: (data) => {
      setRefId(data.referenceId || '');
      setSubmitted(true);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to send. Please try again.'),
  });

  return (
    <div className="min-h-screen " style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #f0fdf4 60%, #ecfdf5 100%)' }}>
      {/* Header */}
      <div className="text-white py-16 text-center" style={{ background: 'linear-gradient(90deg, #1B4332 0%, #4CAF50 100%)' }}>
        <div className="container-custom">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-3">Get In Touch</h1>
          <p className="text-green-100 max-w-lg mx-auto">Have a question or project in mind? We&apos;d love to hear from you. Our team responds within 24 hours.</p>
        </div>
      </div>

      <div className="container-custom py-12 max-w-2xl">
        <div className="bg-white rounded-3xl shadow-soft p-7 lg:p-10" style={{ background: 'linear-gradient(135deg, rgb(240, 253, 244) 0%, rgb(220, 252, 231) 30%, rgb(240, 253, 244) 60%, rgb(236, 253, 245) 100%)' }}>
          {submitted ? (
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                <FiCheckCircle className="text-green-500 text-4xl" />
              </div>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-2">Message Sent! 🌿</h2>
              <p className="text-gray-500 mb-2">Thank you for reaching out. We&apos;ll contact you within 24 hours.</p>
              {refId && (
                <div className="bg-primary-50 rounded-xl p-3 inline-block mt-2">
                  <p className="text-xs text-gray-500">Reference ID</p>
                  <p className="font-bold text-primary-700">#{refId}</p>
                </div>
              )}
              <button onClick={() => setSubmitted(false)} className="btn-ghost text-primary-600 mt-6 block mx-auto text-sm">
                Send Another Message
              </button>
            </motion.div>
          ) : (
            <>
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-1">Send Us a Message</h2>
              <p className="text-sm text-gray-500 mb-6">We typically respond within 24 hours.</p>
              <form onSubmit={handleSubmit(d => submitMutation.mutate(d))} className="space-y-4">

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                    <div className="relative">
                      <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input {...register('name')} placeholder="Your name" className="input-field pl-10 text-sm" />
                    </div>
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Phone *</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                      <input {...register('phone')} placeholder="10-digit number" className="input-field pl-10 text-sm" />
                    </div>
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                    <input {...register('email')} type="email" placeholder="you@example.com" className="input-field pl-10 text-sm" />
                  </div>
                  {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Service Type</label>
                    <select {...register('serviceType')} className="input-field text-sm">
                      <option value="">General Inquiry</option>
                      <option value="Villa Garden Design">Villa Garden Design</option>
                      <option value="Terrace Garden">Terrace Garden</option>
                      <option value="Farmhouse Development">Farmhouse Development</option>
                      <option value="Garden Maintenance">Garden Maintenance</option>
                      <option value="Vertical Garden">Vertical Garden</option>
                      <option value="Indoor Plants Setup">Indoor Plants Setup</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
                    <select {...register('propertyType')} className="input-field text-sm">
                      <option value="">Select type</option>
                      <option value="villa">Villa</option>
                      <option value="farmhouse">Farmhouse</option>
                      <option value="resort">Resort</option>
                      <option value="office">Office</option>
                      <option value="apartment">Apartment</option>
                      <option value="commercial">Commercial</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Message *</label>
                  <div className="relative">
                    <FiMessageSquare className="absolute left-3.5 top-4 text-gray-400 text-sm" />
                    <textarea {...register('message')} rows={5} placeholder="Tell us about your project, requirements, or question..." className="input-field pl-10 text-sm resize-none" />
                  </div>
                  {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
                </div>

                <button type="submit" disabled={submitMutation.isPending}
                  className="btn-primary w-full py-4 flex items-center justify-center gap-2 disabled:opacity-70">
                  {submitMutation.isPending
                    ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : <><FiSend /> Send Message</>}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
