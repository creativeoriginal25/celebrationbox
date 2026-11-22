import { Product, ThemeOption } from '../types';

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: 'pastel-rose',
    name: 'Pink × Lavender × Rose Gold',
    colors: [
      { name: 'Pastel Pink', hex: '#FFB6C1' },
      { name: 'Lavender', hex: '#D8B4E2' },
      { name: 'Rose Gold', hex: '#B76E79' },
    ],
    isAvailable: true,
    description: 'Soft pastel pink, delicate lavender, and metallic rose gold shine.',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'signature-celebration-box',
    name: 'Pastel Rose Celebration Box',
    tagline: 'Big Moments. One Little Box.',
    price: 299,
    description:
      'Everything you need to turn an ordinary space into a beautiful birthday moment.',
    idealFor: 'Bedroom, living room, and hostel birthday celebrations',
    inclusions: [
      '26 Pink Latex Balloons',
      '26 Lavender Latex Balloons',
      '5 Rose Gold Chrome Balloons',
      '1 Rose Gold Happy Birthday Banner',
      '1 Balloon Arch Strip',
      '1 Glue Dot Roll (100 dots)',
    ],
    exclusions: [
      'Cake, backdrop curtain, metal arch stand, and balloon pump are not included.',
    ],
    image: '/products/pastel-rose-setup.jpg',
    badge: 'Official Launch Edition',
    popular: true,
    active: true,
    availableThemes: ['pastel-rose'],
    totalPieces: 60,
    inventoryStatus: 'in_stock',
    packItems: [
      {
        name: 'Pink Latex Balloons',
        quantity: '26 pcs',
        pieceCount: 26,
        specification: 'Soft pastel pink natural latex balloons (10-inch)',
        note: 'Durable, vibrant color balloons for creating your garland arch',
      },
      {
        name: 'Lavender Latex Balloons',
        quantity: '26 pcs',
        pieceCount: 26,
        specification: 'Charming pastel lavender natural latex balloons (10-inch)',
        note: 'Complements the pastel pink and rose gold tones beautifully',
      },
      {
        name: 'Rose Gold Chrome Balloons',
        quantity: '5 pcs',
        pieceCount: 5,
        specification: 'Glossy metallic chrome finish balloons (10-inch)',
        note: 'Statement chrome accents that add luxury shimmer to the garland',
      },
      {
        name: 'Rose Gold Happy Birthday Banner',
        quantity: '1 pc',
        pieceCount: 1,
        specification: 'Cursive metallic rose gold banner with hanging cord',
        note: 'High-shine reflective finish; easy to string and hang',
      },
      {
        name: 'Balloon Arch Strip',
        quantity: '1 pc',
        pieceCount: 1,
        specification: 'Garland tape track with pre-cut dual holes (approx. 2m)',
        note: 'Holds balloons snugly without knot tying struggles',
      },
      {
        name: 'Glue Dot Roll',
        quantity: '1 roll (100 dots)',
        pieceCount: 1,
        specification: 'Removable, wall-safe double-sided glue dots',
        note: 'Safely sticks smaller balloons and accents to walls or other balloons',
      },
    ],
    dimensionsOrSpecs: [
      'Theme: Pink × Lavender × Rose Gold',
      'Total: 60 pieces',
      'Setup time: ~25-35 minutes DIY',
      'Wall-friendly: 100 removable glue dots included',
    ],
  },
  {
    id: 'mini-celebration-box',
    name: 'Mini Celebration Box',
    tagline: 'Hostel & Bedroom Friendly DIY Birthday Kit',
    price: 249,
    description:
      'A compact DIY birthday decoration kit for small celebrations in hostels, bedrooms and homes.',
    idealFor: 'Hostel rooms, small bedroom surprises, desk setups & budget celebrations',
    inclusions: [
      '12 latex balloons (4 Peach, 4 Lilac, 4 Cream)',
      '1 Happy Birthday banner',
      '1 Six-piece cake candle pack',
      '1 Metre balloon arch strip',
      '10 Balloon glue dots',
      '2 Metres curling ribbon',
      '1 Step-by-step DIY decoration instruction card',
      '1 Branded Celebration Box package sticker',
    ],
    exclusions: [
      'Balloon pump not included',
      'Cake is not included',
      'Helium is not included',
    ],
    image: '/products/mini-box.svg',
    badge: 'Previous Edition',
    popular: false,
    active: false, // Inactive per requirement: only Pastel Rose Celebration Box is active
    availableThemes: ['pastel-rose'],
    totalPieces: 33,
    inventoryStatus: 'out_of_stock',
  },
];
