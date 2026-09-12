import Link from 'next/link';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface Props {
  items: BreadcrumbItem[];
  className?: string;
  light?: boolean;
}

export default function Breadcrumb({ items, className, light = false }: Props) {
  const all = [{ label: 'Home', href: '/' }, ...items];

  return (
    <nav aria-label="Breadcrumb" className={cn('flex items-center gap-1 text-sm', className)}>
      {all.map((item, i) => (
        <div key={item.label} className="flex items-center gap-1">
          {i > 0 && <FiChevronRight className={cn('text-xs', light ? 'text-white/40' : 'text-gray-300')} />}
          {item.href && i < all.length - 1 ? (
            <Link
              href={item.href}
              className={cn(
                'hover:underline transition-colors flex items-center gap-1',
                light ? 'text-white/70 hover:text-white' : 'text-gray-400 hover:text-primary-600'
              )}
            >
              {i === 0 && <FiHome className="text-xs" />}
              {item.label}
            </Link>
          ) : (
            <span className={cn(
              'font-medium',
              light ? 'text-white' : 'text-gray-700'
            )}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
