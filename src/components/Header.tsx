import React, { useState } from 'react';
import { Menu, X, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onShopClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onShopClick }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { totalCount, setIsCartOpen } = useCart();

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
    <header className="sticky top-0 z-40 w-full surface-header transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 py-3">
          {/* Logo with accessible fallback */}
          <a
            href="#home"
            className="flex items-center gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink rounded-lg"
            onClick={(e) => {
              e.preventDefault();
              handleLinkClick('#home');
            }}
            aria-label="Celebration Box Home"
          >
            <img
              src="/brand/logo.webp"
              alt="Celebration Box Logo"
              className="h-10 sm:h-11 w-auto object-contain"
              onError={(e) => {
                const target = e.currentTarget;
                target.style.display = 'none';
                if (target.nextElementSibling) {
                  (target.nextElementSibling as HTMLElement).style.display = 'block';
                }
              }}
            />
            <span className="hidden font-display font-extrabold text-xl text-brand-ink">
              Celebration <span className="text-brand-pink">Box</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="px-3.5 py-2 rounded-lg text-sm font-medium text-brand-ink hover:text-brand-pink hover:bg-brand-cream-100 transition-colors cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Actions: Cart Icon + Shop Now CTA */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            {/* Cart Button */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-xl border border-brand-ink/10 bg-white hover:bg-brand-cream-50 text-brand-ink hover:text-brand-pink transition-colors cursor-pointer"
              aria-label={`View cart with ${totalCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {totalCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-brand-pink text-white text-[11px] font-black flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              )}
            </button>

            {/* Shop Now CTA */}
            <button
              onClick={onShopClick}
              className="hidden sm:inline-flex items-center justify-center px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-brand-pink hover:bg-brand-pink-hover shadow-sm active:scale-98 transition-all cursor-pointer"
            >
              <span>Shop Kits</span>
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-xl text-brand-ink hover:text-brand-pink hover:bg-brand-cream-50 border border-brand-ink/10 transition-colors focus:outline-none"
              aria-label="Toggle Navigation Menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-brand-ink/10 px-4 pt-2 pb-6 shadow-card animate-fadeIn">
          <nav className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleLinkClick(link.href)}
                className="flex items-center justify-between px-3 py-2.5 rounded-lg text-base font-medium text-brand-ink hover:text-brand-pink hover:bg-brand-cream-50 transition-colors text-left"
              >
                <span>{link.label}</span>
                <span className="text-xs text-brand-ink-subtle">→</span>
              </button>
            ))}
          </nav>

          <div className="mt-4 pt-3 border-t border-brand-ink/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-brand-ink bg-brand-cream-100 hover:bg-brand-cream-200 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>View Cart ({totalCount} items)</span>
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onShopClick();
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-white bg-brand-pink shadow-sm active:scale-98 transition-all"
            >
              <span>Explore Celebration Boxes</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
