import { Metadata } from 'next';
import { PATHWAY_METADATA } from '@/lib/seo';

export const metadata: Metadata = PATHWAY_METADATA.visiting;

export default function VisitingLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
