'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiClock, FiUser, FiCalendar, FiShare2, FiHeart, FiTag, FiArrowRight } from 'react-icons/fi';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import Breadcrumb from '@/components/common/Breadcrumb';
import ProductCard from '@/components/product/ProductCard';
import { PageLoader } from '@/components/common/LoadingSpinner';
import toast from 'react-hot-toast';

export default function BlogDetailPage() {
  const params = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['blog', params.slug],
    queryFn: () => api.get(`/blogs/${params.slug}`).then(r => r.data),
    staleTime: 5 * 60 * 1000,
  });

  const blog = data?.blog;

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: blog.title, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied!');
    }
  };

  if (isLoading) return <PageLoader />;
  if (!blog) return (
    <div className="min-h-screen pt-24 text-center">
      <p className="text-5xl mb-4">📝</p>
      <p className="text-gray-500 mb-4">Article not found</p>
      <Link href="/blogs" className="btn-primary inline-flex">Back to Blog</Link>
    </div>
  );

  return (
    <div className="min-h-screen bg-surface pt-20">
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-4">
          <Breadcrumb items={[{ label: 'Blog', href: '/blogs' }, { label: blog.title }]} />
        </div>
      </div>

      <div className="container-custom py-10">
        <div className="grid lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {/* Article */}
          <article className="lg:col-span-2">
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="badge bg-primary-100 text-primary-700 capitalize">{blog.category?.replace(/-/g, ' ')}</span>
                {blog.isFeatured && <span className="badge bg-amber-100 text-amber-700">Featured</span>}
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 leading-tight mb-4">{blog.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-6 pb-6 border-b border-gray-100">
                <span className="flex items-center gap-1.5">
                  <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 text-xs font-bold">
                    {blog.author?.firstName?.[0]}
                  </div>
                  {blog.author?.firstName} {blog.author?.lastName}
                </span>
                <span className="flex items-center gap-1"><FiCalendar className="text-xs" /> {blog.publishedAt ? formatDate(blog.publishedAt, { dateStyle: 'long' }) : ''}</span>
                <span className="flex items-center gap-1"><FiClock className="text-xs" /> {blog.readingTime} min read</span>
                <button onClick={handleShare} className="flex items-center gap-1 ml-auto hover:text-primary-600 transition-colors">
                  <FiShare2 className="text-sm" /> Share
                </button>
              </div>
            </motion.div>

            {/* Featured Image */}
            <div className="relative h-72 lg:h-96 rounded-3xl overflow-hidden mb-8 shadow-soft-lg">
              <Image src={blog.featuredImage?.url} alt={blog.title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 66vw" />
            </div>

            {/* Content */}
            <div
              className="prose prose-lg prose-green max-w-none mb-8"
              dangerouslySetInnerHTML={{ __html: blog.content || '<p>' + (blog.content?.replace(/\n/g, '</p><p>') || '') + '</p>' }}
            />

            {/* Tags */}
            {blog.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 pt-6 border-t border-gray-100">
                <span className="text-sm text-gray-500 flex items-center gap-1.5"><FiTag /> Tags:</span>
                {blog.tags.map((tag: string) => (
                  <Link key={tag} href={`/blogs?search=${tag}`} className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full hover:bg-primary-50 hover:text-primary-700 transition-colors">
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            {/* Related Products */}
            {blog.relatedProducts?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-display text-xl font-bold text-gray-900 mb-4">Featured Plants</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {blog.relatedProducts.slice(0, 3).map((p: any) => <ProductCard key={p._id} product={p} compact />)}
                </div>
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Author Card */}
            <div className="bg-white rounded-2xl shadow-soft p-5">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Written by</p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-700">
                  {blog.author?.firstName?.[0]}{blog.author?.lastName?.[0]}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">{blog.author?.firstName} {blog.author?.lastName}</p>
                  <p className="text-xs text-gray-400">Horticulturist & Garden Designer</p>
                </div>
              </div>
            </div>

            {/* Related Posts */}
            {blog.relatedPosts?.length > 0 && (
              <div className="bg-white rounded-2xl shadow-soft p-5">
                <p className="font-semibold text-gray-800 mb-4">Related Articles</p>
                <div className="space-y-4">
                  {blog.relatedPosts.map((p: any) => (
                    <Link key={p._id} href={`/blogs/${p.slug}`} className="flex gap-3 group">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                        {p.featuredImage?.url && <Image src={p.featuredImage.url} alt={p.title} width={64} height={64} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 group-hover:text-primary-700 transition-colors line-clamp-2">{p.title}</p>
                        <p className="text-xs text-gray-400 mt-1">{p.readingTime} min read</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-gradient-primary rounded-2xl p-5 text-white">
              <p className="font-semibold mb-2">Need expert garden advice?</p>
              <p className="text-primary-200 text-sm mb-4">Book a free consultation with our designers.</p>
              <Link href="/query?type=consultation" className="block bg-white text-primary-800 text-sm font-semibold text-center py-2.5 rounded-xl hover:bg-primary-50 transition-colors">
                Book Consultation
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
