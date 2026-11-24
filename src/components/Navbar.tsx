import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  ShoppingBag,
  Sparkles,
  Cake,
  Package,
  Info,
  PhoneCall,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CelebrationBoxLogo } from './CelebrationBoxLogo';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { totalCount } = useCart();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  // Lock body scroll when mobile menu is open
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

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Celebration Boxes', path: '/celebration-boxes' },
    { label: 'Cakes & Combos', path: '/cakes', badge: 'Chocoloom' },
    { label: 'About Us', path: '/about' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-brand-ink/10 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* 1. Official Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 group transition-transform active:scale-98"
            aria-label="Celebration Box Homepage"
          >
            <CelebrationBoxLogo className="h-7 sm:h-9 w-auto" />
          </Link>

          {/* 2. Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`relative px-3.5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 ${
                    active
                      ? 'text-brand-pink bg-brand-pink/10 font-extrabold'
                      : 'text-brand-ink hover:text-brand-pink hover:bg-brand-cream-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {link.badge && (
                    <span className="text-[10px] font-extrabold px-1.5 py-0.2 rounded-full bg-gradient-to-r from-brand-pink to-rose-500 text-white shadow-2xs">
                      {link.badge}
                    </span>
                  )}
                  {active && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-3 right-3 h-0.5 bg-brand-pink rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* 3. Right Action: Cart & Mobile Menu Toggle */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cart Link with Live Counter */}
            <Link
              to="/cart"
              className={`relative p-2.5 sm:px-4 sm:py-2.5 rounded-xl border transition-all flex items-center gap-2 cursor-pointer ${
                isActive('/cart')
                  ? 'border-brand-pink bg-brand-pink text-white shadow-card'
                  : 'border-brand-ink/15 hover:border-brand-pink/50 text-brand-ink hover:text-brand-pink bg-white shadow-2xs'
              }`}
              aria-label="View shopping cart"
            >
              <div className="relative">
                <ShoppingBag className="w-5 h-5" />
                {totalCount > 0 && (
                  <span className={`absolute -top-2 -right-2 text-[10px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border-2 border-white shadow-xs ${
                    isActive('/cart') ? 'bg-white text-brand-pink' : 'bg-brand-pink text-white'
                  }`}>
                    {totalCount}
                  </span>
                )}
              </div>
              <span className="hidden sm:inline text-xs font-bold">Cart</span>
            </Link>

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2.5 rounded-xl border border-brand-ink/15 text-brand-ink hover:bg-brand-cream-50 transition-colors cursor-pointer"
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-brand-ink/10 bg-white shadow-xl overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1.5 max-h-[calc(100vh-5rem)] overflow-y-auto">
              {navLinks.map((link) => {
                const active = isActive(link.path);
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                      active
                        ? 'bg-brand-pink/10 text-brand-pink font-extrabold'
                        : 'text-brand-ink hover:bg-brand-cream-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      {link.path === '/' && <Sparkles className="w-4 h-4 text-brand-pink" />}
                      {link.path === '/celebration-boxes' && <Package className="w-4 h-4 text-brand-teal" />}
                      {link.path === '/cakes' && <Cake className="w-4 h-4 text-rose-500" />}
                      {link.path === '/about' && <Info className="w-4 h-4 text-brand-marigold" />}
                      {link.path === '/contact' && <PhoneCall className="w-4 h-4 text-emerald-600" />}
                      <span>{link.label}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      {link.badge && (
                        <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-brand-pink text-white">
                          {link.badge}
                        </span>
                      )}
                      <ChevronRight className="w-4 h-4 text-brand-ink/20" />
                    </div>
                  </Link>
                );
              })}

              {/* Mobile Cart Direct Button */}
              <div className="pt-2 border-t border-brand-ink/10 mt-2">
                <Link
                  to="/cart"
                  className="flex items-center justify-between px-4 py-3 rounded-xl bg-brand-pink text-white text-sm font-extrabold shadow-card"
                >
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4" />
                    <span>View Shopping Cart</span>
                  </div>
                  <span className="bg-white/20 text-white text-xs px-2.5 py-0.5 rounded-full">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'}
                  </span>
                </Link>
              </div>

              {/* Collaboration Promo Badge */}
              <div className="p-3 rounded-xl bg-pink-50/70 border border-brand-pink/20 text-xs text-brand-ink-light flex items-center justify-between mt-2">
                <div>
                  <span className="font-extrabold text-brand-ink block">CelebrationBox × Chocoloom</span>
                  <span className="text-[11px] text-brand-pink">Cakes baked fresh in Bhimavaram</span>
                </div>
                <Link
                  to="/cakes"
                  className="text-xs font-bold text-brand-pink hover:underline"
                >
                  View Cakes →
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
