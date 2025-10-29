import { Metadata } from 'next';
import { ADMIN_METADATA } from '@/lib/seo';
import AdminLayoutClient from './AdminLayoutClient';

export const metadata: Metadata = ADMIN_METADATA.base;

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}
