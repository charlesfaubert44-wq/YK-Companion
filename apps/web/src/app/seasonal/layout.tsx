import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA.seasonal;

export default function SeasonalLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
