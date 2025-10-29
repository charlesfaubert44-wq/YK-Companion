import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA['aurora-live'];

export default function AuroraLiveLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

