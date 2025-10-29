'use client';

import { useState, useEffect } from 'react';
import { GarageSale, CreateGarageSaleInput, GARAGE_SALE_TAGS } from '@/types/garage-sales.types';

interface AddSaleModalProps {
  sale?: GarageSale | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (saleData: Partial<GarageSale>) => Promise<void>;
}

/**
 * AddSaleModal Component
 * 
 * Modal for adding or editing a garage sale with:
 * - All required and optional fields
 * - Tag selection
 * - Address input (with geocoding support)
 * - Date and time pickers
 * - Cash only / Early birds toggles
 * - Form validation
 * - Loading states
 * 
 * @example
 * ```tsx
 * <AddSaleModal
 *   sale={editingSale}
 *   isOpen={showModal}
 *   onClose={() => setShowModal(false)}
 *   onSave={handleSaveSale}
 * />
 * ```
 */
export default function AddSaleModal({
  sale,
  isOpen,
  onClose,
  onSave,
}: AddSaleModalProps) {
  const [formData, setFormData] = useState<CreateGarageSaleInput>({
    title: '',
    description: '',
    address: '',
    latitude: 62.4540, // Default to Yellowknife
    longitude: -114.3718,
    location_details: '',
    sale_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '17:00',
    tags: [],
    items_description: '',
    cash_only: false,
    early_birds_welcome: false,
  });
  
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Reset form when modal opens/closes or sale changes
  useEffect(() => {
    if (sale) {
      setFormData({
        title: sale.title,
        description: sale.description || '',
        address: sale.address,
        latitude: sale.latitude,
        longitude: sale.longitude,
        location_details: sale.location_details || '',
        sale_date: sale.sale_date,
        start_time: sale.start_time,
        end_time: sale.end_time,
        tags: sale.tags,
        items_description: sale.items_description || '',
        cash_only: sale.cash_only,
        early_birds_welcome: sale.early_birds_welcome,
      });
    } else {
      // Reset to defaults for new sale
      setFormData({
        title: '',
        description: '',
        address: '',
        latitude: 62.4540,
        longitude: -114.3718,
        location_details: '',
        sale_date: new Date().toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '17:00',
        tags: [],
        items_description: '',
        cash_only: false,
        early_birds_welcome: false,
      });
    }
    setErrors({});
  }, [sale, isOpen]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (!formData.sale_date) {
      newErrors.sale_date = 'Date is required';
    } else {
      const saleDate = new Date(formData.sale_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (saleDate < today) {
        newErrors.sale_date = 'Sale date must be today or in the future';
      }
    }

    if (!formData.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!formData.end_time) {
      newErrors.end_time = 'End time is required';
    }

    if (formData.start_time && formData.end_time && formData.start_time >= formData.end_time) {
      newErrors.end_time = 'End time must be after start time';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      const saleData: Partial<GarageSale> = {
        ...formData,
        ...(sale && { id: sale.id }),
      };
      
      await onSave(saleData);
      onClose();
    } catch (error) {
      console.error('Error saving sale:', error);
      setErrors({ submit: 'Failed to save garage sale. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTagToggle = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="w-full max-w-2xl bg-dark-800 rounded-xl border border-gray-700 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {sale ? 'Edit Garage Sale' : 'Add Garage Sale'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-dark-700"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[calc(100vh-12rem)] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Moving Sale - Everything Must Go!"
              className={`w-full px-4 py-2 bg-dark-700 border ${
                errors.title ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none`}
            />
            {errors.title && <p className="mt-1 text-xs text-red-400">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your garage sale..."
              rows={3}
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none resize-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 50 Street, Yellowknife, NT"
              className={`w-full px-4 py-2 bg-dark-700 border ${
                errors.address ? 'border-red-500' : 'border-gray-600'
              } rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none`}
            />
            {errors.address && <p className="mt-1 text-xs text-red-400">{errors.address}</p>}
            <p className="mt-1 text-xs text-gray-500">
              This address will be shown to potential buyers
            </p>
          </div>

          {/* Location Details */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Location Details (Optional)
            </label>
            <input
              type="text"
              value={formData.location_details}
              onChange={(e) => setFormData({ ...formData, location_details: e.target.value })}
              placeholder="e.g., Driveway and garage, side entrance"
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date <span className="text-red-400">*</span>
              </label>
              <input
                type="date"
                required
                value={formData.sale_date}
                onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-2 bg-dark-700 border ${
                  errors.sale_date ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:border-aurora-green focus:outline-none`}
              />
              {errors.sale_date && <p className="mt-1 text-xs text-red-400">{errors.sale_date}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className={`w-full px-4 py-2 bg-dark-700 border ${
                  errors.start_time ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:border-aurora-green focus:outline-none`}
              />
              {errors.start_time && <p className="mt-1 text-xs text-red-400">{errors.start_time}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time <span className="text-red-400">*</span>
              </label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className={`w-full px-4 py-2 bg-dark-700 border ${
                  errors.end_time ? 'border-red-500' : 'border-gray-600'
                } rounded-lg text-white focus:border-aurora-green focus:outline-none`}
              />
              {errors.end_time && <p className="mt-1 text-xs text-red-400">{errors.end_time}</p>}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Item Categories
            </label>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-2 bg-dark-700 rounded-lg border border-gray-600">
              {GARAGE_SALE_TAGS.map(tag => {
                const isSelected = formData.tags.includes(tag);
                return (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagToggle(tag)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all capitalize ${
                      isSelected
                        ? 'bg-aurora-purple text-white'
                        : 'bg-dark-800 text-gray-300 hover:bg-dark-600'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
            {formData.tags.length > 0 && (
              <p className="mt-1 text-xs text-gray-400">
                {formData.tags.length} {formData.tags.length === 1 ? 'category' : 'categories'} selected
              </p>
            )}
          </div>

          {/* Items Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What are you selling?
            </label>
            <textarea
              value={formData.items_description}
              onChange={(e) => setFormData({ ...formData, items_description: e.target.value })}
              placeholder="e.g., Furniture, appliances, tools, winter gear, kids toys..."
              rows={2}
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none resize-none"
            />
          </div>

          {/* Preferences */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Sale Preferences
            </label>
            <label className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors">
              <input
                type="checkbox"
                checked={formData.cash_only}
                onChange={(e) => setFormData({ ...formData, cash_only: e.target.checked })}
                className="w-5 h-5 bg-dark-800 border-gray-600 rounded text-aurora-green focus:ring-aurora-green"
              />
              <div className="flex-1">
                <span className="text-sm text-gray-300 font-medium">💵 Cash Only</span>
                <p className="text-xs text-gray-500">I only accept cash payments</p>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 bg-dark-700 rounded-lg cursor-pointer hover:bg-dark-600 transition-colors">
              <input
                type="checkbox"
                checked={formData.early_birds_welcome}
                onChange={(e) => setFormData({ ...formData, early_birds_welcome: e.target.checked })}
                className="w-5 h-5 bg-dark-800 border-gray-600 rounded text-aurora-green focus:ring-aurora-green"
              />
              <div className="flex-1">
                <span className="text-sm text-gray-300 font-medium">🐦 Early Birds Welcome</span>
                <p className="text-xs text-gray-500">Buyers can arrive before start time</p>
              </div>
            </label>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-sm text-red-400">{errors.submit}</p>
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-700">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="flex-1 px-6 py-3 bg-dark-700 text-white font-semibold rounded-lg hover:bg-dark-600 transition-all disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                sale ? 'Update Sale' : 'Add Sale'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

