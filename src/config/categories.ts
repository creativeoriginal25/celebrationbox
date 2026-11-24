import { OccasionCategory } from '../types';

export const OCCASION_CATEGORIES: OccasionCategory[] = [
  {
    id: 'kids-birthday',
    slug: 'kids-birthday',
    name: "Kid's Birthday",
    tagline: 'Playful & Joyful DIY Birthday Kits',
    description:
      'Everything you need to turn an ordinary space into a beautiful birthday moment. Curated in our signature Baby Pink × Lavender × Metallic Copper theme.',
    image: '/categories/kids-birthday.svg',
    bgColor: '#FFF5E0',
    isAvailable: true,
    badge: 'Available Now',
    availableNotice:
      'Official Birthday Collection: Featuring the Pastel Rose Celebration Box with 56 balloons & foil backdrop.',
    relatedProductIds: ['signature-celebration-box'],
  },
  {
    id: 'adults-birthday',
    slug: 'adults-birthday',
    name: "Adult's Birthday",
    tagline: 'Aesthetic, Instagrammable Room Surprises',
    description:
      'Stylish balloons and elegant celebration styling curated for bedroom, living room, and hostel surprises without the hassle.',
    image: '/categories/adults-birthday.svg',
    bgColor: '#FFF0F3',
    isAvailable: true,
    badge: 'Available Now',
    availableNotice:
      'Official Birthday Collection: Featuring the Pastel Rose Celebration Box with 56 balloons & foil backdrop.',
    relatedProductIds: ['signature-celebration-box'],
  },
  {
    id: 'festive',
    slug: 'festive',
    name: 'Festive',
    tagline: 'Decorative Lights & Traditional Sparkle',
    description:
      'Handpicked seasonal decor, glowing ambient lights, and traditional celebration accents for festivals and special occasions.',
    image: '/categories/festive.svg',
    bgColor: '#FEF3C7',
    isAvailable: false,
    badge: 'Coming Soon',
    availableNotice:
      'Festive kits are currently being perfected for upcoming festive seasons. Join our early notification list on WhatsApp!',
  },
  {
    id: 'gifting-essentials',
    slug: 'gifting-essentials',
    name: 'Gifting Essentials',
    tagline: 'Curated Gift Packaging & Keepsakes',
    description:
      'Charming gift boxes, satin ribbons, handwritten greeting cards, and little celebration tokens to make any present unforgettable.',
    image: '/categories/gifting-essentials.svg',
    bgColor: '#FFE4E6',
    isAvailable: false,
    badge: 'Coming Soon',
    availableNotice:
      'Gifting Essentials collection is launching soon. Check out our all-in-one birthday gift boxes in the meantime!',
  },
  {
    id: 'bachelorette',
    slug: 'bachelorette',
    name: 'Bachelorette',
    tagline: 'Glam Props, Sashes & Photo Walls',
    description:
      'Stunning party sashes, playful photo booth props, confetti balloons, and glamorous backdrops for unforgettable bride-to-be celebrations.',
    image: '/categories/bachelorette.svg',
    bgColor: '#FCE7F3',
    isAvailable: false,
    badge: 'Coming Soon',
    availableNotice:
      'Our dedicated Bachelorette collection is currently in design. Reach out on WhatsApp for custom celebration inquiries!',
  },
  {
    id: 'baby-shower',
    slug: 'baby-shower',
    name: 'Baby Shower',
    tagline: 'Soft Pastels & Gentle Celebrations',
    description:
      'Tender pastel balloons, delicate cloud backdrops, and heartwarming welcome setups to celebrate new arrivals.',
    image: '/categories/baby-shower.svg',
    bgColor: '#E0F2FE',
    isAvailable: false,
    badge: 'Coming Soon',
    availableNotice:
      'Baby Shower celebration kits are launching soon. Stay tuned for our soothing pastel collections!',
  },
  {
    id: 'anniversary',
    slug: 'anniversary',
    name: 'Anniversary',
    tagline: 'Romantic Foil Accents & Intimate Decor',
    description:
      'Romantic heart balloons, warm candlelight accents, and intimate room decorations for milestone celebrations.',
    image: '/categories/anniversary.svg',
    bgColor: '#FFE4E6',
    isAvailable: false,
    badge: 'Coming Soon',
    availableNotice:
      'Anniversary edition boxes with rose-gold metallic tones are launching soon. Check back shortly!',
  },
  {
    id: 'custom-decor',
    slug: 'custom-decor',
    name: 'Custom Decor',
    tagline: 'Personalized Banners & Custom Themes',
    description:
      'Personalized celebration banners, custom name cutouts, and bespoke party accessories crafted specially for your celebration.',
    image: '/categories/custom-decor.svg',
    bgColor: '#EDE9FE',
    isAvailable: false,
    badge: 'Coming Soon',
    availableNotice:
      'Customized banners and bespoke themed kits are currently under development. Chat with us on WhatsApp for special requests.',
  },
  {
    id: 'party-essentials',
    slug: 'party-essentials',
    name: 'Party Essentials',
    tagline: 'Balloons, Ribbons, Pumps & Tape',
    description:
      'The essential party toolkit: dual-action manual pumps, wall-safe balloon glue dots, arch strips, candles, and curling ribbons bundled in our kits.',
    image: '/categories/party-essentials.svg',
    bgColor: '#FEF9C3',
    isAvailable: true,
    badge: 'Bundled in Kits',
    availableNotice:
      'Party Essentials are included inside every Celebration Box kit! We do not sell loose components separately — you get wall-safe glue dots, arch strips, curling ribbons, and candles pre-packaged with every box (and a dual-action pump with the Signature Box).',
    relatedProductIds: ['signature-celebration-box', 'mini-celebration-box'],
  },
];