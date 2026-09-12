'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiThumbsUp, FiEdit2 } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import api from '@/lib/axios';
import { useAuthStore } from '@/store/authStore';
import StarRating from '@/components/common/StarRating';
import { formatDate, timeAgo, cn } from '@/lib/utils';
import toast from 'react-hot-toast';
import type { Review } from '@/types';

const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().optional(),
  comment: z.string().min(10, 'Review must be at least 10 characters').max(1000),
});
type ReviewForm = z.infer<typeof reviewSchema>;

interface Props {
  productId: string;
  ratingsAverage: number;
  ratingsCount: number;
}

export default function ReviewSection({ productId, ratingsAverage, ratingsCount }: Props) {
  const [showForm, setShowForm] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [ratingFilter, setRatingFilter] = useState(0);
  const { isAuthenticated, user } = useAuthStore();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['reviews', productId, sortBy, ratingFilter],
    queryFn: () => api.get(`/reviews/product/${productId}`, {
      params: { sort: sortBy, rating: ratingFilter || undefined, limit: 20 },
    }).then(r => r.data),
    staleTime: 60 * 1000,
  });

  const reviews: Review[] = data?.reviews || [];
  const dist = data?.ratingDistribution || {};
  const total = ratingsCount;

  const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm<ReviewForm>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 0 },
  });

  const rating = watch('rating');

  const submitMutation = useMutation({
    mutationFn: (d: ReviewForm) => api.post(`/reviews/product/${productId}`, d).then(r => r.data),
    onSuccess: () => {
      toast.success('Review submitted! Thank you 🌿');
      reset();
      setShowForm(false);
      qc.invalidateQueries({ queryKey: ['reviews', productId] });
    },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to submit review'),
  });

  const helpfulMutation = useMutation({
    mutationFn: (id: string) => api.post(`/reviews/${id}/helpful`).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reviews', productId] }),
  });

  const pct = (n: number) => total > 0 ? Math.round((n / total) * 100) : 0;

  return (
    <div>
      {/* Summary */}
      <div className="flex flex-col sm:flex-row gap-8 mb-8 pb-8 border-b border-gray-100">
        <div className="flex flex-col items-center justify-center">
          <span className="font-display text-7xl font-bold text-primary-700 leading-none">{ratingsAverage || 0}</span>
          <StarRating rating={ratingsAverage} size="md" className="my-2" />
          <span className="text-sm text-gray-400">{total} reviews</span>
        </div>

        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map(r => (
            <button
              key={r}
              onClick={() => setRatingFilter(ratingFilter === r ? 0 : r)}
              className={cn(
                'flex items-center gap-3 w-full group',
                ratingFilter === r ? 'opacity-100' : 'opacity-80 hover:opacity-100'
              )}
            >
              <span className="text-xs text-gray-500 w-3 text-right">{r}</span>
              <span className="text-xs text-amber-400">⭐</span>
              <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="h-full bg-amber-400 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct(dist[r] || 0)}%` }}
                  transition={{ duration: 0.8, delay: (5 - r) * 0.1 }}
                />
              </div>
              <span className="text-xs text-gray-400 w-8">{dist[r] || 0}</span>
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3 justify-center">
          {isAuthenticated ? (
            <button onClick={() => setShowForm(!showForm)} className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
              <FiEdit2 /> Write Review
            </button>
          ) : (
            <a href="/login" className="btn-primary py-2.5 px-5 text-sm text-center">
              Login to Review
            </a>
          )}
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-primary-400"
          >
            <option value="newest">Newest</option>
            <option value="helpful">Most Helpful</option>
            <option value="rating-high">Highest Rating</option>
            <option value="rating-low">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Write Review Form */}
      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSubmit(d => submitMutation.mutate(d))}
          className="bg-primary-50 rounded-2xl p-6 mb-8 space-y-4"
        >
          <h3 className="font-semibold text-gray-800">Write Your Review</h3>

          <div>
            <p className="text-sm text-gray-600 mb-2">Your Rating *</p>
            <StarRating
              rating={rating}
              size="lg"
              interactive
              onRate={r => setValue('rating', r)}
            />
            {errors.rating && <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>}
          </div>

          <div>
            <input
              {...register('title')}
              placeholder="Review title (optional)"
              className="input-field text-sm"
            />
          </div>

          <div>
            <textarea
              {...register('comment')}
              placeholder="Share your experience with this plant... (min 10 characters)"
              rows={4}
              className="input-field text-sm resize-none"
            />
            {errors.comment && <p className="text-red-500 text-xs mt-1">{errors.comment.message}</p>}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="btn-primary py-2.5 px-6 text-sm"
            >
              {submitMutation.isPending ? 'Submitting...' : 'Submit Review'}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-ghost text-sm">
              Cancel
            </button>
          </div>
        </motion.form>
      )}

      {/* Reviews List */}
      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse space-y-2">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                  <div className="h-3 bg-gray-100 rounded w-full" />
                  <div className="h-3 bg-gray-100 rounded w-3/4" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-4xl mb-3">📝</p>
          <p>No reviews yet. Be the first to review!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {reviews.map(review => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="pb-6 border-b border-gray-100 last:border-0"
            >
              <div className="flex gap-3 mb-3">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-primary-100 flex-shrink-0">
                  {review.user?.avatar?.url ? (
                    <Image src={review.user.avatar.url} alt={review.user.firstName} width={40} height={40} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary-700 font-bold text-sm">
                      {review.user?.firstName?.[0]}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center flex-wrap gap-2 mb-1">
                    <span className="font-semibold text-gray-800 text-sm">
                      {review.user?.firstName} {review.user?.lastName?.[0]}.
                    </span>
                    {review.isVerifiedPurchase && (
                      <span className="badge bg-green-100 text-green-700 text-[10px]">✓ Verified Purchase</span>
                    )}
                    <span className="text-gray-400 text-xs ml-auto">{timeAgo(review.createdAt)}</span>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
              </div>

              {review.title && <p className="font-semibold text-gray-700 text-sm mb-1">{review.title}</p>}
              <p className="text-gray-600 text-sm leading-relaxed mb-3">{review.comment}</p>

              {/* Review images */}
              {review.images && review.images.length > 0 && (
                <div className="flex gap-2 mb-3">
                  {review.images.map((img, i) => (
                    <Image key={i} src={img.url} alt="" width={64} height={64} className="w-16 h-16 rounded-lg object-cover" />
                  ))}
                </div>
              )}

              {/* Seller response */}
              {review.response?.text && (
                <div className="ml-4 mt-3 bg-primary-50 rounded-xl p-3">
                  <p className="text-xs text-primary-700 font-semibold mb-1">🌿 Jaipur Plants Hub replied:</p>
                  <p className="text-sm text-gray-600">{review.response.text}</p>
                </div>
              )}

              {/* Helpful */}
              <div className="flex items-center gap-3 mt-3">
                <span className="text-xs text-gray-400">Was this helpful?</span>
                <button
                  onClick={() => isAuthenticated && helpfulMutation.mutate(review._id)}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-primary-600 transition-colors"
                >
                  <FiThumbsUp className="text-xs" />
                  Yes ({review.helpfulCount})
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
