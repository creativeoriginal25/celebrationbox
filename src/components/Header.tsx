import React, { useState, useEffect, useCallback } from 'react';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  Package,
  Headphones,
  ChevronDown,
  Gift,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { CelebrationBoxLogo } from './CelebrationBoxLogo';
import { BUSINESS_CONFIG } from '../config/business';
import { buildWhatsAppLink, triggerWhatsAppChat } from '../services/whatsappService';

interface HeaderProps {
  onShopClick: () => void;
  onOpenCategory?: (slug: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ onShopClick, onOpenCategory }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [referModalOpen, setReferModalOpen] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const { totalCount, setIsCartOpen } = useCart();

  // Prevent background scrolling when mobile menu or referral modal is open
  useEffect(() => {
    if (mobileMenuOpen || referModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen, referModalOpen]);

  // Handle Search submit or enter
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onShopClick();
      const shopEl = document.getElementById('shop');
      if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // WhatsApp Track Order trigger
  const handleTrackOrder = () => {
    const message = `Hi Celebration Box team! 👋 I would like to track my order status. Could you please assist me?`;
    const url = buildWhatsAppLink(BUSINESS_CONFIG.whatsappNumber, message);
    triggerWhatsAppChat(url);
  };

  // WhatsApp Help / Support trigger
  const handleHelp = () => {
    const message = `Hi Celebration Box support! 👋 I have a question regarding your celebration kits and delivery.`;
    const url = buildWhatsAppLink(BUSINESS_CONFIG.whatsappNumber, message);
    triggerWhatsAppChat(url);
  };

  // Sign In navigation
  const handleSignIn = () => {
    window.location.hash = '/admin/login';
  };

  // Category navigation click
  const handleCategoryClick = (categoryName: string, slug?: string) => {
    setMobileMenuOpen(false);
    if (slug && onOpenCategory) {
      onOpenCategory(slug);
    } else if (categoryName === 'Birthday Kits' || categoryName === 'Combos') {
      onShopClick();
      const shopEl = document.getElementById('shop');
      if (shopEl) shopEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      const catEl = document.getElementById('categories');
      if (catEl) catEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const copyReferralCode = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText('CELEBRATE50');
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2500);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-brand-ink/5 shadow-xs transition-all">
        {/* ========================================================
            ROW 1: TOP HEADER (Logo, Search, Help/Track, Cart, Sign In)
           ======================================================== */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[72px] gap-2 sm:gap-4 md:gap-6">
            
            {/* 1. BRAND LOGO */}
            <div className="flex items-center shrink-0">
              <a
                href="#home"
                onClick={(e) => {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60 rounded-xl transition-transform hover:scale-[1.02] active:scale-98"
                aria-label="Celebration Box Home"
              >
                <CelebrationBoxLogo
                  className="w-[125px] sm:w-[150px] md:w-[170px] h-auto"
                  animated={false}
                  interactive={false}
                />
              </a>
            </div>

            {/* 2. CENTER PILL SEARCH BAR */}
            <div className="flex-1 max-w-xl mx-2 hidden sm:block">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-ink-muted/80 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for decoration kits, themes, and more..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs md:text-sm bg-[#FDF8F6] hover:bg-[#FAF2EE] focus:bg-white text-brand-ink placeholder:text-brand-ink-muted/70 border border-[#F0DFDE] focus:border-brand-pink/50 focus:outline-none focus:ring-2 focus:ring-brand-pink/20 transition-all shadow-inner-xs"
                />
              </form>
            </div>

            {/* 3. RIGHT ACTIONS (Track Order, Help, Cart, Sign In) */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Track Order Button */}
              <button
                onClick={handleTrackOrder}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-ink hover:text-brand-pink transition-colors rounded-full hover:bg-brand-cream-50 cursor-pointer"
                title="Track your order status via WhatsApp"
              >
                <Package className="w-4 h-4 text-brand-ink-light" />
                <span>Track Order</span>
              </button>

              {/* Help Button */}
              <button
                onClick={handleHelp}
                className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-brand-ink hover:text-brand-pink transition-colors rounded-full hover:bg-brand-cream-50 cursor-pointer"
                title="Customer Support &amp; FAQ"
              >
                <Headphones className="w-4 h-4 text-brand-ink-light" />
                <span>Help</span>
              </button>

              {/* Vertical separator */}
              <div className="hidden lg:block w-[1px] h-5 bg-brand-ink/10 my-auto" />

              {/* Shopping Cart Icon with Counter Badge */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-brand-ink/10 hover:border-brand-pink/40 bg-white hover:bg-brand-cream-50 text-brand-ink hover:text-brand-pink transition-all flex items-center justify-center shadow-xs cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-pink/60"
                aria-label={`View shopping cart with ${totalCount} items`}
              >
                <ShoppingBag className="w-4.5 h-4.5 stroke-[2]" />
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#E91E63] text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                  {totalCount}
                </span>
              </button>

              {/* Sign In Button (Wine/Maroon Pill) */}
              <button
                onClick={handleSignIn}
                className="inline-flex items-center justify-center px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-bold text-white bg-[#8A1538] hover:bg-[#72112E] active:scale-95 shadow-sm transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8A1538]/50"
              >
                <span>Sign In</span>
              </button>

              {/* Mobile Hamburger Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="sm:hidden w-9 h-9 rounded-full border border-brand-ink/10 text-brand-ink hover:text-brand-pink flex items-center justify-center transition-colors cursor-pointer"
                aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
              >
                {mobileMenuOpen ? <X className="w-4.5 h-4.5" /> : <Menu className="w-4.5 h-4.5" />}
              </button>
            </div>

          </div>

          {/* Mobile search bar visible on mobile */}
          <div className="pb-3 sm:hidden">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-brand-ink-muted/80 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search decoration kits, themes..."
                className="w-full pl-9 pr-3 py-2 rounded-full text-xs bg-[#FDF8F6] text-brand-ink placeholder:text-brand-ink-muted/70 border border-[#F0DFDE] focus:outline-none focus:border-brand-pink"
              />
            </form>
          </div>
        </div>

        {/* ========================================================
            ROW 2: SUB-NAVIGATION BAR (All Categories, Category Chips, Refer & Earn)
           ======================================================== */}
        <div className="hidden sm:block border-t border-brand-ink/5 bg-[#FFFDFC]/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-11 text-xs font-semibold">
              
              {/* Left: All Categories Pill Button + Category Chips */}
              <div className="flex items-center gap-2 md:gap-3 overflow-x-auto no-scrollbar py-1">
                {/* All Categories Solid Maroon Pill */}
                <button
                  onClick={() => {
                    const el = document.getElementById('categories');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#7A153A] hover:bg-[#65102F] text-white font-bold transition-all shrink-0 cursor-pointer shadow-xs active:scale-95"
                >
                  <Menu className="w-3.5 h-3.5" />
                  <span>All Categories</span>
                  <ChevronDown className="w-3 h-3 opacity-80" />
                </button>

                {/* Category Chips */}
                <button
                  onClick={() => handleCategoryClick('Birthday Kits', 'kids-birthday')}
                  className="px-3 py-1.5 rounded-full text-brand-ink hover:text-[#7A153A] hover:bg-[#FFF0F4] transition-colors shrink-0 cursor-pointer"
                >
                  Birthday Kits
                </button>

                <button
                  onClick={() => handleCategoryClick('Anniversary')}
                  className="px-3 py-1.5 rounded-full text-brand-ink hover:text-[#7A153A] hover:bg-[#FFF0F4] transition-colors shrink-0 cursor-pointer"
                >
                  Anniversary
                </button>

                <button
                  onClick={() => handleCategoryClick('Bachelorette')}
                  className="px-3 py-1.5 rounded-full text-brand-ink hover:text-[#7A153A] hover:bg-[#FFF0F4] transition-colors shrink-0 cursor-pointer"
                >
                  Bachelorette
                </button>

                <button
                  onClick={() => handleCategoryClick('Festive Kits', 'festive')}
                  className="px-3 py-1.5 rounded-full text-brand-ink hover:text-[#7A153A] hover:bg-[#FFF0F4] transition-colors shrink-0 cursor-pointer"
                >
                  Festive Kits
                </button>

                <button
                  onClick={() => handleCategoryClick('Combos')}
                  className="px-3 py-1.5 rounded-full text-brand-ink hover:text-[#7A153A] hover:bg-[#FFF0F4] transition-colors shrink-0 cursor-pointer"
                >
                  Combos
                </button>
              </div>

              {/* Right: Refer & Earn Pill Button */}
              <div className="shrink-0 pl-2">
                <button
                  onClick={() => setReferModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFF0F4] hover:bg-[#FEE4EB] text-[#8A1538] border border-[#FCD6E0] font-bold text-xs shadow-xs transition-all hover:scale-[1.02] active:scale-98 cursor-pointer"
                >
                  <span>Refer &amp; Earn</span>
                  <span className="text-sm">🎁</span>
                </button>
              </div>

            </div>
          </div>
        </div>
      </header>

      {/* ========================================================
          MOBILE NAVIGATION DRAWER
         ======================================================== */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 sm:hidden pointer-events-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-brand-ink/40 backdrop-blur-xs"
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="absolute top-0 right-0 bottom-0 w-[84%] max-w-[320px] bg-white border-l border-brand-ink/10 shadow-modal flex flex-col p-5 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 border-b border-brand-ink/5">
                <CelebrationBoxLogo className="h-6 w-auto" animated={false} interactive={false} />
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-8 h-8 rounded-full text-brand-ink hover:text-brand-pink bg-brand-cream-50 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Categories list */}
              <div className="py-4 space-y-1 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-brand-ink-muted px-3 mb-2">
                  Categories &amp; Themes
                </p>
                <button
                  onClick={() => handleCategoryClick('Birthday Kits', 'kids-birthday')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-ink hover:bg-[#FFF0F4] hover:text-[#7A153A]"
                >
                  <span>🎂 Birthday Kits</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-ink-muted" />
                </button>
                <button
                  onClick={() => handleCategoryClick('Anniversary')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-ink hover:bg-[#FFF0F4] hover:text-[#7A153A]"
                >
                  <span>🤍 Anniversary</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-ink-muted" />
                </button>
                <button
                  onClick={() => handleCategoryClick('Bachelorette')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-ink hover:bg-[#FFF0F4] hover:text-[#7A153A]"
                >
                  <span>🥂 Bachelorette</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-ink-muted" />
                </button>
                <button
                  onClick={() => handleCategoryClick('Festive Kits', 'festive')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-ink hover:bg-[#FFF0F4] hover:text-[#7A153A]"
                >
                  <span>🎁 Festive Kits</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-ink-muted" />
                </button>
                <button
                  onClick={() => handleCategoryClick('Combos')}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold text-brand-ink hover:bg-[#FFF0F4] hover:text-[#7A153A]"
                >
                  <span>🏷️ Combos &amp; Offers</span>
                  <ArrowRight className="w-3.5 h-3.5 text-brand-ink-muted" />
                </button>

                <div className="pt-4 border-t border-brand-ink/5 space-y-2">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      setReferModalOpen(true);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl bg-[#FFF0F4] text-[#8A1538] font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <span>Refer &amp; Earn ₹50 OFF</span>
                    <span>🎁</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleTrackOrder();
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-brand-ink/10 text-brand-ink font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Package className="w-3.5 h-3.5 text-brand-ink-light" />
                    <span>Track Order</span>
                  </button>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleHelp();
                    }}
                    className="w-full py-2 px-3 rounded-xl border border-brand-ink/10 text-brand-ink font-semibold text-xs flex items-center justify-center gap-1.5"
                  >
                    <Headphones className="w-3.5 h-3.5 text-brand-ink-light" />
                    <span>Customer Support</span>
                  </button>
                </div>
              </div>

              {/* Bottom Sign In */}
              <div className="pt-3 border-t border-brand-ink/5">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleSignIn();
                  }}
                  className="w-full py-2.5 rounded-full text-xs font-bold text-white bg-[#8A1538] hover:bg-[#72112E] flex items-center justify-center gap-2"
                >
                  <span>Sign In / Admin</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================
          REFER & EARN MODAL
         ======================================================== */}
      {referModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-brand-ink/60 backdrop-blur-xs animate-fadeIn"
          role="dialog"
          aria-modal="true"
          onClick={() => setReferModalOpen(false)}
        >
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-pink-100 text-center space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setReferModalOpen(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-brand-ink-muted hover:text-brand-ink hover:bg-brand-cream-50 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-full bg-[#FFF0F4] border border-[#FCD6E0] mx-auto flex items-center justify-center text-3xl shadow-xs">
              🎁
            </div>

            <div className="space-y-1">
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-bold bg-pink-100 text-pink-800">
                Celebration Rewards
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#5C112A]">
                Refer &amp; Earn ₹50 OFF
              </h3>
              <p className="text-xs text-brand-ink-light max-w-xs mx-auto">
                Share the joy of effortless celebrations! When your friends place their first Celebration Box order, you both get ₹50 off.
              </p>
            </div>

            <div className="bg-[#FFF8F9] border border-dashed border-[#F3A5BA] rounded-2xl p-3.5 space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-ink-muted">
                Your Universal Referral Code
              </span>
              <div className="flex items-center justify-center gap-2">
                <span className="font-mono font-bold text-lg text-[#8A1538] tracking-widest">
                  CELEBRATE50
                </span>
                <button
                  onClick={copyReferralCode}
                  className="px-3 py-1 rounded-full text-xs font-bold text-white bg-[#8A1538] hover:bg-[#72112E] transition-all cursor-pointer"
                >
                  {copiedCode ? 'Copied! ✓' : 'Copy'}
                </button>
              </div>
            </div>

            <button
              onClick={() => {
                const text = `Hey! 👋 Check out Celebration Box for DIY birthday decoration kits: https://celebrations.vercel.app - Use my code *CELEBRATE50* to get ₹50 off! 🎉`;
                const url = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
                window.open(url, '_blank');
              }}
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Share on WhatsApp</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
