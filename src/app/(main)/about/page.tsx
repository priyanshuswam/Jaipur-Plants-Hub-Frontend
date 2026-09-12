import type { Metadata } from 'next';
import AboutClientPage from './AboutClientPage';

export const metadata: Metadata = {
  title: 'About Jaipur Plants Hub – Our Story & Team',
  description: '15+ years of transforming spaces into green paradises. Meet our expert team of horticulturists and landscape designers.',
};

export default function AboutPage() {
  return <AboutClientPage />;
}
