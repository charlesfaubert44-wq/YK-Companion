'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { UserType } from '@/types/database.types';

interface UserTypeSelectorProps {
  isOpen: boolean;
  onComplete: () => void;
}

export default function UserTypeSelector({ isOpen, onComplete }: UserTypeSelectorProps) {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();

  if (!isOpen) return null;

  const handleSelect = async () => {
    if (!selectedType) return;

    setLoading(true);
    try {
      await updateProfile({ user_type: selectedType });
      onComplete();
    } catch (error) {
      console.error('Error updating user type:', error);
      alert('Failed to save selection. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const userTypes = [
    {
      type: 'visiting' as UserType,
      icon: '🧳',
      title: 'Visiting',
      description: 'Planning a trip to Yellowknife',
      benefits: ['Trip planning tools', 'Aurora forecasts', 'Activity recommendations'],
    },
    {
      type: 'living' as UserType,
      icon: '🏠',
      title: 'Living Here',
      description: 'Resident exploring the city',
      benefits: ['Local events', 'Hidden gems', 'Community guides'],
    },
    {
      type: 'moving' as UserType,
      icon: '📦',
      title: 'Moving Here',
      description: 'Relocating to Yellowknife',
      benefits: ['Housing search', 'Job resources', 'Relocation checklist'],
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-northern-midnight to-dark-900 border border-aurora-green/20 rounded-3xl p-8 max-w-4xl w-full shadow-2xl">
        {/* Title */}
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-white mb-3">
            Welcome to YK Buddy!
          </h2>
          <p className="text-xl text-gray-300">
            Let's personalize your experience
          </p>
        </div>

        {/* User type cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {userTypes.map(({ type, icon, title, description, benefits }) => (
            <button
              key={type}
              onClick={() => setSelectedType(type)}
              className={`p-6 rounded-2xl border-2 transition-all text-left ${
                selectedType === type
                  ? 'border-aurora-green bg-aurora-green/10 shadow-aurora scale-105'
                  : 'border-gray-700 bg-dark-800 hover:border-aurora-blue/50 hover:scale-102'
              }`}
            >
              <div className="text-5xl mb-3">{icon}</div>
              <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
              <p className="text-gray-400 mb-4 text-sm">{description}</p>
              <ul className="space-y-2">
                {benefits.map((benefit, i) => (
                  <li key={i} className="text-sm text-gray-300 flex items-center">
                    <span className="text-aurora-green mr-2">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            </button>
          ))}
        </div>

        {/* Continue button */}
        <button
          onClick={handleSelect}
          disabled={!selectedType || loading}
          className="w-full bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold py-4 rounded-lg hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed text-lg"
        >
          {loading ? 'Saving...' : 'Continue'}
        </button>

        <p className="text-center text-sm text-gray-500 mt-4">
          You can change this later in your profile settings
        </p>
      </div>
    </div>
  );
}
