import { Metadata } from 'next';
import { FEATURE_METADATA } from '@/lib/seo';

export const metadata: Metadata = FEATURE_METADATA.quiz;

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
