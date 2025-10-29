import { Metadata } from 'next';
import { PATHWAY_METADATA } from '@/lib/seo';

export const metadata: Metadata = PATHWAY_METADATA.living;

export default function LivingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

