import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA.aurora;

export default function AuroraLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

