'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiStar, FiEdit2, FiTrash2, FiPlus } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import StarRating from '@/components/common/StarRating';

export default function MyReviewsPage() {
  const qc = useQueryClient();
  const { user } = useAuthStore();

  // Fetch reviews by looking across all orders (simplified approach)
  const { data, isLoading } = useQuery({
    queryKey: ['my-reviews'],
    queryFn: () => api.get('/reviews/product/mine').then(r => r.data).catch(() => ({ reviews: [] })),
    staleTime: 60 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/reviews/${id}`),
    onSuccess: () => { toast.success('Review deleted'); qc.invalidateQueries({ queryKey: ['my-reviews'] }); },
    onError: () => toast.error('Failed to delete review'),
  });

  const reviews = data?.reviews || [];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">My Reviews</h1>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-2xl" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-soft text-center py-16">
          <FiStar className="text-5xl text-gray-200 mx-auto mb-4" />
          <p className="text-gray-500 font-medium mb-2">No reviews yet</p>
          <p className="text-gray-400 text-sm mb-6">Share your experience with the plants you&apos;ve purchased</p>
          <Link href="/account/orders" className="btn-primary inline-flex text-sm py-2.5 px-6 gap-2">
            <FiPlus /> Review Your Purchases
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review: any) => (
            <motion.div key={review._id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className="bg-white rounded-2xl shadow-soft p-5">
              <div className="flex gap-4">
                {review.product?.thumbnail && (
                  <Link href={`/products/${review.product?.slug}`} className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image src={review.product.thumbnail} alt="" width={64} height={64} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                  </Link>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Link href={`/products/${review.product?.slug}`} className="text-sm font-medium text-primary-700 hover:underline">
                        {review.product?.name}
                      </Link>
                      <StarRating rating={review.rating} size="sm" className="mt-1" />
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <span className={cn('badge text-[10px]',
                        review.status === 'approved' ? 'bg-green-100 text-green-700' :
                        review.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-600')}>
                        {review.status}
                      </span>
                    </div>
                  </div>
                  {review.title && <p className="font-medium text-gray-800 text-sm">&quot;{review.title}&quot;</p>}
                  <p className="text-gray-600 text-sm mt-1">{review.comment}</p>
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-xs text-gray-400">{formatDate(review.createdAt, { dateStyle: 'medium' })}</p>
                    <button onClick={() => confirm('Delete this review?') && deleteMutation.mutate(review._id)}
                      className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-600 transition-colors">
                      <FiTrash2 className="text-xs" /> Delete
                    </button>
                  </div>
                </div>
              </div>
              {review.response?.text && (
                <div className="mt-3 ml-20 bg-primary-50 rounded-xl p-3">
                  <p className="text-xs text-primary-700 font-semibold mb-1">🌿 Jaipur Plants Hub replied:</p>
                  <p className="text-xs text-gray-600">{review.response.text}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
