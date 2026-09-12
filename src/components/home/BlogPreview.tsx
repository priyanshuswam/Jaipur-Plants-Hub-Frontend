'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowRight, FiClock, FiUser } from 'react-icons/fi';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate } from '@/lib/utils';

const FALLBACK = [
  { _id: '1', title: '10 Best Indoor Plants for Indian Homes', slug: 'best-indoor-plants-indian-homes', excerpt: 'Discover the perfect indoor plants that thrive in Indian climate conditions and transform your living space into a green paradise.', category: 'indoor-plants', readingTime: 5, publishedAt: '2026-06-15', author: { firstName: 'Amit', lastName: 'Sharma' }, featuredImage: { url: '/images/plant-placeholder.svg' } },
  { _id: '2', title: 'Complete Guide to Terrace Gardening in 2026', slug: 'complete-guide-terrace-gardening-2026', excerpt: 'Everything you need to know about setting up and maintaining a beautiful terrace garden, from waterproofing to plant selection.', category: 'gardening-tips', readingTime: 8, publishedAt: '2026-06-10', author: { firstName: 'Priya', lastName: 'Nair' }, featuredImage: { url: '/images/plant-placeholder.svg' } },
  { _id: '3', title: 'How to Care for Succulents in Summer', slug: 'care-for-succulents-in-summer', excerpt: 'Summer can be challenging for succulents. Here are expert tips to keep your collection healthy through the hot months.', category: 'plant-care', readingTime: 4, publishedAt: '2026-06-05', author: { firstName: 'Rahul', lastName: 'Gupta' }, featuredImage: { url: '/images/plant-placeholder.svg' } },
];

export default function BlogPreview() {
  const { data } = useQuery({
    queryKey: ['blogs', 'featured'],
    queryFn: () => api.get('/blogs/featured', { params: { limit: 3 } }).then(r => r.data.blogs),
    staleTime: 10 * 60 * 1000,
  });

  const posts = (data?.length ? data : FALLBACK);

  return (
    <section className="py-20 bg-white">
      <div className="container-custom">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <span className="section-tag">📝 Blog & Tips</span>
            <h2 className="section-heading">Garden Wisdom & Inspiration</h2>
          </motion.div>
          <Link href="/blogs" className="btn-secondary shrink-0">
            All Articles <FiArrowRight />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {posts.map((post: any, i: number) => (
            <motion.article
              key={post._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="card-blog group"
            >
              {/* Image */}
              <Link href={`/blogs/${post.slug}`} className="block relative overflow-hidden h-52">
                <Image
                  src={post.featuredImage?.url || post.featuredImage}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute top-3 left-3">
                  <span className="badge bg-primary-700 text-white text-[10px] capitalize">
                    {post.category?.replace(/-/g, ' ')}
                  </span>
                </div>
              </Link>

              <div className="p-5">
                <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <FiUser className="text-xs" />
                    {post.author?.firstName} {post.author?.lastName}
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <FiClock className="text-xs" />
                    {post.readingTime} min read
                  </span>
                  {post.publishedAt && (
                    <>
                      <span>·</span>
                      <span>{formatDate(post.publishedAt, { dateStyle: 'medium' })}</span>
                    </>
                  )}
                </div>

                <Link href={`/blogs/${post.slug}`}>
                  <h3 className="font-semibold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors mb-2">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2 mb-4">{post.excerpt}</p>

                <Link
                  href={`/blogs/${post.slug}`}
                  className="inline-flex items-center gap-1.5 text-primary-700 text-sm font-medium hover:gap-2.5 transition-all"
                >
                  Read More <FiArrowRight className="text-xs" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
