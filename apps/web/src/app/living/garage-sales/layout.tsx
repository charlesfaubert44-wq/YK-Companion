import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA['garage-sales'];

export default function GarageSalesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
