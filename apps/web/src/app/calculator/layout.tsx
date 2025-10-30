import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA.calculator;

export default function CalculatorLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
