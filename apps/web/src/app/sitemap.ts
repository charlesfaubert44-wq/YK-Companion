import { MetadataRoute } from 'next';
import {
  getGarageSalesForSitemap,
  getKnowledgeArticlesForSitemap,
  getNeighborhoodsForSitemap,
} from '@/lib/seo/dynamic-metadata';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ykbuddy.com';

/**
 * Enhanced Dynamic Sitemap Generator
 *
 * Generates a comprehensive sitemap with:
 * - All public pages with proper priorities
 * - Dynamic content URLs (garage sales, knowledge articles)
 * - Multilingual support (foundation ready)
 * - Appropriate change frequencies and priorities
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const currentDate = new Date();

  // Static routes configuration
  const staticRoutes = [
    // Homepage - Highest priority, updated daily
    {
      path: '',
      priority: 1.0,
      changeFreq: 'daily' as const,
      lastModified: currentDate,
    },

    // Main pathway pages - Very high priority
    {
      path: '/visiting',
      priority: 0.9,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },
    {
      path: '/living',
      priority: 0.9,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },
    {
      path: '/moving',
      priority: 0.9,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },

    // Key features - High priority
    {
      path: '/living/garage-sales',
      priority: 0.9,
      changeFreq: 'daily' as const,
      lastModified: currentDate,
    },
    {
      path: '/living/neighborhoods',
      priority: 0.9,
      changeFreq: 'daily' as const,
      lastModified: currentDate,
    },
    {
      path: '/visiting/logbook',
      priority: 0.9,
      changeFreq: 'daily' as const,
      lastModified: currentDate,
    },
    {
      path: '/aurora-live',
      priority: 0.9,
      changeFreq: 'hourly' as const,
      lastModified: currentDate,
    },
    {
      path: '/aurora',
      priority: 0.8,
      changeFreq: 'daily' as const,
      lastModified: currentDate,
    },

    // Information and discovery pages - Medium-high priority
    {
      path: '/about',
      priority: 0.8,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/contact',
      priority: 0.8,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/knowledge',
      priority: 0.8,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },
    {
      path: '/discover',
      priority: 0.8,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },

    // Interactive tools - Medium priority
    {
      path: '/calculator',
      priority: 0.7,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/quiz',
      priority: 0.7,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/seasonal',
      priority: 0.7,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },

    // User pages - Medium priority
    {
      path: '/profile',
      priority: 0.6,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },
    {
      path: '/saved',
      priority: 0.6,
      changeFreq: 'weekly' as const,
      lastModified: currentDate,
    },

    // Additional pages - Lower priority
    {
      path: '/sponsor-info',
      priority: 0.6,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/sitemap-page',
      priority: 0.5,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/sitemap',
      priority: 0.5,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/mobile-demo',
      priority: 0.4,
      changeFreq: 'monthly' as const,
      lastModified: currentDate,
    },
    {
      path: '/offline',
      priority: 0.3,
      changeFreq: 'yearly' as const,
      lastModified: currentDate,
    },
  ];

  // Convert static routes to sitemap entries
  const staticSitemapEntries: MetadataRoute.Sitemap = staticRoutes.map(route => ({
    url: `${siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  // Fetch dynamic content for sitemap
  let dynamicGarageSales: MetadataRoute.Sitemap = [];
  let dynamicKnowledgeArticles: MetadataRoute.Sitemap = [];
  let dynamicNeighborhoods: MetadataRoute.Sitemap = [];

  try {
    // Garage sales (recent and upcoming)
    const garageSales = await getGarageSalesForSitemap();
    dynamicGarageSales = garageSales.map(sale => ({
      url: `${siteUrl}/living/garage-sales/${sale.id}`,
      lastModified: new Date(sale.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));

    // Knowledge base articles
    const articles = await getKnowledgeArticlesForSitemap();
    dynamicKnowledgeArticles = articles.map(article => ({
      url: `${siteUrl}/knowledge/${article.id}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Neighborhoods
    const neighborhoods = await getNeighborhoodsForSitemap();
    dynamicNeighborhoods = neighborhoods.map(neighborhood => ({
      url: `${siteUrl}/living/neighborhoods/${neighborhood.id}`,
      lastModified: new Date(neighborhood.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error('Error generating dynamic sitemap entries:', error);
    // Continue with static entries if dynamic content fails
  }

  // Combine all entries
  return [
    ...staticSitemapEntries,
    ...dynamicGarageSales,
    ...dynamicKnowledgeArticles,
    ...dynamicNeighborhoods,
  ];
}

/**
 * Multilingual Sitemap Support
 *
 * For future multilingual support, create language-specific sitemaps:
 *
 * File structure:
 * - app/sitemap.ts (this file - main sitemap with all content)
 * - app/[lang]/sitemap.ts (language-specific sitemaps)
 *
 * Example implementation for /fr/sitemap.xml:
 * ```typescript
 * export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
 *   return staticRoutes.map((route) => ({
 *     url: `${siteUrl}/fr${route.path}`,
 *     lastModified: new Date(),
 *     changeFrequency: route.changeFreq,
 *     priority: route.priority,
 *   }));
 * }
 * ```
 *
 * With hreflang alternates in metadata:
 * - Implemented via multilingual.ts utilities
 * - Use generateHreflangLinks() in page metadata
 */
