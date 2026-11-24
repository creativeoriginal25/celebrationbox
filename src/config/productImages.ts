import { ProductGalleryImage } from '../types';

export const PRODUCT_GALLERIES: Record<string, ProductGalleryImage[]> = {
  'signature-celebration-box': [
    {
      id: 'pastel-rose-setup',
      url: '/products/pastel-rose-setup.jpg',
      alt: 'Pastel Rose Celebration Box - Birthday setup preview',
      title: 'Decoration Setup Preview',
      caption: 'Styling inspiration. Cake, table and additional props are not included. Decorative lighting is available separately on rent.',
      type: 'main',
    },
    {
      id: 'pastel-rose-contents',
      url: '/products/pastel-rose-contents.jpg',
      alt: "Pastel Rose Celebration Box - What's Inside the Box contents",
      title: "What's Inside the Box",
      caption: 'Actual kit contents • 56 Balloons (20 Pink, 20 Lavender, 16 Copper), Gold Banner, Foil Backdrop, Tape & Candles',
      type: 'flatlay',
    },
  ],
  'mini-celebration-box': [
    {
      id: 'mini-main',
      url: '/products/mini-box.svg',
      alt: 'Mini Celebration Box - Complete DIY birthday kit overview',
      title: 'Studio Kit Overview',
      caption: 'Complete hostel and bedroom friendly DIY birthday decoration kit',
      type: 'main',
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
      url: fallbackImage || '/products/pastel-rose-setup.jpg',
      alt: productName ? `${productName} photograph` : 'Celebration Box product image',
      title: 'Product Image',
      caption: productName || 'Celebration Box item',
      type: 'main',
    },
  ];
};
