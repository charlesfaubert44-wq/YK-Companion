'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface User {
  id: string;
  email: string;
  full_name?: string;
  user_type?: string;
  is_admin: boolean;
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  permissions?: UserPermissions;
}

interface UserPermissions {
  id: string;
  user_id: string;
  is_super_admin: boolean;
  can_manage_users: boolean;
  can_manage_sponsors: boolean;
  can_manage_content: boolean;
  can_manage_garage_sales: boolean;
  can_view_analytics: boolean;
  can_manage_settings: boolean;
  notes?: string;
}

export default function AdminUsersPage() {
  const supabase = createClient();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);

  const [filters, setFilters] = useState({
    search: '',
    userType: 'all',
    adminStatus: 'all',
    activeStatus: 'all'
  });

  const [permissions, setPermissions] = useState({
    is_super_admin: false,
    can_manage_users: false,
    can_manage_sponsors: false,
    can_manage_content: false,
    can_manage_garage_sales: false,
    can_view_analytics: false,
    can_manage_settings: false,
    notes: ''
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [users, filters]);

  const fetchUsers = async () => {
    // Fetch all users with their permissions
    const { data: profilesData, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        *,
        permissions:user_permissions(*)
      `)
      .order('created_at', { ascending: false });

    if (profilesData && !profilesError) {
      // Flatten the permissions array (since it returns as array with one item)
      const formattedUsers = profilesData.map((user: any) => ({
        ...user,
        permissions: Array.isArray(user.permissions) && user.permissions.length > 0
          ? user.permissions[0]
          : null
      }));
      setUsers(formattedUsers);
    } else {
      console.error('Error fetching users:', profilesError);
    }
  };

  const applyFilters = () => {
    let filtered = [...users];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(u =>
        u.email?.toLowerCase().includes(searchLower) ||
        u.full_name?.toLowerCase().includes(searchLower)
      );
    }

    // User type filter
    if (filters.userType !== 'all') {
      filtered = filtered.filter(u => u.user_type === filters.userType);
    }

    // Admin status filter
    if (filters.adminStatus === 'admin') {
      filtered = filtered.filter(u => u.is_admin);
    } else if (filters.adminStatus === 'non-admin') {
      filtered = filtered.filter(u => !u.is_admin);
    }

    // Active status filter
    if (filters.activeStatus === 'active') {
      filtered = filtered.filter(u => u.is_active);
    } else if (filters.activeStatus === 'inactive') {
      filtered = filtered.filter(u => !u.is_active);
    }

    setFilteredUsers(filtered);
    setCurrentPage(1);
  };

  const toggleAdminStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_admin: !currentStatus })
      .eq('id', userId);

    if (!error) {
      fetchUsers();
      alert(`Admin status ${!currentStatus ? 'granted' : 'revoked'} successfully`);
    } else {
      alert('Error updating admin status: ' + error.message);
    }
  };

  const toggleActiveStatus = async (userId: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('profiles')
      .update({ is_active: !currentStatus })
      .eq('id', userId);

    if (!error) {
      fetchUsers();
      alert(`User ${!currentStatus ? 'activated' : 'suspended'} successfully`);
    } else {
      alert('Error updating user status: ' + error.message);
    }
  };

  const openPermissionsModal = (user: User) => {
    setSelectedUser(user);
    if (user.permissions) {
      setPermissions({
        is_super_admin: user.permissions.is_super_admin,
        can_manage_users: user.permissions.can_manage_users,
        can_manage_sponsors: user.permissions.can_manage_sponsors,
        can_manage_content: user.permissions.can_manage_content,
        can_manage_garage_sales: user.permissions.can_manage_garage_sales,
        can_view_analytics: user.permissions.can_view_analytics,
        can_manage_settings: user.permissions.can_manage_settings,
        notes: user.permissions.notes || ''
      });
    } else {
      // Default permissions if none exist
      setPermissions({
        is_super_admin: false,
        can_manage_users: false,
        can_manage_sponsors: false,
        can_manage_content: false,
        can_manage_garage_sales: false,
        can_view_analytics: false,
        can_manage_settings: false,
        notes: ''
      });
    }
    setShowPermissionsModal(true);
  };

  const savePermissions = async () => {
    if (!selectedUser) return;

    // Upsert permissions
    const { error } = await supabase
      .from('user_permissions')
      .upsert({
        user_id: selectedUser.id,
        ...permissions
      }, {
        onConflict: 'user_id'
      });

    if (!error) {
      setShowPermissionsModal(false);
      fetchUsers();
      alert('Permissions updated successfully');
    } else {
      alert('Error updating permissions: ' + error.message);
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Email', 'Name', 'User Type', 'Admin', 'Active', 'Created', 'Last Login'],
      ...filteredUsers.map(u => [
        u.email,
        u.full_name || '',
        u.user_type || '',
        u.is_admin ? 'Yes' : 'No',
        u.is_active ? 'Yes' : 'No',
        new Date(u.created_at).toLocaleDateString(),
        u.last_login_at ? new Date(u.last_login_at).toLocaleDateString() : 'Never'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `users_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">User Management</h1>
            <p className="text-gray-400">Manage user accounts and permissions ({filteredUsers.length} users)</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              ← Back to Admin
            </Link>
            <button
              onClick={exportToCSV}
              className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700">
            <div className="text-gray-400 text-sm mb-1">Total Users</div>
            <div className="text-3xl font-bold text-white">{users.length}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-aurora-green/20">
            <div className="text-gray-400 text-sm mb-1">Admins</div>
            <div className="text-3xl font-bold text-aurora-green">
              {users.filter(u => u.is_admin).length}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-aurora-blue/20">
            <div className="text-gray-400 text-sm mb-1">Active Users</div>
            <div className="text-3xl font-bold text-aurora-blue">
              {users.filter(u => u.is_active).length}
            </div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/20">
            <div className="text-gray-400 text-sm mb-1">Super Admins</div>
            <div className="text-3xl font-bold text-yellow-400">
              {users.filter(u => u.permissions?.is_super_admin).length}
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by email or name..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              />
            </div>

            {/* User Type Filter */}
            <div>
              <select
                value={filters.userType}
                onChange={(e) => setFilters({ ...filters, userType: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All User Types</option>
                <option value="visiting">Visiting</option>
                <option value="living">Living</option>
                <option value="moving">Moving</option>
              </select>
            </div>

            {/* Admin Status Filter */}
            <div>
              <select
                value={filters.adminStatus}
                onChange={(e) => setFilters({ ...filters, adminStatus: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All Users</option>
                <option value="admin">Admins Only</option>
                <option value="non-admin">Non-Admins Only</option>
              </select>
            </div>

            {/* Active Status Filter */}
            <div>
              <select
                value={filters.activeStatus}
                onChange={(e) => setFilters({ ...filters, activeStatus: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 overflow-hidden">
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white mb-4">Users</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-900/50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Created
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Last Login
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {paginatedUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      {users.length === 0
                        ? 'No users found in the system.'
                        : 'No users match your filters.'}
                    </td>
                  </tr>
                ) : (
                  paginatedUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-900/30 transition-colors">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-white font-medium">{user.email}</div>
                          {user.full_name && (
                            <div className="text-sm text-gray-400">{user.full_name}</div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.user_type === 'visiting' ? 'bg-blue-500/20 text-blue-400' :
                          user.user_type === 'living' ? 'bg-green-500/20 text-green-400' :
                          user.user_type === 'moving' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.user_type || 'None'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-1">
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold inline-block w-fit ${
                            user.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {user.is_active ? 'Active' : 'Suspended'}
                          </span>
                          {user.is_admin && (
                            <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-xs font-semibold inline-block w-fit">
                              Admin
                            </span>
                          )}
                          {user.permissions?.is_super_admin && (
                            <span className="px-3 py-1 bg-aurora-purple/20 text-aurora-purple rounded-full text-xs font-semibold inline-block w-fit">
                              Super Admin
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-400">
                        {user.last_login_at
                          ? new Date(user.last_login_at).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openPermissionsModal(user)}
                            className="px-3 py-1 bg-aurora-blue/20 text-aurora-blue rounded-lg text-xs font-semibold hover:bg-aurora-blue/30 transition-all"
                          >
                            Permissions
                          </button>
                          <button
                            onClick={() => toggleAdminStatus(user.id, user.is_admin)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              user.is_admin
                                ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {user.is_admin ? 'Revoke Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => toggleActiveStatus(user.id, user.is_active)}
                            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                              user.is_active
                                ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            }`}
                          >
                            {user.is_active ? 'Suspend' : 'Activate'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 p-6 border-t border-gray-700/50">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Permissions Modal */}
      {showPermissionsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-2">
              Manage Permissions
            </h2>
            <p className="text-gray-400 mb-6">
              {selectedUser.email}
            </p>

            <div className="space-y-4 mb-6">
              {/* Super Admin */}
              <label className="flex items-center gap-3 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg cursor-pointer hover:bg-yellow-500/20 transition-colors">
                <input
                  type="checkbox"
                  checked={permissions.is_super_admin}
                  onChange={(e) => {
                    const isSuperAdmin = e.target.checked;
                    setPermissions({
                      ...permissions,
                      is_super_admin: isSuperAdmin,
                      // If super admin, grant all permissions
                      ...(isSuperAdmin ? {
                        can_manage_users: true,
                        can_manage_sponsors: true,
                        can_manage_content: true,
                        can_manage_garage_sales: true,
                        can_view_analytics: true,
                        can_manage_settings: true
                      } : {})
                    });
                  }}
                  className="w-5 h-5"
                />
                <div className="flex-1">
                  <div className="font-semibold text-yellow-400">Super Admin</div>
                  <div className="text-sm text-gray-400">Full access to all features and settings</div>
                </div>
              </label>

              {/* Individual Permissions */}
              <div className={`space-y-3 ${permissions.is_super_admin ? 'opacity-50 pointer-events-none' : ''}`}>
                <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.can_manage_users}
                    onChange={(e) => setPermissions({ ...permissions, can_manage_users: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Manage Users</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.can_manage_sponsors}
                    onChange={(e) => setPermissions({ ...permissions, can_manage_sponsors: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Manage Sponsors</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.can_manage_content}
                    onChange={(e) => setPermissions({ ...permissions, can_manage_content: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Manage Content</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.can_manage_garage_sales}
                    onChange={(e) => setPermissions({ ...permissions, can_manage_garage_sales: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Manage Garage Sales</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.can_view_analytics}
                    onChange={(e) => setPermissions({ ...permissions, can_view_analytics: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white">View Analytics</span>
                </label>

                <label className="flex items-center gap-3 p-3 bg-gray-900/50 border border-gray-700 rounded-lg cursor-pointer hover:bg-gray-900/70 transition-colors">
                  <input
                    type="checkbox"
                    checked={permissions.can_manage_settings}
                    onChange={(e) => setPermissions({ ...permissions, can_manage_settings: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Manage Settings</span>
                </label>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Notes
                </label>
                <textarea
                  value={permissions.notes}
                  onChange={(e) => setPermissions({ ...permissions, notes: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  placeholder="Any notes about this user's permissions..."
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowPermissionsModal(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={savePermissions}
                className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
              >
                Save Permissions
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
