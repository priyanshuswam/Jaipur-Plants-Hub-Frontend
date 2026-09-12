'use client';

import { FiStar } from 'react-icons/fi';
import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';

interface Props {
  rating: number;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  showCount?: boolean;
  interactive?: boolean;
  onRate?: (rating: number) => void;
  className?: string;
}

export default function StarRating({ rating, count, size = 'sm', showCount = false, interactive = false, onRate, className }: Props) {
  const sizes = { sm: 'text-xs', md: 'text-base', lg: 'text-xl' };

  return (
    <div className={cn('flex items-center gap-1', className)}>
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => {
          const filled = rating >= star;
          const half = !filled && rating >= star - 0.5;
          return (
            <button
              key={star}
              onClick={() => interactive && onRate?.(star)}
              disabled={!interactive}
              className={cn(sizes[size], interactive && 'cursor-pointer hover:scale-110 transition-transform')}
            >
              {filled ? (
                <FaStar className="text-amber-400" />
              ) : half ? (
                <FaStarHalfAlt className="text-amber-400" />
              ) : (
                <FiStar className="text-gray-300" />
              )}
            </button>
          );
        })}
      </div>
      {showCount && count !== undefined && (
        <span className="text-xs text-gray-400 ml-1">({count})</span>
      )}
    </div>
  );
}
