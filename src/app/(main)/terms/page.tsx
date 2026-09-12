import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Terms of Service – Jaipur Plants Hub' };

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-surface pt-24 pb-16">
      <div className="container-custom max-w-4xl">
        <div className="bg-white rounded-3xl shadow-soft p-8 lg:p-12">
          <h1 className="font-display text-3xl font-bold text-gray-900 mb-2">Terms of Service</h1>
          <p className="text-gray-400 text-sm mb-8">Last updated: January 1, 2026</p>
          {[
            { title: '1. Acceptance of Terms', body: 'By accessing and using Jaipur Plants Hub\'s website and services, you agree to these Terms of Service. If you do not agree, please do not use our services.' },
            { title: '2. Products and Orders', body: 'All products are subject to availability. Prices are listed in Indian Rupees (INR) and include applicable taxes unless stated otherwise. We reserve the right to cancel any order if the product is unavailable or there is a pricing error. In such cases, a full refund will be issued.' },
            { title: '3. Payment Terms', body: 'Payment must be completed at the time of order for online payments. For COD orders, payment is due upon delivery. We accept UPI, cards, net banking, and Cash on Delivery. All online transactions are secured by Razorpay.' },
            { title: '4. Delivery Policy', body: 'We deliver to 500+ cities across India. Delivery times vary: 2-5 business days for standard, 1-2 days for express. We are not responsible for delays caused by weather, logistics disruptions, or incorrect delivery addresses provided by customers.' },
            { title: '5. Product Quality Guarantee', body: 'All plants are inspected and carefully packaged before dispatch. We guarantee healthy plants or a free replacement within 7 days of delivery if the plant arrived damaged or unhealthy. Contact support@greenscapepro.com with your order number and photos for replacement.' },
            { title: '6. Landscape Services', body: 'Service quotations are valid for 30 days. All landscape projects require a 30% advance deposit before work commences. Final payment is due upon project completion. We guarantee workmanship for 1 year from project completion.' },
            { title: '7. Intellectual Property', body: 'All content on this website, including text, images, logos, and design, is owned by Jaipur Plants Hub and protected by Indian copyright law. You may not reproduce, distribute, or use our content without written permission.' },
            { title: '8. Limitation of Liability', body: 'Jaipur Plants Hub\'s liability is limited to the value of the products purchased. We are not liable for indirect, incidental, or consequential damages. Our liability for landscape service claims is limited to the service fee paid.' },
            { title: '9. Governing Law', body: 'These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts in Mumbai, Maharashtra.' },
            { title: '10. Contact', body: 'For questions about these terms, contact legal@greenscapepro.com or write to us at 123 Garden Street, Green City, Maharashtra – 400001.' },
          ].map((section) => (
            <div key={section.title} className="mb-6">
              <h2 className="font-semibold text-gray-800 mb-2">{section.title}</h2>
              <p className="text-gray-600 text-sm leading-relaxed">{section.body}</p>
            </div>
          ))}
          <div className="border-t border-gray-100 pt-6 flex gap-4">
            <Link href="/privacy-policy" className="text-primary-600 text-sm hover:underline">Privacy Policy</Link>
            <Link href="/contact" className="text-primary-600 text-sm hover:underline">Contact Us</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
