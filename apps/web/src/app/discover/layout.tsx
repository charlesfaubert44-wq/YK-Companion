import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA.discover;

export default function DiscoverLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
