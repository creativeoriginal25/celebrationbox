import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CelebrationBoxLogo } from './CelebrationBoxLogo';

interface HeaderProps {
  onShopClick: () => void;
}

interface NavItem {
  label: string;
  href: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home', id: 'home' },
  { label: 'Shop', href: '#shop', id: 'shop' },
  { label: 'Occasions', href: '#categories', id: 'categories' },
  { label: 'How It Works', href: '#how-it-works', id: 'how-it-works' },
  { label: 'About', href: '#about', id: 'about' },
];

export const Header: React.FC<HeaderProps> = ({ onShopClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('home');
  const { totalCount, setIsCartOpen } = useCart();
  const shouldReduceMotion = useReducedMotion();

  // Scroll detection to subtly tune glass opacity & shadow
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Active section tracking (ScrollSpy)
  useEffect(() => {
    // Only track sections on homepage
    if (typeof window !== 'undefined' && (window.location.hash.startsWith('#/product') || window.location.hash.startsWith('#/category'))) {
      setActiveSection('');
      return;
    }

    const observerCallback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver(observerCallback, observerOptions);

    NAV_ITEMS.forEach((item) => {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  // Prevent background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Handle Escape key to close mobile menu
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  // Navigation handler with cross-page support
  const handleLinkClick = useCallback((href: string) => {
    setMobileMenuOpen(false);

    // If on a dedicated product or category view, clear hash first
    if (window.location.hash.startsWith('#/product') || window.location.hash.startsWith('#/category')) {
      window.location.hash = '';
      setTimeout(() => {
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 60);
      return;
    }

    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleShopNowCTA = () => {
    setMobileMenuOpen(false);
    onShopClick();
  };

  return (
    <>
      {/* Sticky Floating Header Container */}
      <header className="sticky top-3.5 sm:top-4 z-40 w-full px-3 sm:px-6 pointer-events-none transition-all duration-300">
        <div
          className={`max-w-[1240px] mx-auto pointer-events-auto rounded-[20px] transition-all duration-300 ${
            isScrolled
              ? 'bg-white/[0.88] shadow-[0_12px_36px_0_rgba(43,43,58,0.08)] border-white/85'
              : 'bg-white/[0.78] shadow-[0_8px_30px_0_rgba(43,43,58,0.04)] border-white/65'
          } border backdrop-blur-[20px] [-webkit-backdrop-filter:blur(20px)]`}
          style={{
            // Inline fallbacks ensuring exact glassmorphism rendering across all browsers
            backgroundColor: isScrolled ? 'rgba(255, 255, 255, 0.88)' : 'rgba(255, 255, 255, 0.78)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <div className="flex items-center justify-between h-[68px] sm:h-[72px] px-4 sm:px-6 lg:px-8">
            
            {/* ========================================================
                1. LEFT: OFFICIAL LOGO (COMPACT, NO RECTANGULAR BOX)
               ======================================================== */}
            <div className="flex items-center shrink-0">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  handleLinkClick('#home');
                }}
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60 rounded-xl transition-transform hover:scale-[1.02] active:scale-98"
                aria-label="Celebration Box Home"
              >
                <CelebrationBoxLogo
                  className="h-8 sm:h-8.5 md:h-9 w-auto"
                  animated={false}
                  interactive={false}
                />
              </a>
            </div>

            {/* ========================================================
                2. CENTER: 5 CURATED NAVIGATION ITEMS (DESKTOP)
               ======================================================== */}
            <nav
              className="hidden md:flex items-center space-x-1 lg:space-x-2"
              aria-label="Main Navigation"
            >
              {NAV_ITEMS.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleLinkClick(item.href)}
                    className={`relative px-3.5 py-2 rounded-full text-sm font-medium transition-colors duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/50 ${
                      isActive
                        ? 'text-brand-pink font-semibold'
                        : 'text-brand-ink/80 hover:text-brand-pink hover:bg-brand-cream-50/60'
                    }`}
                  >
                    <span>{item.label}</span>

                    {/* Subtle animated underline for active navigation item */}
                    {isActive && (
                      <motion.span
                        layoutId={shouldReduceMotion ? undefined : 'activeNavIndicator'}
                        className="absolute bottom-1 left-3.5 right-3.5 h-[2px] bg-brand-pink rounded-full"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                  </button>
                );
              })}
            </nav>

            {/* ========================================================
                3. RIGHT: SHOPPING BAG + PRIMARY PINK "SHOP NOW" CTA
               ======================================================== */}
            <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
              {/* Minimal Outlined Shopping Bag Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-10 h-10 sm:w-10.5 sm:h-10.5 rounded-[14px] border border-white/80 bg-white/70 hover:bg-white text-brand-ink hover:text-brand-pink transition-all duration-200 flex items-center justify-center shadow-xs hover:shadow-sm active:scale-95 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
                aria-label={`View shopping cart with ${totalCount} items`}
              >
                <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
                {totalCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 rounded-full bg-brand-pink text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                    {totalCount}
                  </span>
                )}
              </button>

              {/* Primary "Shop Now" Pink CTA */}
              <button
                onClick={handleShopNowCTA}
                className="hidden sm:inline-flex items-center justify-center gap-1.5 px-5 py-2.5 h-10.5 rounded-[14px] text-sm font-semibold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-[0_4px_14px_0_rgba(233,30,99,0.30)] hover:shadow-[0_6px_20px_0_rgba(233,30,99,0.40)] hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
              >
                <span>Shop Now</span>
              </button>

              {/* Mobile Hamburger Toggle Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden w-10 h-10 rounded-[14px] border border-white/80 bg-white/70 hover:bg-white text-brand-ink hover:text-brand-pink transition-colors flex items-center justify-center shadow-xs focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60 cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE NAVIGATION DRAWER (REFINED GLASS SHEET)
         ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden pointer-events-auto">
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-brand-ink/40 backdrop-blur-sm"
              aria-hidden="true"
            />

            {/* Sliding Drawer Sheet */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-[86%] max-w-[340px] bg-white/[0.94] backdrop-blur-[24px] [-webkit-backdrop-filter:blur(24px)] border-l border-white/80 shadow-modal flex flex-col p-6 overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-brand-ink/5">
                <CelebrationBoxLogo className="h-7 w-auto" animated={false} interactive={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-xl text-brand-ink hover:text-brand-pink bg-brand-cream-50 hover:bg-brand-cream-100 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="flex flex-col space-y-1.5 py-6 flex-1">
                {NAV_ITEMS.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleLinkClick(item.href)}
                      className={`flex items-center justify-between px-4 py-3.5 rounded-2xl text-base font-medium transition-all text-left cursor-pointer ${
                        isActive
                          ? 'bg-brand-pink/10 text-brand-pink font-semibold'
                          : 'text-brand-ink hover:text-brand-pink hover:bg-brand-cream-50/80'
                      }`}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className={`w-4 h-4 transition-transform ${isActive ? 'text-brand-pink' : 'text-brand-ink/30'}`} />
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Actions */}
              <div className="pt-4 border-t border-brand-ink/5 space-y-3">
                <button
                  onClick={handleShopNowCTA}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-sm font-bold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-[0_4px_14px_0_rgba(233,30,99,0.30)] active:scale-98 transition-all cursor-pointer"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setIsCartOpen(true);
                  }}
                  className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold text-brand-ink bg-brand-cream-100 hover:bg-brand-cream-200 transition-colors cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>View Cart ({totalCount})</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};