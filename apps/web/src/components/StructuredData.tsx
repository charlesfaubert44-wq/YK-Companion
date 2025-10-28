'use client';

import Script from 'next/script';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ykbuddy.com';

export default function StructuredData() {
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'YK Buddy',
    description: 'Your friendly companion for exploring Yellowknife',
    url: siteUrl,
    logo: `${siteUrl}/icons/icon-512x512.png`,
    sameAs: [
      // Add social media links when available
      // 'https://facebook.com/ykbuddy',
      // 'https://twitter.com/ykbuddy',
      // 'https://instagram.com/ykbuddy',
    ],
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yellowknife',
      addressRegion: 'Northwest Territories',
      addressCountry: 'CA',
    },
  };

  const websiteData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'YK Buddy',
    description:
      'Your friendly companion for exploring Yellowknife - whether you are visiting, living here, or planning to move.',
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/knowledge?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'YK Buddy',
    description:
      'Community platform for Yellowknife residents, visitors, and newcomers',
    url: siteUrl,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Yellowknife',
      addressRegion: 'NT',
      addressCountry: 'CA',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '62.4540',
      longitude: '-114.3718',
    },
    areaServed: {
      '@type': 'City',
      name: 'Yellowknife',
    },
  };

  return (
    <>
      <Script
        id="organization-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
      />
      <Script
        id="website-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteData) }}
      />
      <Script
        id="local-business-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessData) }}
      />
    </>
  );
}
