import type { Metadata } from 'next';

// Site Configuration
export const SITE_CONFIG = {
  name: 'YK Buddy',
  fullName: 'YK Buddy - Your Yellowknife Companion',
  description: 'Your friendly companion for exploring Yellowknife - whether you are visiting, living here, or planning to move. Features aurora tracking, garage sale planner, and local insights.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://ykbuddy.com',
  locale: 'en_US',
  twitterHandle: '@YKBuddy',
  supportedLanguages: ['en', 'fr', 'dene', 'inuktitut'],
} as const;

// Google Search Console verification
export const googleSiteVerification = process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION;

// Default Keywords
const DEFAULT_KEYWORDS = [
  'Yellowknife',
  'Northwest Territories',
  'NWT',
  'Aurora',
  'Northern Lights',
  'Aurora Borealis',
  'Trip Planning',
  'Canada Travel',
  'Moving to Yellowknife',
  'Garage Sales',
  'Yellowknife Events',
  'Northern Canada',
  'Arctic Travel',
  'Indigenous Tourism',
  'Yellowknife Guide',
  'YK',
  'Great Slave Lake',
];

// Default Open Graph Image
const DEFAULT_OG_IMAGE = {
  url: '/og-image.jpg',
  width: 1200,
  height: 630,
  alt: 'YK Buddy - Your Yellowknife Companion',
};

/**
 * Default metadata configuration for the entire application
 */
export const defaultMetadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.fullName,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: 'YK Buddy Team' }],
  creator: 'YK Buddy',
  publisher: 'YK Buddy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
    siteName: SITE_CONFIG.name,
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.fullName,
    description: SITE_CONFIG.description,
    images: [DEFAULT_OG_IMAGE.url],
    creator: SITE_CONFIG.twitterHandle,
    site: SITE_CONFIG.twitterHandle,
  },
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  alternates: {
    canonical: SITE_CONFIG.url,
  },
};

/**
 * Configuration for generating page-specific metadata
 */
export interface PageMetadataConfig {
  title: string;
  description?: string;
  path?: string;
  image?: string;
  keywords?: string[];
  type?: 'website' | 'article' | 'profile';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
  noindex?: boolean;
  nofollow?: boolean;
}

/**
 * Generate comprehensive metadata for a specific page
 */
