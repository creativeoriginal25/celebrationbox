/**
 * CelebrationBox × Chocoloom Cake Catalogue & Configuration
 * Official bakery partner in Bhimavaram / SRKR Campus
 * Website: https://www.chocoloom.com/uni-chocoloom
 */

export type CakeSize = '250g' | '500g' | '1kg' | '1.5kg' | '2kg';
export type CakeDietType = 'eggless' | 'contains_egg';

export interface CakeFlavourOption {
  id: string;
  name: string;
  tagline: string;
  description: string;
  image: string;
  isPopular?: boolean;
  pricing: Record<CakeSize, number>;
}

export interface CakeDesignOption {
  id: string;
  name: string;
  tagline: string;
  image: string;
  additionalCost: number;
}

export interface CakeCustomizationState {
  includeCake: boolean;
  flavourId: string;
  size: CakeSize;
  dietType: CakeDietType;
  designId: string;
  nameOnCake: string;
  customMessage: string;
  referenceImage?: string; // base64 or URL
  referenceImageName?: string;
  specialInstructions: string;
}

export const CHOCOLOOM_CONFIG = {
  brandName: 'Chocoloom',
  tagline: 'Cakes by Chocoloom',
  websiteUrl: 'https://www.chocoloom.com/uni-chocoloom',
  logoUrl: 'https://www.chocoloom.com/assets/logo.png',
  campusHub: 'Bhimavaram (SRKR Campus & Nearby Delivery)',
  baseBoxPrice: 399,
  sizes: [
    { id: '250g', label: '250g Bento', description: 'Cute Mini Bento (1–2 servings)' },
    { id: '500g', label: '500g Classic', description: 'Standard Birthday (4–6 servings)', default: true },
    { id: '1kg', label: '1.0 kg Party', description: 'Party Size (8–12 servings)' },
    { id: '1.5kg', label: '1.5 kg Grand', description: 'Celebration Size (12–16 servings)' },
    { id: '2kg', label: '2.0 kg Mega', description: 'Large Gathering (16–22 servings)' },
  ] as Array<{ id: CakeSize; label: string; description: string; default?: boolean }>,
  flavours: [
    {
      id: 'dutch-truffle',
      name: 'Dutch Truffle',
      tagline: 'Signature Rich Dark Truffle',
      description: 'Velvety dark chocolate ganache layered with moist chocolate sponge.',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      isPopular: true,
      pricing: {
        '250g': 249,
        '500g': 449,
        '1kg': 799,
        '1.5kg': 1149,
        '2kg': 1499,
      },
    },
    {
      id: 'belgian-dark-silk',
      name: 'Belgian Dark Silk',
      tagline: 'Melt-in-mouth Artisan Belgian Cocoa',
      description: 'Crafted with premium Belgian dark chocolate for a rich, silky finish.',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
      isPopular: true,
      pricing: {
        '250g': 269,
        '500g': 489,
        '1kg': 849,
        '1.5kg': 1229,
        '2kg': 1599,
      },
    },
    {
      id: 'black-forest-mini',
      name: 'Black Forest Classic',
      tagline: 'Cherries, Cream & Dark Chocolate Shavings',
      description: 'Classic chocolate sponge layered with whipped cream and tart red cherries.',
      image: 'https://images.unsplash.com/photo-1606890737304-57a1ca8a5b62?w=600&auto=format&fit=crop&q=80',
      pricing: {
        '250g': 229,
        '500g': 419,
        '1kg': 749,
        '1.5kg': 1079,
        '2kg': 1399,
      },
    },
    {
      id: 'red-velvet',
      name: 'Red Velvet Cream Cheese',
      tagline: 'Velvety Crimson Sponge & Tangy Frosting',
      description: 'Silky crimson red velvet sponge with premium cream cheese frosting.',
      image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      isPopular: true,
      pricing: {
        '250g': 279,
        '500g': 499,
        '1kg': 879,
        '1.5kg': 1269,
        '2kg': 1649,
      },
    },
    {
      id: 'butterscotch-crunch',
      name: 'Butterscotch Crunch',
      tagline: 'Caramelized Praline & Butterscotch Cream',
      description: 'Golden vanilla sponge with crunchy butterscotch praline and caramel glaze.',
      image: 'https://images.unsplash.com/photo-1542826438-bd32f43d626f?w=600&auto=format&fit=crop&q=80',
      pricing: {
        '250g': 229,
        '500g': 399,
        '1kg': 729,
        '1.5kg': 1049,
        '2kg': 1349,
      },
    },
    {
      id: 'hazelnut-praline',
      name: 'Hazelnut Praline Swirl',
      tagline: 'Roasted Hazelnuts & Nutella Ganache',
      description: 'Rich hazelnut praline paste swirled into dark chocolate whipped ganache.',
      image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=600&auto=format&fit=crop&q=80',
      pricing: {
        '250g': 289,
        '500g': 519,
        '1kg': 899,
        '1.5kg': 1299,
        '2kg': 1699,
      },
    },
    {
      id: 'fresh-pineapple',
      name: 'Fresh Pineapple Delight',
      tagline: 'Sweet Pineapple Chunks & Whipped Cream',
      description: 'Light and airy vanilla sponge layered with juicy pineapple compote.',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
      pricing: {
        '250g': 219,
        '500g': 389,
        '1kg': 699,
        '1.5kg': 999,
        '2kg': 1299,
      },
    },
  ] as CakeFlavourOption[],
  designs: [
    {
      id: 'classic-swirl',
      name: 'Classic Birthday Swirl',
      tagline: 'Traditional chocolate piping & golden candle',
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80',
      additionalCost: 0,
    },
    {
      id: 'korean-bento',
      name: 'Korean Minimalist Bento',
      tagline: 'Clean aesthetic pastel piping with custom name',
      image: 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?w=600&auto=format&fit=crop&q=80',
      additionalCost: 0,
    },
    {
      id: 'rose-piped',
      name: 'Pastel Rose Floral Piping',
      tagline: 'Matches the CelebrationBox Pastel Rose theme',
      image: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=600&auto=format&fit=crop&q=80',
      additionalCost: 50,
    },
    {
      id: 'vintage-heart',
      name: 'Vintage Lambeth Heart',
      tagline: 'Baroque ruffled borders with royal retro charm',
      image: 'https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80',
      additionalCost: 80,
    },
    {
      id: 'custom-photo-reference',
      name: 'Order by Reference Photo',
      tagline: 'Pinterest & Instagram cake design reproduction',
      image: 'https://images.unsplash.com/photo-1548741487-18d363dc4469?w=600&auto=format&fit=crop&q=80',
      additionalCost: 100,
    },
  ] as CakeDesignOption[],
};

export const DEFAULT_CAKE_CUSTOMIZATION: CakeCustomizationState = {
  includeCake: false,
  flavourId: 'dutch-truffle',
  size: '500g',
  dietType: 'eggless',
  designId: 'classic-swirl',
  nameOnCake: '',
  customMessage: '',
  specialInstructions: '',
};

export const calculateCakePrice = (state: CakeCustomizationState): number => {
  if (!state.includeCake) return 0;
  const flavour = CHOCOLOOM_CONFIG.flavours.find((f) => f.id === state.flavourId) || CHOCOLOOM_CONFIG.flavours[0];
  const base = flavour.pricing[state.size] || 449;
  const design = CHOCOLOOM_CONFIG.designs.find((d) => d.id === state.designId) || CHOCOLOOM_CONFIG.designs[0];
  return base + (design.additionalCost || 0);
};

export const getCakeFlavour = (id: string): CakeFlavourOption => {
  return CHOCOLOOM_CONFIG.flavours.find((f) => f.id === id) || CHOCOLOOM_CONFIG.flavours[0];
};

export const getCakeDesign = (id: string): CakeDesignOption => {
  return CHOCOLOOM_CONFIG.designs.find((d) => d.id === id) || CHOCOLOOM_CONFIG.designs[0];
};

