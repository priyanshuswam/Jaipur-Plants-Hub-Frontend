'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiSend, FiCheckCircle, FiUpload, FiX } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { INDIAN_STATES } from '@/constants';
import Breadcrumb from '@/components/common/Breadcrumb';
import toast from 'react-hot-toast';
import Link from 'next/link';

const schema = z.object({
  type: z.string().default('consultation'),
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  subject: z.string().optional(),
  message: z.string().min(10),
  serviceType: z.string().optional(),
  propertyType: z.string().optional(),
  area: z.string().optional(),
  budget: z.string().optional(),
  location: z.string().optional(),
  timeline: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

const BUDGET_OPTIONS = ['Under ₹20,000', '₹20,000 – ₹50,000', '₹50,000 – ₹1,00,000', '₹1,00,000 – ₹2,50,000', 'Above ₹2,50,000'];
const TIMELINE_OPTIONS = ['ASAP (within 2 weeks)', '1 month', '2-3 months', '3-6 months', 'Flexible'];

export default function QueryClientPage() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [refId, setRefId] = useState('');

  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    // Safe defaults — no synchronous searchParams access during render
    defaultValues: { type: 'consultation', serviceType: '' },
  });

  // Read URL params after hydration only
  useEffect(() => {
    const type = searchParams.get('type');
    const service = searchParams.get('service');
    if (type) setValue('type', type as any);
    if (service) setValue('serviceType', service);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const type = watch('type');

  const submitMutation = useMutation({
    mutationFn: (d: FormData) => api.post('/queries', d).then(r => r.data),
    onSuccess: (data) => { setRefId(data.referenceId || ''); setSubmitted(true); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Submission failed. Please try again.'),
  });

  const TYPE_LABELS: Record<string, string> = {
    consultation: '🌿 Book Consultation',
    quote: '💰 Request Quote',
    contact: '💬 General Enquiry',
    support: '🆘 Support Request',
    partnership: '🤝 Partnership',
  };

  if (submitted) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center max-w-md mx-4 bg-white rounded-3xl shadow-soft-xl p-10">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <FiCheckCircle className="text-green-500 text-4xl" />
          </div>
          <h1 className="font-display text-2xl font-bold text-gray-900 mb-2">Request Received! 🌿</h1>
          <p className="text-gray-500 mb-4">Our team will contact you within 24 hours.</p>
          {refId && (
            <div className="bg-primary-50 rounded-xl p-4 mb-5">
              <p className="text-xs text-gray-400">Reference ID</p>
              <p className="font-bold text-primary-700 text-lg">#{refId}</p>
            </div>
          )}
          <div className="flex gap-3">
            <button onClick={() => setSubmitted(false)} className="flex-1 btn-ghost text-sm border border-gray-200 rounded-xl py-2.5">New Request</button>
            <Link href="/" className="flex-1 btn-primary text-sm text-center py-2.5">Back to Home</Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-8">
          <Breadcrumb items={[{ label: 'Request Query' }]} />
          <h1 className="font-display text-3xl font-bold text-gray-900 mt-2">
            {TYPE_LABELS[type] || 'Submit Your Request'}
          </h1>
          <p className="text-gray-500 mt-1">Fill in the details below and we&apos;ll get back to you within 24 hours.</p>
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-10">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit(d => submitMutation.mutate(d))} className="bg-white rounded-3xl shadow-soft p-7 lg:p-9 space-y-5">
              {/* Request Type */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Request Type</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(TYPE_LABELS).map(([val, label]) => (
                    <label key={val} className="cursor-pointer">
                      <input {...register('type')} type="radio" value={val} className="hidden peer" />
                      <span className="block text-sm px-4 py-2 rounded-full border-2 border-gray-200 peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 hover:border-gray-300 transition-all font-medium">
                        {label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Full Name *', placeholder: 'Your full name' },
                  { name: 'phone', label: 'Phone Number *', placeholder: '10-digit mobile' },
                ].map(f => (
                  <div key={f.name}>
                    <label className="block text-xs font-medium text-gray-600 mb-1">{f.label}</label>
                    <input {...register(f.name as any)} placeholder={f.placeholder} className="input-field text-sm" />
                    {(errors as any)[f.name] && <p className="text-red-500 text-xs mt-1">{(errors as any)[f.name]?.message}</p>}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Email Address *</label>
                <input {...register('email')} type="email" placeholder="you@example.com" className="input-field text-sm" />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {(type === 'consultation' || type === 'quote') && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Service Required</label>
                      <select {...register('serviceType')} className="input-field text-sm">
                        <option value="">Select service</option>
                        {['Villa Garden Design', 'Terrace Garden', 'Farmhouse Development', 'Vertical Garden', 'Garden Maintenance', 'Indoor Plants Setup', 'Resort/Hotel Garden', 'Office Garden', 'Other'].map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Property Type</label>
                      <select {...register('propertyType')} className="input-field text-sm">
                        <option value="">Select type</option>
                        {['Villa', 'Farmhouse', 'Resort', 'Hotel', 'Office', 'Apartment', 'Commercial', 'Other'].map(p => (
                          <option key={p} value={p.toLowerCase()}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Area/Size</label>
                      <input {...register('area')} placeholder="e.g. 1500 sq ft" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Budget Range</label>
                      <select {...register('budget')} className="input-field text-sm">
                        <option value="">Select budget</option>
                        {BUDGET_OPTIONS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Project Location</label>
                      <input {...register('location')} placeholder="City, State" className="input-field text-sm" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">Timeline</label>
                      <select {...register('timeline')} className="input-field text-sm">
                        <option value="">When do you need it?</option>
                        {TIMELINE_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Message / Requirements *</label>
                <textarea {...register('message')} rows={5} placeholder="Describe your requirements, vision, or questions in detail..." className="input-field text-sm resize-none" />
                {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message.message}</p>}
              </div>

              <button type="submit" disabled={submitMutation.isPending} className="btn-primary w-full py-4 text-base flex items-center justify-center gap-2 disabled:opacity-70">
                {submitMutation.isPending
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><FiSend /> Submit Request</>}
              </button>
              <p className="text-xs text-gray-400 text-center">We typically respond within 24 hours · No spam ever</p>
            </form>
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl shadow-soft p-6">
              <h3 className="font-semibold text-gray-800 mb-4">What Happens Next?</h3>
              <div className="space-y-4">
                {[
                  { step: '01', title: 'We receive your request', desc: 'Our team reviews your requirements immediately.' },
                  { step: '02', title: 'We call you back', desc: 'A specialist calls within 24 hours to discuss further.' },
                  { step: '03', title: 'Free site visit', desc: 'We schedule a free visit to assess your space.' },
                  { step: '04', title: 'Design & Quotation', desc: 'Receive a custom design and transparent quote.' },
                ].map(s => (
                  <div key={s.step} className="flex gap-3">
                    <span className="w-7 h-7 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-bold text-xs flex-shrink-0 mt-0.5">{s.step}</span>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{s.title}</p>
                      <p className="text-gray-500 text-xs">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-primary-50 rounded-2xl p-5 space-y-3">
              {[
                { label: '📞 Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
                { label: '📧 Email', value: 'info@greenscapepro.com', href: 'mailto:info@greenscapepro.com' },
                { label: '⏰ Hours', value: 'Mon–Sat: 9AM–6PM', href: undefined },
              ].map(c => (
                <div key={c.label}>
                  <p className="text-xs text-gray-400">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-primary-700 font-medium text-sm hover:underline">{c.value}</a>
                  ) : (
                    <p className="text-gray-700 font-medium text-sm">{c.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
