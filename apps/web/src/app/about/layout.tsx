import { Metadata } from 'next';
import { STATIC_METADATA } from '@/lib/seo';

export const metadata: Metadata = STATIC_METADATA.about;

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

