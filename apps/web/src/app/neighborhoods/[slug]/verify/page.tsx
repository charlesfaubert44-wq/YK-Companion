'use client';

import { useParams } from 'next/navigation';
import VerificationForm from '@/components/neighborhoods/VerificationForm';

/**
 * Neighborhood Verification Page
 *
 * Multi-step form for users to verify their residency
 * in a specific neighborhood
 */

// Mock neighborhood data - will be replaced with API call
const NEIGHBORHOODS = {
  'range-lake': { name: 'Range Lake', icon: '🏡' },
  'old-town': { name: 'Old Town', icon: '🏛️' },
  'niven-lake': { name: 'Niven Lake', icon: '🌲' },
  'downtown': { name: 'Downtown', icon: '🏢' },
  'kam-lake': { name: 'Kam Lake', icon: '🏭' },
  'yellowknife-bay': { name: 'Yellowknife Bay', icon: '⚓' },
};

export default function NeighborhoodVerificationPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const neighborhood = NEIGHBORHOODS[slug as keyof typeof NEIGHBORHOODS] || {
    name: 'Unknown Neighborhood',
    icon: '🏘️',
  };

  return (
    <VerificationForm
      neighborhoodName={neighborhood.name}
      neighborhoodIcon={neighborhood.icon}
    />
  );
}
