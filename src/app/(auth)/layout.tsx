import Link from 'next/link';
import Image from 'next/image';
import { FaLeaf } from 'react-icons/fa';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left: Decorative Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-primary p-12 relative overflow-hidden">
        {/* BG circles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/5 rounded-full" />
          <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-white/5 rounded-full" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-white/5 rounded-full" />
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 relative">
          <div className="w-11 h-11 bg-white/20 rounded-xl flex items-center justify-center border border-white/30">
            <FaLeaf className="text-white text-xl" />
          </div>
          <div>
            <span className="font-display font-bold text-2xl text-white block">Jaipur Plants Hub</span>
            <span className="text-primary-200 text-xs tracking-widest uppercase">Premium Landscape Solutions</span>
          </div>
        </Link>

        {/* Center content */}
        <div className="relative">
          <h2 className="font-display text-4xl font-bold text-white mb-4 leading-tight">
            Transform Your Space Into A{' '}
            <span className="text-primary-200">Living Paradise</span>
          </h2>
          <p className="text-primary-100 text-lg leading-relaxed mb-8">
            Join 1,200+ happy customers who trust Jaipur Plants Hub for premium plants, expert landscape design, and professional garden services.
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              { v: '800+', l: 'Plant Varieties' },
              { v: '1,200+', l: 'Happy Customers' },
              { v: '500+', l: 'Projects Done' },
              { v: '15+', l: 'Years Experience' },
            ].map(s => (
              <div key={s.l} className="bg-white/10 backdrop-blur rounded-xl p-4 border border-white/15">
                <p className="font-display text-2xl font-bold text-white">{s.v}</p>
                <p className="text-primary-200 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="relative flex items-center gap-3">
          <div className="flex -space-x-2">
            {['47', '12', '23', '44'].map(n => (
              <Image key={n} src={`https://i.pravatar.cc/40?img=${n}`} alt="" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <p className="text-primary-100 text-sm">
            <strong className="text-white">4,000+ gardeners</strong> joined this month
          </p>
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex items-center justify-center p-6 sm:p-10 bg-surface">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-9 h-9 bg-gradient-primary rounded-xl flex items-center justify-center">
              <FaLeaf className="text-white" />
            </div>
            <span className="font-display font-bold text-xl text-primary-800">Jaipur Plants Hub</span>
          </Link>
          {children}
        </div>
      </div>
    </div>
  );
}
