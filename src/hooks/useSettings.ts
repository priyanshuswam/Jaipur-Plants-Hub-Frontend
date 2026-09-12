/**
 * useSettings — fetch and cache public site settings
 */

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/axios';
import type { Settings } from '@/types';

export function useSettings() {
  const { data, isLoading } = useQuery<Settings>({
    queryKey: ['public-settings'],
    queryFn: () => api.get('/settings/public').then(r => r.data.settings),
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  return {
    settings: data || {},
    isLoading,
    get: (key: string, fallback?: any) => data?.[key] ?? fallback,
  };
}
