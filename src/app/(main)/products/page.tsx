import type { Metadata } from 'next';
import { Suspense } from 'react';
import ProductsClientPage from './ProductsClientPage';

export const metadata: Metadata = {
  title: 'Shop Plants & Garden Products',
  description: 'Browse 800+ premium plants, seeds, pots, fertilizers and gardening tools. Free delivery above ₹999.',
};

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-surface pt-20 flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin" /></div>}>
      <ProductsClientPage />
    </Suspense>
  );
}
