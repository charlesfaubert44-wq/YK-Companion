import { MetadataRoute } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ykbuddy.com';

/**
 * Enhanced Robots.txt Configuration
 * 
 * Defines crawling rules for search engine bots:
 * - Allow public pages for all search engines
 * - Block private/admin areas
 * - Specify sitemap location
 * - Optimize crawl rate for specific bots
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // General rules for all bots
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/admin/',           // Admin dashboard and tools
          '/api/',             // API endpoints (not meant for crawling)
          '/profile/',         // User profiles (private)
          '/saved/',           // User saved items (private)
          '/auth/',            // Authentication pages
          '/*.json',           // JSON data files
          '/pixel-demo/',      // Demo/test pages
        ],
        // Crawl delay in seconds (optional, for politeness)
        crawlDelay: 1,
      },
      // Specific rules for Google
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/profile/',
          '/saved/',
          '/auth/',
        ],
      },
      // Specific rules for Bing
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: [
          '/admin/',
          '/api/',
          '/profile/',
          '/saved/',
          '/auth/',
        ],
      },
      // Block all AI scrapers/crawlers (optional - uncomment if desired)
      /*
      {
        userAgent: 'GPTBot',
        disallow: ['/'],
      },
      {
        userAgent: 'ChatGPT-User',
        disallow: ['/'],
      },
      {
        userAgent: 'CCBot',
        disallow: ['/'],
      },
      {
        userAgent: 'anthropic-ai',
        disallow: ['/'],
      },
      */
    ],
    // Sitemap location
    sitemap: `${siteUrl}/sitemap.xml`,
    // Additional host information (helps search engines)
    host: siteUrl,
  };
}

/**
 * Notes on robots.txt optimization:
 * 
 * 1. Public Pages (Allowed):
 *    - All pathway pages (/visiting, /living, /moving)
 *    - Features (garage sales, aurora, knowledge)
 *    - Static pages (about, contact)
 * 
 * 2. Private Pages (Disallowed):
 *    - Admin dashboard and all admin routes
 *    - API endpoints (use API documentation instead)
 *    - User-specific pages (profile, saved items)
 *    - Authentication flows
 * 
 * 3. Crawl Budget Optimization:
 *    - Block unnecessary routes to save crawl budget
 *    - Focus bot attention on valuable content
 *    - Use crawlDelay to be polite to servers
 * 
 * 4. Security Note:
 *    - robots.txt is NOT a security measure
 *    - Use proper authentication/authorization
 *    - This only guides well-behaved bots
 */
