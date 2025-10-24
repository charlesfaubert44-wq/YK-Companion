'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface GarageSale {
  id: string;
  title: string;
  description?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  start_date: string;
  end_date: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  posted_by?: string;
  approval_status: 'pending' | 'approved' | 'rejected' | 'flagged';
  approved_by?: string;
  approved_at?: string;
  admin_notes?: string;
  rejection_reason?: string;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export default function AdminGarageSalesPage() {
  const supabase = createClient();
  const [sales, setSales] = useState<GarageSale[]>([]);
  const [filteredSales, setFilteredSales] = useState<GarageSale[]>([]);
  const [selectedSale, setSelectedSale] = useState<GarageSale | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState<'approve' | 'reject' | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    featured: 'all'
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    fetchGarageSales();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [sales, filters]);

  const fetchGarageSales = async () => {
    const { data, error } = await supabase
      .from('garage_sales')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setSales(data);
    }
  };

  const applyFilters = () => {
    let filtered = [...sales];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(s =>
        s.title.toLowerCase().includes(searchLower) ||
        s.address.toLowerCase().includes(searchLower) ||
        s.contact_email?.toLowerCase().includes(searchLower)
      );
    }

    // Status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(s => s.approval_status === filters.status);
    }

    // Featured filter
    if (filters.featured === 'featured') {
      filtered = filtered.filter(s => s.is_featured);
    } else if (filters.featured === 'not-featured') {
      filtered = filtered.filter(s => !s.is_featured);
    }

    setFilteredSales(filtered);
    setCurrentPage(1);
  };

  const openApprovalModal = (sale: GarageSale, action: 'approve' | 'reject') => {
    setSelectedSale(sale);
    setApprovalAction(action);
    setAdminNotes(sale.admin_notes || '');
    setRejectionReason(sale.rejection_reason || '');
    setShowApprovalModal(true);
  };

  const handleApproval = async () => {
    if (!selectedSale || !approvalAction) return;

    const updates: any = {
      approval_status: approvalAction === 'approve' ? 'approved' : 'rejected',
      approved_at: new Date().toISOString(),
      admin_notes: adminNotes || null
    };

    if (approvalAction === 'reject') {
      updates.rejection_reason = rejectionReason;
    }

    const { error } = await supabase
      .from('garage_sales')
      .update(updates)
      .eq('id', selectedSale.id);

    if (!error) {
      setShowApprovalModal(false);
      fetchGarageSales();
      alert(`Garage sale ${approvalAction === 'approve' ? 'approved' : 'rejected'} successfully`);
    } else {
      alert('Error: ' + error.message);
    }
  };

  const toggleFeatured = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('garage_sales')
      .update({ is_featured: !currentStatus })
      .eq('id', id);

    if (!error) {
      fetchGarageSales();
    }
  };

  const flagSale = async (id: string) => {
    if (confirm('Are you sure you want to flag this garage sale as inappropriate?')) {
      const { error } = await supabase
        .from('garage_sales')
        .update({ approval_status: 'flagged' })
        .eq('id', id);

      if (!error) {
        fetchGarageSales();
        alert('Garage sale flagged successfully');
      }
    }
  };

  const deleteSale = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this garage sale? This action cannot be undone.')) {
      const { error } = await supabase
        .from('garage_sales')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchGarageSales();
        alert('Garage sale deleted successfully');
      }
    }
  };

  const exportToCSV = () => {
    const csv = [
      ['Title', 'Address', 'Start Date', 'End Date', 'Status', 'Contact', 'Created'],
      ...filteredSales.map(s => [
        s.title,
        s.address,
        new Date(s.start_date).toLocaleDateString(),
        new Date(s.end_date).toLocaleDateString(),
        s.approval_status,
        s.contact_email || s.contact_phone || '',
        new Date(s.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `garage_sales_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredSales.length / itemsPerPage);
  const paginatedSales = filteredSales.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const pendingCount = sales.filter(s => s.approval_status === 'pending').length;
  const approvedCount = sales.filter(s => s.approval_status === 'approved').length;
  const rejectedCount = sales.filter(s => s.approval_status === 'rejected').length;
  const flaggedCount = sales.filter(s => s.approval_status === 'flagged').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Garage Sales Management</h1>
            <p className="text-gray-400">Moderate and manage garage sale listings ({filteredSales.length} listings)</p>
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
          <div className="bg-gray-800/50 rounded-xl p-6 border border-yellow-500/20">
            <div className="text-gray-400 text-sm mb-1">Pending Approval</div>
            <div className="text-3xl font-bold text-yellow-400">{pendingCount}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-green-500/20">
            <div className="text-gray-400 text-sm mb-1">Approved</div>
            <div className="text-3xl font-bold text-green-400">{approvedCount}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-red-500/20">
            <div className="text-gray-400 text-sm mb-1">Rejected</div>
            <div className="text-3xl font-bold text-red-400">{rejectedCount}</div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-6 border border-orange-500/20">
            <div className="text-gray-400 text-sm mb-1">Flagged</div>
            <div className="text-3xl font-bold text-orange-400">{flaggedCount}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search by title, address, or contact..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              />
            </div>

            {/* Status Filter */}
            <div>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </select>
            </div>

            {/* Featured Filter */}
            <div>
              <select
                value={filters.featured}
                onChange={(e) => setFilters({ ...filters, featured: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All Listings</option>
                <option value="featured">Featured Only</option>
                <option value="not-featured">Not Featured</option>
              </select>
            </div>
          </div>
        </div>

        {/* Garage Sales List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Listings</h2>

          <div className="space-y-4">
            {paginatedSales.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                {sales.length === 0
                  ? 'No garage sales yet.'
                  : 'No garage sales match your filters.'}
              </p>
            ) : (
              paginatedSales.map((sale) => (
                <div
                  key={sale.id}
                  className={`bg-gray-900/50 border rounded-xl p-6 transition-all ${
                    sale.approval_status === 'pending' ? 'border-yellow-500/30' :
                    sale.approval_status === 'approved' ? 'border-green-500/30' :
                    sale.approval_status === 'flagged' ? 'border-orange-500/30' :
                    'border-gray-700'
                  }`}
                >
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-white">{sale.title}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sale.approval_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          sale.approval_status === 'approved' ? 'bg-green-500/20 text-green-400' :
                          sale.approval_status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                          'bg-orange-500/20 text-orange-400'
                        }`}>
                          {sale.approval_status}
                        </span>
                        {sale.is_featured && (
                          <span className="px-3 py-1 bg-aurora-purple/20 text-aurora-purple rounded-full text-xs font-semibold">
                            Featured
                          </span>
                        )}
                      </div>

                      {sale.description && (
                        <p className="text-gray-400 mb-3">{sale.description}</p>
                      )}

                      <div className="grid md:grid-cols-2 gap-3 text-sm mb-3">
                        <div>
                          <span className="text-gray-500">Address:</span>{' '}
                          <span className="text-white">{sale.address}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Dates:</span>{' '}
                          <span className="text-white">
                            {new Date(sale.start_date).toLocaleDateString()} - {new Date(sale.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        {sale.contact_name && (
                          <div>
                            <span className="text-gray-500">Contact:</span>{' '}
                            <span className="text-white">{sale.contact_name}</span>
                          </div>
                        )}
                        {sale.contact_email && (
                          <div>
                            <span className="text-gray-500">Email:</span>{' '}
                            <span className="text-white">{sale.contact_email}</span>
                          </div>
                        )}
                      </div>

                      {sale.admin_notes && (
                        <div className="bg-gray-800/50 rounded-lg p-3 mb-3">
                          <div className="text-xs text-gray-500 mb-1">Admin Notes:</div>
                          <div className="text-sm text-gray-300">{sale.admin_notes}</div>
                        </div>
                      )}

                      {sale.rejection_reason && (
                        <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3 mb-3">
                          <div className="text-xs text-red-400 mb-1">Rejection Reason:</div>
                          <div className="text-sm text-gray-300">{sale.rejection_reason}</div>
                        </div>
                      )}

                      <div className="text-xs text-gray-500">
                        Created: {new Date(sale.created_at).toLocaleString()}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {sale.approval_status === 'pending' && (
                        <>
                          <button
                            onClick={() => openApprovalModal(sale, 'approve')}
                            className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30 transition-all"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => openApprovalModal(sale, 'reject')}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all"
                          >
                            Reject
                          </button>
                        </>
                      )}

                      {sale.approval_status === 'approved' && (
                        <button
                          onClick={() => toggleFeatured(sale.id, sale.is_featured)}
                          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                            sale.is_featured
                              ? 'bg-purple-500/20 text-purple-400 hover:bg-purple-500/30'
                              : 'bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30'
                          }`}
                        >
                          {sale.is_featured ? 'Unfeature' : 'Feature'}
                        </button>
                      )}

                      {sale.approval_status !== 'flagged' && (
                        <button
                          onClick={() => flagSale(sale.id)}
                          className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg text-sm font-semibold hover:bg-orange-500/30 transition-all"
                        >
                          Flag
                        </button>
                      )}

                      <button
                        onClick={() => deleteSale(sale.id)}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-8">
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

      {/* Approval/Rejection Modal */}
      {showApprovalModal && selectedSale && approvalAction && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-2xl border border-gray-700 p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-2">
              {approvalAction === 'approve' ? 'Approve' : 'Reject'} Garage Sale
            </h2>
            <p className="text-gray-400 mb-6">{selectedSale.title}</p>

            <div className="space-y-4 mb-6">
              {approvalAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Rejection Reason *
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    rows={3}
                    required
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Explain why this garage sale is being rejected..."
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Admin Notes (Optional)
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  placeholder="Any internal notes about this listing..."
                />
              </div>
            </div>

            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowApprovalModal(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleApproval}
                disabled={approvalAction === 'reject' && !rejectionReason}
                className={`px-6 py-2 font-semibold rounded-lg transition-all ${
                  approvalAction === 'approve'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:shadow-lg'
                    : 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed'
                }`}
              >
                {approvalAction === 'approve' ? 'Approve Listing' : 'Reject Listing'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
