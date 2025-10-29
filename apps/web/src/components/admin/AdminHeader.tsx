'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface AdminHeaderProps {
  title?: string;
  subtitle?: string;
  onMenuClick?: () => void;
}

export default function AdminHeader({ title, subtitle, onMenuClick }: AdminHeaderProps) {
  const { user, profile } = useAuth();
  const { isSuperAdmin, permissions } = useAdminAuth();
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase credentials');
      return;
    }

    const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
    
    await supabase.auth.signOut();
    router.push('/');
  };

  const getInitials = () => {
    if (profile?.full_name) {
      const names = profile.full_name.split(' ');
      return names.map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user?.email?.[0].toUpperCase() || 'A';
  };

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Admin';

  return (
    <header className="bg-dark-900/80 backdrop-blur-lg border-b border-aurora-green/10 sticky top-0 z-30">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Left: Menu & Title */}
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          {onMenuClick && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg text-gray-400 hover:bg-dark-700 hover:text-white transition-all"
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}

          {/* Title */}
          <div>
            {title && (
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                {title}
              </h1>
            )}
            {subtitle && (
              <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Right: User Info & Actions */}
        <div className="flex items-center gap-4">
          {/* Admin Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-aurora-green/10 border border-aurora-green/30">
            <span className="text-aurora-green text-sm font-semibold">
              {isSuperAdmin ? '⚡ Super Admin' : '👑 Admin'}
            </span>
          </div>

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl bg-dark-700 hover:bg-dark-600 transition-all border border-aurora-green/20"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-aurora-green to-aurora-blue flex items-center justify-center text-white font-bold text-sm">
                {getInitials()}
              </div>

              {/* Name (hidden on mobile) */}
              <div className="hidden md:block text-left">
                <div className="text-white font-semibold text-sm">{displayName}</div>
                <div className="text-gray-400 text-xs">{user?.email}</div>
              </div>

              {/* Dropdown Icon */}
              <svg
                className={`w-4 h-4 text-gray-400 transition-transform ${showUserMenu ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {/* Dropdown Menu */}
            {showUserMenu && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowUserMenu(false)}
                />

                {/* Menu */}
                <div className="absolute right-0 mt-2 w-64 bg-dark-800 border border-aurora-green/20 rounded-xl shadow-2xl z-50 overflow-hidden">
                  {/* User Info */}
                  <div className="p-4 border-b border-gray-700">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-aurora-green to-aurora-blue flex items-center justify-center text-white font-bold">
                        {getInitials()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-white font-semibold truncate">{displayName}</div>
                        <div className="text-gray-400 text-sm truncate">{user?.email}</div>
                      </div>
                    </div>

                    {/* Role Badge */}
                    <div className="mt-3 flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-aurora-green/10 border border-aurora-green/30">
                      <span className="text-aurora-green text-sm font-semibold">
                        {isSuperAdmin ? '⚡ Super Admin' : '👑 Admin'}
                      </span>
                    </div>

                    {/* Permissions Summary */}
                    {permissions && !isSuperAdmin && (
                      <div className="mt-3 text-xs text-gray-400">
                        <div className="font-semibold mb-1">Permissions:</div>
                        <div className="space-y-1">
                          {permissions.can_manage_users && <div>• Manage Users</div>}
                          {permissions.can_manage_sponsors && <div>• Manage Sponsors</div>}
                          {permissions.can_manage_content && <div>• Manage Content</div>}
                          {permissions.can_manage_garage_sales && <div>• Manage Garage Sales</div>}
                          {permissions.can_view_analytics && <div>• View Analytics</div>}
                          {permissions.can_manage_settings && <div>• Manage Settings</div>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={() => {
                        router.push('/profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-dark-700 hover:text-white transition-all text-left"
                    >
                      <span className="text-xl">👤</span>
                      <span>My Profile</span>
                    </button>

                    <button
                      onClick={() => {
                        router.push('/');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-gray-300 hover:bg-dark-700 hover:text-white transition-all text-left"
                    >
                      <span className="text-xl">🏠</span>
                      <span>Back to Site</span>
                    </button>
                  </div>

                  {/* Sign Out */}
                  <div className="p-2 border-t border-gray-700">
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all text-left"
                    >
                      <span className="text-xl">🚪</span>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

