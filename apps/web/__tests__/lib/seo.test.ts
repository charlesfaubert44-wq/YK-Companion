/**
 * SEO Library Tests
 * 
 * Tests for metadata generation, structured data, and SEO utilities
 */

import {
  defaultMetadata,
  generatePageMetadata,
  SITE_CONFIG,
  PATHWAY_METADATA,
  FEATURE_METADATA,
  STATIC_METADATA,
  ADMIN_METADATA,
  USER_METADATA,
} from '@/lib/seo/metadata';

import {
  generateOrganizationSchema,
  generateWebSiteSchema,
  generateLocalBusinessSchema,
  generateBreadcrumbSchema,
  generateArticleSchema,
  generateEventSchema,
  generateFAQSchema,
} from '@/lib/seo/structured-data';

describe('SEO Metadata Library', () => {
  describe('Site Configuration', () => {
    it('should have correct site configuration', () => {
      expect(SITE_CONFIG.name).toBe('YK Buddy');
      expect(SITE_CONFIG.url).toBeTruthy();
      expect(SITE_CONFIG.locale).toBe('en_US');
      expect(SITE_CONFIG.supportedLanguages).toContain('en');
    });
  });

  describe('Default Metadata', () => {
    it('should have required metadata fields', () => {
      expect(defaultMetadata.title).toBeDefined();
      expect(defaultMetadata.description).toBeDefined();
      expect(defaultMetadata.keywords).toBeDefined();
      expect(defaultMetadata.openGraph).toBeDefined();
      expect(defaultMetadata.twitter).toBeDefined();
    });

    it('should have proper Open Graph metadata', () => {
      expect(defaultMetadata.openGraph).toMatchObject({
        type: 'website',
        locale: 'en_US',
        siteName: 'YK Buddy',
      });
    });

    it('should have proper Twitter Card metadata', () => {
      expect(defaultMetadata.twitter).toMatchObject({
        card: 'summary_large_image',
      });
    });

    it('should have proper robots configuration', () => {
      expect(defaultMetadata.robots).toMatchObject({
        index: true,
        follow: true,
      });
    });

    it('should have icons configured', () => {
      expect(defaultMetadata.icons).toBeDefined();
      expect(defaultMetadata.icons?.icon).toBeDefined();
      expect(defaultMetadata.icons?.apple).toBeDefined();
    });
  });

  describe('generatePageMetadata', () => {
    it('should generate basic page metadata', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        description: 'Test description',
        path: '/test',
      });

      expect(metadata.title).toBe('Test Page');
      expect(metadata.description).toBe('Test description');
      expect(metadata.openGraph?.url).toContain('/test');
    });

    it('should use default description if not provided', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        path: '/test',
      });

      expect(metadata.description).toBe(SITE_CONFIG.description);
    });

    it('should include custom keywords', () => {
      const customKeywords = ['custom', 'test', 'keywords'];
      const metadata = generatePageMetadata({
        title: 'Test Page',
        keywords: customKeywords,
      });

      expect(metadata.keywords).toEqual(expect.arrayContaining(customKeywords));
    });

    it('should generate article type metadata', () => {
      const metadata = generatePageMetadata({
        title: 'Article Title',
        type: 'article',
        publishedTime: '2024-01-01',
        modifiedTime: '2024-01-15',
        authors: ['Author Name'],
        section: 'Knowledge Base',
        tags: ['aurora', 'yellowknife'],
      });

      expect(metadata.openGraph).toMatchObject({
        type: 'article',
        publishedTime: '2024-01-01',
        modifiedTime: '2024-01-15',
      });
    });

    it('should set noindex/nofollow when specified', () => {
      const metadata = generatePageMetadata({
        title: 'Private Page',
        noindex: true,
        nofollow: true,
      });

      expect(metadata.robots).toMatchObject({
        index: false,
        follow: false,
      });
    });

    it('should include canonical URL', () => {
      const metadata = generatePageMetadata({
        title: 'Test Page',
        path: '/test',
      });

      expect(metadata.alternates?.canonical).toContain('/test');
    });
  });

  describe('Pathway Metadata', () => {
    it('should have metadata for all pathways', () => {
      expect(PATHWAY_METADATA.visiting).toBeDefined();
      expect(PATHWAY_METADATA.living).toBeDefined();
      expect(PATHWAY_METADATA.moving).toBeDefined();
    });

    it('should have proper visiting metadata', () => {
      expect(PATHWAY_METADATA.visiting.title).toContain('Visiting');
      expect(PATHWAY_METADATA.visiting.description).toBeTruthy();
      expect(PATHWAY_METADATA.visiting.keywords).toBeDefined();
    });

    it('should have proper living metadata', () => {
      expect(PATHWAY_METADATA.living.title).toContain('Living');
      expect(PATHWAY_METADATA.living.description).toBeTruthy();
    });

    it('should have proper moving metadata', () => {
      expect(PATHWAY_METADATA.moving.title).toContain('Moving');
      expect(PATHWAY_METADATA.moving.description).toBeTruthy();
    });
  });

  describe('Feature Metadata', () => {
    it('should have metadata for all features', () => {
      expect(FEATURE_METADATA.aurora).toBeDefined();
      expect(FEATURE_METADATA['aurora-live']).toBeDefined();
      expect(FEATURE_METADATA['garage-sales']).toBeDefined();
      expect(FEATURE_METADATA.knowledge).toBeDefined();
      expect(FEATURE_METADATA.discover).toBeDefined();
      expect(FEATURE_METADATA.calculator).toBeDefined();
      expect(FEATURE_METADATA.quiz).toBeDefined();
      expect(FEATURE_METADATA.seasonal).toBeDefined();
    });

    it('should have aurora-specific keywords', () => {
      const keywords = FEATURE_METADATA.aurora.keywords as string[];
      expect(keywords).toContain('aurora forecast');
      expect(keywords).toContain('yellowknife aurora');
    });

    it('should have garage sales metadata', () => {
      expect(FEATURE_METADATA['garage-sales'].title).toContain('Garage Sales');
      expect(FEATURE_METADATA['garage-sales'].description).toBeTruthy();
    });
  });

  describe('Static & User Metadata', () => {
    it('should have static page metadata', () => {
      expect(STATIC_METADATA.about).toBeDefined();
      expect(STATIC_METADATA.contact).toBeDefined();
      expect(STATIC_METADATA['sponsor-info']).toBeDefined();
    });

    it('should have user page metadata with noindex', () => {
      expect(USER_METADATA.profile).toBeDefined();
      expect(USER_METADATA.profile.robots).toMatchObject({
        index: false,
      });
    });

    it('should have admin metadata with noindex and nofollow', () => {
      expect(ADMIN_METADATA.base).toBeDefined();
      expect(ADMIN_METADATA.base.robots).toMatchObject({
        index: false,
        follow: false,
      });
    });
  });
});

