'use client';

import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { FiSave, FiRefreshCw } from 'react-icons/fi';
import { useQuery, useMutation } from '@tanstack/react-query';
import api from '@/lib/axios';
import toast from 'react-hot-toast';

export default function AdminSettingsPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () => api.get('/settings/admin').then(r => r.data.grouped),
    staleTime: 60 * 1000,
  });

  const { register, handleSubmit } = useForm();

  const updateMutation = useMutation({
    mutationFn: (d: any) => api.put('/settings/admin', d),
    onSuccess: () => { toast.success('Settings saved!'); refetch(); },
    onError: () => toast.error('Failed to save settings'),
  });

  const initMutation = useMutation({
    mutationFn: () => api.post('/settings/admin/init'),
    onSuccess: () => { toast.success('Settings initialized!'); refetch(); },
  });

  const GROUPS = [
    {
      key: 'general', label: '🌐 General', fields: [
        { key: 'site_name', label: 'Site Name', type: 'text' },
        { key: 'site_tagline', label: 'Site Tagline', type: 'text' },
        { key: 'site_maintenance', label: 'Maintenance Mode', type: 'checkbox' },
      ],
    },
    {
      key: 'business', label: '🏢 Business', fields: [
        { key: 'company_name', label: 'Company Name', type: 'text' },
        { key: 'company_phone', label: 'Phone', type: 'text' },
        { key: 'company_email', label: 'Email', type: 'email' },
        { key: 'company_whatsapp', label: 'WhatsApp Number', type: 'text' },
        { key: 'working_hours', label: 'Working Hours', type: 'text' },
        { key: 'company_address', label: 'Address', type: 'text' },
      ],
    },
    {
      key: 'shipping', label: '🚚 Shipping', fields: [
        { key: 'free_shipping_threshold', label: 'Free Shipping Above (₹)', type: 'number' },
        { key: 'standard_shipping_cost', label: 'Standard Shipping Cost (₹)', type: 'number' },
        { key: 'cod_available', label: 'COD Available', type: 'checkbox' },
        { key: 'cod_charges', label: 'COD Charges (₹)', type: 'number' },
      ],
    },
    {
      key: 'social', label: '📱 Social Media', fields: [
        { key: 'social_facebook', label: 'Facebook URL', type: 'text' },
        { key: 'social_instagram', label: 'Instagram URL', type: 'text' },
        { key: 'social_youtube', label: 'YouTube URL', type: 'text' },
        { key: 'social_twitter', label: 'Twitter/X URL', type: 'text' },
      ],
    },
    {
      key: 'seo', label: '🔍 SEO', fields: [
        { key: 'seo_title', label: 'Default SEO Title', type: 'text' },
        { key: 'seo_description', label: 'Default SEO Description', type: 'text' },
        { key: 'seo_keywords', label: 'SEO Keywords (comma-separated)', type: 'text' },
        { key: 'google_analytics_id', label: 'Google Analytics ID', type: 'text' },
      ],
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-soft p-6 space-y-3 animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4" />
            <div className="h-4 bg-gray-100 rounded w-full" />
            <div className="h-4 bg-gray-100 rounded w-3/4" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold text-gray-900">Site Settings</h1>
        <div className="flex gap-3">
          <button onClick={() => initMutation.mutate()} disabled={initMutation.isPending}
            className="flex items-center gap-2 text-sm text-gray-500 border border-gray-200 rounded-xl px-4 py-2 hover:bg-gray-50 disabled:opacity-60">
            <FiRefreshCw className={initMutation.isPending ? 'animate-spin' : ''} /> Init Defaults
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit(d => updateMutation.mutate(d))}>
        <div className="space-y-6">
          {GROUPS.map(group => (
            <motion.div key={group.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-soft p-6">
              <h2 className="font-semibold text-gray-800 mb-5">{group.label}</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                {group.fields.map(field => (
                  <div key={field.key} className={field.type === 'checkbox' ? 'flex items-center gap-3 col-span-2' : ''}>
                    {field.type === 'checkbox' ? (
                      <>
                        <input
                          {...register(field.key)}
                          type="checkbox"
                          defaultChecked={data?.[group.key]?.[field.key]}
                          className="w-4 h-4 rounded text-primary-600"
                        />
                        <label className="text-sm font-medium text-gray-700">{field.label}</label>
                      </>
                    ) : (
                      <>
                        <label className="block text-xs font-medium text-gray-600 mb-1">{field.label}</label>
                        <input
                          {...register(field.key)}
                          type={field.type}
                          defaultValue={data?.[group.key]?.[field.key] || ''}
                          className="input-field text-sm"
                        />
                      </>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="sticky bottom-4 mt-6 flex justify-end">
          <button type="submit" disabled={updateMutation.isPending}
            className="btn-primary py-3 px-7 flex items-center gap-2 shadow-green-lg disabled:opacity-70">
            {updateMutation.isPending
              ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <FiSave />}
            Save All Settings
          </button>
        </div>
      </form>
    </div>
  );
}
