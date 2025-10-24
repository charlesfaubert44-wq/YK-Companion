'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAdminGuard } from '@/hooks/useAdminGuard';
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
  total_price: number;
  payment_status: string;
  contact_email?: string;
  contact_name?: string;
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
  const { loading: authLoading, isAdmin } = useAdminGuard();
  const supabase = createClient();
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [pricingPlans, setPricingPlans] = useState<PricingPlan[]>([]);
  const [showNewSponsorForm, setShowNewSponsorForm] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [calculatedPrice, setCalculatedPrice] = useState(0);

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
    notes: ''
  });

  useEffect(() => {
    fetchSponsors();
    fetchPricingPlans();
  }, []);

  useEffect(() => {
    calculatePrice();
  }, [formData.position, formData.plan_type, formData.duration_days, pricingPlans]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const endDate = new Date(formData.start_date);
    endDate.setDate(endDate.getDate() + formData.duration_days);

    const { data, error } = await supabase
      .from('premium_sponsors')
      .insert([{
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
        is_active: true,
        payment_status: 'pending'
      }])
      .select();

    if (!error) {
      setShowNewSponsorForm(false);
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
        notes: ''
      });
      fetchSponsors();
      alert('Sponsor added successfully!');
    } else {
      alert('Error adding sponsor: ' + error.message);
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

  const deleteSponsor = async (id: string) => {
    if (confirm('Are you sure you want to delete this sponsor?')) {
      const { error } = await supabase
        .from('premium_sponsors')
        .delete()
        .eq('id', id);

      if (!error) {
        fetchSponsors();
      }
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
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Premium Sponsors</h1>
            <p className="text-gray-400">Manage premium spotlight placements</p>
          </div>
          <div className="flex gap-4">
            <Link href="/admin" className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600">
              ← Back to Admin
            </Link>
            <button
              onClick={() => setShowNewSponsorForm(!showNewSponsorForm)}
              className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              {showNewSponsorForm ? 'Cancel' : '+ New Sponsor'}
            </button>
          </div>
        </div>

        {/* New Sponsor Form */}
        {showNewSponsorForm && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">Add New Premium Sponsor</h2>

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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Northern Lights Tours Inc."
                  />
                </div>

                {/* Tagline */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Experience the magic of the North"
                  />
                </div>

                {/* Link */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Website Link
                  </label>
                  <input
                    type="url"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="https://example.com"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Position *
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, duration_days: parseInt(e.target.value) })}
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
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                </div>

                {/* Contact Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
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
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
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
                    <p><strong>Plan:</strong> {selectedPlan.plan_name}</p>
                    <p><strong>Base Rate:</strong> ${selectedPlan.base_price_per_day}/day</p>
                    <p><strong>Duration:</strong> {formData.duration_days} days</p>
                    {formData.duration_days >= 7 && (
                      <p className="text-aurora-green">
                        <strong>Volume Discount Applied:</strong> {
                          formData.duration_days >= 90 ? selectedPlan.volume_discount_90days * 100 :
                          formData.duration_days >= 30 ? selectedPlan.volume_discount_30days * 100 :
                          selectedPlan.volume_discount_7days * 100
                        }%
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

              {/* Submit Button */}
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowNewSponsorForm(false)}
                  className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
                >
                  Create Sponsor Listing
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Sponsors List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Existing Sponsors</h2>

          <div className="space-y-4">
            {sponsors.length === 0 ? (
              <p className="text-gray-400 text-center py-8">No sponsors yet. Add your first premium sponsor above!</p>
            ) : (
              sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="bg-gray-900/50 border border-gray-700 rounded-xl p-6 hover:border-aurora-blue/50 transition-all"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold text-yellow-400">{sponsor.name}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sponsor.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {sponsor.is_active ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          sponsor.payment_status === 'paid' ? 'bg-green-500/20 text-green-400' :
                          sponsor.payment_status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {sponsor.payment_status}
                        </span>
                      </div>

                      {sponsor.tagline && (
                        <p className="text-gray-400 italic mb-2">{sponsor.tagline}</p>
                      )}

                      <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-400">
                        <div>
                          <span className="text-gray-500">Position:</span> {sponsor.position}
                        </div>
                        <div>
                          <span className="text-gray-500">Plan:</span> {sponsor.plan_type}
                        </div>
                        <div>
                          <span className="text-gray-500">Price:</span> ${sponsor.total_price}
                        </div>
                        <div>
                          <span className="text-gray-500">Start:</span> {new Date(sponsor.start_date).toLocaleDateString()}
                        </div>
                        <div>
                          <span className="text-gray-500">End:</span> {new Date(sponsor.end_date).toLocaleDateString()}
                        </div>
                        {sponsor.link && (
                          <div>
                            <a href={sponsor.link} target="_blank" rel="noopener noreferrer" className="text-aurora-blue hover:text-aurora-green">
                              View Website →
                            </a>
                          </div>
                        )}
                      </div>

                      {sponsor.contact_name && (
                        <div className="mt-2 text-sm text-gray-500">
                          Contact: {sponsor.contact_name} {sponsor.contact_email && `(${sponsor.contact_email})`}
                        </div>
                      )}
                    </div>

                    <div className="flex gap-2">
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
        </div>
      </div>
    </div>
  );
}
