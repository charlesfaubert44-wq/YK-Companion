import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA.knowledge;

export default function KnowledgeLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
