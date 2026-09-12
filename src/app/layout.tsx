import type { Metadata, Viewport } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import '@/styles/globals.css';
import QueryProvider from '@/providers/QueryProvider';
import ThemeProvider from '@/providers/ThemeProvider';
import AuthProvider from '@/providers/AuthProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
  weight: ['400', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  themeColor: '#2E7D32',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: 'Jaipur Plants Hub – Premium Nursery & Landscape Solutions',
    template: '%s | Jaipur Plants Hub',
  },
  description:
    'Transform your space with Jaipur Plants Hub. Premium plants, expert landscape design, farmhouse development, terrace gardens, and professional garden services.',
  keywords: [
    'nursery', 'landscape design', 'garden services', 'plants online', 'indoor plants',
    'outdoor plants', 'farmhouse garden', 'terrace garden', 'garden maintenance', 'landscape architecture',
  ],
  authors: [{ name: 'Jaipur Plants Hub', url: 'https://jaipurplantshub.com' }],
  creator: 'Jaipur Plants Hub',
  publisher: 'Jaipur Plants Hub',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://jaipurplantshub.com'),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Jaipur Plants Hub',
    title: 'Jaipur Plants Hub – Premium Nursery & Landscape Solutions',
    description: 'Transform your space with expert landscape design and premium plants.',
    images: [{ url: '/images/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jaipur Plants Hub – Premium Nursery & Landscape Solutions',
    description: 'Transform your space with expert landscape design and premium plants.',
    images: ['/images/og-image.jpg'],
    creator: '@jaipurplantshub',
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <QueryProvider>
          <ThemeProvider>
            <AuthProvider>
              {children}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#fff',
                    color: '#1a2e1c',
                    border: '1px solid #e8f5e9',
                    borderRadius: '12px',
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                    padding: '14px 18px',
                    fontSize: '14px',
                    fontWeight: '500',
                  },
                  success: {
                    iconTheme: { primary: '#2E7D32', secondary: '#fff' },
                  },
                  error: {
                    iconTheme: { primary: '#ef4444', secondary: '#fff' },
                  },
                }}
              />
            </AuthProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