describe('Structured Data (Schema.org)', () => {
  describe('Organization Schema', () => {
    it('should generate valid organization schema', () => {
      const schema = generateOrganizationSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Organization');
      expect(schema.name).toBe('YK Buddy');
      expect(schema.url).toBeTruthy();
      expect(schema.logo).toBeDefined();
      expect(schema.address).toBeDefined();
    });

    it('should have proper address information', () => {
      const schema = generateOrganizationSchema();

      expect(schema.address).toMatchObject({
        '@type': 'PostalAddress',
        addressLocality: 'Yellowknife',
        addressRegion: 'Northwest Territories',
        addressCountry: 'CA',
      });
    });
  });

  describe('WebSite Schema', () => {
    it('should generate valid website schema', () => {
      const schema = generateWebSiteSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('WebSite');
      expect(schema.name).toBe('YK Buddy');
      expect(schema.potentialAction).toBeDefined();
    });

    it('should have search action configured', () => {
      const schema = generateWebSiteSchema();

      expect(schema.potentialAction).toMatchObject({
        '@type': 'SearchAction',
        target: expect.objectContaining({
          '@type': 'EntryPoint',
        }),
      });
    });
  });

  describe('LocalBusiness Schema', () => {
    it('should generate valid local business schema', () => {
      const schema = generateLocalBusinessSchema();

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('LocalBusiness');
      expect(schema.name).toBe('YK Buddy');
      expect(schema.geo).toBeDefined();
    });

    it('should have proper geo coordinates', () => {
      const schema = generateLocalBusinessSchema();

      expect(schema.geo).toMatchObject({
        '@type': 'GeoCoordinates',
        latitude: 62.4540,
        longitude: -114.3718,
      });
    });

    it('should have area served information', () => {
      const schema = generateLocalBusinessSchema();

      expect(schema.areaServed).toMatchObject({
        '@type': 'City',
        name: 'Yellowknife',
      });
    });
  });

  describe('Breadcrumb Schema', () => {
    it('should generate valid breadcrumb schema', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://ykbuddy.com' },
        { name: 'Living', url: 'https://ykbuddy.com/living' },
        { name: 'Garage Sales', url: 'https://ykbuddy.com/living/garage-sales' },
      ];

      const schema = generateBreadcrumbSchema(breadcrumbs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('BreadcrumbList');
      expect(schema.itemListElement).toHaveLength(3);
    });

    it('should have proper position numbering', () => {
      const breadcrumbs = [
        { name: 'Home', url: 'https://ykbuddy.com' },
        { name: 'Living', url: 'https://ykbuddy.com/living' },
      ];

      const schema = generateBreadcrumbSchema(breadcrumbs);

      expect(schema.itemListElement[0].position).toBe(1);
      expect(schema.itemListElement[1].position).toBe(2);
    });
  });

  describe('Article Schema', () => {
    it('should generate valid article schema', () => {
      const config = {
        title: 'Aurora Viewing Guide',
        description: 'Complete guide to viewing aurora',
        url: 'https://ykbuddy.com/knowledge/aurora-guide',
        datePublished: '2024-01-01',
      };

      const schema = generateArticleSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Article');
      expect(schema.headline).toBe(config.title);
      expect(schema.datePublished).toBe(config.datePublished);
    });

    it('should use datePublished as dateModified if not provided', () => {
      const config = {
        title: 'Test Article',
        description: 'Test',
        url: 'https://ykbuddy.com/test',
        datePublished: '2024-01-01',
      };

      const schema = generateArticleSchema(config);

      expect(schema.dateModified).toBe(config.datePublished);
    });

    it('should have proper publisher information', () => {
      const config = {
        title: 'Test Article',
        description: 'Test',
        url: 'https://ykbuddy.com/test',
        datePublished: '2024-01-01',
      };

      const schema = generateArticleSchema(config);

      expect(schema.publisher).toMatchObject({
        '@type': 'Organization',
        name: 'YK Buddy',
      });
    });
  });

  describe('Event Schema', () => {
    it('should generate valid event schema', () => {
      const config = {
        name: 'Community Garage Sale',
        description: 'Big community sale event',
        startDate: '2024-06-15T09:00:00',
        location: {
          name: 'Downtown Yellowknife',
          latitude: 62.4540,
          longitude: -114.3718,
        },
        url: 'https://ykbuddy.com/events/123',
      };

      const schema = generateEventSchema(config);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('Event');
      expect(schema.name).toBe(config.name);
      expect(schema.startDate).toBe(config.startDate);
    });

    it('should use startDate as endDate if not provided', () => {
      const config = {
        name: 'Event',
        description: 'Test event',
        startDate: '2024-06-15T09:00:00',
        location: { name: 'Test Location' },
        url: 'https://ykbuddy.com/event',
      };

      const schema = generateEventSchema(config);

      expect(schema.endDate).toBe(config.startDate);
    });

    it('should include offers when provided', () => {
      const config = {
        name: 'Event',
        description: 'Test event',
        startDate: '2024-06-15T09:00:00',
        location: { name: 'Test Location' },
        url: 'https://ykbuddy.com/event',
        offers: {
          price: '0',
          currency: 'CAD',
          availability: 'https://schema.org/InStock',
        },
      };

      const schema = generateEventSchema(config);

      expect(schema.offers).toMatchObject({
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CAD',
      });
    });

    it('should have proper location with geo coordinates', () => {
      const config = {
        name: 'Event',
        description: 'Test event',
        startDate: '2024-06-15T09:00:00',
        location: {
          name: 'Test Location',
          latitude: 62.4540,
          longitude: -114.3718,
        },
        url: 'https://ykbuddy.com/event',
      };

      const schema = generateEventSchema(config);

      expect(schema.location.geo).toMatchObject({
        '@type': 'GeoCoordinates',
        latitude: 62.4540,
        longitude: -114.3718,
      });
    });
  });

  describe('FAQ Schema', () => {
    it('should generate valid FAQ schema', () => {
      const faqs = [
        {
          question: 'What is the best time to visit?',
          answer: 'Winter months (November to March) are ideal for aurora viewing.',
        },
        {
          question: 'How cold does it get?',
          answer: 'Winter temperatures average -25°C to -35°C.',
        },
      ];

      const schema = generateFAQSchema(faqs);

      expect(schema['@context']).toBe('https://schema.org');
      expect(schema['@type']).toBe('FAQPage');
      expect(schema.mainEntity).toHaveLength(2);
    });

    it('should have proper question/answer structure', () => {
      const faqs = [
        {
          question: 'Test question?',
          answer: 'Test answer.',
        },
      ];

      const schema = generateFAQSchema(faqs);

      expect(schema.mainEntity[0]).toMatchObject({
        '@type': 'Question',
        name: 'Test question?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Test answer.',
        },
      });
    });
  });
});

