import type { Metadata } from 'next';
import BlogsClientPage from './BlogsClientPage';

export const metadata: Metadata = {
  title: 'Blog – Gardening Tips, Plant Care & Landscape Ideas',
  description: 'Expert guides on plant care, gardening tips, landscape design inspiration, and seasonal garden advice from Jaipur Plants Hub.',
};

export default function BlogsPage() {
  return <BlogsClientPage />;
}
