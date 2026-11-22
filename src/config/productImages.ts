import { ProductGalleryImage } from '../types';

export const PRODUCT_GALLERIES: Record<string, ProductGalleryImage[]> = {
  'signature-celebration-box': [
    {
      id: 'pastel-rose-setup',
      url: '/products/pastel-rose-setup.jpg',
      alt: 'Pastel Rose Celebration Box - Balloon garland setup preview',
      title: 'Decoration Setup Preview',
      caption: 'Illustrative setup preview • Pink × Lavender × Rose Gold balloon garland with Happy Birthday banner',
      type: 'main',
    },
    {
      id: 'pastel-rose-contents',
      url: '/products/pastel-rose-contents.jpg',
      alt: "Pastel Rose Celebration Box - What's Inside the Box contents infographic",
      title: "What's Inside the Box",
      caption: 'Exact package contents • 26 Pink, 26 Lavender, 5 Rose Gold, Banner, Arch Strip & Glue Dots (60 total pcs)',
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
