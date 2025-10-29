import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ykbuddy.com';

/**
 * Enhanced Dynamic Sitemap Generator
 * 
 * Generates a comprehensive sitemap with:
 * - All public pages with proper priorities
 * - Dynamic content URLs (future: garage sales, knowledge articles)
 * - Multilingual support (future: alternate language pages)
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
  ];

  // Convert static routes to sitemap entries
  const staticSitemapEntries: MetadataRoute.Sitemap = staticRoutes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: route.lastModified,
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));

  // Future: Add dynamic routes (garage sales, knowledge articles, etc.)
  // const dynamicGarageSales = await getDynamicGarageSalesSitemapEntries();
  // const dynamicKnowledgeArticles = await getDynamicKnowledgeSitemapEntries();

  // Combine all entries
  return [
    ...staticSitemapEntries,
    // ...dynamicGarageSales,
    // ...dynamicKnowledgeArticles,
  ];
}

/**
 * Future: Generate sitemap entries for dynamic garage sales
 * 
 * This function will fetch active/recent garage sales from the database
 * and generate sitemap entries for them.
 */
/* async function getDynamicGarageSalesSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch recent/active garage sales (last 30 days + future events)
    const { data: garageSales } = await supabase
      .from('garage_sales')
      .select('id, date, updated_at')
      .gte('date', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      .eq('status', 'active')
      .limit(1000);

    if (!garageSales) return [];

    return garageSales.map((sale) => ({
      url: `${siteUrl}/living/garage-sales/${sale.id}`,
      lastModified: new Date(sale.updated_at),
      changeFrequency: 'daily' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Error generating garage sales sitemap entries:', error);
    return [];
  }
} */

/**
 * Future: Generate sitemap entries for knowledge base articles
 */
/* async function getDynamicKnowledgeSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    // Fetch published knowledge articles
    const { data: articles } = await supabase
      .from('knowledge_base')
      .select('id, updated_at')
      .eq('status', 'published')
      .limit(1000);

    if (!articles) return [];

    return articles.map((article) => ({
      url: `${siteUrl}/knowledge/${article.id}`,
      lastModified: new Date(article.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch (error) {
    console.error('Error generating knowledge articles sitemap entries:', error);
    return [];
  }
} */

/**
 * Multilingual Sitemap Support
 * 
 * For future multilingual support, we can create language-specific sitemaps:
 * - sitemap.xml (main sitemap index)
 * - sitemap-en.xml (English pages)
 * - sitemap-fr.xml (French pages)
 * - sitemap-dene.xml (Dene pages)
 * 
 * Using Next.js sitemap feature with different routes:
 * - /sitemap/[lang].xml
 */
