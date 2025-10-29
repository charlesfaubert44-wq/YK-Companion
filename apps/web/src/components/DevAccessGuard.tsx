'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function DevAccessGuard({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Check if dev access guard should be enabled (only in development or specific envs)
  const isDevAccessEnabled = process.env.NEXT_PUBLIC_DEV_ACCESS_ENABLED === 'true';

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    // Skip guard if not enabled or not mounted yet
    if (!isDevAccessEnabled || !isMounted) {
      setHasAccess(true);
      return;
    }

    // Don't guard the dev-access page itself
    if (pathname === '/dev-access') {
      setHasAccess(true);
      return;
    }

    // Check if user has access (only run on client)
    if (typeof window !== 'undefined') {
      const access = localStorage.getItem('yk_dev_access');

      if (access === 'granted') {
        setHasAccess(true);
      } else {
        // Redirect to dev access page
        router.push('/dev-access');
      }
    }
  }, [pathname, router, isDevAccessEnabled, isMounted]);

  // For production or SSR, always show children
  if (!isDevAccessEnabled || !isMounted) {
    return <>{children}</>;
  }

  // Show loading state while checking access
  if (hasAccess === null) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-semibold">Loading...</div>
        </div>
      </div>
    );
  }

  // Show children if has access or on dev-access page
  return <>{children}</>;
}
