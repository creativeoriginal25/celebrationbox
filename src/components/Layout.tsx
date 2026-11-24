import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';
import { useCart } from '../context/CartContext';
import { PolicyModal, PolicyType } from './PolicyModal';
import { CheckCircle2, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { pathname } = useLocation();
  const { toastMessage, totalCount } = useCart();
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FFFDFB] text-brand-ink selection:bg-brand-pink-100 selection:text-brand-pink font-sans antialiased">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Main Page Content */}
      <main className="flex-1">{children}</main>

      {/* 3. Global Footer */}
      <Footer onOpenPolicy={(policy) => setActivePolicy(policy)} />

      {/* 4. Global Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="px-4 py-3 rounded-2xl bg-brand-ink text-white text-xs sm:text-sm font-bold shadow-2xl flex items-center gap-3 border border-brand-pink/30">
            <span className="w-7 h-7 rounded-full bg-brand-pink text-white flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
            </span>
            <span>{toastMessage}</span>
            <Link
              to="/cart"
              className="ml-2 px-2.5 py-1 rounded-lg bg-white/15 hover:bg-brand-pink text-white text-xs font-extrabold transition-colors inline-flex items-center gap-1"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Cart ({totalCount})</span>
            </Link>
          </div>
        </div>
      )}

      {/* 5. Policy Modal */}
      <PolicyModal
        policyType={activePolicy}
        onClose={() => setActivePolicy(null)}
      />
    </div>
  );
};
