'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

interface ProfileFormProps {
  userId: string;
  initialData: {
    full_name: string;
    user_type: string;
    address: string;
  };
}

/**
 * ProfileForm Component
 *
 * Form for editing user profile information including name, user type, and address.
 */
export default function ProfileForm({ userId, initialData }: ProfileFormProps) {
  const { updateProfile } = useAuth();
  const [formData, setFormData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await updateProfile({
        full_name: formData.full_name,
        user_type: formData.user_type as 'visiting' | 'living' | 'moving',
        address: formData.address,
      });

      setMessage({
        type: 'success',
        text: 'Profile updated successfully!',
      });

      // Clear success message after 3 seconds
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        type: 'error',
        text: 'Failed to update profile. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg border ${
            message.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-red-500/10 border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Full Name */}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
          Full Name
        </label>
        <input
          type="text"
          id="full_name"
          name="full_name"
          value={formData.full_name}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green focus:ring-2 focus:ring-aurora-green/20 transition"
          placeholder="Your full name"
        />
      </div>

      {/* User Type */}
      <div>
        <label htmlFor="user_type" className="block text-sm font-medium text-gray-300 mb-2">
          I am...
        </label>
        <select
          id="user_type"
          name="user_type"
          value={formData.user_type}
          onChange={handleChange}
          required
          className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-aurora-green focus:ring-2 focus:ring-aurora-green/20 transition"
        >
          <option value="">Select your status</option>
          <option value="visiting">🧭 Visiting - Explorer</option>
          <option value="living">🏔️ Living - Resident</option>
          <option value="moving">🎒 Moving - New Arrival</option>
        </select>
      </div>

      {/* Address */}
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-2">
          Address (Optional)
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className="w-full px-4 py-3 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-aurora-green focus:ring-2 focus:ring-aurora-green/20 transition"
          placeholder="Your address"
        />
      </div>

      {/* Submit Button */}
      <div className="flex gap-4 pt-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
}
