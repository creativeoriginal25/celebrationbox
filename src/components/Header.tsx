import React, { useState } from 'react';
import { Menu, X, MessageCircle, Sparkles, ShoppingBag } from 'lucide-react';
import { BUSINESS_CONFIG } from '../config/business';

interface HeaderProps {
  onOpenOrder: (productId?: 'mini-celebration-box' | 'signature-celebration-box') => void;
  onOpenAdminTemplates: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenOrder, onOpenAdminTemplates }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Shop Kits', href: '#shop' },
    { label: 'Compare', href: '#compare' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why Us', href: '#why-us' },
    { label: 'FAQ', href: '#faq' },
    { label: 'About', href: '#about' },
  ];

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-nav transition-all duration-300">
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-brand-pink via-brand-pink-600 to-brand-pink text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-brand-marigold animate-pulse" />
        <span>Student-founded in Bhimavaram • DIY Birthday Kits from ₹249 • Campus Pickup Available</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a
            href="#home"
            className="flex items-center gap-3 group focus:outline-none"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
          >
            <img
              src="/brand/logo.webp"
              alt="Celebration Box Logo"
              className="h-10 sm:h-12 w-auto object-contain transition-transform group-hover:scale-105 duration-200"
            />
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="px-3.5 py-2 rounded-full text-sm font-medium text-brand-ink hover:text-brand-pink hover:bg-white/60 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <button
              onClick={() => onOpenOrder()}
              className="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-md shadow-brand-pink/25 hover:shadow-lg hover:shadow-brand-pink/35 transition-all duration-200 active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop Now</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={() => onOpenOrder()}
              className="inline-flex items-center justify-center p-2 rounded-xl text-white bg-brand-pink shadow-sm"
              aria-label="Shop"
            >
              <ShoppingBag className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-brand-ink hover:text-brand-pink hover:bg-white/70 glass-pill transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-white/60 px-4 pt-3 pb-6 animate-fadeIn">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium text-brand-ink hover:text-brand-pink hover:bg-white/80 transition-all text-left"
              >
                <span>{link.label}</span>
                <span className="text-xs text-brand-ink-subtle">→</span>
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-brand-ink/10 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenOrder();
              }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-bold text-white bg-brand-pink shadow-md shadow-brand-pink/25 active:scale-98 transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Customize & Order Now</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAdminTemplates();
              }}
              className="w-full py-2 text-xs text-brand-ink-muted hover:text-brand-pink text-center"
            >
              Founder Tools: WhatsApp Message Templates
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

