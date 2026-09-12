'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiMessageSquare, FiEye, FiCheckCircle, FiChevronDown } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const STATUS_COLORS: Record<string, string> = {
  new: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  contacted: 'bg-purple-100 text-purple-700',
  converted: 'bg-green-100 text-green-700',
  closed: 'bg-gray-100 text-gray-500',
  spam: 'bg-red-100 text-red-600',
};

export default function AdminQueriesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [selected, setSelected] = useState<any>(null);
  const [note, setNote] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-queries', search, status, page],
    queryFn: () => api.get('/queries/admin/all', { params: { search: search || undefined, status: status || undefined, page, limit: 15 } }).then(r => r.data),
    staleTime: 30 * 1000,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => api.put(`/queries/admin/${id}/status`, { status }),
    onSuccess: () => { toast.success('Status updated'); qc.invalidateQueries({ queryKey: ['admin-queries'] }); },
  });

  const addNoteMutation = useMutation({
    mutationFn: ({ id, text }: { id: string; text: string }) => api.post(`/queries/admin/${id}/note`, { text }),
    onSuccess: () => { toast.success('Note added'); setNote(''); qc.invalidateQueries({ queryKey: ['admin-queries'] }); },
  });

  const queries = data?.queries || [];
  const meta = data?.meta || {};

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Customer Queries</h1>

      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search queries..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400" />
        </div>
        <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5">
          {['', 'new', 'in_progress', 'contacted', 'converted', 'closed', 'spam'].map(s => (
            <option key={s} value={s}>{s ? s.replace(/_/g, ' ') : 'All Status'}</option>
          ))}
        </select>
        <span className="text-sm text-gray-400">{meta.total || 0} queries</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-soft overflow-hidden">
          <div className="divide-y divide-gray-50">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="p-4 space-y-2 animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-1/3" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                </div>
              ))
            ) : queries.length === 0 ? (
              <div className="text-center py-12">
                <FiMessageSquare className="text-4xl text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400">No queries found</p>
              </div>
            ) : (
              queries.map((query: any) => (
                <button
                  key={query._id}
                  onClick={() => setSelected(query)}
                  className={cn('w-full text-left p-4 hover:bg-gray-50 transition-colors', selected?._id === query._id ? 'bg-primary-50' : '')}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">{query.name}</p>
                      <p className="text-xs text-gray-400">{query.email} · {query.phone}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 flex-shrink-0">
                      <span className={cn('badge text-[10px]', STATUS_COLORS[query.status] || 'bg-gray-100')}>{query.status}</span>
                      <span className="text-[10px] text-gray-400">{formatDate(query.createdAt, { dateStyle: 'short' })}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-1">{query.message}</p>
                  <div className="flex gap-2 mt-1.5">
                    <span className="badge bg-gray-100 text-gray-500 text-[10px]">{query.type}</span>
                    {query.serviceType && <span className="badge bg-primary-50 text-primary-600 text-[10px]">{query.serviceType}</span>}
                  </div>
                </button>
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

        {/* Detail */}
        <div className="bg-white rounded-2xl shadow-soft p-5">
          {selected ? (
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-800">{selected.name}</p>
                <p className="text-sm text-gray-400">{selected.email}</p>
                <p className="text-sm text-primary-600">{selected.phone}</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Message</p>
                <p className="text-sm text-gray-700">{selected.message}</p>
              </div>

              {selected.serviceType && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Service:</span> {selected.serviceType}
                </div>
              )}

              {/* Status update */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Update Status</p>
                <div className="flex flex-wrap gap-1.5">
                  {['new', 'in_progress', 'contacted', 'converted', 'closed'].map(s => (
                    <button
                      key={s}
                      onClick={() => { updateMutation.mutate({ id: selected._id, status: s }); setSelected({ ...selected, status: s }); }}
                      className={cn('text-xs px-2.5 py-1 rounded-full transition-all', selected.status === s ? (STATUS_COLORS[s] || 'bg-gray-200') : 'bg-gray-100 text-gray-500 hover:bg-gray-200')}
                    >
                      {s.replace(/_/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Add Note</p>
                <textarea value={note} onChange={e => setNote(e.target.value)} rows={3} placeholder="Internal note..."
                  className="input-field text-sm resize-none mb-2" />
                <button onClick={() => note && addNoteMutation.mutate({ id: selected._id, text: note })}
                  disabled={!note || addNoteMutation.isPending}
                  className="btn-primary py-2 px-4 text-xs w-full disabled:opacity-70">
                  {addNoteMutation.isPending ? 'Saving...' : 'Save Note'}
                </button>
              </div>

              {/* Existing notes */}
              {selected.notes?.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Notes</p>
                  <div className="space-y-2">
                    {selected.notes.map((n: any, i: number) => (
                      <div key={i} className="bg-primary-50 rounded-lg p-2.5">
                        <p className="text-xs text-gray-700">{n.text}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{formatDate(n.addedAt, { dateStyle: 'short' })}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-10">
              <FiMessageSquare className="text-4xl text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Select a query to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
