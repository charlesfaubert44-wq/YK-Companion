import { SITE_CONFIG } from './metadata';

/**
 * Advanced Schema.org Types
 *
 * Additional structured data schemas for rich search results:
 * - VideoObject
 * - Product (for premium features)
 * - Review/AggregateRating
 * - HowTo
 * - Course
 */

// Type definitions
export interface VideoSchemaConfig {
  name: string;
  description: string;
  thumbnailUrl: string;
  uploadDate: string;
  duration?: string; // ISO 8601 duration format (e.g., "PT1M30S" for 1 min 30 sec)
  contentUrl?: string;
  embedUrl?: string;
  width?: number;
  height?: number;
}

export interface ProductSchemaConfig {
  name: string;
  description: string;
  image: string[];
  sku?: string;
  brand?: string;
  offers: {
    price: string;
    priceCurrency: string;
    availability: string;
    url: string;
    validFrom?: string;
  };
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}

export interface ReviewSchemaConfig {
  itemReviewed: {
    type: string;
    name: string;
    url?: string;
  };
  author: {
    name: string;
    type?: string;
  };
  reviewRating: {
    ratingValue: number;
    bestRating?: number;
    worstRating?: number;
  };
  reviewBody: string;
  datePublished: string;
}

export interface HowToSchemaConfig {
  name: string;
  description: string;
  image?: string;
  totalTime?: string; // ISO 8601 duration
  estimatedCost?: {
    currency: string;
    value: string;
  };
  tool?: string[];
  supply?: string[];
  steps: Array<{
    name: string;
    text: string;
    image?: string;
    url?: string;
  }>;
}

export interface CourseSchemaConfig {
  name: string;
  description: string;
  provider: {
    name: string;
    url?: string;
  };
  url: string;
  image?: string;
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
  offers?: {
    price: string;
    priceCurrency: string;
    availability: string;
  };
}

/**
 * Generate VideoObject schema
 *
 * For video content (e.g., aurora webcam streams, tutorial videos)
 */
export function generateVideoSchema(config: VideoSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'VideoObject',
    name: config.name,
    description: config.description,
    thumbnailUrl: config.thumbnailUrl,
    uploadDate: config.uploadDate,
    ...(config.duration && { duration: config.duration }),
    ...(config.contentUrl && { contentUrl: config.contentUrl }),
    ...(config.embedUrl && { embedUrl: config.embedUrl }),
    ...(config.width &&
      config.height && {
        width: config.width,
        height: config.height,
      }),
  };
}

/**
 * Generate Product schema
 *
 * For premium features, sponsored listings, or merchandise
 */
export function generateProductSchema(config: ProductSchemaConfig) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: config.name,
    description: config.description,
    image: config.image,
    ...(config.sku && { sku: config.sku }),
    brand: {
      '@type': 'Brand',
      name: config.brand || SITE_CONFIG.name,
    },
    offers: {
      '@type': 'Offer',
      url: config.offers.url,
      priceCurrency: config.offers.priceCurrency,
      price: config.offers.price,
      availability: config.offers.availability,
      ...(config.offers.validFrom && { validFrom: config.offers.validFrom }),
    },
  };

  if (config.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      reviewCount: config.aggregateRating.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate Review schema
 *
 * For user reviews and testimonials
 */
export function generateReviewSchema(config: ReviewSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    itemReviewed: {
      '@type': config.itemReviewed.type,
      name: config.itemReviewed.name,
      ...(config.itemReviewed.url && { url: config.itemReviewed.url }),
    },
    author: {
      '@type': config.author.type || 'Person',
      name: config.author.name,
    },
    reviewRating: {
      '@type': 'Rating',
      ratingValue: config.reviewRating.ratingValue,
      bestRating: config.reviewRating.bestRating || 5,
      worstRating: config.reviewRating.worstRating || 1,
    },
    reviewBody: config.reviewBody,
    datePublished: config.datePublished,
  };
}

