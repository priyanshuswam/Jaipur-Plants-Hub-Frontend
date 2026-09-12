'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FiPlus, FiSearch, FiEdit2, FiTrash2, FiEye, FiCalendar } from 'react-icons/fi';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function AdminServicesPage() {
  const qc = useQueryClient();
  const [search, setSearch] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin-services'],
    queryFn: () => api.get('/services').then(r => r.data),
    staleTime: 60 * 1000,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      api.put(`/services/${id}`, { isActive: !isActive }),
    onSuccess: () => { toast.success('Service updated'); qc.invalidateQueries({ queryKey: ['admin-services'] }); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/services/${id}`),
    onSuccess: () => { toast.success('Service deleted'); qc.invalidateQueries({ queryKey: ['admin-services'] }); },
    onError: () => toast.error('Failed to delete service'),
  });

  const services = (data?.services || []).filter((s: any) =>
    !search || s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Services</h1>
        <Link href="/admin/services/new" className="btn-primary py-2.5 px-5 text-sm flex items-center gap-2">
          <FiPlus /> Add Service
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-soft p-4 mb-5 flex items-center gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search services..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-primary-400" />
        </div>
        <span className="text-sm text-gray-400">{services.length} services</span>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-40 skeleton rounded-2xl" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((service: any) => (
            <div key={service._id} className={cn('bg-white rounded-2xl shadow-soft overflow-hidden', !service.isActive ? 'opacity-60' : '')}>
              <div className="relative h-36 overflow-hidden">
                <Image src={service.thumbnail || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'} alt={service.name} fill className="object-cover" sizes="33vw" />
                <div className="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent" />
                <span className="absolute top-2 left-2 text-xl">{service.icon}</span>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
                  <span className={cn('badge text-[10px]', service.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white')}>
                    {service.isActive ? 'Active' : 'Inactive'}
                  </span>
                  <span className="text-white/80 text-xs flex items-center gap-1">
                    <FiCalendar className="text-xs" /> {service.bookingCount}+ bookings
                  </span>
                </div>
              </div>
              <div className="p-4">
                <p className="font-semibold text-gray-800 text-sm mb-1">{service.name}</p>
                <p className="text-gray-500 text-xs mb-3 line-clamp-2">{service.shortDescription}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 capitalize">{service.category?.replace(/-/g, ' ')}</span>
                  <div className="flex gap-1.5">
                    <Link href={`/services/${service.slug}`} target="_blank"
                      className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                      <FiEye className="text-sm" />
                    </Link>
                    <button onClick={() => toggleMutation.mutate({ id: service._id, isActive: service.isActive })}
                      className={cn('p-1.5 rounded-lg text-sm transition-colors', service.isActive ? 'hover:bg-red-50 text-gray-400 hover:text-red-500' : 'hover:bg-green-50 text-gray-400 hover:text-green-600')}>
                      <FiEdit2 className="text-sm" />
                    </button>
                    <button onClick={() => confirm('Delete this service?') && deleteMutation.mutate(service._id)}
                      className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                      <FiTrash2 className="text-sm" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
