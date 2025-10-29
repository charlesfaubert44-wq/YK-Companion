import { Metadata } from 'next';
import { STATIC_METADATA } from '@/lib/seo';

export const metadata: Metadata = STATIC_METADATA['sponsor-info'];

export default function SponsorInfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

