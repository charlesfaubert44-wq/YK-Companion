'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Link from 'next/link';
import Carousel, { CarouselCard } from '../Carousel';

interface Sponsor {
  id: string;
  name: string;
  tagline?: string;
  link?: string;
  position: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
  plan_type: 'basic' | 'premium' | 'enterprise';
}

interface PremiumSponsorsCarouselProps {
  position?: string;
  showAll?: boolean;
  maxSponsors?: number;
  showPlaceholder?: boolean;
  autoplay?: boolean;
  autoplayInterval?: number;
}

export default function PremiumSponsorsCarousel({
  position,
  showAll = false,
  maxSponsors = 6,
  showPlaceholder = true,
  autoplay = true,
  autoplayInterval = 5000,
}: PremiumSponsorsCarouselProps) {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    fetchSponsors();
  }, [position, showAll]);

  const fetchSponsors = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString();

      let query = supabase
        .from('premium_sponsors')
        .select('*')
        .eq('is_active', true)
        .lte('start_date', today)
        .gte('end_date', today)
        .order('created_at', { ascending: false });

      if (position && !showAll) {
        query = query.eq('position', position);
      }

      if (maxSponsors > 0) {
        query = query.limit(maxSponsors);
      }

      const { data, error } = await query;

      if (data && !error) {
        setSponsors(data);
      } else if (error) {
        console.error('Error fetching sponsors:', error);
      }
    } catch (err) {
      console.error('Error fetching sponsors:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPlanBorderColor = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return 'border-yellow-500/60 hover:border-yellow-400';
      case 'premium':
        return 'border-aurora-purple/50 hover:border-aurora-purple';
      case 'basic':
      default:
        return 'border-aurora-blue/40 hover:border-aurora-blue';
    }
  };

  const getPlanGradient = (planType: string) => {
    switch (planType) {
      case 'enterprise':
        return 'from-yellow-500/20 to-yellow-600/5';
      case 'premium':
        return 'from-aurora-purple/20 to-aurora-purple/5';
      case 'basic':
      default:
        return 'from-aurora-blue/20 to-aurora-blue/5';
    }
  };

  if (loading) {
    return (
      <div className="py-8">
        {/* Reserve space while loading to prevent layout shift */}
      </div>
    );
  }

  if (sponsors.length === 0 && showPlaceholder) {
    return <SponsorPlaceholder />;
  }

  if (sponsors.length === 0) {
    return null;
  }

  const renderSponsor = (sponsor: Sponsor) => {
    const content = (
      <div className={`relative group bg-gradient-to-br ${getPlanGradient(sponsor.plan_type)} backdrop-blur-sm rounded-xl border-2 ${getPlanBorderColor(sponsor.plan_type)} transition-all overflow-hidden h-full ${sponsor.link ? 'cursor-pointer' : ''}`}>
        {sponsor.plan_type === 'enterprise' && (
          <div className="absolute inset-0 overflow-hidden rounded-xl opacity-40">
            <div className="aurora-wave aurora-green"></div>
            <div className="aurora-wave aurora-blue"></div>
            <div className="aurora-wave aurora-purple"></div>
          </div>
        )}

        <div className="relative z-10 p-6 h-full flex flex-col">
          <div className="flex justify-between items-start mb-3">
            <span className={`text-xs uppercase tracking-widest font-semibold ${
              sponsor.plan_type === 'enterprise' ? 'text-yellow-400' :
              sponsor.plan_type === 'premium' ? 'text-aurora-purple' :
              'text-aurora-blue'
            }`}>
              {sponsor.plan_type === 'enterprise' && '✨ '}{sponsor.plan_type}
            </span>
          </div>

          <h3 className={`text-xl md:text-2xl font-bold mb-2 ${
            sponsor.plan_type === 'enterprise'
              ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-400'
              : 'text-white'
          }`}>
            {sponsor.name}
          </h3>

          {sponsor.tagline && (
            <p className="text-sm text-gray-300 italic mb-3 flex-grow">
              {sponsor.tagline}
            </p>
          )}

          {sponsor.link && (
            <div className="text-xs text-aurora-blue group-hover:text-aurora-green transition-colors mt-auto">
              Learn more →
            </div>
          )}
        </div>

        {sponsor.plan_type === 'enterprise' && (
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-400/0 via-yellow-300/20 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
        )}
      </div>
    );

    if (sponsor.link) {
      return (
        <a
          href={sponsor.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block h-full"
        >
          {content}
        </a>
      );
    }

    return <div className="h-full">{content}</div>;
  };

  // Use carousel for mobile, grid for desktop
  return (
    <div className="py-6">
      {/* Mobile: Carousel */}
      <div className="block md:hidden">
        <Carousel
          autoplayInterval={autoplay ? autoplayInterval : 0}
          showDots={true}
          showArrows={false}
          loop={true}
          itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
          gap={16}
          snap={true}
        >
          {sponsors.map((sponsor) => (
            <CarouselCard key={sponsor.id}>
              {renderSponsor(sponsor)}
            </CarouselCard>
          ))}
        </Carousel>
      </div>

      {/* Desktop: Grid */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sponsors.map(renderSponsor)}
      </div>
    </div>
  );
}

function SponsorPlaceholder() {
  return (
    <div className="py-8">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl border-2 border-dashed border-gray-700/50 p-8 text-center">
        <div className="text-4xl mb-4">🏢</div>
        <h3 className="text-xl font-semibold text-gray-400 mb-2">
          Premium Sponsor Space Available
        </h3>
        <p className="text-sm text-gray-500 mb-4 max-w-md mx-auto">
          Showcase your business to thousands of Yellowknife visitors, residents, and newcomers.
        </p>
        <Link href="/sponsor-info">
          <button className="px-6 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm">
            Become a Sponsor
          </button>
        </Link>
      </div>
    </div>
  );
}
