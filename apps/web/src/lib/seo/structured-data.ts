import { SITE_CONFIG } from './metadata';

/**
 * Schema.org Structured Data Generators
 * These functions generate JSON-LD structured data for enhanced SEO
 */

// Common types
export interface BreadcrumbItem {
  name: string;
  url: string;
}

export interface ArticleSchemaConfig {
  title: string;
  description: string;
  url: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  section?: string;
}

export interface EventSchemaConfig {
  name: string;
  description: string;
  startDate: string;
  endDate?: string;
  location: {
    name: string;
    address?: string;
    latitude?: number;
    longitude?: number;
  };
  image?: string;
  url: string;
  organizer?: string;
  offers?: {
    price: string;
    currency: string;
    availability?: string;
  };
}

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Generate Organization schema
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_CONFIG.url}#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    logo: {
      '@type': 'ImageObject',
      '@id': `${SITE_CONFIG.url}#logo`,
      url: `${SITE_CONFIG.url}/icons/icon-512x512.png`,
      width: 512,
      height: 512,
      caption: SITE_CONFIG.name,
    },
    image: {
      '@id': `${SITE_CONFIG.url}#logo`,
    },
    sameAs: [
      // Add social media links when available
      // 'https://facebook.com/ykbuddy',
      // 'https://twitter.com/ykbuddy',
      // 'https://instagram.com/ykbuddy',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yellowknife',
      addressRegion: 'Northwest Territories',
      postalCode: 'X1A',
      addressCountry: 'CA',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer support',
      areaServed: 'CA',
      availableLanguage: ['English', 'French'],
    },
  };
}

/**
 * Generate WebSite schema with search action
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_CONFIG.url}#website`,
    name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    publisher: {
      '@id': `${SITE_CONFIG.url}#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_CONFIG.url}/knowledge?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-US',
  };
}

/**
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${SITE_CONFIG.url}#localbusiness`,
    name: SITE_CONFIG.name,
    description: 'Community platform for Yellowknife residents, visitors, and newcomers',
    url: SITE_CONFIG.url,
    telephone: '',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '',
      addressLocality: 'Yellowknife',
      addressRegion: 'NT',
      postalCode: 'X1A',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 62.4540,
      longitude: -114.3718,
    },
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
      ],
      opens: '00:00',
      closes: '23:59',
    },
    areaServed: {
      '@type': 'City',
      name: 'Yellowknife',
      '@id': 'https://www.wikidata.org/wiki/Q2062',
    },
    knowsAbout: [
      'Yellowknife',
      'Northwest Territories',
      'Aurora Borealis',
      'Northern Lights',
      'Arctic Tourism',
      'Relocation Services',
    ],
  };
}

/**
 * Generate BreadcrumbList schema
 */
export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article schema (for knowledge base articles)
 */
export function generateArticleSchema(config: ArticleSchemaConfig) {
  const {
    title,
    description,
    url,
    image = `${SITE_CONFIG.url}/og-image.jpg`,
    datePublished,
    dateModified,
    authorName = 'YK Buddy Team',
    section = 'Knowledge Base',
  } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: description,
    image: image,
    datePublished: datePublished,
    dateModified: dateModified || datePublished,
    author: {
      '@type': 'Organization',
      name: authorName,
      url: SITE_CONFIG.url,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}#organization`,
      name: SITE_CONFIG.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_CONFIG.url}/icons/icon-512x512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: section,
    inLanguage: 'en-US',
  };
}

/**
 * Generate Event schema (for garage sales and community events)
 */
export function generateEventSchema(config: EventSchemaConfig) {
  const {
    name,
    description,
    startDate,
    endDate,
    location,
    image,
    url,
    organizer = SITE_CONFIG.name,
    offers,
  } = config;

  const eventSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: name,
    description: description,
    startDate: startDate,
    endDate: endDate || startDate,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: location.name,
      ...(location.address && { address: location.address }),
      ...(location.latitude && location.longitude && {
        geo: {
          '@type': 'GeoCoordinates',
          latitude: location.latitude,
          longitude: location.longitude,
        },
      }),
    },
    ...(image && { image: [image] }),
    ...(url && { url: url }),
    organizer: {
      '@type': 'Organization',
      name: organizer,
      url: SITE_CONFIG.url,
    },
  };

  if (offers) {
    eventSchema.offers = {
      '@type': 'Offer',
      price: offers.price,
      priceCurrency: offers.currency,
      availability: offers.availability || 'https://schema.org/InStock',
      url: url,
    };
  }

  return eventSchema;
}

/**
 * Generate FAQPage schema
 */
export function generateFAQSchema(faqs: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate WebPage schema for general pages
 */
export function generateWebPageSchema(config: {
  title: string;
  description: string;
  url: string;
  breadcrumbs?: BreadcrumbItem[];
  datePublished?: string;
  dateModified?: string;
}) {
  const {
    title,
    description,
    url,
    breadcrumbs,
    datePublished,
    dateModified,
  } = config;

  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': url,
    url: url,
    name: title,
    description: description,
    isPartOf: {
      '@id': `${SITE_CONFIG.url}#website`,
    },
    ...(breadcrumbs && {
      breadcrumb: {
        '@id': `${url}#breadcrumb`,
      },
    }),
    ...(datePublished && { datePublished }),
    ...(dateModified && { dateModified }),
    inLanguage: 'en-US',
    potentialAction: [
      {
        '@type': 'ReadAction',
        target: [url],
      },
    ],
  };
}

