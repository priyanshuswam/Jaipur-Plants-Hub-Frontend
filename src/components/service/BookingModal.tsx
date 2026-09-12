'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { FiX, FiCalendar, FiClock, FiMapPin, FiCheckCircle } from 'react-icons/fi';
import { useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

const schema = z.object({
  date: z.string().min(1, 'Please select a date'),
  timeSlot: z.string().min(1, 'Please select a time slot'),
  address: z.string().min(5, 'Please enter your address'),
  area: z.string().optional(),
  budget: z.string().optional(),
  notes: z.string().optional(),
  phone: z.string().regex(/^[6-9]\d{9}$/).optional().or(z.literal('')),
});
type FormData = z.infer<typeof schema>;

const TIME_SLOTS = ['9:00 AM - 10:00 AM', '10:00 AM - 11:00 AM', '11:00 AM - 12:00 PM', '2:00 PM - 3:00 PM', '3:00 PM - 4:00 PM', '4:00 PM - 5:00 PM'];

export default function BookingModal({ service, onClose }: { service: any; onClose: () => void }) {
  const { user } = useAuthStore();
  const [done, setDone] = useState(false);
  const [bookingRef, setBookingRef] = useState('');

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 3);
  const minDate = tomorrow.toISOString().split('T')[0];

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { phone: user?.phone || '' },
  });

  const bookMutation = useMutation({
    mutationFn: (d: FormData) => api.post(`/services/${service._id}/book`, d).then(r => r.data),
    onSuccess: (data) => {
      setBookingRef(data.booking?._id?.toString().slice(-8).toUpperCase() || '');
      setDone(true);
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Booking failed. Please try again.'),
  });

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-primary p-5 flex items-start justify-between">
          <div>
            <p className="text-primary-200 text-xs uppercase tracking-wide">Book Service</p>
            <h2 className="font-display text-xl font-bold text-white">{service.name}</h2>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white p-1">
            <FiX className="text-xl" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {done ? (
            <div className="text-center py-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-green-500 text-3xl" />
              </div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-2">Consultation Booked!</h3>
              <p className="text-gray-500 text-sm mb-4">
                Our designer will contact you within 24 hours to confirm the appointment.
              </p>
              {bookingRef && (
                <div className="bg-primary-50 rounded-xl p-3 mb-5">
                  <p className="text-xs text-gray-500">Booking Reference</p>
                  <p className="font-bold text-primary-700">#{bookingRef}</p>
                </div>
              )}
              <button onClick={onClose} className="btn-primary w-full py-3">Done</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(d => bookMutation.mutate(d))} className="space-y-4">
              {/* Date */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                  <FiCalendar className="text-primary-500" /> Preferred Date *
                </label>
                <input {...register('date')} type="date" min={minDate} className="input-field text-sm" />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date.message}</p>}
              </div>

              {/* Time Slot */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                  <FiClock className="text-primary-500" /> Preferred Time *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {TIME_SLOTS.map(slot => (
                    <label key={slot} className="relative">
                      <input {...register('timeSlot')} type="radio" value={slot} className="hidden peer" />
                      <span className="block text-xs text-center px-2 py-2 rounded-xl border-2 border-gray-200 peer-checked:border-primary-600 peer-checked:bg-primary-50 peer-checked:text-primary-700 hover:border-gray-300 cursor-pointer transition-all">
                        {slot}
                      </span>
                    </label>
                  ))}
                </div>
                {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot.message}</p>}
              </div>

              {/* Address */}
              <div>
                <label className="flex items-center gap-2 text-xs font-semibold text-gray-600 mb-1.5">
                  <FiMapPin className="text-primary-500" /> Site Address *
                </label>
                <textarea {...register('address')} rows={2} placeholder="Full address for the site visit" className="input-field text-sm resize-none" />
                {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message}</p>}
              </div>

              {/* Optional Fields */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Garden Area (optional)</label>
                  <input {...register('area')} placeholder="e.g. 500 sq ft" className="input-field text-sm py-2.5" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Budget (optional)</label>
                  <input {...register('budget')} placeholder="e.g. ₹50,000" className="input-field text-sm py-2.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1">Additional Notes</label>
                <textarea {...register('notes')} rows={2} placeholder="Any special requirements..." className="input-field text-sm resize-none" />
              </div>

              <button type="submit" disabled={bookMutation.isPending} className="btn-primary w-full py-3.5 flex items-center justify-center gap-2 disabled:opacity-70">
                {bookMutation.isPending
                  ? <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  : <><FiCalendar /> Confirm Booking</>}
              </button>
              <p className="text-xs text-gray-400 text-center">Free consultation · No commitment required</p>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  );
}