/**
 * Generate AggregateRating schema
 *
 * For overall ratings across multiple reviews
 */
export function generateAggregateRatingSchema(config: {
  itemName: string;
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
  worstRating?: number;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Thing',
      name: config.itemName,
    },
    ratingValue: config.ratingValue,
    reviewCount: config.reviewCount,
    bestRating: config.bestRating || 5,
    worstRating: config.worstRating || 1,
  };
}

/**
 * Generate HowTo schema
 *
 * For step-by-step guides (e.g., "How to prepare for winter in Yellowknife")
 */
export function generateHowToSchema(config: HowToSchemaConfig) {
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: config.name,
    description: config.description,
    ...(config.image && { image: config.image }),
    ...(config.totalTime && { totalTime: config.totalTime }),
    ...(config.estimatedCost && {
      estimatedCost: {
        '@type': 'MonetaryAmount',
        currency: config.estimatedCost.currency,
        value: config.estimatedCost.value,
      },
    }),
    ...(config.tool && { tool: config.tool }),
    ...(config.supply && { supply: config.supply }),
    step: config.steps.map((step, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: step.name,
      text: step.text,
      ...(step.image && { image: step.image }),
      ...(step.url && { url: step.url }),
    })),
  };
}

/**
 * Generate Course schema
 *
 * For educational content or onboarding guides
 */
export function generateCourseSchema(config: CourseSchemaConfig) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: config.name,
    description: config.description,
    provider: {
      '@type': 'Organization',
      name: config.provider.name,
      ...(config.provider.url && { url: config.provider.url }),
    },
    url: config.url,
    ...(config.image && { image: config.image }),
  };

  if (config.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      reviewCount: config.aggregateRating.reviewCount,
    };
  }

  if (config.offers) {
    schema.offers = {
      '@type': 'Offer',
      price: config.offers.price,
      priceCurrency: config.offers.priceCurrency,
      availability: config.offers.availability,
    };
  }

  return schema;
}

/**
 * Generate ItemList schema
 *
 * For lists of items (e.g., "Top 10 Things to Do in Yellowknife")
 */
export function generateItemListSchema(config: {
  name: string;
  description?: string;
  items: Array<{
    name: string;
    url: string;
    image?: string;
  }>;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: config.name,
    ...(config.description && { description: config.description }),
    itemListElement: config.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Thing',
        name: item.name,
        url: item.url,
        ...(item.image && { image: item.image }),
      },
    })),
  };
}

/**
 * Generate Place schema with enhanced details
 *
 * For location-based content (attractions, businesses)
 */
export function generatePlaceSchema(config: {
  name: string;
  description: string;
  address: {
    streetAddress?: string;
    addressLocality: string;
    addressRegion: string;
    postalCode?: string;
    addressCountry: string;
  };
  geo: {
    latitude: number;
    longitude: number;
  };
  image?: string[];
  telephone?: string;
  url?: string;
  openingHours?: string[];
  aggregateRating?: {
    ratingValue: number;
    reviewCount: number;
  };
}) {
  const schema: any = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: config.name,
    description: config.description,
    address: {
      '@type': 'PostalAddress',
      ...config.address,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: config.geo.latitude,
      longitude: config.geo.longitude,
    },
    ...(config.image && { image: config.image }),
    ...(config.telephone && { telephone: config.telephone }),
    ...(config.url && { url: config.url }),
    ...(config.openingHours && { openingHoursSpecification: config.openingHours }),
  };

  if (config.aggregateRating) {
    schema.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: config.aggregateRating.ratingValue,
      reviewCount: config.aggregateRating.reviewCount,
    };
  }

  return schema;
}

/**
 * Generate WebApplication schema
 *
 * For the YK Buddy web app itself
 */
export function generateWebApplicationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    applicationCategory: 'LifestyleApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'CAD',
    },
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    screenshot: `${SITE_CONFIG.url}/og-image.jpg`,
  };
}
