import type { Metadata } from 'next';
import { Suspense } from 'react';
import QueryClientPage from './QueryClientPage';

export const metadata: Metadata = {
  title: 'Request a Quote / Consultation',
  description: 'Get a free consultation or quote for your garden design, landscape, or plant requirements.',
};

export default function QueryPage() {
  return (
    <Suspense>
      <QueryClientPage />
    </Suspense>
  );
}
