/**
 * SEO and Metadata Library
 * 
 * This module provides comprehensive SEO utilities for the YK Buddy application.
 * It includes metadata generation, structured data, and SEO best practices.
 */

export {
  defaultMetadata,
  generatePageMetadata,
  SITE_CONFIG,
  googleSiteVerification,
  PATHWAY_METADATA,
  FEATURE_METADATA,
  STATIC_METADATA,
  ADMIN_METADATA,
  USER_METADATA,
  type PageMetadataConfig,
} from './metadata';

export {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateEventSchema,
  generateFAQSchema,
  type BreadcrumbItem,
  type ArticleSchemaConfig,
  type EventSchemaConfig,
  type FAQItem,
} from './structured-data';

