'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch, FiShoppingCart, FiHeart, FiUser, FiMenu, FiX,
  FiChevronDown, FiSun, FiMoon, FiBell,
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { useAuthStore } from '@/store/authStore';
import { useCartCount } from '@/store/cartStore';
import { useWishlistCount } from '@/store/wishlistStore';
import { useUIStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { NAV_LINKS } from '@/constants';
import { cn } from '@/lib/utils';
import SearchModal from '@/components/common/SearchModal';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const dropdownTimer = useRef<NodeJS.Timeout | undefined>(undefined);

  const { isAuthenticated, user } = useAuthStore();
  const cartCount = useCartCount();
  const wishlistCount = useWishlistCount();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu, theme, setTheme, isSearchOpen, toggleSearch } = useUIStore();
  const openCart = useCartStore((s) => s.openCart);

  // Scroll detection
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Close menu on route change
  useEffect(() => { closeMobileMenu(); }, [pathname, closeMobileMenu]);

  const handleDropdownEnter = (label: string) => {
    clearTimeout(dropdownTimer.current);
    setActiveDropdown(label);
  };

  const handleDropdownLeave = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 150);
  };

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-all duration-300',
          scrolled
            ? 'shadow-lg'
            : ''
        )}
        style={{ background: 'linear-gradient(90deg, #1B4332 0%, #4CAF50 100%)' }}
      >
        <nav className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">

            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-primary flex items-center justify-center shadow-green group-hover:shadow-green-lg transition-all duration-300 group-hover:scale-105">
                <FaLeaf className="text-white text-lg" />
              </div>
              <div className="hidden sm:block">
                <span className="font-display font-bold text-xl leading-none text-white">
                  Jaipur Plants Hub
                </span>
                <span className="block text-xs font-medium tracking-widest uppercase text-green-200">
                  Pro
                </span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <ul className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <li
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => 'children' in link ? handleDropdownEnter(link.label) : undefined}
                  onMouseLeave={handleDropdownLeave}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive(link.href) && link.href !== '/'
                        ? 'text-white bg-white/20'
                        : 'text-white/90 hover:text-white hover:bg-white/15'
                    )}
                  >
                    {link.label}
                    {'children' in link && (
                      <FiChevronDown
                        className={cn('text-xs transition-transform duration-200', activeDropdown === link.label ? 'rotate-180' : '')}
                      />
                    )}
                  </Link>

                  {/* Dropdown */}
                  {'children' in link && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-soft-xl border border-primary-50 overflow-hidden py-2"
                          onMouseEnter={() => handleDropdownEnter(link.label)}
                          onMouseLeave={handleDropdownLeave}
                        >
                          {(link as any).children.map((child: any) => (
                            <Link
                              key={child.href}
                              href={child.href}
                              className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-primary-50 hover:text-primary-700 transition-colors"
                            >
                              <span className="w-1.5 h-1.5 rounded-full bg-primary-400 flex-shrink-0" />
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </li>
              ))}
            </ul>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
              {/* Search */}
              <button
                onClick={toggleSearch}
                className="btn-icon text-white hover:bg-white/15"
                aria-label="Search"
              >
                <FiSearch className="text-lg" />
              </button>

              {/* Theme Toggle removed */}

              {/* Wishlist */}
              <Link
                href="/wishlist"
                className="btn-icon relative text-white hover:bg-white/15"
                aria-label="Wishlist"
              >
                <FiHeart className="text-lg" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Cart */}
              <button
                onClick={openCart}
                className="btn-icon relative text-white hover:bg-white/15"
                aria-label="Cart"
              >
                <FiShoppingCart className="text-lg" />
                {cartCount > 0 && (
                  <motion.span
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center"
                  >
                    {cartCount > 9 ? '9+' : cartCount}
                  </motion.span>
                )}
              </button>

              {/* User */}
              {isAuthenticated ? (
                <Link
                  href="/account"
                  className="hidden sm:flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-all duration-200 ml-1 bg-white/20 text-white hover:bg-white/30"
                >
                  {user?.avatar?.url ? (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden shrink-0"><Image src={user.avatar.url} alt={user.firstName || 'User'} fill className="object-cover" sizes="24px" /></div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-[10px] font-bold">
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </div>
                  )}
                  <span className="text-sm font-medium">{user?.firstName}</span>
                </Link>
              ) : (
                <div className="hidden sm:flex items-center gap-2 ml-1">
                  <Link
                    href="/login"
                    className="text-sm font-medium px-3 py-1.5 rounded-full transition-all text-white hover:bg-white/15"
                  >
                    Login
                  </Link>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={toggleMobileMenu}
                className="btn-icon ml-1 lg:hidden text-white hover:bg-white/15"
                aria-label="Menu"
              >
                <AnimatePresence mode="wait">
                  {isMobileMenuOpen ? (
                    <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <FiX className="text-xl" />
                    </motion.div>
                  ) : (
                    <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                      <FiMenu className="text-xl" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </button>
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden bg-white border-t border-primary-50 overflow-hidden"
            >
              <div className="container-custom py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className={cn(
                        'flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                        isActive(link.href)
                          ? 'bg-primary-50 text-primary-700'
                          : 'text-gray-700 hover:bg-gray-50 hover:text-primary-700'
                      )}
                    >
                      {link.label}
                    </Link>
                    {'children' in link && (
                      <div className="ml-4 mt-1 space-y-1">
                        {(link as any).children.slice(0, 5).map((child: any) => (
                          <Link
                            key={child.href}
                            href={child.href}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-primary-600 rounded-lg transition-colors"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary-400" />
                            {child.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="pt-4 border-t border-gray-100 flex gap-3">
                  {isAuthenticated ? (
                    <Link href="/account" className="btn-primary flex-1 py-3 text-sm text-center">
                      My Account
                    </Link>
                  ) : (
                    <>
                      <Link href="/login" className="btn-secondary flex-1 py-3 text-sm text-center">Login</Link>
                      <Link href="/signup" className="btn-primary flex-1 py-3 text-sm text-center">Sign Up</Link>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => useUIStore.getState().closeSearch()} />
    </>
  );
}
