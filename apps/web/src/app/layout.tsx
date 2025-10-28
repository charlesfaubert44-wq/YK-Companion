import type { Metadata } from 'next';
import { Inter, Press_Start_2P } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { SloganProvider } from '@/contexts/SloganContext';
import PWAInstaller from '@/components/PWAInstaller';
import GoogleAnalytics from '@/components/GoogleAnalytics';
import StructuredData from '@/components/StructuredData';
import { Analytics } from '@vercel/analytics/react';
import { defaultMetadata, googleSiteVerification } from '@/lib/seo';

const inter = Inter({ subsets: ['latin'] });
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  ...defaultMetadata,
  themeColor: '#10B981',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'YK Buddy',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    viewportFit: 'cover',
  },
  ...(googleSiteVerification && {
    verification: {
      google: googleSiteVerification,
    },
  }),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pressStart2P.variable} overflow-x-hidden`}>
      <head>
        <GoogleAnalytics />
        <StructuredData />
      </head>
      <body className={`${inter.className} overflow-x-hidden`}>
        <LanguageProvider>
          <AuthProvider>
            <SloganProvider>
              {children}
              <PWAInstaller />
              <Analytics />
            </SloganProvider>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
