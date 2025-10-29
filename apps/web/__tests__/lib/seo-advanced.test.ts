/**
 * Advanced SEO Features Tests
 * 
 * Tests for:
 * - Advanced schema types (Video, Product, Review, HowTo, etc.)
 * - Multilingual SEO utilities
 * - Dynamic content metadata
 */

import {
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
} from '@/lib/seo/advanced-schemas';

import {
  generateHreflangLinks,
  generateLanguageMetadata,
  generateOpenGraphLocales,
  getLanguageFromPath,
  createMultilingualMetadata,
  LANGUAGE_CONFIG,
  SEO_TRANSLATIONS,
  type SupportedLanguage,
} from '@/lib/seo/multilingual';

describe('Advanced Schema Types', () => {
  describe('VideoObject Schema', () => {
    it('should generate valid video schema', () => {
      const config: VideoSchemaConfig = {
        name: 'Aurora Live Stream',
        description: 'Live aurora borealis webcam from Yellowknife',
        thumbnailUrl: 'https://ykbuddy.com/aurora-thumbnail.jpg',
        uploadDate: '2024-01-01',
        duration: 'PT0S', // Livestream
        embedUrl: 'https://ykbuddy.com/aurora-live/embed',
      };

      const schema = generateVideoSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('VideoObject');
      expect(schema.name).toBe(config.name);
      expect(schema.thumbnailUrl).toBe(config.thumbnailUrl);
      expect(schema.duration).toBe(config.duration);
    });

    it('should handle optional video properties', () => {
      const config: VideoSchemaConfig = {
        name: 'Tutorial Video',
        description: 'How to prepare for winter',
        thumbnailUrl: 'https://ykbuddy.com/thumb.jpg',
        uploadDate: '2024-01-01',
        width: 1920,
        height: 1080,
      };

      const schema = generateVideoSchema(config);

      expect(schema.width).toBe(1920);
      expect(schema.height).toBe(1080);
    });
  });

  describe('Product Schema', () => {
    it('should generate valid product schema', () => {
      const config: ProductSchemaConfig = {
        name: 'Premium Sponsorship',
        description: 'Featured listing on YK Buddy homepage',
        image: ['https://ykbuddy.com/product.jpg'],
        sku: 'PREMIUM-001',
        brand: 'YK Buddy',
        offers: {
          price: '99.99',
          priceCurrency: 'CAD',
          availability: 'https://schema.org/InStock',
          url: 'https://ykbuddy.com/sponsor-info',
        },
      };

      const schema = generateProductSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Product');
      expect(schema.name).toBe(config.name);
      expect(schema.sku).toBe(config.sku);
      expect(schema.offers['@type']).toBe('Offer');
      expect(schema.offers.price).toBe('99.99');
    });

    it('should include aggregate rating when provided', () => {
      const config: ProductSchemaConfig = {
        name: 'Product',
        description: 'Test product',
        image: ['test.jpg'],
        offers: {
          price: '10.00',
          priceCurrency: 'CAD',
          availability: 'https://schema.org/InStock',
          url: 'https://ykbuddy.com/product',
        },
        aggregateRating: {
          ratingValue: 4.5,
          reviewCount: 42,
        },
      };

      const schema = generateProductSchema(config);

      expect(schema.aggregateRating).toBeDefined();
      expect(schema.aggregateRating.ratingValue).toBe(4.5);
      expect(schema.aggregateRating.reviewCount).toBe(42);
    });
  });

  describe('Review Schema', () => {
    it('should generate valid review schema', () => {
      const config: ReviewSchemaConfig = {
        itemReviewed: {
          type: 'LocalBusiness',
          name: 'YK Buddy',
          url: 'https://ykbuddy.com',
        },
        author: {
          name: 'John Doe',
          type: 'Person',
        },
        reviewRating: {
          ratingValue: 5,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: 'Excellent resource for Yellowknife information!',
        datePublished: '2024-01-15',
      };

      const schema = generateReviewSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Review');
      expect(schema.reviewRating.ratingValue).toBe(5);
      expect(schema.author.name).toBe('John Doe');
    });

    it('should use default rating values', () => {
      const config: ReviewSchemaConfig = {
        itemReviewed: {
          type: 'Product',
          name: 'Test',
        },
        author: {
          name: 'User',
        },
        reviewRating: {
          ratingValue: 4,
        },
        reviewBody: 'Good',
        datePublished: '2024-01-01',
      };

      const schema = generateReviewSchema(config);

      expect(schema.reviewRating.bestRating).toBe(5);
      expect(schema.reviewRating.worstRating).toBe(1);
    });
  });

  describe('HowTo Schema', () => {
    it('should generate valid how-to schema', () => {
      const config: HowToSchemaConfig = {
        name: 'How to Prepare for Winter in Yellowknife',
        description: 'Complete guide to winter preparation',
        totalTime: 'P1D',
        tool: ['Winter tires', 'Block heater'],
        supply: ['Emergency kit', 'Warm clothing'],
        steps: [
          {
            name: 'Install winter tires',
            text: 'Switch to winter tires by October 1st',
          },
          {
            name: 'Test block heater',
            text: 'Ensure your vehicle block heater is working',
          },
        ],
      };

      const schema = generateHowToSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('HowTo');
      expect(schema.step).toHaveLength(2);
      expect(schema.step[0].position).toBe(1);
      expect(schema.step[1].position).toBe(2);
      expect(schema.tool).toEqual(config.tool);
    });
  });

  describe('Course Schema', () => {
    it('should generate valid course schema', () => {
      const config: CourseSchemaConfig = {
        name: 'Newcomer Orientation',
        description: 'Complete guide for new Yellowknife residents',
        provider: {
          name: 'YK Buddy',
          url: 'https://ykbuddy.com',
        },
        url: 'https://ykbuddy.com/moving',
      };

      const schema = generateCourseSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Course');
      expect(schema.provider.name).toBe('YK Buddy');
    });
  });

  describe('ItemList Schema', () => {
    it('should generate valid item list schema', () => {
      const config = {
        name: 'Top Things to Do in Yellowknife',
        description: 'Must-see attractions',
        items: [
          {
            name: 'Aurora Viewing',
            url: 'https://ykbuddy.com/aurora',
          },
          {
            name: 'Old Town Tour',
            url: 'https://ykbuddy.com/discover',
          },
        ],
      };

      const schema = generateItemListSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('ItemList');
      expect(schema.itemListElement).toHaveLength(2);
      expect(schema.itemListElement[0].position).toBe(1);
    });
  });

  describe('Place Schema', () => {
    it('should generate valid place schema with all properties', () => {
      const config = {
        name: 'Prince of Wales Northern Heritage Centre',
        description: 'Museum showcasing northern culture and history',
        address: {
          streetAddress: '4750 48th Street',
          addressLocality: 'Yellowknife',
          addressRegion: 'NT',
          postalCode: 'X1A 2L9',
          addressCountry: 'CA',
        },
        geo: {
          latitude: 62.4503,
          longitude: -114.3730,
        },
        image: ['https://ykbuddy.com/pwn.jpg'],
        telephone: '+1-867-767-9347',
        url: 'https://www.pwnhc.ca',
        aggregateRating: {
          ratingValue: 4.7,
          reviewCount: 156,
        },
      };

      const schema = generatePlaceSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Place');
      expect(schema.geo.latitude).toBe(62.4503);
      expect(schema.address.addressLocality).toBe('Yellowknife');
      expect(schema.aggregateRating).toBeDefined();
    });
  });

  describe('WebApplication Schema', () => {
    it('should generate valid web application schema', () => {
      const schema = generateWebApplicationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebApplication');
      expect(schema.name).toBe('YK Buddy');
      expect(schema.applicationCategory).toBe('LifestyleApplication');
      expect(schema.offers.price).toBe('0');
    });
  });
});

describe('Multilingual SEO', () => {
  describe('Language Configuration', () => {
    it('should have configuration for all supported languages', () => {
      expect(LANGUAGE_CONFIG.en).toBeDefined();
      expect(LANGUAGE_CONFIG.fr).toBeDefined();
      expect(LANGUAGE_CONFIG.dene).toBeDefined();
      expect(LANGUAGE_CONFIG.inuktitut).toBeDefined();
    });

    it('should have correct language codes', () => {
      expect(LANGUAGE_CONFIG.en.code).toBe('en-CA');
      expect(LANGUAGE_CONFIG.fr.code).toBe('fr-CA');
      expect(LANGUAGE_CONFIG.dene.code).toBe('den');
      expect(LANGUAGE_CONFIG.inuktitut.code).toBe('iu');
    });
  });

  describe('Hreflang Links', () => {
    it('should generate hreflang links for all languages', () => {
      const links = generateHreflangLinks('/about', ['en', 'fr']);

      expect(links).toHaveLength(3); // en, fr, x-default
      expect(links.find((l) => l.hreflang === 'en-CA')).toBeDefined();
      expect(links.find((l) => l.hreflang === 'fr-CA')).toBeDefined();
      expect(links.find((l) => l.hreflang === 'x-default')).toBeDefined();
    });

    it('should generate correct URLs for languages', () => {
      const links = generateHreflangLinks('/about', ['en', 'fr']);

      const enLink = links.find((l) => l.hreflang === 'en-CA');
      const frLink = links.find((l) => l.hreflang === 'fr-CA');

      expect(enLink?.href).toContain('/about');
      expect(frLink?.href).toContain('/fr/about');
    });

    it('should include x-default pointing to English', () => {
      const links = generateHreflangLinks('/page', ['en', 'fr', 'dene']);

      const defaultLink = links.find((l) => l.hreflang === 'x-default');

      expect(defaultLink).toBeDefined();
      expect(defaultLink?.href).not.toContain('/en/');
    });
  });

  describe('Language Metadata', () => {
    it('should generate language-specific metadata', () => {
      const translations = {
        title: {
          en: 'About Us',
          fr: 'À propos de nous',
          dene: 'Test',
          inuktitut: 'Test',
        },
        description: {
          en: 'Learn about YK Buddy',
          fr: 'En savoir plus sur YK Buddy',
          dene: 'Test',
          inuktitut: 'Test',
        },
      };

      const metadata = generateLanguageMetadata('fr', translations);

      expect(metadata.title).toBe('À propos de nous');
      expect(metadata.description).toBe('En savoir plus sur YK Buddy');
      expect(metadata.openGraph.locale).toBe('fr-CA');
    });
  });

  describe('Open Graph Locales', () => {
    it('should generate alternate locales', () => {
      const locales = generateOpenGraphLocales('en', ['en', 'fr', 'dene']);

      expect(locales).toHaveLength(2); // Excludes current language
      expect(locales).toContain('fr-CA');
      expect(locales).toContain('den');
      expect(locales).not.toContain('en-CA');
    });
  });

  describe('Language from Path', () => {
    it('should extract language from path', () => {
      expect(getLanguageFromPath('/fr/about')).toBe('fr');
      expect(getLanguageFromPath('/dene/contact')).toBe('dene');
      expect(getLanguageFromPath('/inuktitut/aurora')).toBe('inuktitut');
    });

    it('should default to English for paths without language', () => {
      expect(getLanguageFromPath('/about')).toBe('en');
      expect(getLanguageFromPath('/')).toBe('en');
    });

    it('should default to English for invalid language codes', () => {
      expect(getLanguageFromPath('/invalid/page')).toBe('en');
    });
  });

  describe('Multilingual Metadata Creation', () => {
    it('should create complete multilingual metadata', () => {
      const translations = {
        title: {
          en: 'Test Page',
          fr: 'Page de test',
          dene: 'Test',
          inuktitut: 'Test',
        },
        description: {
          en: 'Description',
          fr: 'La description',
          dene: 'Test',
          inuktitut: 'Test',
        },
      };

      const metadata = createMultilingualMetadata(
        '/test',
        'fr',
        ['en', 'fr'],
        translations
      );

      expect(metadata.title).toBe('Page de test');
      expect(metadata.openGraph.locale).toBe('fr-CA');
      expect(metadata.openGraph.alternateLocale).toContain('en-CA');
      expect(metadata.alternates.canonical).toContain('/fr/test');
    });
  });

  describe('SEO Translations', () => {
    it('should have translations for site title', () => {
      expect(SEO_TRANSLATIONS.siteTitle.en).toBeDefined();
      expect(SEO_TRANSLATIONS.siteTitle.fr).toBeDefined();
      expect(SEO_TRANSLATIONS.siteTitle.dene).toBeDefined();
      expect(SEO_TRANSLATIONS.siteTitle.inuktitut).toBeDefined();
    });

    it('should have translations for all pathways', () => {
      const pathways = SEO_TRANSLATIONS.pathways;

      expect(pathways.visiting.en).toBe('Visiting');
      expect(pathways.living.fr).toBe('Vivre');
      expect(pathways.moving).toBeDefined();
    });

    it('should have translations for features', () => {
      const features = SEO_TRANSLATIONS.features;

      expect(features.aurora.en).toBe('Aurora Forecast');
      expect(features.garageSales).toBeDefined();
      expect(features.knowledge).toBeDefined();
    });

    it('should have common term translations', () => {
      const common = SEO_TRANSLATIONS.common;

      expect(common.readMore).toBeDefined();
      expect(common.learnMore).toBeDefined();
      expect(common.search).toBeDefined();
    });
  });
});

describe('SEO Best Practices - Advanced', () => {
  describe('Schema Validation', () => {
    it('should have @context in all schemas', () => {
      const videoSchema = generateVideoSchema({
        name: 'Test',
        description: 'Test',
        thumbnailUrl: 'test.jpg',
        uploadDate: '2024-01-01',
      });

      const productSchema = generateProductSchema({
        name: 'Test',
        description: 'Test',
        image: ['test.jpg'],
        offers: {
          price: '0',
          priceCurrency: 'CAD',
          availability: 'https://schema.org/InStock',
          url: 'https://test.com',
        },
      });

      expect(videoSchema['@context']).toBe('https://schema.org');
      expect(productSchema['@context']).toBe('https://schema.org');
    });

    it('should have @type in all schemas', () => {
      const schemas = [
        generateVideoSchema({
          name: 'Test',
          description: 'Test',
          thumbnailUrl: 'test.jpg',
          uploadDate: '2024-01-01',
        }),
        generateProductSchema({
          name: 'Test',
          description: 'Test',
          image: ['test.jpg'],
          offers: {
            price: '0',
            priceCurrency: 'CAD',
            availability: 'https://schema.org/InStock',
            url: 'https://test.com',
          },
        }),
        generateWebApplicationSchema(),
      ];

      schemas.forEach((schema) => {
        expect(schema['@type']).toBeDefined();
      });
    });
  });

  describe('Multilingual URL Structure', () => {
    it('should have consistent URL pattern for languages', () => {
      const links = generateHreflangLinks('/page', ['en', 'fr', 'dene']);

      links.forEach((link) => {
        if (link.hreflang !== 'x-default') {
          expect(link.href).toMatch(/^https?:\/\/.+/);
        }
      });
    });
  });
});

