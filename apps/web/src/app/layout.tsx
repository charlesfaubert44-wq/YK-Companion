import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '@/styles/globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { SloganProvider } from '@/contexts/SloganContext'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
  preload: true,
})

export const metadata: Metadata = {
  title: 'YK Buddy - Your Yellowknife Companion',
  description: 'Your friendly multilingual platform for exploring Yellowknife - whether you\'re visiting, living here, or planning to move. Because Nobody Should Face -40° Alone.',
  keywords: ['Yellowknife', 'Northwest Territories', 'Canada', 'Aurora', 'Travel', 'Tourism', 'Moving', 'Living'],
  authors: [{ name: 'YK Buddy Team' }],
  creator: 'YK Buddy',
  publisher: 'YK Buddy',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002'),
  openGraph: {
    type: 'website',
    locale: 'en_CA',
    url: '/',
    siteName: 'YK Buddy',
    title: 'YK Buddy - Your Yellowknife Companion',
    description: 'Your friendly multilingual platform for exploring Yellowknife. Because Nobody Should Face -40° Alone.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'YK Buddy - Yellowknife Companion',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'YK Buddy - Your Yellowknife Companion',
    description: 'Your friendly multilingual platform for exploring Yellowknife',
    images: ['/og-image.png'],
  },
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
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* DNS prefetch for Supabase */}
        <link rel="dns-prefetch" href="https://supabase.co" />
        
        {/* Theme color */}
        <meta name="theme-color" content="#0A1128" />
      </head>
      <body className={inter.className} suppressHydrationWarning>
        <ErrorBoundary>
          <AuthProvider>
            <LanguageProvider>
              <SloganProvider>
                {children}
              </SloganProvider>
            </LanguageProvider>
          </AuthProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
}
