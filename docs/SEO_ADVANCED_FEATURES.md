# Advanced SEO Features Guide

Complete guide to the advanced SEO features in YK Buddy including dynamic content metadata, multilingual support, and advanced schema types.

## Table of Contents

1. [Overview](#overview)
2. [Dynamic Content Metadata](#dynamic-content-metadata)
3. [Advanced Schema Types](#advanced-schema-types)
4. [Multilingual SEO](#multilingual-seo)
5. [Usage Examples](#usage-examples)
6. [Best Practices](#best-practices)
7. [Testing](#testing)

## Overview

YK Buddy's advanced SEO system extends the core SEO features with:

- **Dynamic Content Metadata**: Auto-generated SEO for garage sales and knowledge articles
- **Advanced Schema Types**: VideoObject, Product, Review, HowTo, Course, and more
- **Multilingual Support**: Complete i18n SEO with hreflang tags and translations
- **Dynamic Sitemap**: Automatically includes database content in sitemap

## Dynamic Content Metadata

### Garage Sale Metadata

Automatically generate optimized metadata for individual garage sale pages.

```typescript
import { generateGarageSaleMetadata } from '@/lib/seo';

// In your garage sale detail page
export async function generateMetadata({ params }) {
  return await generateGarageSaleMetadata(params.id);
}
```

**What it generates:**
- Title: `{Sale Title} - Garage Sale in {Location}`
- Description: Truncated description with date and location
- Keywords: Location-based and tags from sale
- Open Graph image: Sale image if available
- Article metadata with publish/update dates

### Knowledge Article Metadata

Auto-generate metadata for knowledge base articles.

```typescript
import { generateKnowledgeArticleMetadata } from '@/lib/seo';

// In your knowledge article page
export async function generateMetadata({ params }) {
  return await generateKnowledgeArticleMetadata(params.id);
}
```

**What it generates:**
- Title: Article title
- Description: From excerpt or first 160 chars of content
- Keywords: Category and tags
- Article schema data
- Publish and update dates

### Dynamic Sitemap Integration

The sitemap automatically includes recent garage sales and published articles.

**Location:** `apps/web/src/app/sitemap.ts`

```typescript
// Automatically fetches and includes:
// - Garage sales from last 30 days + future sales
// - All published knowledge articles

// Priorities:
// - Garage sales: 0.7 (daily updates)
// - Articles: 0.6 (weekly updates)
```

**No configuration needed** - it works automatically!

## Advanced Schema Types

### VideoObject Schema

For video content like aurora webcams or tutorials.

```typescript
import { generateVideoSchema } from '@/lib/seo/advanced-schemas';

const videoSchema = generateVideoSchema({
  name: 'Aurora Live Stream',
  description: 'Real-time aurora viewing from Yellowknife',
  thumbnailUrl: 'https://ykbuddy.com/aurora-thumb.jpg',
  uploadDate: '2024-01-01',
  duration: 'PT0S', // Livestream (PT = Period of Time, 0S = 0 seconds)
  embedUrl: 'https://ykbuddy.com/aurora-live/embed',
  width: 1920,
  height: 1080,
});
```

**Duration format (ISO 8601):**
- `PT1M30S` = 1 minute 30 seconds
- `PT1H` = 1 hour
- `PT0S` = Livestream

### Product Schema

For premium features, sponsorships, or merchandise.

```typescript
import { generateProductSchema } from '@/lib/seo/advanced-schemas';

const productSchema = generateProductSchema({
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
    validFrom: '2024-01-01',
  },
  aggregateRating: {
    ratingValue: 4.8,
    reviewCount: 25,
  },
});
```

**Availability values:**
- `https://schema.org/InStock`
- `https://schema.org/OutOfStock`
- `https://schema.org/PreOrder`
- `https://schema.org/Discontinued`

### Review Schema

For testimonials and user reviews.

```typescript
import { generateReviewSchema } from '@/lib/seo/advanced-schemas';

const reviewSchema = generateReviewSchema({
  itemReviewed: {
    type: 'LocalBusiness',
    name: 'YK Buddy',
    url: 'https://ykbuddy.com',
  },
  author: {
    name: 'Jane Smith',
    type: 'Person',
  },
  reviewRating: {
    ratingValue: 5,
    bestRating: 5,
    worstRating: 1,
  },
  reviewBody: 'Excellent resource for planning my Yellowknife trip!',
  datePublished: '2024-01-15',
});
```

### HowTo Schema

For step-by-step guides.

```typescript
import { generateHowToSchema } from '@/lib/seo/advanced-schemas';

const howToSchema = generateHowToSchema({
  name: 'How to Prepare for Winter in Yellowknife',
  description: 'Essential winter preparation guide',
  image: 'https://ykbuddy.com/winter-prep.jpg',
  totalTime: 'P1D', // 1 day
  estimatedCost: {
    currency: 'CAD',
    value: '500',
  },
  tool: ['Winter tires', 'Block heater', 'Ice scraper'],
  supply: ['Emergency kit', 'Warm clothing', 'Blanket'],
  steps: [
    {
      name: 'Install Winter Tires',
      text: 'Switch to winter tires by October 1st. This is legally required in the NWT.',
      image: 'https://ykbuddy.com/winter-tires.jpg',
    },
    {
      name: 'Test Block Heater',
      text: 'Ensure your vehicle block heater is functioning properly.',
    },
    {
      name: 'Prepare Emergency Kit',
      text: 'Pack blankets, candles, matches, shovel, and sand/kitty litter.',
    },
  ],
});
```

**Time format (ISO 8601 Duration):**
- `P1D` = 1 day
- `PT2H` = 2 hours
- `PT30M` = 30 minutes
- `P1DT2H30M` = 1 day, 2 hours, 30 minutes

### Course Schema

For educational content or onboarding.

```typescript
import { generateCourseSchema } from '@/lib/seo/advanced-schemas';

const courseSchema = generateCourseSchema({
  name: 'Newcomer Orientation to Yellowknife',
  description: 'Complete guide for new residents',
  provider: {
    name: 'YK Buddy',
    url: 'https://ykbuddy.com',
  },
  url: 'https://ykbuddy.com/moving',
  image: 'https://ykbuddy.com/course.jpg',
  aggregateRating: {
    ratingValue: 4.9,
    reviewCount: 102,
  },
  offers: {
    price: '0',
    priceCurrency: 'CAD',
    availability: 'https://schema.org/InStock',
  },
});
```

### ItemList Schema

For "Top 10" style lists.

```typescript
import { generateItemListSchema } from '@/lib/seo/advanced-schemas';

const itemListSchema = generateItemListSchema({
  name: 'Top 10 Things to Do in Yellowknife',
  description: 'Must-see attractions and activities',
  items: [
    {
      name: 'Aurora Viewing',
      url: 'https://ykbuddy.com/aurora',
      image: 'https://ykbuddy.com/aurora.jpg',
    },
    {
      name: 'Old Town Tour',
      url: 'https://ykbuddy.com/discover/old-town',
    },
    // ... more items
  ],
});
```

### Place Schema

For attractions and points of interest.

```typescript
import { generatePlaceSchema } from '@/lib/seo/advanced-schemas';

const placeSchema = generatePlaceSchema({
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
  openingHours: ['Mo-Fr 10:30-17:00', 'Sa-Su 12:00-17:00'],
  aggregateRating: {
    ratingValue: 4.7,
    reviewCount: 156,
  },
});
```

## Multilingual SEO

### Supported Languages

YK Buddy supports four languages:
- **English (en-CA)**: Default
- **French (fr-CA)**: Français
- **Dene (den)**: Dëne
- **Inuktitut (iu)**: ᐃᓄᒃᑎᑐᑦ

### Hreflang Tags

Automatically generate hreflang links for language alternates.

```typescript
import { generateHreflangLinks } from '@/lib/seo/multilingual';

const hreflangLinks = generateHreflangLinks('/about', ['en', 'fr', 'dene']);

// Returns:
// [
//   { hreflang: 'en-CA', href: 'https://ykbuddy.com/about' },
//   { hreflang: 'fr-CA', href: 'https://ykbuddy.com/fr/about' },
//   { hreflang: 'den', href: 'https://ykbuddy.com/dene/about' },
//   { hreflang: 'x-default', href: 'https://ykbuddy.com/about' },
// ]
```

### Language-Specific Metadata

Generate metadata for a specific language.

```typescript
import { createMultilingualMetadata } from '@/lib/seo/multilingual';

const metadata = createMultilingualMetadata(
  '/about',
  'fr', // current language
  ['en', 'fr', 'dene'], // available languages
  {
    title: {
      en: 'About Us',
      fr: 'À propos de nous',
      dene: 'Nįłį wegots\'ą',
      inuktitut: 'Test',
    },
    description: {
      en: 'Learn about YK Buddy',
      fr: 'En savoir plus sur YK Buddy',
      dene: 'YK Buddy wegots\'ą',
      inuktitut: 'Test',
    },
  }
);

export const metadata = metadata;
```

### Pre-built Translations

Use built-in translations for common terms.

```typescript
import { SEO_TRANSLATIONS } from '@/lib/seo/multilingual';

// Site title in all languages
SEO_TRANSLATIONS.siteTitle.en; // 'YK Buddy - Your Yellowknife Companion'
SEO_TRANSLATIONS.siteTitle.fr; // 'YK Buddy - Votre compagnon de Yellowknife'

// Pathways
SEO_TRANSLATIONS.pathways.visiting.fr; // 'Visite'
SEO_TRANSLATIONS.pathways.living.dene; // 'Gots\'ę́dé'

// Features
SEO_TRANSLATIONS.features.aurora.fr; // 'Prévisions aurores boréales'

// Common terms
SEO_TRANSLATIONS.common.readMore.fr; // 'Lire la suite'
```

### Language Detection

Extract language from URL path.

```typescript
import { getLanguageFromPath } from '@/lib/seo/multilingual';

getLanguageFromPath('/fr/about'); // 'fr'
getLanguageFromPath('/dene/contact'); // 'dene'
getLanguageFromPath('/about'); // 'en' (default)
```

### Language-Specific Sitemaps

For future implementation:

```typescript
// app/[lang]/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap({ params }): Promise<MetadataRoute.Sitemap> {
  const lang = params.lang;
  
  return routes.map((route) => ({
    url: `${siteUrl}/${lang}${route.path}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: route.priority,
  }));
}
```

## Usage Examples

### Complete Page with Advanced SEO

```typescript
// app/attractions/[id]/page.tsx
import { Metadata } from 'next';
import StructuredData from '@/components/StructuredData';
import { 
  generatePlaceSchema, 
  generateReviewSchema,
  createMultilingualMetadata 
} from '@/lib/seo';

export async function generateMetadata({ params }): Promise<Metadata> {
  const attraction = await fetchAttraction(params.id);
  
  return createMultilingualMetadata(
    `/attractions/${params.id}`,
    'en',
    ['en', 'fr'],
    {
      title: {
        en: attraction.title_en,
        fr: attraction.title_fr,
        dene: attraction.title_dene || attraction.title_en,
        inuktitut: attraction.title_inuktitut || attraction.title_en,
      },
      description: {
        en: attraction.description_en,
        fr: attraction.description_fr,
        dene: attraction.description_dene || attraction.description_en,
        inuktitut: attraction.description_inuktitut || attraction.description_en,
      },
    }
  );
}

export default function AttractionPage({ params }) {
  const attraction = await fetchAttraction(params.id);
  
  // Generate place schema
  const placeSchema = generatePlaceSchema({
    name: attraction.name,
    description: attraction.description,
    address: attraction.address,
    geo: attraction.coordinates,
    image: attraction.images,
    aggregateRating: attraction.rating,
  });
  
  return (
    <>
      <Script
        id="place-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(placeSchema) }}
      />
      {/* Page content */}
    </>
  );
}
```

### Video Content Page

```typescript
// app/aurora-live/page.tsx
import Script from 'next/script';
import { generateVideoSchema } from '@/lib/seo';

export default function AuroraLivePage() {
  const videoSchema = generateVideoSchema({
    name: 'Live Aurora Borealis Webcam',
    description: 'Watch the northern lights live from Yellowknife, Northwest Territories',
    thumbnailUrl: 'https://ykbuddy.com/aurora-live-thumb.jpg',
    uploadDate: new Date().toISOString(),
    duration: 'PT0S', // Livestream
    embedUrl: 'https://ykbuddy.com/aurora-live/embed',
  });
  
  return (
    <>
      <Script
        id="video-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
      />
      {/* Video player */}
    </>
  );
}
```

### How-To Guide with Schema

```typescript
// app/guides/winter-prep/page.tsx
import { generateHowToSchema } from '@/lib/seo';

export default function WinterPrepPage() {
  const howToSchema = generateHowToSchema({
    name: 'How to Prepare for Winter in Yellowknife',
    description: 'Complete winterization guide for vehicles and homes',
    totalTime: 'P1D',
    estimatedCost: { currency: 'CAD', value: '500' },
    tool: ['Winter tires', 'Block heater', 'Ice scraper'],
    supply: ['Emergency kit', 'Warm clothing'],
    steps: [
      {
        name: 'Install Winter Tires',
        text: 'Switch to winter tires by October 1st...',
      },
      // ... more steps
    ],
  });
  
  return (
    <>
      <Script
        id="howto-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
      {/* Guide content */}
    </>
  );
}
```

## Best Practices

### Dynamic Content

✅ **DO:**
- Cache metadata generation when possible
- Handle missing/deleted content gracefully
- Set noindex for non-public items
- Keep descriptions under 160 characters

❌ **DON'T:**
- Generate metadata for every DB record
- Forget error handling
- Include private/deleted items in sitemap

### Advanced Schemas

✅ **DO:**
- Use appropriate schema types
- Include all required properties
- Validate with Google Rich Results Test
- Keep data accurate and current

❌ **DON'T:**
- Mix incompatible schema types
- Include false or misleading information
- Forget to update old schema data

### Multilingual SEO

✅ **DO:**
- Use hreflang for all language versions
- Maintain consistent URL structure
- Provide complete translations
- Set x-default to primary language

❌ **DON'T:**
- Mix languages on same page
- Use auto-translation for SEO content
- Forget canonical for duplicates
- Link to non-existent language versions

## Testing

### Run Advanced Tests

```bash
cd apps/web
npm test -- __tests__/lib/seo-advanced.test.ts
```

**Coverage:**
- 29 tests for advanced features
- All schema types validated
- Multilingual utilities tested
- Best practices verified

### Manual Testing Checklist

**Dynamic Content:**
- [ ] Garage sale metadata generates correctly
- [ ] Knowledge article metadata works
- [ ] Dynamic sitemap includes recent content
- [ ] Handles missing content gracefully

**Advanced Schemas:**
- [ ] Video schema validates
- [ ] Product schema validates
- [ ] Review schema validates
- [ ] HowTo schema validates
- [ ] All schemas have required properties

**Multilingual:**
- [ ] Hreflang links generate correctly
- [ ] Language detection works
- [ ] Translations are accurate
- [ ] URL structure is consistent

### Validation Tools

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test all schema types
   - Check for errors/warnings

2. **Schema Markup Validator**
   - URL: https://validator.schema.org/
   - Paste JSON-LD output
   - Validate structure

3. **Hreflang Tags Testing Tool**
   - URL: https://www.aleydasolis.com/english/international-seo-tools/hreflang-tags-generator/
   - Verify hreflang implementation

## Migration Guide

### Adding to Existing Pages

1. **Dynamic Garage Sale Metadata:**
```typescript
// Create: app/living/garage-sales/[id]/page.tsx
import { generateGarageSaleMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return await generateGarageSaleMetadata(params.id);
}
```

2. **Dynamic Knowledge Article Metadata:**
```typescript
// Create: app/knowledge/[id]/page.tsx
import { generateKnowledgeArticleMetadata } from '@/lib/seo';

export async function generateMetadata({ params }) {
  return await generateKnowledgeArticleMetadata(params.id);
}
```

3. **Add Language Support:**
```typescript
// Update any page metadata
import { createMultilingualMetadata } from '@/lib/seo';

export const metadata = createMultilingualMetadata(...);
```

## Future Enhancements

1. **Auto-translation Pipeline**
   - Integrate with translation service
   - Auto-generate multilingual content
   - Maintain translation quality

2. **Performance Optimization**
   - Cache generated metadata
   - Incremental sitemap updates
   - CDN optimization

3. **Advanced Analytics**
   - Track multilingual engagement
   - Monitor schema performance
   - A/B test metadata variations

---

**Last Updated:** October 29, 2024  
**Version:** 2.0  
**Test Coverage:** 73 tests (44 core + 29 advanced)

