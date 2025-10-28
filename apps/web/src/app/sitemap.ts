import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ykbuddy.com';

export default function sitemap(): MetadataRoute.Sitemap {
  // Define routes with custom priorities and change frequencies
  const routes = [
    // Homepage - Highest priority
    { path: '', priority: 1.0, changeFreq: 'daily' as const },

    // Main landing pages - High priority
    { path: '/visiting', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/living', priority: 0.9, changeFreq: 'weekly' as const },
    { path: '/moving', priority: 0.9, changeFreq: 'weekly' as const },

    // Key features - High priority
    { path: '/living/garage-sales', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/aurora-live', priority: 0.9, changeFreq: 'daily' as const },
    { path: '/aurora', priority: 0.8, changeFreq: 'weekly' as const },

    // Information pages - Medium-high priority
    { path: '/about', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/contact', priority: 0.8, changeFreq: 'monthly' as const },
    { path: '/knowledge', priority: 0.8, changeFreq: 'weekly' as const },
    { path: '/discover', priority: 0.8, changeFreq: 'weekly' as const },

    // Tools & utilities - Medium priority
    { path: '/calculator', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/quiz', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/seasonal', priority: 0.7, changeFreq: 'weekly' as const },

    // Additional pages
    { path: '/sponsor-info', priority: 0.6, changeFreq: 'monthly' as const },
    { path: '/sitemap-page', priority: 0.5, changeFreq: 'monthly' as const },
  ];

  return routes.map((route) => ({
    url: `${siteUrl}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFreq,
    priority: route.priority,
  }));
}
