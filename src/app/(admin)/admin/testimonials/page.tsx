'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCheck, FiX, FiStar, FiTrash2 } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminTestimonialsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');

  const { data: pendingData } = useQuery({
    queryKey: ['admin-testimonials-pending'],
    queryFn: () => api.get('/testimonials/admin/pending').then(r => r.data),
    staleTime: 60 * 1000,
  });

  const { data: approvedData } = useQuery({
    queryKey: ['admin-testimonials-approved'],
    queryFn: () => api.get('/testimonials', { params: { limit: 50 } }).then(r => r.data),
    staleTime: 60 * 1000,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/testimonials/admin/${id}/approve`, { status }),
    onSuccess: () => {
      toast.success('Testimonial updated');
      qc.invalidateQueries({ queryKey: ['admin-testimonials-pending'] });
      qc.invalidateQueries({ queryKey: ['admin-testimonials-approved'] });
    },
    onError: () => toast.error('Failed to update testimonial'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/testimonials/${id}`),
    onSuccess: () => {
      toast.success('Testimonial deleted');
      qc.invalidateQueries({ queryKey: ['admin-testimonials-approved'] });
    },
    onError: () => toast.error('Failed to delete'),
  });

  const featureMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) =>
      api.put(`/testimonials/admin/${id}/approve`, { status: 'approved', isFeatured: !isFeatured }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin-testimonials-approved'] }),
  });

  const pending = pendingData?.testimonials || [];
  const approved = approvedData?.testimonials || [];
  const items = tab === 'pending' ? pending : approved;

  const renderStars = (rating: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FiStar key={i} className={cn('text-xs', i < rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300')} />
    ));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Testimonials</h1>

      <div className="flex gap-2 mb-5">
        {([['pending', `Pending (${pending.length})`], ['approved', `Approved (${approved.length})`]] as const).map(([v, l]) => (
          <button key={v} onClick={() => setTab(v)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all',
              tab === v ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-primary-300')}>
            {l}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {items.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-soft text-center py-12 text-gray-400">
            No {tab} testimonials
          </div>
        ) : items.map((t: any) => (
          <motion.div key={t._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="bg-white rounded-2xl shadow-soft p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-3">
                <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700 flex-shrink-0">
                  {t.customer?.name?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{t.customer?.name}</p>
                  <p className="text-xs text-gray-400">{t.customer?.designation}{t.customer?.location ? ` · ${t.customer.location}` : ''}</p>
                  <div className="flex gap-0.5 mt-1">{renderStars(t.rating)}</div>
                </div>
              </div>
              <div className="flex gap-2">
                {tab === 'pending' ? (
                  <>
                    <button onClick={() => approveMutation.mutate({ id: t._id, status: 'approved' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors">
                      <FiCheck className="text-xs" /> Approve
                    </button>
                    <button onClick={() => approveMutation.mutate({ id: t._id, status: 'rejected' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-colors">
                      <FiX className="text-xs" /> Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => featureMutation.mutate({ id: t._id, isFeatured: t.isFeatured })}
                      className={cn('px-3 py-1.5 rounded-lg text-sm transition-colors flex items-center gap-1.5',
                        t.isFeatured ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
                      <FiStar className="text-xs" /> {t.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button onClick={() => confirm('Delete testimonial?') && deleteMutation.mutate(t._id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </>
                )}
              </div>
            </div>
            {t.title && <p className="font-medium text-gray-700 text-sm mt-3">&quot;{t.title}&quot;</p>}
            <p className="text-gray-600 text-sm mt-2 italic">&quot;{t.content}&quot;</p>
            <p className="text-xs text-gray-400 mt-2">{formatDate(t.createdAt, { dateStyle: 'medium' })}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
