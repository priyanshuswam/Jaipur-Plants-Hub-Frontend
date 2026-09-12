import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  tag?: string;
  title: string;
  highlight?: string;
  description?: string;
  center?: boolean;
  light?: boolean;
  className?: string;
}

export default function SectionHeader({ tag, title, highlight, description, center = true, light = false, className }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={cn(center ? 'text-center' : '', className)}
    >
      {tag && (
        <span className={cn(
          'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide uppercase mb-4',
          light ? 'bg-white/10 text-white/80' : 'bg-primary-50 text-primary-700'
        )}>
          {tag}
        </span>
      )}
      <h2 className={cn(
        'font-display text-4xl lg:text-5xl font-bold leading-tight mb-4',
        light ? 'text-white' : 'text-gray-900'
      )}>
        {title}
        {highlight && (
          <>
            {' '}
            <span className={light
              ? 'text-primary-300'
              : 'bg-gradient-to-r from-primary-700 to-accent bg-clip-text text-transparent'
            }>
              {highlight}
            </span>
          </>
        )}
      </h2>
      {description && (
        <p className={cn(
          'text-lg leading-relaxed',
          center ? 'max-w-2xl mx-auto' : 'max-w-xl',
          light ? 'text-white/70' : 'text-gray-500'
        )}>
          {description}
        </p>
      )}
    </motion.div>
  );
}
