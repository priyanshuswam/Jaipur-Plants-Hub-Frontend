'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiUser, FiShield, FiToggleRight, FiMail, FiEdit2 } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { formatDate, cn } from '@/lib/utils';
import toast from 'react-hot-toast';

const ROLES = ['', 'customer', 'staff', 'manager', 'admin'];
const ROLE_COLORS: Record<string, string> = {
  admin: 'bg-purple-100 text-purple-700',
  manager: 'bg-blue-100 text-blue-700',
  staff: 'bg-cyan-100 text-cyan-700',
  customer: 'bg-gray-100 text-gray-600',
};

export default function AdminUsersPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', search, role, page],
    queryFn: () => api.get('/users/admin', { params: { search: search || undefined, role: role || undefined, page, limit: 20 } }).then(r => r.data),
    staleTime: 30 * 1000,
  });

  const toggleMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/admin/${id}/activate`),
    onSuccess: () => { toast.success('User status updated'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: () => toast.error('Failed to update user'),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ id, role }: { id: string; role: string }) => api.put(`/users/admin/${id}/role`, { role }),
    onSuccess: () => { toast.success('Role updated'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: (e: any) => toast.error(e?.response?.data?.message || 'Failed to update role'),
  });

  const users = data?.users || [];
  const meta = data?.meta || {};

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Users</h1>

      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-48">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search users..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400" />
        </div>
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }}
          className="text-sm border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-primary-400">
          {ROLES.map(r => <option key={r} value={r}>{r ? r.charAt(0).toUpperCase() + r.slice(1) : 'All Roles'}</option>)}
        </select>
        <span className="text-sm text-gray-400">{meta.total || 0} users</span>
      </div>

      <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                {['User', 'Email', 'Phone', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
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
              ) : users.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-12 text-gray-400">No users found</td></tr>
              ) : (
                users.map((user: any) => (
                  <tr key={user._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-700 font-semibold text-xs flex-shrink-0">
                          {user.firstName?.[0]}{user.lastName?.[0]}
                        </div>
                        <p className="font-medium text-gray-800">{user.firstName} {user.lastName}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500">{user.email}</td>
                    <td className="px-4 py-3 text-gray-500">{user.phone || '—'}</td>
                    <td className="px-4 py-3">
                      <select
                        defaultValue={user.role}
                        onChange={e => changeRoleMutation.mutate({ id: user._id, role: e.target.value })}
                        className={cn('text-xs px-2 py-1 rounded-full border-0 font-semibold cursor-pointer focus:ring-0', ROLE_COLORS[user.role] || 'bg-gray-100')}
                      >
                        {['customer', 'staff', 'manager', 'admin'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className={cn('badge', user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600')}>
                        {user.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{formatDate(user.createdAt, { dateStyle: 'short' })}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => toggleMutation.mutate(user._id)} disabled={toggleMutation.isPending}
                        className={cn('p-1.5 rounded-lg transition-colors text-sm', user.isActive ? 'hover:bg-red-50 text-gray-400 hover:text-red-500' : 'hover:bg-green-50 text-gray-400 hover:text-green-600')}
                        title={user.isActive ? 'Deactivate' : 'Activate'}>
                        <FiToggleRight />
                      </button>
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
