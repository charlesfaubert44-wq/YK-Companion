'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAdminGuard } from '@/hooks/useAdminGuard';
import { Profile } from '@/types/database.types';

interface PaginationData {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export default function UserManagementPage() {
  const { loading: authLoading, isAdmin } = useAdminGuard();
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterAdmin, setFilterAdmin] = useState('');
  const [editingUser, setEditingUser] = useState<Profile | null>(null);

  useEffect(() => {
    if (!authLoading && isAdmin) {
      fetchUsers();
    }
  }, [authLoading, isAdmin, pagination.page, search, filterType, filterAdmin]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      });

      if (search) params.append('search', search);
      if (filterType) params.append('userType', filterType);
      if (filterAdmin) params.append('isAdmin', filterAdmin);

      const response = await fetch(`/api/admin/users?${params}`);
      const data = await response.json();

      if (response.ok) {
        setUsers(data.users);
        setPagination(data.pagination);
      } else {
        console.error('Error fetching users:', data.error);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateUser = async (userId: string, updates: Partial<Profile>) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        fetchUsers();
        setEditingUser(null);
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchUsers();
      } else {
        const data = await response.json();
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  // Show loading state while checking auth
  if (authLoading || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      {/* Header */}
      <div className="bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link
                href="/admin"
                className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-2"
              >
                ← Back to Dashboard
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                User Management
              </h1>
              <p className="text-gray-300 mt-2">
                Manage user accounts, permissions, and profiles
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20 mb-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Search</label>
              <input
                type="text"
                placeholder="Name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
              />
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">User Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
              >
                <option value="">All Types</option>
                <option value="visiting">Visiting</option>
                <option value="living">Living</option>
                <option value="moving">Moving</option>
              </select>
            </div>
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Admin Status</label>
              <select
                value={filterAdmin}
                onChange={(e) => setFilterAdmin(e.target.value)}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
              >
                <option value="">All Users</option>
                <option value="true">Admins Only</option>
                <option value="false">Non-Admins Only</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={fetchUsers}
                className="w-full px-4 py-2 bg-aurora-green text-dark-900 rounded-lg font-semibold hover:bg-aurora-blue transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid md:grid-cols-4 gap-6 mb-6">
          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
            <div className="text-gray-400 text-sm">Total Users</div>
            <div className="text-3xl font-bold text-white mt-1">{pagination.total}</div>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
            <div className="text-gray-400 text-sm">Current Page</div>
            <div className="text-3xl font-bold text-white mt-1">
              {pagination.page} / {pagination.totalPages}
            </div>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
            <div className="text-gray-400 text-sm">Per Page</div>
            <div className="text-3xl font-bold text-white mt-1">{pagination.limit}</div>
          </div>
          <div className="bg-dark-800 rounded-xl p-6 border border-aurora-pink/20">
            <div className="text-gray-400 text-sm">Showing</div>
            <div className="text-3xl font-bold text-white mt-1">{users.length}</div>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-dark-800 rounded-xl border border-aurora-green/20 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-dark-700 border-b border-gray-600">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">User</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Admin</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Joined</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      Loading users...
                    </td>
                  </tr>
                ) : users.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-dark-700 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-white font-semibold">{user.full_name || 'Unnamed'}</div>
                        <div className="text-gray-400 text-sm">{user.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.user_type === 'visiting' ? 'bg-blue-500/20 text-blue-300' :
                          user.user_type === 'living' ? 'bg-green-500/20 text-green-300' :
                          user.user_type === 'moving' ? 'bg-purple-500/20 text-purple-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {user.user_type || 'Not Set'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.is_admin ? (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-aurora-green/20 text-aurora-green">
                            Admin
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-500/20 text-gray-400">
                            User
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-gray-300 text-sm">
                        {new Date(user.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setEditingUser(user)}
                            className="px-3 py-1 bg-aurora-blue/20 text-aurora-blue rounded hover:bg-aurora-blue/30 transition-colors text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleUpdateUser(user.id, { is_admin: !user.is_admin })}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              user.is_admin
                                ? 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30'
                                : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                            }`}
                          >
                            {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user.id, user.full_name || user.email)}
                            className="px-3 py-1 bg-red-500/20 text-red-300 rounded hover:bg-red-500/30 transition-colors text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
              disabled={pagination.page === 1}
              className="px-4 py-2 bg-dark-800 text-white rounded-lg border border-aurora-green/20 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <div className="px-4 py-2 bg-dark-800 text-white rounded-lg border border-aurora-green/20">
              Page {pagination.page} of {pagination.totalPages}
            </div>
            <button
              onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
              disabled={pagination.page === pagination.totalPages}
              className="px-4 py-2 bg-dark-800 text-white rounded-lg border border-aurora-green/20 hover:bg-dark-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-xl border border-aurora-green/20 max-w-md w-full p-6">
            <h3 className="text-2xl font-bold text-white mb-4">Edit User</h3>
            <div className="space-y-4">
              <div>
                <label className="text-gray-300 text-sm mb-2 block">Full Name</label>
                <input
                  type="text"
                  value={editingUser.full_name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, full_name: e.target.value })}
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
                />
              </div>
              <div>
                <label className="text-gray-300 text-sm mb-2 block">User Type</label>
                <select
                  value={editingUser.user_type || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, user_type: e.target.value as any })}
                  className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-aurora-green"
                >
                  <option value="">Not Set</option>
                  <option value="visiting">Visiting</option>
                  <option value="living">Living</option>
                  <option value="moving">Moving</option>
                </select>
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleUpdateUser(editingUser.id, {
                    full_name: editingUser.full_name,
                    user_type: editingUser.user_type,
                  })}
                  className="flex-1 px-4 py-2 bg-aurora-green text-dark-900 rounded-lg font-semibold hover:bg-aurora-blue transition-colors"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => setEditingUser(null)}
                  className="flex-1 px-4 py-2 bg-dark-700 text-white rounded-lg hover:bg-dark-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
