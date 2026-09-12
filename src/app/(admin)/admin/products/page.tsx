'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiToggleRight, FiAlertTriangle, FiEye } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/services/productService';
import { formatPrice, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminProductsPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-products', search, page, filter],
    queryFn: () => productService.getAll({
      search: search || undefined,
      page, limit: 20,
      ...(filter === 'low-stock' ? { inStock: 'lowstock' } : {}),
      ...(filter === 'inactive' ? { active: 'false' } : {}),
    }).then(r => r.data),
    staleTime: 30 * 1000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => productService.delete(id),
    onSuccess: () => { toast.success('Product deleted'); qc.invalidateQueries({ queryKey: ['admin-products'] }); },
    onError: () => toast.error('Failed to delete product'),
  });

  const products = data?.products || [];
  const meta = data?.meta || {};

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/admin/products/new" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiPlus /> Add Product
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400" />
        </div>
        <div className="flex gap-2">
          {[{ v: '', l: 'All' }, { v: 'low-stock', l: '⚠️ Low Stock' }, { v: 'inactive', l: 'Inactive' }].map(f => (
            <button key={f.v} onClick={() => { setFilter(f.v); setPage(1); }}
              className={cn('px-3 py-1.5 rounded-full text-xs font-medium transition-all',
                filter === f.v ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}>
              {f.l}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-400 ml-auto">{meta.total || 0} products</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['Product', 'SKU', 'Price', 'Stock', 'Status', 'Sales', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {isLoading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <tr key={i}>{Array.from({ length: 7 }).map((_, j) => (
                    <td key={j} className="px-4 py-3"><div className="h-4 skeleton rounded w-20" /></td>
                  ))}</tr>
                ))
              ) : products.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No products found</td></tr>
              ) : (
                products.map((product: any) => (
                  <tr key={product._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {product.thumbnail && <Image src={product.thumbnail} alt="" width={40} height={40} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-xs text-gray-400">{product.category?.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 font-mono text-xs">{product.sku}</td>
                    <td className="px-4 py-3 font-semibold text-gray-800">
                      {formatPrice(product.price)}
                      {product.compareAtPrice > product.price && (
                        <span className="text-xs text-gray-400 line-through ml-1">{formatPrice(product.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('font-semibold', product.stock === 0 ? 'text-red-500' : product.stock <= product.lowStockThreshold ? 'text-amber-500' : 'text-green-600')}>
                        {product.stock}
                      </span>
                      {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                        <FiAlertTriangle className="inline ml-1 text-amber-400 text-xs" />
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500')}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{product.totalSales || 0}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <Link href={`/products/${product.slug}`} target="_blank" className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors" title="View">
                          <FiEye className="text-sm" />
                        </Link>
                        <Link href={`/admin/products/${product._id}/edit`} className="p-1.5 hover:bg-primary-50 rounded-lg text-gray-400 hover:text-primary-600 transition-colors" title="Edit">
                          <FiEdit2 className="text-sm" />
                        </Link>
                        <button onClick={() => { if (confirm('Delete this product?')) deleteMutation.mutate(product._id); }}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors" title="Delete">
                          <FiTrash2 className="text-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {meta.totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-400">Page {page} of {meta.totalPages}</p>
            <div className="flex gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
              <button onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))} disabled={page === meta.totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
