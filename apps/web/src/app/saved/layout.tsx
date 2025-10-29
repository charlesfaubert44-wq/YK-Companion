import { Metadata } from 'next';
import { USER_METADATA } from '@/lib/seo';

export const metadata: Metadata = USER_METADATA.saved;

export default function SavedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

