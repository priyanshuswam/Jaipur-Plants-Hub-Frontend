'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FiCheck, FiX, FiStar } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { timeAgo, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminReviewsPage() {
  const qc = useQueryClient();
  const [tab, setTab] = useState<'pending' | 'approved'>('pending');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-reviews', tab],
    queryFn: () => {
      if (tab === 'pending') return api.get('/reviews/admin/pending').then(r => r.data);
      return api.get('/reviews/admin/approved').then(r => r.data);
    },
    staleTime: 30 * 1000,
  });

  const approveMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.put(`/reviews/admin/${id}/approve`, { status }),
    onSuccess: () => { toast.success('Review updated'); qc.invalidateQueries({ queryKey: ['admin-reviews'] }); },
    onError: () => toast.error('Failed to update review'),
  });

  const reviews = data?.reviews || [];

  const renderStars = (n: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <FiStar key={i} className={cn('text-xs', i < n ? 'text-amber-400 fill-amber-400' : 'text-gray-200')} />
    ));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Product Reviews</h1>

      <div className="flex gap-2 mb-5">
        {(['pending', 'approved'] as const).map(v => (
          <button key={v} onClick={() => setTab(v)}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all',
              tab === v ? 'bg-primary-600 text-white' : 'bg-white text-gray-600 border border-gray-200')}>
            {v}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}</div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft text-center py-12 text-gray-400">
          No {tab} reviews
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <div key={review._id} className="bg-white rounded-2xl shadow-soft p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3 flex-1">
                  {review.product?.thumbnail && (
                    <Image src={review.product.thumbnail} alt="" width={48} height={48} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-primary-600 font-medium mb-0.5">{review.product?.name}</p>
                    <div className="flex gap-0.5 mb-1">{renderStars(review.rating)}</div>
                    {review.title && <p className="font-semibold text-gray-800 text-sm">&quot;{review.title}&quot;</p>}
                    <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                    <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                      <span>{review.user?.firstName} {review.user?.lastName}</span>
                      <span>·</span>
                      <span>{timeAgo(review.createdAt)}</span>
                      {review.isVerifiedPurchase && <span className="text-green-600 font-medium">✓ Verified</span>}
                    </div>
                  </div>
                </div>
                {tab === 'pending' && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button onClick={() => approveMutation.mutate({ id: review._id, status: 'approved' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-sm hover:bg-green-100 transition-colors">
                      <FiCheck className="text-xs" /> Approve
                    </button>
                    <button onClick={() => approveMutation.mutate({ id: review._id, status: 'rejected' })}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-500 rounded-lg text-sm hover:bg-red-100 transition-colors">
                      <FiX className="text-xs" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
