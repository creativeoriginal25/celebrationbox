import { PRODUCTS } from './products';

// Derive initial flagship product price directly from source of truth
const flagshipProduct = PRODUCTS.find((p) => p.id === 'signature-celebration-box') || PRODUCTS[0];
const startingPrice = flagshipProduct?.price || 299;

export interface HeroConfig {
  badge: {
    icon: string;
    text: string;
  };
  headline: {
    line1: string;
    highlight: string;
  };
  subtitle: string;
  productVisual: {
    image: string;
    alt: string;
    badge: string;
    caption: string;
  };
  trustChips: Array<{
    label: string;
    type: 'price' | 'pickup' | 'diy';
  }>;
  primaryCta: string;
  secondaryCta: string;
  socialProofText: string;
}

export const HERO_CONFIG: HeroConfig = {
  badge: {
    icon: '✨',
    text: 'CURATED DIY CELEBRATION KITS',
  },
  headline: {
    line1: 'Make Every Celebration',
    highlight: 'Special.',
  },
  subtitle: 'Beautiful birthday decorations, packed into one easy DIY box.',
  productVisual: {
    image: '/products/pastel-rose-setup.jpg',
    alt: 'Pastel Rose Celebration Box - 60-piece DIY birthday balloon garland setup',
    badge: 'Flagship Edition • ₹299',
    caption: 'Illustrative setup preview • 60-piece DIY kit',
  },
  trustChips: [
    { label: `From ₹${startingPrice}`, type: 'price' },
    { label: 'Free Campus Pickup', type: 'pickup' },
    { label: 'DIY Setup', type: 'diy' },
  ],
  primaryCta: 'Explore Celebration Boxes',
  secondaryCta: 'Order on WhatsApp',
  socialProofText: 'Made for easy DIY celebrations',
};
