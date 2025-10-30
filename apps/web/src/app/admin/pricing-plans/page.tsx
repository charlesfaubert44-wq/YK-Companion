'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';

interface PricingPlan {
  id: string;
  plan_name: string;
  plan_type: string;
  position: string;
  base_price_per_day: number;
  min_duration_days: number;
  max_duration_days: number;
  position_multiplier: number;
  volume_discount_7days: number;
  volume_discount_30days: number;
  volume_discount_90days: number;
  is_active: boolean;
  description?: string;
}

export default function AdminPricingPlansPage() {
  const supabase = createClient();
  const [plans, setPlans] = useState<PricingPlan[]>([]);
  const [showNewPlanForm, setShowNewPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlan | null>(null);

  const [formData, setFormData] = useState({
    plan_name: '',
    plan_type: 'basic',
    position: 'home_top',
    base_price_per_day: 10.0,
    min_duration_days: 7,
    max_duration_days: 365,
    position_multiplier: 1.0,
    volume_discount_7days: 0.05,
    volume_discount_30days: 0.15,
    volume_discount_90days: 0.25,
    description: '',
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    const { data, error } = await supabase
      .from('premium_pricing_plans')
      .select('*')
      .order('position', { ascending: true });

    if (data && !error) {
      setPlans(data);
    }
  };

  const resetForm = () => {
    setFormData({
      plan_name: '',
      plan_type: 'basic',
      position: 'home_top',
      base_price_per_day: 10.0,
      min_duration_days: 7,
      max_duration_days: 365,
      position_multiplier: 1.0,
      volume_discount_7days: 0.05,
      volume_discount_30days: 0.15,
      volume_discount_90days: 0.25,
      description: '',
    });
    setEditingPlan(null);
    setShowNewPlanForm(false);
  };

  const handleEdit = (plan: PricingPlan) => {
    setFormData({
      plan_name: plan.plan_name,
      plan_type: plan.plan_type,
      position: plan.position,
      base_price_per_day: Number(plan.base_price_per_day),
      min_duration_days: plan.min_duration_days,
      max_duration_days: plan.max_duration_days,
      position_multiplier: Number(plan.position_multiplier),
      volume_discount_7days: Number(plan.volume_discount_7days),
      volume_discount_30days: Number(plan.volume_discount_30days),
      volume_discount_90days: Number(plan.volume_discount_90days),
      description: plan.description || '',
    });
    setEditingPlan(plan);
    setShowNewPlanForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPlan) {
      // Update existing plan
      const { error } = await supabase
        .from('premium_pricing_plans')
        .update(formData)
        .eq('id', editingPlan.id);

      if (!error) {
        resetForm();
        fetchPlans();
        alert('Pricing plan updated successfully!');
      } else {
        alert('Error updating plan: ' + error.message);
      }
    } else {
      // Create new plan
      const { error } = await supabase
        .from('premium_pricing_plans')
        .insert([{ ...formData, is_active: true }]);

      if (!error) {
        resetForm();
        fetchPlans();
        alert('Pricing plan created successfully!');
      } else {
        alert('Error creating plan: ' + error.message);
      }
    }
  };

  const togglePlanStatus = async (id: string, currentStatus: boolean) => {
    const { error } = await supabase
      .from('premium_pricing_plans')
      .update({ is_active: !currentStatus })
      .eq('id', id);

    if (!error) {
      fetchPlans();
    }
  };

  const deletePlan = async (id: string) => {
    if (confirm('Are you sure you want to delete this pricing plan?')) {
      const { error } = await supabase.from('premium_pricing_plans').delete().eq('id', id);

      if (!error) {
        fetchPlans();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Pricing Plans</h1>
            <p className="text-gray-400">Manage premium spotlight pricing structure</p>
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
                resetForm();
                setShowNewPlanForm(!showNewPlanForm);
              }}
              className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              {showNewPlanForm ? 'Cancel' : '+ New Pricing Plan'}
            </button>
          </div>
        </div>

        {/* Pricing Calculator Preview */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-yellow-500/10 to-yellow-600/10 border-2 border-yellow-500/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-yellow-400 mb-4">💡 Pricing Formula</h3>
            <p className="text-gray-300 mb-4">Premium Spotlight pricing is based on:</p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>
                • <strong>Position:</strong> Prime positions (home_top) cost more
              </li>
              <li>
                • <strong>Duration:</strong> Longer = bigger discounts (7+, 30+, 90+ days)
              </li>
              <li>
                • <strong>Plan Type:</strong> Basic, Premium, or Enterprise tiers
              </li>
              <li>
                • <strong>Formula:</strong> (Base Price × Days) × (1 - Volume Discount)
              </li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-aurora-blue/10 to-aurora-purple/10 border-2 border-aurora-blue/30 rounded-2xl p-6">
            <h3 className="text-xl font-bold text-aurora-blue mb-4">📊 Example Pricing</h3>
            <div className="space-y-3 text-sm">
              <div className="bg-gray-900/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">7 days @ $15/day (5% discount)</div>
                <div className="text-white font-bold">= $99.75 CAD</div>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">30 days @ $15/day (15% discount)</div>
                <div className="text-white font-bold">= $382.50 CAD</div>
              </div>
              <div className="bg-gray-900/30 rounded-lg p-3">
                <div className="text-gray-400 mb-1">90 days @ $15/day (25% discount)</div>
                <div className="text-white font-bold">= $1,012.50 CAD</div>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        {showNewPlanForm && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8 mb-8">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingPlan ? 'Edit Pricing Plan' : 'Create New Pricing Plan'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.plan_name}
                    onChange={e => setFormData({ ...formData, plan_name: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Home Top - Premium"
                  />
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

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Position *</label>
                  <select
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  >
                    <option value="home_top">Home - Top</option>
                    <option value="home_middle">Home - Middle</option>
                    <option value="home_bottom">Home - Bottom</option>
                    <option value="visiting">Visiting Section</option>
                    <option value="living">Living Section</option>
                    <option value="moving">Moving Section</option>
                  </select>
                </div>

                {/* Base Price Per Day */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Base Price Per Day (CAD) *
                  </label>
                  <input
                    type="number"
                    required
                    step="0.01"
                    min="0"
                    value={formData.base_price_per_day}
                    onChange={e =>
                      setFormData({ ...formData, base_price_per_day: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                </div>

                {/* Min Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Minimum Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.min_duration_days}
                    onChange={e =>
                      setFormData({ ...formData, min_duration_days: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                </div>

                {/* Max Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Maximum Duration (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.max_duration_days}
                    onChange={e =>
                      setFormData({ ...formData, max_duration_days: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                </div>

                {/* Position Multiplier */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Position Multiplier
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="10"
                    value={formData.position_multiplier}
                    onChange={e =>
                      setFormData({ ...formData, position_multiplier: parseFloat(e.target.value) })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Higher = more expensive position</p>
                </div>

                {/* 7 Day Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    7+ Days Discount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.volume_discount_7days}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        volume_discount_7days: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.volume_discount_7days * 100).toFixed(0)}% discount
                  </p>
                </div>

                {/* 30 Day Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    30+ Days Discount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.volume_discount_30days}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        volume_discount_30days: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.volume_discount_30days * 100).toFixed(0)}% discount
                  </p>
                </div>

                {/* 90 Day Discount */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    90+ Days Discount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="1"
                    value={formData.volume_discount_90days}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        volume_discount_90days: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {(formData.volume_discount_90days * 100).toFixed(0)}% discount
                  </p>
                </div>

                {/* Description */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-gray-900/50 border border-gray-600 rounded-lg text-white focus:border-aurora-blue focus:outline-none"
                    placeholder="Brief description of this pricing plan"
                  />
                </div>
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
                  {editingPlan ? 'Update Plan' : 'Create Plan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Plans List */}
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700/50 p-8">
          <h2 className="text-2xl font-bold text-white mb-6">Current Pricing Plans</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map(plan => (
              <div
                key={plan.id}
                className={`bg-gray-900/50 border-2 rounded-xl p-6 transition-all ${
                  plan.is_active
                    ? 'border-aurora-blue/30 hover:border-aurora-blue/60'
                    : 'border-gray-700/30'
                }`}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-white mb-1">{plan.plan_name}</h3>
                    <div className="flex gap-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          plan.is_active
                            ? 'bg-green-500/20 text-green-400'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}
                      >
                        {plan.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="px-2 py-1 bg-aurora-blue/20 text-aurora-blue rounded-full text-xs font-semibold">
                        {plan.plan_type}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Position:</span>
                    <span className="text-white">{plan.position}</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Base Rate:</span>
                    <span className="text-aurora-green font-semibold">
                      ${plan.base_price_per_day}/day
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>7 Days:</span>
                    <span className="text-white">
                      {(plan.volume_discount_7days * 100).toFixed(0)}% off
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>30 Days:</span>
                    <span className="text-white">
                      {(plan.volume_discount_30days * 100).toFixed(0)}% off
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>90 Days:</span>
                    <span className="text-white">
                      {(plan.volume_discount_90days * 100).toFixed(0)}% off
                    </span>
                  </div>
                </div>

                {plan.description && (
                  <p className="text-xs text-gray-500 mb-4 italic">{plan.description}</p>
                )}

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(plan)}
                    className="flex-1 px-3 py-2 bg-aurora-blue/20 text-aurora-blue rounded-lg text-sm font-semibold hover:bg-aurora-blue/30 transition-all"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => togglePlanStatus(plan.id, plan.is_active)}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                      plan.is_active
                        ? 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30'
                        : 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                    }`}
                  >
                    {plan.is_active ? 'Disable' : 'Enable'}
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/30 transition-all"
                  >
                    Del
                  </button>
                </div>
              </div>
            ))}
          </div>

          {plans.length === 0 && (
            <p className="text-gray-400 text-center py-8">
              No pricing plans yet. Create your first one above!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
