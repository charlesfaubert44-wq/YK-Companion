'use client';

import Script from 'next/script';
import { 
  generateOrganizationSchema, 
  generateWebSiteSchema, 
  generateLocalBusinessSchema,
  type BreadcrumbItem,
  type ArticleSchemaConfig,
  type EventSchemaConfig,
  type FAQItem,
} from '@/lib/seo/structured-data';
import { 
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateEventSchema,
  generateFAQSchema,
  generateWebPageSchema,
} from '@/lib/seo/structured-data';

interface StructuredDataProps {
  type?: 'default' | 'article' | 'event' | 'faq' | 'webpage';
  breadcrumbs?: BreadcrumbItem[];
  article?: ArticleSchemaConfig;
  event?: EventSchemaConfig;
  faqs?: FAQItem[];
  webpage?: {
    title: string;
    description: string;
    url: string;
    datePublished?: string;
    dateModified?: string;
  };
}

/**
 * StructuredData Component
 * 
 * Renders JSON-LD structured data for enhanced SEO.
 * Supports multiple schema types and can be customized per page.
 * 
 * @example
 * // Basic usage (in layout.tsx for global schemas)
 * <StructuredData />
 * 
 * @example
 * // With breadcrumbs
 * <StructuredData 
 *   breadcrumbs={[
 *     { name: 'Home', url: '/' },
 *     { name: 'Living', url: '/living' },
 *     { name: 'Garage Sales', url: '/living/garage-sales' }
 *   ]} 
 * />
 * 
 * @example
 * // Article schema (for knowledge base)
 * <StructuredData 
 *   type="article"
 *   article={{
 *     title: 'Guide to Aurora Viewing',
 *     description: 'Complete guide...',
 *     url: '/knowledge/aurora-viewing',
 *     datePublished: '2024-01-01',
 *     dateModified: '2024-01-15',
 *   }}
 * />
 * 
 * @example
 * // Event schema (for garage sales)
 * <StructuredData 
 *   type="event"
 *   event={{
 *     name: 'Community Garage Sale',
 *     description: 'Big sale event',
 *     startDate: '2024-06-15T09:00:00',
 *     endDate: '2024-06-15T16:00:00',
 *     location: {
 *       name: 'Downtown Yellowknife',
 *       latitude: 62.4540,
 *       longitude: -114.3718,
 *     },
 *     url: '/living/garage-sales/123',
 *   }}
 * />
 */
export default function StructuredData({
  type = 'default',
  breadcrumbs,
  article,
  event,
  faqs,
  webpage,
}: StructuredDataProps) {
  // Always include base schemas
  const organizationData = generateOrganizationSchema();
  const websiteData = generateWebSiteSchema();
  const localBusinessData = generateLocalBusinessSchema();

  return (
    <>
      {/* Base schemas - always included */}
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <Script
        id="local-business-structured-data"
        type="application/ld+json"
        strategy="beforeInteractive"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />

      {/* Breadcrumbs */}
      {breadcrumbs && breadcrumbs.length > 0 && (
        <Script
          id="breadcrumb-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(generateBreadcrumbSchema(breadcrumbs)) 
          }}
        />
      )}

      {/* Article schema */}
      {type === 'article' && article && (
        <Script
          id="article-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(generateArticleSchema(article)) 
          }}
        />
      )}

      {/* Event schema */}
      {type === 'event' && event && (
        <Script
          id="event-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(generateEventSchema(event)) 
          }}
        />
      )}

      {/* FAQ schema */}
      {type === 'faq' && faqs && faqs.length > 0 && (
        <Script
          id="faq-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(generateFAQSchema(faqs)) 
          }}
        />
      )}

      {/* WebPage schema */}
      {type === 'webpage' && webpage && (
        <Script
          id="webpage-structured-data"
          type="application/ld+json"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ 
            __html: JSON.stringify(generateWebPageSchema({
              ...webpage,
              breadcrumbs,
            })) 
          }}
        />
      )}
    </>
  );
}

/**
 * Breadcrumb Component
 * 
 * Helper component to generate breadcrumb structured data
 * Can be used in individual pages for page-specific breadcrumbs
 */
export function BreadcrumbStructuredData({ items }: { items: BreadcrumbItem[] }) {
  if (!items || items.length === 0) return null;

  return (
    <Script
      id="breadcrumb-data"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(generateBreadcrumbSchema(items)) 
      }}
    />
  );
}

/**
 * Article Structured Data Component
 * 
 * Helper component for knowledge base articles
 */
export function ArticleStructuredData({ article }: { article: ArticleSchemaConfig }) {
  return (
    <Script
      id="article-data"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(generateArticleSchema(article)) 
      }}
    />
  );
}

/**
 * Event Structured Data Component
 * 
 * Helper component for events and garage sales
 */
export function EventStructuredData({ event }: { event: EventSchemaConfig }) {
  return (
    <Script
      id="event-data"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(generateEventSchema(event)) 
      }}
    />
  );
}

/**
 * FAQ Structured Data Component
 * 
 * Helper component for FAQ sections
 */
export function FAQStructuredData({ faqs }: { faqs: FAQItem[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <Script
      id="faq-data"
      type="application/ld+json"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ 
        __html: JSON.stringify(generateFAQSchema(faqs)) 
      }}
    />
  );
}
