import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FiArrowRight, FiCheck, FiCalendar } from 'react-icons/fi';

export const metadata: Metadata = {
  title: 'Farmhouse Garden Development – Complete Landscape Solutions',
  description: 'Transform your farmhouse into a green paradise with orchards, vegetable gardens, flower beds, and complete landscape development.',
};

const SERVICES = [
  { icon: '🍋', title: 'Fruit Orchards', desc: 'Mango, pomegranate, guava, lemon and seasonal fruit trees planted and trained.' },
  { icon: '🥬', title: 'Kitchen Gardens', desc: 'Year-round vegetable plots with raised beds and drip irrigation.' },
  { icon: '🌸', title: 'Flower Gardens', desc: 'Seasonal flowering beds, rose gardens, and cut-flower sections.' },
  { icon: '🌳', title: 'Shade Trees & Avenues', desc: 'Strategic tree planting for shade, wind-break, and aesthetics.' },
  { icon: '💧', title: 'Water Features', desc: 'Ponds, water fountains, and decorative water elements.' },
  { icon: '🛤️', title: 'Pathways & Seating', desc: 'Natural stone paths, garden benches, and outdoor seating areas.' },
  { icon: '💡', title: 'Garden Lighting', desc: 'Solar and low-voltage outdoor lighting for pathways and features.' },
  { icon: '🚿', title: 'Irrigation System', desc: 'Drip and sprinkler irrigation systems with automated timers.' },
];

const GALLERY = [
  '/images/plant-placeholder.svg',
  '/images/plant-placeholder.svg',
  '/images/plant-placeholder.svg',
  '/images/plant-placeholder.svg',
];

export default function FarmhouseDevelopmentPage() {
  return (
    <div className="min-h-screen bg-surface pt-20">
      {/* Hero */}
      <div className="relative h-[60vh] flex items-center overflow-hidden">
        <Image src="/images/plant-placeholder.svg" alt="Farmhouse Development" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/90 via-dark/50 to-transparent" />
        <div className="container-custom relative">
          <div className="max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-white/15 backdrop-blur rounded-full text-primary-200 text-sm font-medium mb-4">🌾 Complete Farmhouse Development</span>
            <h1 className="font-display text-4xl lg:text-6xl font-bold text-white mb-4 leading-tight">
              Transform Your Farmhouse Into a Green Paradise
            </h1>
            <p className="text-primary-100 text-lg mb-7">
              End-to-end farmhouse landscape development including orchards, vegetable gardens, flower beds, water features, and more.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/query?type=consultation&service=Farmhouse Development" className="btn-primary text-base px-8 py-4 flex items-center gap-2">
                <FiCalendar /> Free Consultation
              </Link>
              <Link href="/gallery?category=farmhouse" className="text-white border-2 border-white/40 px-6 py-4 rounded-full hover:bg-white/15 transition-all font-semibold flex items-center gap-2">
                View Projects <FiArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <span className="section-tag">🌿 What We Offer</span>
            <h2 className="section-heading">Complete Farmhouse Landscape Solutions</h2>
            <p className="section-subheading mx-auto mt-3">From design to installation — we handle every aspect of your farmhouse landscape.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICES.map((s, i) => (
              <div key={s.title} className="bg-white rounded-2xl shadow-soft p-5 hover:shadow-soft-lg hover:-translate-y-0.5 transition-all border border-gray-50">
                <span className="text-3xl block mb-3">{s.icon}</span>
                <h3 className="font-semibold text-gray-800 mb-1.5">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="py-16 bg-surface">
        <div className="container-custom">
          <div className="text-center mb-8">
            <span className="section-tag">📸 Our Projects</span>
            <h2 className="section-heading">Farmhouse Transformations</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {GALLERY.map((src, i) => (
              <div key={i} className="relative rounded-2xl overflow-hidden group" style={{ aspectRatio: '1' }}>
                <Image src={src} alt={`Project ${i + 1}`} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link href="/gallery?category=farmhouse" className="btn-secondary inline-flex items-center gap-2 px-7 py-3">
              View Full Gallery <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="bg-gradient-primary rounded-3xl p-8 lg:p-12">
            <div className="grid lg:grid-cols-2 gap-10 items-center">
              <div>
                <h2 className="font-display text-3xl font-bold text-white mb-4">Why Choose Us for Your Farmhouse?</h2>
                <ul className="space-y-3">
                  {[
                    'Free site survey and custom design plan',
                    'Local plant sourcing for maximum survival rate',
                    'Certified horticulturists with 15+ years experience',
                    'Complete project management from start to finish',
                    'Drip irrigation and water conservation systems',
                    '1-year plant health warranty',
                    'Post-installation care and maintenance packages',
                  ].map(pt => (
                    <li key={pt} className="flex items-center gap-3 text-primary-100 text-sm">
                      <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <FiCheck className="text-white text-xs" />
                      </div>
                      {pt}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="text-center">
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { v: '50+', l: 'Farmhouses Done' },
                    { v: '15+', l: 'Years Experience' },
                    { v: '100%', l: 'Client Satisfaction' },
                    { v: '1 Year', l: 'Plant Warranty' },
                  ].map(s => (
                    <div key={s.l} className="bg-white/15 backdrop-blur rounded-xl p-4 text-center">
                      <p className="font-display text-2xl font-bold text-white">{s.v}</p>
                      <p className="text-primary-200 text-sm">{s.l}</p>
                    </div>
                  ))}
                </div>
                <Link href="/query?type=consultation&service=Farmhouse Development" className="inline-flex items-center gap-2 bg-white text-primary-800 font-semibold px-7 py-3.5 rounded-full mt-5 hover:bg-primary-50 transition-all">
                  <FiCalendar /> Get Free Quote
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
