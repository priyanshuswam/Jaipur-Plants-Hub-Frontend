'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminBlogsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-blogs', search, page],
    queryFn: () => api.get('/blogs', { params: { search: search || undefined, page, limit: 15, status: 'all' } }).then(r => r.data),
    staleTime: 30 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/blogs/${id}`),
    onSuccess: () => { toast.success('Blog deleted'); qc.invalidateQueries({ queryKey: ['admin-blogs'] }); },
  });

  const blogs = data?.blogs || [];
  const meta = data?.meta || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Blog Posts</h1>
        <Link href="/admin/blogs/new" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiPlus /> New Post
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search blogs..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400" />
        </div>
        <span className="text-sm text-gray-400">{meta.total || 0} posts</span>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="divide-y divide-gray-50">
          {isLoading ? Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-4 p-4 animate-pulse">
              <div className="w-16 h-16 bg-gray-200 rounded-xl" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
              </div>
            </div>
          )) : blogs.length === 0 ? (
            <div className="text-center py-12 text-gray-400">No blog posts yet</div>
          ) : (
            blogs.map((blog: any) => (
              <div key={blog._id} className="flex gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                  {blog.featuredImage?.url && <Image src={blog.featuredImage.url} alt="" width={64} height={64} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-800 line-clamp-1">{blog.title}</p>
                  <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                    <span className="capitalize badge bg-gray-100 text-gray-500">{blog.status}</span>
                    <span>{blog.category?.replace(/-/g, ' ')}</span>
                    {blog.publishedAt && <span>{formatDate(blog.publishedAt, { dateStyle: 'short' })}</span>}
                    <span>{blog.views || 0} views</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Link href={`/blogs/${blog.slug}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600">
                    <FiEye className="text-sm" />
                  </Link>
                  <Link href={`/admin/blogs/${blog._id}/edit`} className="p-1.5 hover:bg-primary-50 rounded-lg text-gray-400 hover:text-primary-600">
                    <FiEdit2 className="text-sm" />
                  </Link>
                  <button onClick={() => confirm('Delete this post?') && deleteMutation.mutate(blog._id)}
                    className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500">
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {meta.totalPages > 1 && (
          <div className="flex justify-between px-4 py-3 border-t border-gray-100">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="text-sm text-primary-600 disabled:opacity-40">← Prev</button>
            <span className="text-sm text-gray-400">{page}/{meta.totalPages}</span>
            <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="text-sm text-primary-600 disabled:opacity-40">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