describe('SEO Best Practices', () => {
  describe('Title Tags', () => {
    it('should have titles within recommended length (50-60 chars)', () => {
      const titles = [
        PATHWAY_METADATA.visiting.title,
        PATHWAY_METADATA.living.title,
        PATHWAY_METADATA.moving.title,
        FEATURE_METADATA.aurora.title,
      ];

      titles.forEach((title) => {
        expect(title).toBeDefined();
        if (typeof title === 'string') {
          expect(title.length).toBeLessThanOrEqual(60);
        }
      });
    });
  });

  describe('Meta Descriptions', () => {
    it('should have descriptions within recommended length (150-160 chars)', () => {
      const descriptions = [
        PATHWAY_METADATA.visiting.description,
        PATHWAY_METADATA.living.description,
        PATHWAY_METADATA.moving.description,
      ];

      descriptions.forEach((desc) => {
        expect(desc).toBeDefined();
        if (typeof desc === 'string') {
          expect(desc.length).toBeLessThanOrEqual(160);
        }
      });
    });
  });

  describe('Keywords', () => {
    it('should have relevant keywords', () => {
      const keywords = PATHWAY_METADATA.visiting.keywords as string[];
      expect(keywords).toBeDefined();
      expect(keywords.length).toBeGreaterThan(0);
    });
  });

  describe('Canonical URLs', () => {
    it('should have canonical URLs', () => {
      expect(PATHWAY_METADATA.visiting.alternates?.canonical).toBeTruthy();
      expect(PATHWAY_METADATA.living.alternates?.canonical).toBeTruthy();
      expect(PATHWAY_METADATA.moving.alternates?.canonical).toBeTruthy();
    });
  });
});

