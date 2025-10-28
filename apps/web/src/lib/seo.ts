import type { Metadata } from 'next';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ykbuddy.com';
const siteName = 'YK Buddy';
const siteDescription = 'Your friendly companion for exploring Yellowknife - whether you are visiting, living here, or planning to move. Features aurora tracking, garage sale planner, and local insights.';

export const defaultMetadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - Your Yellowknife Companion`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
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
  ],
  authors: [{ name: 'YK Buddy Team' }],
  creator: 'YK Buddy',
  publisher: 'YK Buddy',
  robots: {
    index: true,
    follow: true,
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
    locale: 'en_US',
    url: siteUrl,
    title: `${siteName} - Your Yellowknife Companion`,
    description: siteDescription,
    siteName: siteName,
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'YK Buddy - Your Yellowknife Companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - Your Yellowknife Companion`,
    description: siteDescription,
    images: ['/og-image.jpg'],
    creator: '@YKBuddy',
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
  },
};

export function generatePageMetadata({
  title,
  description,
  path = '',
  image,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string;
}): Metadata {
  const pageUrl = `${siteUrl}${path}`;
  const pageDescription = description || siteDescription;
  const pageImage = image || '/og-image.jpg';

  return {
    title,
    description: pageDescription,
    openGraph: {
      title,
      description: pageDescription,
      url: pageUrl,
      images: [
        {
          url: pageImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      title,
      description: pageDescription,
      images: [pageImage],
    },
  };
}