export function generatePageMetadata(config: PageMetadataConfig): Metadata {
  const {
    title,
    description = SITE_CONFIG.description,
    path = '',
    image,
    keywords = [],
    type = 'website',
    publishedTime,
    modifiedTime,
    authors,
    section,
    tags,
    noindex = false,
    nofollow = false,
  } = config;

  const pageUrl = path ? `${SITE_CONFIG.url}${path}` : SITE_CONFIG.url;
  const pageImage = image || DEFAULT_OG_IMAGE.url;
  const allKeywords = [...DEFAULT_KEYWORDS, ...keywords];

  // Build Open Graph metadata based on type
  const openGraphBase = {
    title,
    description,
    url: pageUrl,
    siteName: SITE_CONFIG.name,
    locale: SITE_CONFIG.locale,
    images: [
      {
        url: pageImage,
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  };

  let openGraph: Metadata['openGraph'];
  if (type === 'article') {
    openGraph = {
      ...openGraphBase,
      type: 'article',
      publishedTime,
      modifiedTime,
      authors,
      section,
      tags,
    };
  } else {
    openGraph = {
      ...openGraphBase,
      type,
    };
  }

  return {
    title,
    description,
    keywords: allKeywords,
    openGraph,
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [pageImage],
      creator: SITE_CONFIG.twitterHandle,
      site: SITE_CONFIG.twitterHandle,
    },
    alternates: {
      canonical: pageUrl,
    },
    robots: {
      index: !noindex,
      follow: !nofollow,
      googleBot: {
        index: !noindex,
        follow: !nofollow,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

/**
 * Pre-configured metadata for main pathways
 */
export const PATHWAY_METADATA = {
  visiting: generatePageMetadata({
    title: 'Visiting Yellowknife',
    description: 'Plan your trip to Yellowknife. Aurora viewing, activities, accommodations and attractions. Complete guide to visiting Canada\'s northern capital.',
    path: '/visiting',
    keywords: ['visit yellowknife', 'yellowknife tourism', 'yellowknife vacation', 'aurora tours', 'northern lights viewing'],
  }),
  living: generatePageMetadata({
    title: 'Living in Yellowknife',
    description: 'Essential guide to living in Yellowknife. Local events, garage sales, community resources, and daily life in Canada\'s northern capital.',
    path: '/living',
    keywords: ['living in yellowknife', 'yellowknife community', 'yellowknife events', 'yellowknife lifestyle'],
  }),
  moving: generatePageMetadata({
    title: 'Moving to Yellowknife',
    description: 'Complete guide to moving to Yellowknife. Housing, jobs, cost of living, and tips for a smooth transition to Canada\'s northern capital.',
    path: '/moving',
    keywords: ['moving to yellowknife', 'relocating to yellowknife', 'yellowknife jobs', 'yellowknife housing', 'moving to nwt'],
  }),
} as const;

/**
 * Pre-configured metadata for feature pages
 */
export const FEATURE_METADATA = {
  aurora: generatePageMetadata({
    title: 'Aurora Forecast & Tracking',
    description: 'Real-time aurora borealis forecasts and tracking for Yellowknife. Get alerts for optimal northern lights viewing conditions.',
    path: '/aurora',
    keywords: ['aurora forecast', 'northern lights forecast', 'yellowknife aurora', 'aurora alerts', 'kp index'],
  }),
  'aurora-live': generatePageMetadata({
    title: 'Live Aurora Dashboard',
    description: 'Real-time aurora conditions, live webcams, and instant notifications for northern lights viewing in Yellowknife.',
    path: '/aurora-live',
    keywords: ['live aurora', 'aurora webcam', 'real-time aurora', 'aurora now', 'current aurora conditions'],
  }),
  'garage-sales': generatePageMetadata({
    title: 'Yellowknife Garage Sales',
    description: 'Find and post garage sales in Yellowknife. Interactive map, filters, and notifications for deals in your neighborhood.',
    path: '/living/garage-sales',
    keywords: ['yellowknife garage sales', 'yard sales yellowknife', 'garage sale map', 'buy and sell yellowknife'],
  }),
  knowledge: generatePageMetadata({
    title: 'Knowledge Base',
    description: 'Comprehensive knowledge base about Yellowknife. Local tips, guides, FAQs, and community-contributed insights.',
    path: '/knowledge',
    keywords: ['yellowknife guide', 'yellowknife tips', 'yellowknife faq', 'yellowknife information'],
  }),
  discover: generatePageMetadata({
    title: 'Discover Yellowknife',
    description: 'Explore Yellowknife\'s hidden gems, attractions, restaurants, and cultural experiences. Your guide to what makes YK special.',
    path: '/discover',
    keywords: ['yellowknife attractions', 'things to do yellowknife', 'yellowknife restaurants', 'yellowknife culture'],
  }),
  calculator: generatePageMetadata({
    title: 'Moving Cost Calculator',
    description: 'Calculate the cost of moving to Yellowknife. Estimate moving expenses, cost of living differences, and budget planning.',
    path: '/calculator',
    keywords: ['moving calculator', 'yellowknife cost of living', 'moving cost estimate', 'relocation budget'],
  }),
  quiz: generatePageMetadata({
    title: 'Yellowknife Readiness Quiz',
    description: 'Take our interactive quiz to see if you\'re ready for life in Yellowknife. Get personalized recommendations.',
    path: '/quiz',
    keywords: ['yellowknife quiz', 'moving to north quiz', 'yellowknife readiness', 'should i move to yellowknife'],
  }),
  seasonal: generatePageMetadata({
    title: 'Seasonal Guide',
    description: 'Seasonal activities, events, and tips for experiencing Yellowknife year-round. From summer adventures to winter wonders.',
    path: '/seasonal',
    keywords: ['yellowknife seasons', 'yellowknife weather', 'seasonal activities yellowknife', 'yellowknife year round'],
  }),
} as const;

/**
 * Pre-configured metadata for static pages
 */
export const STATIC_METADATA = {
  about: generatePageMetadata({
    title: 'About YK Buddy',
    description: 'Learn about YK Buddy, our mission to make Yellowknife accessible and welcoming for visitors, residents, and newcomers.',
    path: '/about',
    keywords: ['about yk buddy', 'yellowknife platform', 'yellowknife community platform'],
  }),
  contact: generatePageMetadata({
    title: 'Contact Us',
    description: 'Get in touch with YK Buddy. Questions, feedback, or partnership inquiries welcome.',
    path: '/contact',
    keywords: ['contact yk buddy', 'yellowknife help', 'contact yellowknife guide'],
  }),
  'sponsor-info': generatePageMetadata({
    title: 'Become a Sponsor',
    description: 'Partner with YK Buddy to reach visitors, residents, and newcomers to Yellowknife. Flexible sponsorship opportunities.',
    path: '/sponsor-info',
    keywords: ['yellowknife advertising', 'sponsor yellowknife', 'yellowknife marketing', 'advertise in yellowknife'],
  }),
} as const;

/**
 * Admin pages - noindex/nofollow
 */
export const ADMIN_METADATA = {
  base: generatePageMetadata({
    title: 'Admin Dashboard',
    description: 'YK Buddy administration panel',
    path: '/admin',
    noindex: true,
    nofollow: true,
  }),
};

/**
 * User pages - noindex
 */
export const USER_METADATA = {
  profile: generatePageMetadata({
    title: 'My Profile',
    description: 'Manage your YK Buddy profile and preferences',
    path: '/profile',
    noindex: true,
  }),
  saved: generatePageMetadata({
    title: 'Saved Items',
    description: 'Your saved garage sales, events, and favorites',
    path: '/saved',
    noindex: true,
  }),
};

