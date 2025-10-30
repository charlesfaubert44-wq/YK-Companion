import { Metadata } from 'next';
import { STATIC_METADATA } from '@/lib/seo';

export const metadata: Metadata = STATIC_METADATA.contact;

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
