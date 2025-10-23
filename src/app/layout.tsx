import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'YK-Companion | Your Guide to Yellowknife, NWT',
  description: 'Discover Yellowknife - Whether you\'re living here, moving here, or visiting. Your ultimate companion to Canada\'s Northern Capital.',
  keywords: ['Yellowknife', 'NWT', 'Northwest Territories', 'Northern Canada', 'Aurora', 'Travel Guide'],
  authors: [{ name: 'YK-Companion' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=5',
  themeColor: '#0ea5e9',
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
