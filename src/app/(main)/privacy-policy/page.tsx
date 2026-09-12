import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Privacy Policy – Jaipur Plants Hub' };

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-12">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Privacy Policy</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: January 1, 2026</p>
          {[
            { title: 'Information We Collect', body: 'We collect information you provide directly to us, such as your name, email address, phone number, delivery address, and payment information when you create an account, place an order, or contact us. We also automatically collect certain information about your device and how you interact with our website.' },
            { title: 'How We Use Your Information', body: 'We use the information we collect to process orders and deliver products, send transactional emails and order updates, provide customer support, send promotional communications (with your consent), improve our services and website, prevent fraud and ensure security, and comply with legal obligations.' },
            { title: 'Information Sharing', body: 'We do not sell or rent your personal information to third parties. We may share your information with payment processors (Razorpay), shipping partners, and email service providers only as necessary to provide our services. All third parties are bound by confidentiality agreements.' },
            { title: 'Data Security', body: 'We implement industry-standard security measures including SSL encryption, secure payment processing, and regular security audits to protect your personal information. We never store complete payment card details on our servers.' },
            { title: 'Cookies', body: 'We use cookies to improve your browsing experience, remember your preferences, and analyze website traffic. You can control cookie settings through your browser. Essential cookies required for the website to function cannot be disabled.' },
            { title: 'Your Rights', body: 'You have the right to access, correct, or delete your personal data. You may request a copy of your data or ask us to stop using it for marketing by contacting privacy@greenscapepro.com. We will respond within 30 days.' },
            { title: 'Contact Us', body: 'For privacy-related questions or concerns, contact our Data Protection Officer at privacy@greenscapepro.com or write to: Jaipur Plants Hub, 123 Garden Street, Green City, Maharashtra – 400001.' },
          ].map((section) => (
            <div key={section.title} className="mb-7">
              <h2 className="font-semibold text-gray-800 text-lg mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-6 flex gap-4">
            <Link href="/terms" className="text-primary-600 text-sm hover:underline">Terms of Service</Link>
            <Link href="/contact" className="text-primary-600 text-sm hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
