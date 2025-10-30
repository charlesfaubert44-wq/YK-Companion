'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface Sponsor {
  id: string;
  name: string;
  tagline?: string;
  link?: string;
  position: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  plan_type: string;
  duration_days: number;
  total_price: number;
  payment_status: string;
  contact_email?: string;
  contact_name?: string;
  notes?: string;
  created_at: string;
}

interface PricingPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  position: string;
  base_price_per_day: number;
  position_multiplier: number;
  volume_discount_7days: number;
  volume_discount_30days: number;
  volume_discount_90days: number;
  description: string;
}

export default function AdminSponsorsPage() {
  const supabase = createClient();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [filteredSponsors, setFilteredSponsors] = useState<Sponsor[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [selectedSponsors, setSelectedSponsors] = useState<string[]>([]);

  // Filters
  const [filters, setFilters] = useState({
    search: '',
    position: 'all',
    paymentStatus: 'all',
    activeStatus: 'all',
  });

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    link: '',
    position: 'home_top',
    plan_type: 'basic',
    duration_days: 7,
    start_date: new Date().toISOString().split('T')[0],
    contact_email: '',
    contact_name: '',
    notes: '',
    payment_status: 'pending',
  });

  useEffect(() => {
    fetchSponsors();
    fetchPricingPlans();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [formData.position, formData.plan_type, formData.duration_days, pricingPlans]);

  useEffect(() => {
    applyFilters();
  }, [sponsors, filters]);

  const fetchSponsors = async () => {
    const { data, error } = await supabase
      .from('premium_sponsors')
      .select('*')
      .order('created_at', { ascending: false });

    if (data && !error) {
      setSponsors(data);
    }
  };

  const fetchPricingPlans = async () => {
    const { data, error } = await supabase
      .from('premium_pricing_plans')
      .select('*')
      .eq('is_active', true)
      .order('position', { ascending: true });

    if (data && !error) {
      setPricingPlans(data);
    }
  };

  const applyFilters = () => {
    let filtered = [...sponsors];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        s =>
          s.name.toLowerCase().includes(searchLower) ||
          s.tagline?.toLowerCase().includes(searchLower) ||
          s.contact_email?.toLowerCase().includes(searchLower)
      );
    }

    // Position filter
    if (filters.position !== 'all') {
      filtered = filtered.filter(s => s.position === filters.position);
    }

    // Payment status filter
    if (filters.paymentStatus !== 'all') {
      filtered = filtered.filter(s => s.payment_status === filters.paymentStatus);
    }

    // Active status filter
    if (filters.activeStatus === 'active') {
      filtered = filtered.filter(s => s.is_active);
    } else if (filters.activeStatus === 'inactive') {
      filtered = filtered.filter(s => !s.is_active);
    }

    setFilteredSponsors(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const calculatePrice = () => {
    const plan = pricingPlans.find(
      p => p.position === formData.position && p.plan_type === formData.plan_type
    );

    if (!plan) {
      setCalculatedPrice(0);
      setSelectedPlan(null);
      return;
    }

    setSelectedPlan(plan);

    let basePrice = plan.base_price_per_day * formData.duration_days;
    let discount = 0;

    // Apply volume discounts
    if (formData.duration_days >= 90) {
      discount = plan.volume_discount_90days;
    } else if (formData.duration_days >= 30) {
      discount = plan.volume_discount_30days;
    } else if (formData.duration_days >= 7) {
      discount = plan.volume_discount_7days;
    }

    const finalPrice = basePrice * (1 - discount);
    setCalculatedPrice(Math.round(finalPrice * 100) / 100);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tagline: '',
      link: '',
      position: 'home_top',
      plan_type: 'basic',
      duration_days: 7,
      start_date: new Date().toISOString().split('T')[0],
      contact_email: '',
      contact_name: '',
      notes: '',
      payment_status: 'pending',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (sponsor: Sponsor) => {
    setFormData({
      name: sponsor.name,
      tagline: sponsor.tagline || '',
      link: sponsor.link || '',
      position: sponsor.position,
      plan_type: sponsor.plan_type,
      duration_days: sponsor.duration_days,
      start_date: new Date(sponsor.start_date).toISOString().split('T')[0],
      contact_email: sponsor.contact_email || '',
      contact_name: sponsor.contact_name || '',
      notes: sponsor.notes || '',
      payment_status: sponsor.payment_status,
    });
    setEditingId(sponsor.id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endDate = new Date(formData.start_date);
    endDate.setDate(endDate.getDate() + formData.duration_days);

    const sponsorData = {
      name: formData.name,
      tagline: formData.tagline || null,
      link: formData.link || null,
      position: formData.position,
      plan_type: formData.plan_type,
      duration_days: formData.duration_days,
      start_date: formData.start_date,
      end_date: endDate.toISOString(),
      total_price: calculatedPrice,
      contact_email: formData.contact_email || null,
      contact_name: formData.contact_name || null,
      notes: formData.notes || null,
      payment_status: formData.payment_status,
      is_active: true,
    };

    let error;
    if (editingId) {
      // Update existing sponsor
      ({ error } = await supabase.from('premium_sponsors').update(sponsorData).eq('id', editingId));
    } else {
      // Create new sponsor
      ({ error } = await supabase.from('premium_sponsors').insert([sponsorData]));
    }

    if (!error) {
      resetForm();
      fetchSponsors();
      alert(editingId ? 'Sponsor updated successfully!' : 'Sponsor added successfully!');
    } else {
      alert('Error: ' + error.message);
    }
  };

  const toggleSponsorStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('premium_sponsors')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      fetchSponsors();
    }
  };

  const updatePaymentStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from('premium_sponsors')
      .update({ payment_status: status })
      .eq('id', id);

    if (!error) {
      fetchSponsors();
    }
  };

  const deleteSponsor = async (id: string) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      const { error } = await supabase.from('premium_sponsors').delete().eq('id', id);

      if (!error) {
        fetchSponsors();
      }
    }
  };

  // Bulk actions
  const toggleSelectAll = () => {
    if (selectedSponsors.length === paginatedSponsors.length) {
      setSelectedSponsors([]);
    } else {
      setSelectedSponsors(paginatedSponsors.map(s => s.id));
    }
  };

  const toggleSelectSponsor = (id: string) => {
    setSelectedSponsors(prev =>
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const bulkUpdatePaymentStatus = async (status: string) => {
    if (selectedSponsors.length === 0) return;

    const { error } = await supabase
      .from('premium_sponsors')
      .update({ payment_status: status })
      .in('id', selectedSponsors);

    if (!error) {
      fetchSponsors();
      setSelectedSponsors([]);
      alert(`Updated ${selectedSponsors.length} sponsor(s)`);
    }
  };

  const bulkToggleActive = async (isActive: boolean) => {
    if (selectedSponsors.length === 0) return;

    const { error } = await supabase
      .from('premium_sponsors')
      .update({ is_active: isActive })
      .in('id', selectedSponsors);

    if (!error) {
      fetchSponsors();
      setSelectedSponsors([]);
      alert(`Updated ${selectedSponsors.length} sponsor(s)`);
    }
  };

  const exportToCSV = () => {
    const csv = [
      [
        'Name',
        'Tagline',
        'Position',
        'Plan',
        'Start Date',
        'End Date',
        'Price',
        'Payment Status',
        'Active',
        'Contact',
      ],
      ...filteredSponsors.map(s => [
        s.name,
        s.tagline || '',
        s.position,
        s.plan_type,
        new Date(s.start_date).toLocaleDateString(),
        new Date(s.end_date).toLocaleDateString(),
        s.total_price,
        s.payment_status,
        s.is_active ? 'Yes' : 'No',
        s.contact_email || '',
      ]),
    ]
      .map(row => row.join(','))
      .join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `sponsors_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  // Pagination
  const totalPages = Math.ceil(filteredSponsors.length / itemsPerPage);
  const paginatedSponsors = filteredSponsors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Premium Sponsors</h1>
            <p className="text-gray-400">
              Manage premium spotlight placements ({filteredSponsors.length} sponsors)
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/admin"
              className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              ← Back to Admin
            </Link>
            <button
              onClick={() => {
                if (showForm && !editingId) {
                  resetForm();
                } else {
                  resetForm();
                  setShowForm(true);
                }
              }}
              className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              {showForm ? 'Cancel' : '+ New Sponsor'}
            </button>
            <button
              onClick={exportToCSV}
              className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
            >
              Export CSV
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingId ? 'Edit Premium Sponsor' : 'Add New Premium Sponsor'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Sponsor Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Sponsor Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Northern Lights Tours Inc."
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tagline (max 100 chars)
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.tagline}
                    onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Experience the magic of the North"
                  />
                  <p className="text-xs text-gray-500 mt-1">{formData.tagline.length}/100</p>
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website Link
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={e => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                  <select
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  >
                    <option value="home_top">Home - Top (Premium)</option>
                    <option value="home_middle">Home - Middle</option>
                    <option value="home_bottom">Home - Bottom</option>
                    <option value="visiting">Visiting Section</option>
                    <option value="living">Living Section</option>
                    <option value="moving">Moving Section</option>
                  </select>
                </div>

                {/* Plan Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Type *
                  </label>
                  <select
                    value={formData.plan_type}
                    onChange={e => setFormData({ ...formData, plan_type: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  >
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="enterprise">Enterprise</option>
                  </select>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (days) *
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="365"
                    value={formData.duration_days}
                    onChange={e =>
                      setFormData({ ...formData, duration_days: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Discounts: 7+ days (5-15%), 30+ days (15-25%), 90+ days (25-35%)
                  </p>
                </div>

                {/* Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={e => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                </div>

                {/* Payment Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Payment Status
                  </label>
                  <select
                    value={formData.payment_status}
                    onChange={e => setFormData({ ...formData, payment_status: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={e => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                </div>

                {/* Contact Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.contact_email}
                    onChange={e => setFormData({ ...formData, contact_email: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                </div>

                {/* Notes */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Internal Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={e => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Any internal notes or special arrangements"
                  />
                </div>
              </div>

              {/* Price Calculation */}
              <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-500/30 rounded-xl p-6">
                <h3 className="text-xl font-bold text-yellow-400 mb-4">Pricing Calculation</h3>
                {selectedPlan ? (
                  <div className="space-y-2 text-gray-300">
                    <p>
                      <strong>Plan:</strong> {selectedPlan.plan_name}
                    </p>
                    <p>
                      <strong>Base Rate:</strong> ${selectedPlan.base_price_per_day}/day
                    </p>
                    <p>
                      <strong>Duration:</strong> {formData.duration_days} days
                    </p>
                    {formData.duration_days >= 7 && (
                      <p className="text-aurora-green">
                        <strong>Volume Discount Applied:</strong>{' '}
                        {formData.duration_days >= 90
                          ? selectedPlan.volume_discount_90days * 100
                          : formData.duration_days >= 30
                            ? selectedPlan.volume_discount_30days * 100
                            : selectedPlan.volume_discount_7days * 100}
                        %
                      </p>
                    )}
                    <div className="pt-4 border-t border-yellow-500/30">
                      <p className="text-2xl font-bold text-yellow-300">
                        Total Price: ${calculatedPrice.toFixed(2)} CAD
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-400">Select position and plan type to see pricing</p>
                )}
              </div>

              {/* Submit Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
                >
                  {editingId ? 'Update Sponsor' : 'Create Sponsor'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filters */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-6 mb-8">
          <div className="grid md:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <input
                type="text"
                placeholder="Search sponsors..."
                value={filters.search}
                onChange={e => setFilters({ ...filters, search: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              />
            </div>

            {/* Position Filter */}
            <div>
              <select
                value={filters.position}
                onChange={e => setFilters({ ...filters, position: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All Positions</option>
                <option value="home_top">Home - Top</option>
                <option value="home_middle">Home - Middle</option>
                <option value="home_bottom">Home - Bottom</option>
                <option value="visiting">Visiting</option>
                <option value="living">Living</option>
                <option value="moving">Moving</option>
              </select>
            </div>

            {/* Payment Status Filter */}
            <div>
              <select
                value={filters.paymentStatus}
                onChange={e => setFilters({ ...filters, paymentStatus: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All Payment Status</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Active Status Filter */}
            <div>
              <select
                value={filters.activeStatus}
                onChange={e => setFilters({ ...filters, activeStatus: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
              >
                <option value="all">All Status</option>
                <option value="active">Active Only</option>
                <option value="inactive">Inactive Only</option>
              </select>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedSponsors.length > 0 && (
          <div className="bg-aurora-blue/10 border border-aurora-blue/30 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="text-white font-semibold">
              {selectedSponsors.length} sponsor(s) selected
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => bulkUpdatePaymentStatus('paid')}
                className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 text-sm font-semibold"
              >
                Mark as Paid
              </button>
              <button
                onClick={() => bulkUpdatePaymentStatus('pending')}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 text-sm font-semibold"
              >
                Mark as Pending
              </button>
              <button
                onClick={() => bulkToggleActive(true)}
                className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 text-sm font-semibold"
              >
                Activate
              </button>
              <button
                onClick={() => bulkToggleActive(false)}
                className="px-4 py-2 bg-gray-500/20 text-gray-400 rounded-lg hover:bg-gray-500/30 text-sm font-semibold"
              >
                Deactivate
              </button>
              <button
                onClick={() => setSelectedSponsors([])}
                className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 text-sm font-semibold"
              >
                Clear Selection
              </button>
            </div>
          </div>
        )}

        {/* Sponsors List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-white">Sponsors</h2>
            {paginatedSponsors.length > 0 && (
              <label className="flex items-center gap-2 text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={
                    selectedSponsors.length === paginatedSponsors.length &&
                    paginatedSponsors.length > 0
                  }
                  onChange={toggleSelectAll}
                  className="w-4 h-4"
                />
                Select All
              </label>
            )}
          </div>

          <div className="space-y-4">
            {paginatedSponsors.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                {sponsors.length === 0
                  ? 'No sponsors yet. Add your first premium sponsor above!'
                  : 'No sponsors match your filters.'}
              </p>
            ) : (
              paginatedSponsors.map(sponsor => (
                <div
                  key={sponsor.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-aurora-blue/50 transition-all"
                >
                  <div className="flex gap-4">
                    {/* Checkbox */}
                    <div className="flex items-start pt-1">
                      <input
                        type="checkbox"
                        checked={selectedSponsors.includes(sponsor.id)}
                        onChange={() => toggleSelectSponsor(sponsor.id)}
                        className="w-4 h-4"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-yellow-400">{sponsor.name}</h3>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sponsor.is_active
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-gray-500/20 text-gray-400'
                          }`}
                        >
                          {sponsor.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            sponsor.payment_status === 'paid'
                              ? 'bg-green-500/20 text-green-400'
                              : sponsor.payment_status === 'pending'
                                ? 'bg-yellow-500/20 text-yellow-400'
                                : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {sponsor.payment_status}
                        </span>
                      </div>

                      {sponsor.tagline && (
                        <p className="text-gray-400 italic mb-2">{sponsor.tagline}</p>
                      )}

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400 mb-3">
                        <div>
                          <span className="text-gray-500">Position:</span>{' '}
                          {sponsor.position.replace('_', ' ')}
                        </div>
                        <div>
                          <span className="text-gray-500">Plan:</span> {sponsor.plan_type}
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span> ${sponsor.total_price}
                        </div>
                        <div>
                          <span className="text-gray-500">Start:</span>{' '}
                          {new Date(sponsor.start_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-500">End:</span>{' '}
                          {new Date(sponsor.end_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-500">Duration:</span> {sponsor.duration_days}{' '}
                          days
                        </div>
                      </div>

                      {sponsor.link && (
                        <div className="mb-2">
                          <a
                            href={sponsor.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-aurora-blue hover:text-aurora-green text-sm"
                          >
                            {sponsor.link} →
                          </a>
                        </div>
                      )}

                      {sponsor.contact_name && (
                        <div className="text-sm text-gray-500">
                          Contact: {sponsor.contact_name}{' '}
                          {sponsor.contact_email && `(${sponsor.contact_email})`}
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleEdit(sponsor)}
                        className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg text-sm font-semibold hover:bg-blue-500/30 transition-all"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => toggleSponsorStatus(sponsor.id, sponsor.is_active)}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                          sponsor.is_active
                            ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                            : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        }`}
                      >
                        {sponsor.is_active ? 'Deactivate' : 'Activate'}
                      </button>

                      {/* Payment Status Quick Update */}
                      {sponsor.payment_status === 'pending' && (
                        <button
                          onClick={() => updatePaymentStatus(sponsor.id, 'paid')}
                          className="px-4 py-2 bg-green-500/20 text-green-400 rounded-lg text-sm font-semibold hover:bg-green-500/30"
                        >
                          Mark Paid
                        </button>
                      )}

                      <button
                        onClick={() => deleteSponsor(sponsor.id)}
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
    </div>
  );
}
