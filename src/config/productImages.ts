import { ProductGalleryImage } from '../types';

export const PRODUCT_GALLERIES: Record<string, ProductGalleryImage[]> = {
  'mini-celebration-box': [
    {
      id: 'mini-main',
      url: '/products/mini-box.svg',
      alt: 'Mini Celebration Box - Complete DIY birthday kit overview',
      title: 'Studio Kit Overview',
      caption: 'Complete hostel and bedroom friendly DIY birthday decoration kit',
      type: 'main',
    },
    {
      id: 'mini-flatlay',
      url: '/products/mini-box-flatlay.svg',
      alt: 'Mini Celebration Box flat-lay of all 8 items and 33 pieces',
      title: 'Full Kit Flat-Lay',
      caption: 'All 8 kit items and verified 33 pieces laid out cleanly',
      type: 'flatlay',
    },
    {
      id: 'mini-details',
      url: '/products/mini-box-details.svg',
      alt: 'Close-up texture of Pastel Pop balloons, banner, and candles',
      title: 'Contents & Materials',
      caption: 'Natural latex balloons, matte finish banner letters, and cake candles',
      type: 'details',
    },
    {
      id: 'mini-setup',
      url: '/products/mini-box-setup.svg',
      alt: 'Mini Celebration Box bedroom and hostel wall decoration setup',
      title: 'Room Setup Example',
      caption: 'Intimate wall and cake table birthday styling completed in 15-20 minutes',
      type: 'setup',
    },
    {
      id: 'mini-package',
      url: '/products/mini-box-package.svg',
      alt: 'Mini Celebration Box compact packaging and unboxing presentation',
      title: 'Packaging & Unboxing',
      caption: 'Discreet 22 x 16 x 6 cm recyclable presentation box ready to surprise',
      type: 'packaging',
    },
  ],
  'signature-celebration-box': [
    {
      id: 'signature-main',
      url: '/products/signature-box.svg',
      alt: 'Signature Celebration Box - Complete party setup with shimmer backdrop and foil balloon',
      title: 'Studio Kit Overview',
      caption: 'Complete party setup with 6-ft foil shimmer backdrop, foil balloon, and pump',
      type: 'main',
    },
    {
      id: 'signature-flatlay',
      url: '/products/signature-box-flatlay.svg',
      alt: 'Signature Celebration Box flat-lay of all 12 items and 60 pieces',
      title: 'Full Kit Flat-Lay',
      caption: 'All 12 kit items and verified 60 pieces including pump and photo props',
      type: 'flatlay',
    },
    {
      id: 'signature-details',
      url: '/products/signature-box-details.svg',
      alt: 'Macro view of 18-inch metallic foil balloon, dual-action pump, and photo props',
      title: 'Contents & Materials',
      caption: '18-inch statement foil balloon, wooden selfie props, and dual-action hand pump',
      type: 'details',
    },
    {
      id: 'signature-setup',
      url: '/products/signature-box-setup.svg',
      alt: 'Signature Celebration Box living room celebration setup with shimmer backdrop',
      title: 'Party Setup Example',
      caption: 'Instagrammable photo wall with 6-foot shimmer curtain and full balloon garland',
      type: 'setup',
    },
    {
      id: 'signature-package',
      url: '/products/signature-box-package.svg',
      alt: 'Signature Celebration Box presentation packaging and unboxing',
      title: 'Packaging & Unboxing',
      caption: 'Large 32 x 24 x 8 cm party box with branded seal and protection',
      type: 'packaging',
    },
  ],
};

/**
 * Returns the gallery images for a given product.
 * If no custom gallery is defined or only one image is available,
 * returns a fallback array with the product's primary image.
 */
export const getProductImages = (
  productId: string,
  fallbackImage?: string,
  productName?: string
): ProductGalleryImage[] => {
  const customGallery = PRODUCT_GALLERIES[productId];
  if (customGallery && customGallery.length > 0) {
    return customGallery;
  }

  // Fallback if only single image is configured
  return [
    {
      id: `${productId}-main`,
      url: fallbackImage || '/products/mini-box.svg',
      alt: productName ? `${productName} photograph` : 'Celebration Box product image',
      title: 'Product Image',
      caption: productName || 'Celebration Box item',
      type: 'main',
    },
  ];
};