import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection';
import StatsSection from '@/components/home/StatsSection';
import FeaturedCategories from '@/components/home/FeaturedCategories';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import ServicesSection from '@/components/home/ServicesSection';
import AboutPreview from '@/components/home/AboutPreview';
import GalleryPreview from '@/components/home/GalleryPreview';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview';
import FAQSection from '@/components/home/FAQSection';
import CTASection from '@/components/home/CTASection';
import NewsletterSection from '@/components/home/NewsletterSection';

export const metadata: Metadata = {
  title: 'Jaipur Plants Hub – Premium Nursery & Landscape Solutions',
  description: 'Transform your space with Jaipur Plants Hub. 800+ premium plants, expert landscape design, terrace gardens, farmhouse development, and professional garden services across India.',
};

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroSection />
      <StatsSection />
      <FeaturedCategories />
      <FeaturedProducts />
      <ServicesSection />
      <AboutPreview />
      <GalleryPreview />
      <TestimonialsSection />
      <BlogPreview />
      <FAQSection />
      <CTASection />
      <NewsletterSection />
    </main>
  );
}
