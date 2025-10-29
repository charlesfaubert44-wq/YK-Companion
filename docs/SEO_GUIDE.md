# SEO & Metadata Guide

Complete guide to the SEO and metadata implementation in YK Buddy.

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Metadata System](#metadata-system)
4. [Structured Data](#structured-data)
5. [Sitemap & Robots](#sitemap--robots)
6. [Page-Specific SEO](#page-specific-seo)
7. [Best Practices](#best-practices)
8. [Testing & Validation](#testing--validation)
9. [Troubleshooting](#troubleshooting)

## Overview

YK Buddy implements a comprehensive SEO strategy to maximize visibility in search engines and social media platforms. Our implementation includes:

- **Metadata Management**: Centralized metadata generation for all pages
- **Structured Data**: Schema.org JSON-LD for enhanced search results
- **Dynamic Sitemap**: Automatically generated sitemap with proper priorities
- **Robots Configuration**: Optimized crawling rules for search engines
- **Social Media Optimization**: Open Graph and Twitter Card support
- **Multilingual Support**: Foundation for future multilingual SEO

## Architecture

### File Structure

```
apps/web/src/
├── lib/
│   └── seo/
│       ├── index.ts              # Main exports
│       ├── metadata.ts           # Metadata generation utilities
│       └── structured-data.ts    # Schema.org generators
├── components/
│   └── StructuredData.tsx        # Structured data component
└── app/
    ├── layout.tsx                # Root layout with default metadata
    ├── sitemap.ts                # Dynamic sitemap generator
    ├── robots.ts                 # Robots.txt configuration
    └── [route]/
        └── layout.tsx            # Route-specific metadata
```

### Core Components

1. **Metadata Library** (`@/lib/seo/metadata.ts`)
   - Site configuration
   - Default metadata
   - Page metadata generator
   - Pre-configured metadata for all pages

2. **Structured Data Library** (`@/lib/seo/structured-data.ts`)
   - Organization schema
   - Website schema
   - LocalBusiness schema
   - Article, Event, FAQ schemas
   - Breadcrumb schema

3. **StructuredData Component** (`@/components/StructuredData.tsx`)
   - Renders JSON-LD structured data
   - Supports multiple schema types
   - Page-specific customization

## Metadata System

### Default Metadata

All pages inherit from `defaultMetadata` defined in `apps/web/src/lib/seo/metadata.ts`:

```typescript
import { defaultMetadata } from '@/lib/seo';

export const metadata: Metadata = defaultMetadata;
```

Default metadata includes:
- Title with template
- Description
- Keywords
- Open Graph tags
- Twitter Card tags
- Robots directives
- Icons and manifest
- Canonical URL

### Generating Page Metadata

Use `generatePageMetadata()` for custom pages:

```typescript
import { generatePageMetadata } from '@/lib/seo';

export const metadata = generatePageMetadata({
  title: 'Page Title',
  description: 'Page description (150-160 chars recommended)',
  path: '/your-page',
  keywords: ['custom', 'keywords'],
  image: '/custom-og-image.jpg', // optional
});
```

### Pre-configured Metadata

Use pre-configured metadata for standard pages:

```typescript
// Pathway pages
import { PATHWAY_METADATA } from '@/lib/seo';
export const metadata = PATHWAY_METADATA.visiting;
export const metadata = PATHWAY_METADATA.living;
export const metadata = PATHWAY_METADATA.moving;

// Feature pages
import { FEATURE_METADATA } from '@/lib/seo';
export const metadata = FEATURE_METADATA.aurora;
export const metadata = FEATURE_METADATA['aurora-live'];
export const metadata = FEATURE_METADATA['garage-sales'];
export const metadata = FEATURE_METADATA.knowledge;
export const metadata = FEATURE_METADATA.discover;
export const metadata = FEATURE_METADATA.calculator;
export const metadata = FEATURE_METADATA.quiz;
export const metadata = FEATURE_METADATA.seasonal;

// Static pages
import { STATIC_METADATA } from '@/lib/seo';
export const metadata = STATIC_METADATA.about;
export const metadata = STATIC_METADATA.contact;
export const metadata = STATIC_METADATA['sponsor-info'];

// User pages (noindex)
import { USER_METADATA } from '@/lib/seo';
export const metadata = USER_METADATA.profile;
export const metadata = USER_METADATA.saved;

// Admin pages (noindex, nofollow)
import { ADMIN_METADATA } from '@/lib/seo';
export const metadata = ADMIN_METADATA.base;
```

### Article Metadata

For knowledge base articles or blog posts:

```typescript
export const metadata = generatePageMetadata({
  title: 'Article Title',
  description: 'Article description',
  path: '/knowledge/article-slug',
  type: 'article',
  publishedTime: '2024-01-01',
  modifiedTime: '2024-01-15',
  authors: ['Author Name'],
  section: 'Knowledge Base',
  tags: ['aurora', 'yellowknife'],
});
```

### Private Pages

For pages that shouldn't be indexed:

```typescript
export const metadata = generatePageMetadata({
  title: 'Private Page',
  description: 'Private page description',
  noindex: true,
  nofollow: true, // optional
});
```

## Structured Data

### Global Schemas

Global schemas are automatically included in the root layout:

- **Organization**: Company/organization information
- **WebSite**: Website with search action
- **LocalBusiness**: Local business with geo coordinates

These are rendered via `<StructuredData />` component in `apps/web/src/app/layout.tsx`.

### Page-Specific Schemas

#### Breadcrumbs

```tsx
import StructuredData from '@/components/StructuredData';

export default function YourPage() {
  return (
    <>
      <StructuredData
        breadcrumbs={[
          { name: 'Home', url: 'https://ykbuddy.com' },
          { name: 'Living', url: 'https://ykbuddy.com/living' },
          { name: 'Garage Sales', url: 'https://ykbuddy.com/living/garage-sales' },
        ]}
      />
      {/* Your page content */}
    </>
  );
}
```

#### Article Schema

For knowledge base articles:

```tsx
import StructuredData from '@/components/StructuredData';

export default function ArticlePage() {
  return (
    <>
      <StructuredData
        type="article"
        article={{
          title: 'Aurora Viewing Guide',
          description: 'Complete guide to viewing northern lights',
          url: 'https://ykbuddy.com/knowledge/aurora-guide',
          datePublished: '2024-01-01',
          dateModified: '2024-01-15',
          authorName: 'YK Buddy Team',
        }}
      />
      {/* Your article content */}
    </>
  );
}
```

#### Event Schema

For garage sales and events:

```tsx
import StructuredData from '@/components/StructuredData';

export default function GarageSalePage({ sale }) {
  return (
    <>
      <StructuredData
        type="event"
        event={{
          name: sale.title,
          description: sale.description,
          startDate: sale.date,
          location: {
            name: sale.location,
            latitude: sale.latitude,
            longitude: sale.longitude,
          },
          url: `https://ykbuddy.com/living/garage-sales/${sale.id}`,
        }}
      />
      {/* Your event content */}
    </>
  );
}
```

#### FAQ Schema

For FAQ sections:

```tsx
import StructuredData from '@/components/StructuredData';

export default function FAQPage() {
  const faqs = [
    {
      question: 'When is the best time to see aurora?',
      answer: 'November through March offers the darkest skies.',
    },
    // ... more FAQs
  ];

  return (
    <>
      <StructuredData type="faq" faqs={faqs} />
      {/* Your FAQ content */}
    </>
  );
}
```

### Helper Components

Use helper components for cleaner code:

```tsx
import { 
  BreadcrumbStructuredData,
  ArticleStructuredData,
  EventStructuredData,
  FAQStructuredData 
} from '@/components/StructuredData';

// Breadcrumbs
<BreadcrumbStructuredData items={breadcrumbs} />

// Article
<ArticleStructuredData article={articleConfig} />

// Event
<EventStructuredData event={eventConfig} />

// FAQ
<FAQStructuredData faqs={faqList} />
```

## Sitemap & Robots

### Sitemap

Dynamic sitemap is generated at `/sitemap.xml` from `apps/web/src/app/sitemap.ts`.

**Current Features:**
- All public pages with priorities
- Appropriate change frequencies
- Last modified dates
- Prepared for dynamic content (garage sales, articles)

**Priority Levels:**
- 1.0: Homepage
- 0.9: Main pathways, key features
- 0.8: Information pages
- 0.7: Interactive tools
- 0.6: Additional pages
- 0.5: Utility pages

**Change Frequencies:**
- `hourly`: Aurora live data
- `daily`: Homepage, garage sales
- `weekly`: Main pathways, features
- `monthly`: Static pages, tools

**Future Enhancements:**
The sitemap is prepared for dynamic content:
```typescript
// Uncomment and implement when ready
const dynamicGarageSales = await getDynamicGarageSalesSitemapEntries();
const dynamicKnowledgeArticles = await getDynamicKnowledgeSitemapEntries();
```

### Robots.txt

Robots configuration at `/robots.txt` from `apps/web/src/app/robots.ts`.

**Allowed:**
- All public pages
- Pathways, features, static pages

**Disallowed:**
- `/admin/` - Admin dashboard
- `/api/` - API endpoints
- `/profile/` - User profiles
- `/saved/` - User saved items
- `/auth/` - Authentication pages
- `/*.json` - JSON data files
- `/pixel-demo/` - Demo pages

**Configuration:**
- Sitemap location specified
- Crawl delay set to 1 second
- Specific rules for Googlebot and Bingbot
- Optional AI scraper blocking (commented out)

## Page-Specific SEO

### Client Components

For client components (`'use client'`), create a layout file:

```typescript
// app/your-route/layout.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  path: '/your-route',
});

export default function YourRouteLayout({ children }) {
  return <>{children}</>;
}
```

### Server Components

For server components, export metadata directly:

```typescript
// app/your-route/page.tsx
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

export const metadata: Metadata = generatePageMetadata({
  title: 'Your Page Title',
  description: 'Your page description',
  path: '/your-route',
});

export default function YourPage() {
  return <div>Your content</div>;
}
```

### Dynamic Routes

For dynamic routes with database content:

```typescript
import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo';

type Props = {
  params: { id: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Fetch data
  const item = await fetchItem(params.id);

  return generatePageMetadata({
    title: item.title,
    description: item.description,
    path: `/items/${params.id}`,
    image: item.image_url,
  });
}

export default function ItemPage({ params }: Props) {
  // Your page implementation
}
```

## Best Practices

### Title Tags

✅ **DO:**
- Keep titles under 60 characters
- Include target keywords naturally
- Make titles unique per page
- Use the template pattern: `Page Title | YK Buddy`

❌ **DON'T:**
- Stuff keywords
- Use generic titles
- Duplicate titles across pages

### Meta Descriptions

✅ **DO:**
- Keep descriptions 150-160 characters
- Include a call-to-action
- Make them compelling and accurate
- Include target keywords naturally

❌ **DON'T:**
- Duplicate descriptions
- Write generic descriptions
- Exceed 160 characters (truncation)

### Keywords

✅ **DO:**
- Use relevant, specific keywords
- Include location-based keywords
- Mix broad and long-tail keywords
- Research user search intent

❌ **DON'T:**
- Keyword stuff
- Use irrelevant keywords
- Rely solely on broad keywords

### Images

✅ **DO:**
- Include alt text for all images
- Use descriptive filenames
- Optimize file sizes
- Provide Open Graph images (1200x630px)

❌ **DON'T:**
- Leave alt text empty
- Use generic filenames (image1.jpg)
- Upload unoptimized images

### Structured Data

✅ **DO:**
- Use appropriate schema types
- Keep data accurate and current
- Test with Google's Rich Results Test
- Include all required properties

❌ **DON'T:**
- Use incorrect schema types
- Include false information
- Ignore validation errors

### URLs

✅ **DO:**
- Use descriptive, readable URLs
- Include keywords when appropriate
- Use hyphens for word separation
- Keep URLs concise

❌ **DON'T:**
- Use underscores or special characters
- Create overly long URLs
- Change URLs frequently

### Canonical URLs

✅ **DO:**
- Set canonical URLs for all pages
- Point to the preferred version
- Use absolute URLs

❌ **DON'T:**
- Have multiple canonicals
- Point to redirected pages
- Use relative URLs

## Testing & Validation

### Local Testing

1. **Check Metadata:**
   ```bash
   npm run dev
   # Visit page and view source (Ctrl/Cmd + U)
   # Check <head> section for meta tags
   ```

2. **Run Tests:**
   ```bash
   cd apps/web
   npm test -- __tests__/lib/seo.test.ts
   ```

3. **Check Sitemap:**
   ```
   http://localhost:3000/sitemap.xml
   ```

4. **Check Robots:**
   ```
   http://localhost:3000/robots.txt
   ```

### Online Validation Tools

1. **Google Rich Results Test**
   - URL: https://search.google.com/test/rich-results
   - Test structured data
   - Validate schema.org markup

2. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Test Open Graph tags
   - Preview social sharing

3. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Test Twitter Card tags
   - Preview Twitter sharing

4. **Google Search Console**
   - Submit sitemap
   - Monitor indexing status
   - Check for errors

5. **Lighthouse SEO Audit**
   ```bash
   # Chrome DevTools > Lighthouse > SEO
   # Target: 95+ score
   ```

### Validation Checklist

Before deployment:

- [ ] All pages have unique titles
- [ ] All pages have unique descriptions
- [ ] Titles are under 60 characters
- [ ] Descriptions are 150-160 characters
- [ ] All images have alt text
- [ ] Structured data validates (no errors)
- [ ] Sitemap includes all public pages
- [ ] Robots.txt blocks private areas
- [ ] Open Graph images are 1200x630px
- [ ] Canonical URLs are set correctly
- [ ] No broken links in metadata
- [ ] Lighthouse SEO score 95+

## Troubleshooting

### Common Issues

#### Metadata Not Showing

**Problem:** Metadata doesn't appear in page source

**Solutions:**
1. Check if layout/page is server component (not `'use client'`)
2. Verify metadata is exported correctly
3. Clear Next.js cache: `rm -rf .next`
4. Check for console errors

#### Duplicate Metadata

**Problem:** Multiple title or description tags

**Solutions:**
1. Check for metadata in multiple layout levels
2. Ensure child metadata overrides parent correctly
3. Remove duplicate manual meta tags

#### Structured Data Not Validating

**Problem:** Validation errors in Rich Results Test

**Solutions:**
1. Check required properties are included
2. Verify data types (string, number, date format)
3. Ensure URLs are absolute
4. Test with smaller schema first

#### Sitemap Not Updating

**Problem:** Sitemap shows old content

**Solutions:**
1. Clear build cache: `rm -rf .next`
2. Check if sitemap function is async
3. Verify dynamic data fetching
4. Rebuild application

#### Poor Lighthouse SEO Score

**Problem:** SEO score below 95

**Common Issues:**
1. Missing meta description
2. Document doesn't have a title
3. Links don't have descriptive text
4. Images don't have alt attributes
5. robots.txt not valid

**Solutions:**
1. Add missing metadata
2. Fix link text (avoid "click here")
3. Add alt text to all images
4. Validate robots.txt syntax

### Debug Helpers

#### View Rendered Metadata

```javascript
// In browser console
document.querySelector('head').innerHTML;
```

#### Check Structured Data

```javascript
// In browser console
JSON.parse(
  document.querySelector('script[type="application/ld+json"]').textContent
);
```

#### Verify Canonical URL

```javascript
// In browser console
document.querySelector('link[rel="canonical"]')?.href;
```

## Future Enhancements

### Planned Features

1. **Dynamic Content SEO**
   - Auto-generate metadata for garage sales
   - Auto-generate metadata for knowledge articles
   - Include in sitemap automatically

2. **Multilingual SEO**
   - hreflang tags for language versions
   - Language-specific sitemaps
   - Translated metadata

3. **Advanced Schema**
   - Product schema for premium features
   - Review schema for testimonials
   - VideoObject schema for video content

4. **Performance Monitoring**
   - SEO metrics dashboard
   - Search visibility tracking
   - Keyword ranking monitoring

5. **A/B Testing**
   - Test different title formats
   - Test description variations
   - Measure click-through rates

### Implementation Notes

When implementing dynamic content:

```typescript
// Example: Auto-generate garage sale metadata
export async function generateMetadata({ params }): Promise<Metadata> {
  const sale = await getGarageSale(params.id);
  
  return generatePageMetadata({
    title: `${sale.title} - Garage Sale in Yellowknife`,
    description: `${sale.description} - ${sale.location}`,
    path: `/living/garage-sales/${params.id}`,
    image: sale.image_url,
  });
}
```

## Resources

### External Documentation

- [Next.js Metadata Documentation](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Card Documentation](https://developer.twitter.com/en/docs/twitter-for-websites/cards)

### Internal Resources

- SEO Library: `apps/web/src/lib/seo/`
- Tests: `apps/web/__tests__/lib/seo.test.ts`
- Examples: See existing page layouts

## Support

For questions or issues with SEO implementation:

1. Check this documentation
2. Review test files for examples
3. Validate with online tools
4. Check Next.js documentation
5. Consult with team

---

**Last Updated:** October 2024
**Version:** 1.0
**Maintainer:** YK Buddy Development Team

