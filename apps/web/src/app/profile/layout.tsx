import { Metadata } from 'next';
import { USER_METADATA } from '@/lib/seo';

export const metadata: Metadata = USER_METADATA.profile;

export default function ProfileLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
