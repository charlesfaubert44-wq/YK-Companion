import type { Metadata } from 'next';
import { Inter, Press_Start_2P } from 'next/font/google';
import '../styles/globals.css';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'] });
const pressStart2P = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pixel',
});

export const metadata: Metadata = {
  title: 'YK Buddy - Your Yellowknife Companion',
  description: 'Your friendly companion for exploring Yellowknife - whether you are visiting, living here, or planning to move.',
  keywords: ['Yellowknife', 'Northwest Territories', 'Aurora', 'Northern Lights', 'Trip Planning', 'Canada Travel', 'Moving to Yellowknife'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={pressStart2P.variable}>
      <body className={inter.className}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
