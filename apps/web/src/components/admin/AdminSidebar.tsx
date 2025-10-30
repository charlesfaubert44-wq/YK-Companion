'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarItem {
  title: string;
  href: string;
  icon: string;
  description?: string;
}

const navigationItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: '📊',
    description: 'Overview & stats',
  },
  {
    title: 'Premium Sponsors',
    href: '/admin/sponsors',
    icon: '✨',
    description: 'Manage sponsors',
  },
  {
    title: 'Pricing Plans',
    href: '/admin/pricing-plans',
    icon: '💰',
    description: 'Configure pricing',
  },
  {
    title: 'User Management',
    href: '/admin/users',
    icon: '👥',
    description: 'Manage users',
  },
  {
    title: 'Garage Sales',
    href: '/admin/garage-sales',
    icon: '🏘️',
    description: 'Moderate listings',
  },
  {
    title: 'Knowledge Base',
    href: '/admin/knowledge',
    icon: '📚',
    description: 'Articles & FAQs',
  },
  {
    title: 'Banners',
    href: '/admin/banners',
    icon: '🎨',
    description: 'Manage banners',
  },
  {
    title: 'Analytics',
    href: '/admin/analytics',
    icon: '📈',
    description: 'View reports',
  },
  {
    title: 'Settings',
    href: '/admin/settings',
    icon: '⚙️',
    description: 'Site configuration',
  },
];

interface AdminSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export default function AdminSidebar({ isCollapsed = false, onToggleCollapse }: AdminSidebarProps) {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname?.startsWith(href);
  };

  return (
    <aside
      className={`
        fixed lg:static inset-y-0 left-0 z-40
        bg-gradient-to-b from-dark-900 via-dark-800 to-dark-900
        border-r border-aurora-green/10
        transition-all duration-300
        ${isCollapsed ? 'w-20' : 'w-72'}
        flex flex-col
      `}
    >
      {/* Logo / Header */}
      <div className="p-6 border-b border-aurora-green/10">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="text-3xl">⚡</div>
          {!isCollapsed && (
            <div>
              <h2 className="text-xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Admin Panel
              </h2>
              <p className="text-xs text-gray-400">YK Buddy</p>
            </div>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {navigationItems.map(item => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-xl
                transition-all duration-200 group
                ${
                  active
                    ? 'bg-aurora-green/20 text-aurora-green border-2 border-aurora-green/50'
                    : 'text-gray-400 hover:bg-dark-700 hover:text-white border-2 border-transparent'
                }
              `}
              title={isCollapsed ? item.title : undefined}
            >
              <span className="text-2xl flex-shrink-0">{item.icon}</span>
              {!isCollapsed && (
                <div className="flex-1 min-w-0">
                  <div
                    className={`font-semibold ${active ? 'text-aurora-green' : 'text-white group-hover:text-white'}`}
                  >
                    {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-gray-500 group-hover:text-gray-400">
                      {item.description}
                    </div>
                  )}
                </div>
              )}
              {!isCollapsed && active && (
                <div className="w-2 h-2 rounded-full bg-aurora-green animate-pulse" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-aurora-green/10">
        {!isCollapsed ? (
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-700 hover:text-white transition-all"
          >
            <span className="text-2xl">←</span>
            <span className="font-semibold">Back to Site</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center justify-center px-4 py-3 rounded-xl text-gray-400 hover:bg-dark-700 hover:text-white transition-all"
            title="Back to Site"
          >
            <span className="text-2xl">←</span>
          </Link>
        )}

        {/* Collapse Toggle Button */}
        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="mt-2 w-full flex items-center justify-center px-4 py-2 rounded-xl text-gray-400 hover:bg-dark-700 hover:text-white transition-all"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="text-xl">{isCollapsed ? '→' : '←'}</span>
          </button>
        )}
      </div>
    </aside>
  );
}
