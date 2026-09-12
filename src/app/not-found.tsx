import Link from 'next/link';
import { FiArrowLeft, FiHome, FiShoppingBag } from 'react-icons/fi';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        {/* Decorative plant SVG */}
        <div className="text-9xl font-display font-black text-primary-100 leading-none select-none mb-2">404</div>
        <div className="text-6xl mb-6 animate-float">🌿</div>
        <h1 className="font-display text-3xl font-bold text-gray-900 mb-3">
          This Page Has Gone to Seed
        </h1>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back to greener pastures.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Link href="/" className="btn-primary px-7 py-3.5 flex items-center gap-2">
            <FiHome /> Back to Home
          </Link>
          <Link href="/products" className="btn-secondary px-7 py-3.5 flex items-center gap-2">
            <FiShoppingBag /> Browse Plants
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-gray-400">
          {[
            { label: 'Garden Design', href: '/services' },
            { label: 'About Us', href: '/about' },
            { label: 'Contact', href: '/contact' },
            { label: 'Blog', href: '/blogs' },
          ].map(link => (
            <Link key={link.href} href={link.href} className="hover:text-primary-600 transition-colors">
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
