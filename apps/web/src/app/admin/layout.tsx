'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading } = useAdminAuth();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Redirect non-admin users
  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push('/');
    }
  }, [isAdmin, loading, router]);

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-aurora-green border-t-transparent rounded-full animate-spin"></div>
          <div className="text-white text-xl font-semibold">Loading Admin Panel...</div>
        </div>
      </div>
    );
  }

  // Don't render anything for non-admin (will redirect)
  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      {/* Layout Grid */}
      <div className="flex min-h-screen">
        {/* Sidebar - Desktop */}
        <div className="hidden lg:block">
          <AdminSidebar
            isCollapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>

        {/* Mobile Sidebar Overlay */}
        {mobileSidebarOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 z-30 lg:hidden"
              onClick={() => setMobileSidebarOpen(false)}
            />

            {/* Sidebar */}
            <div className="lg:hidden">
              <AdminSidebar isCollapsed={false} />
            </div>
          </>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <AdminHeader
            onMenuClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          />

          {/* Page Content */}
          <main className="flex-1 overflow-x-hidden">
            <div className="container mx-auto px-4 py-6 md:px-6 md:py-8">
              {children}
            </div>
          </main>

          {/* Footer */}
          <footer className="border-t border-aurora-green/10 py-4 px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-400">
              <div>
                © {new Date().getFullYear()} YK Buddy. Admin Panel.
              </div>
              <div className="flex items-center gap-4">
                <a href="/" className="hover:text-aurora-green transition-colors">
                  Site Home
                </a>
                <span>•</span>
                <a href="/admin/settings" className="hover:text-aurora-green transition-colors">
                  Settings
                </a>
                <span>•</span>
                <a href="/admin/analytics" className="hover:text-aurora-green transition-colors">
                  Analytics
                </a>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

