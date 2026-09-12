import type { Metadata } from 'next';
import ServicesClientPage from './ServicesClientPage';

export const metadata: Metadata = {
  title: 'Garden & Landscape Services',
  description: 'Professional garden design, farmhouse development, terrace gardens, and maintenance services.',
};

export default function ServicesPage() {
  return <ServicesClientPage />;
}
