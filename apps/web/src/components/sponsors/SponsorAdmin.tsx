'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Sponsor {
  id?: string;
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
}

interface PricingPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  position: string;
  base_price_per_day: number;
  min_duration_days: number;
  max_duration_days: number;
  description: string;
}

export default function SponsorAdmin() {
  const { user } = useAuth();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSponsor, setEditingSponsor] = useState<Sponsor | null>(null);
  const supabase = createClient();

  const [formData, setFormData] = useState<Sponsor>({
    name: '',
    tagline: '',
    link: '',
    position: 'home_top',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    is_active: true,
    plan_type: 'basic',
    duration_days: 30,
    total_price: 0,
    payment_status: 'pending',
    contact_email: '',
    contact_name: '',
    notes: ''
  });

  useEffect(() => {
    if (user) {
      fetchSponsors();
      fetchPricingPlans();
    }
  }, [user]);

  useEffect(() => {
    calculatePrice();
  }, [formData.plan_type, formData.position, formData.duration_days]);

  const fetchSponsors = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_sponsors')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && !error) {
        setSponsors(data);
      }
    } catch (err) {
      console.error('Error fetching sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPricingPlans = async () => {
    try {
      const { data, error } = await supabase
        .from('premium_pricing_plans')
        .select('*')
        .eq('is_active', true)
        .order('base_price_per_day', { ascending: false });

      if (data && !error) {
        setPricingPlans(data);
      }
    } catch (err) {
      console.error('Error fetching pricing plans:', err);
    }
  };

  const calculatePrice = () => {
    const plan = pricingPlans.find(
      p => p.plan_type === formData.plan_type && p.position === formData.position
    );

    if (plan) {
      const basePrice = plan.base_price_per_day * formData.duration_days;
      setFormData(prev => ({ ...prev, total_price: basePrice }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingSponsor?.id) {
        const { error } = await supabase
          .from('premium_sponsors')
          .update(formData)
          .eq('id', editingSponsor.id);

        if (error) throw error;
        alert('Sponsor updated successfully!');
      } else {
        const { error } = await supabase
          .from('premium_sponsors')
          .insert([formData]);

        if (error) throw error;
        alert('Sponsor created successfully!');
      }

      setShowForm(false);
      setEditingSponsor(null);
      resetForm();
      fetchSponsors();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sponsor?')) return;

    try {
      const { error } = await supabase
        .from('premium_sponsors')
        .delete()
        .eq('id', id);

      if (error) throw error;
      alert('Sponsor deleted successfully!');
      fetchSponsors();
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleEdit = (sponsor: Sponsor) => {
    setEditingSponsor(sponsor);
    setFormData(sponsor);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      tagline: '',
      link: '',
      position: 'home_top',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      is_active: true,
      plan_type: 'basic',
      duration_days: 30,
      total_price: 0,
      payment_status: 'pending',
      contact_email: '',
      contact_name: '',
      notes: ''
    });
  };

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Please sign in to access the admin panel.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-aurora-blue"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Sponsor Management</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingSponsor(null);
            resetForm();
          }}
          className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
        >
          {showForm ? 'Cancel' : 'Add New Sponsor'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            {editingSponsor ? 'Edit Sponsor' : 'Add New Sponsor'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Website URL
                </label>
                <input
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                  placeholder="https://example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Position *
                </label>
                <select
                  required
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                >
                  <option value="home_top">Home - Top</option>
                  <option value="home_middle">Home - Middle</option>
                  <option value="home_bottom">Home - Bottom</option>
                  <option value="visiting">Visiting Section</option>
                  <option value="living">Living Section</option>
                  <option value="moving">Moving Section</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Plan Type *
                </label>
                <select
                  required
                  value={formData.plan_type}
                  onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                >
                  <option value="basic">Basic</option>
                  <option value="premium">Premium</option>
                  <option value="enterprise">Enterprise</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Duration (days) *
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={formData.duration_days}
                  onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Start Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  End Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Name
                </label>
                <input
                  type="text"
                  value={formData.contact_name}
                  onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Payment Status
                </label>
                <select
                  value={formData.payment_status}
                  onChange={(e) => setFormData({ ...formData, payment_status: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="refunded">Refunded</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Total Price (CAD)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.total_price}
                  onChange={(e) => setFormData({ ...formData, total_price: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-blue"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                className="w-4 h-4 text-aurora-blue bg-gray-900 border-gray-700 rounded focus:ring-aurora-blue"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-300">
                Active
              </label>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              {editingSponsor ? 'Update Sponsor' : 'Create Sponsor'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Business
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Dates
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Price
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {sponsors.map((sponsor) => (
                <tr key={sponsor.id} className="hover:bg-gray-900/30">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-white">{sponsor.name}</div>
                    {sponsor.tagline && (
                      <div className="text-xs text-gray-400">{sponsor.tagline}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    {sponsor.position}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      sponsor.plan_type === 'enterprise' ? 'bg-yellow-500/20 text-yellow-400' :
                      sponsor.plan_type === 'premium' ? 'bg-aurora-purple/20 text-aurora-purple' :
                      'bg-aurora-blue/20 text-aurora-blue'
                    }`}>
                      {sponsor.plan_type}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    <div>{new Date(sponsor.start_date).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">to {new Date(sponsor.end_date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                      sponsor.is_active ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {sponsor.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                    ${sponsor.total_price.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleEdit(sponsor)}
                      className="text-aurora-blue hover:text-aurora-green mr-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => sponsor.id && handleDelete(sponsor.id)}
                      className="text-red-400 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
