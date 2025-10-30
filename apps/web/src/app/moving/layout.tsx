import { Metadata } from 'next';
import { PATHWAY_METADATA } from '@/lib/seo';

export const metadata: Metadata = PATHWAY_METADATA.moving;

export default function MovingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
