'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Sponsor {
  id: string;
  name: string;
  tagline?: string;
  link?: string;
  position: 'home_top' | 'home_middle' | 'home_bottom' | 'visiting' | 'living' | 'moving';
  start_date: string;
  end_date: string;
  is_active: boolean;
}

interface PremiumSpotlightProps {
  position: 'home_top' | 'home_middle' | 'home_bottom' | 'visiting' | 'living' | 'moving';
}

export default function PremiumSpotlight({ position }: PremiumSpotlightProps) {
  const [sponsor, setSponsor] = useState<Sponsor | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    fetchActiveSponsor();
  }, [position]);

  const fetchActiveSponsor = async () => {
    try {
      const today = new Date().toISOString();

      const { data, error } = await supabase
        .from('premium_sponsors')
        .select('*')
        .eq('position', position)
        .eq('is_active', true)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      if (data && !error) {
        setSponsor(data);
        setTimeout(() => setIsVisible(true), 100);
      }
    } catch (err) {
      console.error('Error fetching sponsor:', err);
    }
  };

  if (!sponsor) return null;

  const content = (
    <div className="relative group">
      {/* Northern Lights Background */}
      <div className="absolute inset-0 overflow-hidden rounded-2xl opacity-60">
        <div className="aurora-wave aurora-green"></div>
        <div className="aurora-wave aurora-blue"></div>
        <div className="aurora-wave aurora-purple"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center py-8 px-6">
        <div className="text-xs uppercase tracking-widest text-aurora-green mb-2 font-semibold animate-pulse">
          ✨ Premium Spotlight ✨
        </div>

        <h2 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400 mb-2 text-center animate-shimmer">
          {sponsor.name}
        </h2>

        {sponsor.tagline && (
          <p className="text-sm text-gray-300 text-center max-w-2xl italic">
            {sponsor.tagline}
          </p>
        )}

        {sponsor.link && (
          <div className="mt-4">
            <div className="text-xs text-aurora-blue hover:text-aurora-green transition-colors">
              Learn more →
            </div>
          </div>
        )}
      </div>

      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/0 via-yellow-300/20 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );

  if (sponsor.link) {
    return (
      <div className={`max-w-4xl mx-auto px-4 py-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-yellow-500/30 hover:border-yellow-400/60 transition-all cursor-pointer overflow-hidden">
            {content}
          </div>
        </a>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto px-4 py-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="relative bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-sm rounded-2xl border-2 border-yellow-500/30 overflow-hidden">
        {content}
      </div>
    </div>
  );
}
