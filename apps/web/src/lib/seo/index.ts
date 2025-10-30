/**
 * SEO and Metadata Library
 *
 * This module provides comprehensive SEO utilities for the YK Buddy application.
 * It includes metadata generation, structured data, multilingual support,
 * dynamic content metadata, and SEO best practices.
 */

// Core Metadata
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

// Structured Data (Basic)
export {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateEventSchema,
  generateFAQSchema,
  generateWebPageSchema,
  type BreadcrumbItem,
  type ArticleSchemaConfig,
  type EventSchemaConfig,
  type FAQItem,
} from './structured-data';

// Advanced Structured Data
export {
  generateVideoSchema,
  generateProductSchema,
  generateReviewSchema,
  generateAggregateRatingSchema,
  generateHowToSchema,
  generateCourseSchema,
  generateItemListSchema,
  generatePlaceSchema,
  generateWebApplicationSchema,
  type VideoSchemaConfig,
  type ProductSchemaConfig,
  type ReviewSchemaConfig,
  type HowToSchemaConfig,
  type CourseSchemaConfig,
} from './advanced-schemas';

// Dynamic Content Metadata
export {
  generateGarageSaleMetadata,
  generateKnowledgeArticleMetadata,
  fetchGarageSaleForSchema,
  fetchKnowledgeArticleForSchema,
  getGarageSalesForSitemap,
  getKnowledgeArticlesForSitemap,
} from './dynamic-metadata';

// Multilingual Support
export {
  generateHreflangLinks,
  generateLanguageMetadata,
  generateOpenGraphLocales,
  getLanguageFromPath,
  generateLanguageSitemapIndex,
  addLanguageToSchema,
  createMultilingualMetadata,
  LANGUAGE_CONFIG,
  SEO_TRANSLATIONS,
  type SupportedLanguage,
} from './multilingual';
