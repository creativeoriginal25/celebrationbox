import { Product, ThemeOption } from '../types';

export const AVAILABLE_THEMES: ThemeOption[] = [
  {
    id: 'pastel-pop',
    name: 'Pastel Pop',
    colors: [
      { name: 'Peach', hex: '#FFBE98' },
      { name: 'Lilac', hex: '#D8B4E2' },
      { name: 'Cream', hex: '#FFF4E0' },
    ],
    isAvailable: true,
    description: 'Soft, trendy and cheerful tones of peach, lilac, and cream. Perfect for aesthetic photos!',
  },
  {
    id: 'golden-glam',
    name: 'Golden Glam',
    colors: [
      { name: 'Gold', hex: '#D4AF37' },
      { name: 'Midnight Black', hex: '#1C1C1E' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    isAvailable: false,
    description: 'Upcoming luxury edition for evening party vibes (Launching soon).',
  },
  {
    id: 'rose-blush',
    name: 'Rose Blush',
    colors: [
      { name: 'Rose Gold', hex: '#B76E79' },
      { name: 'Dusty Pink', hex: '#DCAE96' },
      { name: 'Pearl', hex: '#FDFBF7' },
    ],
    isAvailable: false,
    description: 'Upcoming romantic & soft aesthetic theme (Launching soon).',
  },
];

export const PRODUCTS: Product[] = [
  {
    id: 'mini-celebration-box',
    name: 'Mini Celebration Box',
    tagline: 'Hostel & Bedroom Friendly DIY Birthday Kit',
    price: 249,
    description:
      'A compact DIY birthday decoration kit for small celebrations in hostels, bedrooms and homes. Everything you need to create an intimate, memorable surprise in minutes.',
    idealFor: 'Hostel rooms, small bedroom surprises, desk setups & budget celebrations',
    inclusions: [
      '12 latex balloons (4 Peach, 4 Lilac, 4 Cream)',
      '1 Happy Birthday banner (pre-punched & easy to hang)',
      '1 Six-piece cake candle pack (sparkling celebration candles)',
      '1 Metre balloon arch strip for quick balloon garland styling',
      '10 Balloon glue dots (leaves no marks on walls)',
      '2 Metres curling ribbon for tying & styling',
      '1 Step-by-step DIY decoration instruction card',
      '1 Branded Celebration Box package sticker',
    ],
    exclusions: [
      'Balloon pump not included (easy to blow up by mouth or share with a friend)',
      'Cake is not included',
      'Helium is not included',
    ],
    image: '/products/mini-box.svg',
    badge: 'Budget Pick',
    popular: false,
    active: true,
    availableThemes: ['pastel-pop'],
    dimensionsOrSpecs: [
      'Setup time: ~15-20 minutes',
      'Wall friendly: removable glue dots included',
      'Box dimensions: 22 x 16 x 6 cm compact packaging',
    ],
  },
  {
    id: 'signature-celebration-box',
    name: 'Signature Celebration Box',
    tagline: 'Complete Party Setup with Backdrop & Foil Balloon',
    price: 499,
    description:
      'A more complete DIY birthday decoration experience with a backdrop, foil balloon and photo props. Turns any ordinary room into an Instagrammable celebration hub.',
    idealFor: 'Living rooms, hall parties, group celebrations & photobooth backdrops',
    inclusions: [
      '20 latex balloons (balanced coordinated Pastel Pop palette)',
      '1 Happy Birthday banner (premium cardstock finish)',
      '1 Six-foot shimmer foil backdrop curtain (party photo wall ready)',
      '1 18-inch Happy Birthday foil balloon statement piece',
      '2 Metres balloon arch strip for fuller garland structure',
      '20 Balloon glue dots (high-hold, surface safe)',
      '6 Photo booth props on sturdy wooden sticks for group selfies',
      '1 Manual balloon hand pump included (effortless inflation)',
      '1 Six-piece cake candle pack',
      '3 Metres curling ribbon',
      '1 Step-by-step DIY decoration instruction card',
      '1 Branded Celebration Box package sticker',
    ],
    exclusions: [
      'Cake is not included',
      'Helium is not included',
      'Professional decoration service is not included (100% fun DIY kit)',
    ],
    image: '/products/signature-box.svg',
    badge: 'Most Popular',
    popular: true,
    active: true,
    availableThemes: ['pastel-pop'],
    dimensionsOrSpecs: [
      'Setup time: ~30-40 minutes',
      'Includes manual balloon pump for zero breath fatigue',
      'Box dimensions: 32 x 24 x 8 cm premium presentation box',
    ],
  },
];
