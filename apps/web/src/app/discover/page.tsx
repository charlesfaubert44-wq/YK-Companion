'use client';

import { useState } from 'react';
import SwipeableCards, { CardData } from '@/components/SwipeableCards';
import { useLanguage } from '@/contexts/LanguageContext';
import { useSwipePageNavigation } from '@/hooks/useSwipeNavigation';
import Link from 'next/link';

const activityCards: CardData[] = [
  {
    id: '1',
    title: 'Aurora Viewing',
    description: 'Experience the magical Northern Lights dancing across the night sky. Best viewing from September to April.',
    emoji: '🌌',
    category: 'Winter Activity',
    tags: ['Night', 'Photography', 'Nature'],
    metadata: { season: 'winter', difficulty: 'easy' }
  },
  {
    id: '2',
    title: 'Dog Sledding',
    description: 'Mush through pristine snow-covered trails with a team of energetic sled dogs. An authentic northern experience!',
    emoji: '🐕',
    category: 'Winter Activity',
    tags: ['Adventure', 'Outdoors', 'Animals'],
    metadata: { season: 'winter', difficulty: 'moderate' }
  },
  {
    id: '3',
    title: 'Ice Fishing',
    description: 'Try your luck catching fish through holes in the frozen lake. A peaceful winter tradition.',
    emoji: '🎣',
    category: 'Winter Activity',
    tags: ['Fishing', 'Relaxing', 'Traditional'],
    metadata: { season: 'winter', difficulty: 'easy' }
  },
  {
    id: '4',
    title: 'Snowmobiling',
    description: 'Speed across frozen lakes and backcountry trails on a powerful snowmobile.',
    emoji: '🛷',
    category: 'Winter Activity',
    tags: ['Adventure', 'Speed', 'Outdoors'],
    metadata: { season: 'winter', difficulty: 'moderate' }
  },
  {
    id: '5',
    title: 'Kayaking',
    description: 'Paddle through crystal-clear northern waters under the midnight sun.',
    emoji: '🚣',
    category: 'Summer Activity',
    tags: ['Water', 'Exercise', 'Scenic'],
    metadata: { season: 'summer', difficulty: 'moderate' }
  },
  {
    id: '6',
    title: 'Hiking',
    description: 'Explore stunning trails with panoramic views of lakes, forests, and tundra.',
    emoji: '🥾',
    category: 'Summer Activity',
    tags: ['Exercise', 'Nature', 'Photography'],
    metadata: { season: 'summer', difficulty: 'varies' }
  },
  {
    id: '7',
    title: 'Wildlife Viewing',
    description: 'Spot caribou, bison, foxes, and birds in their natural habitat.',
    emoji: '🦌',
    category: 'All Season',
    tags: ['Nature', 'Photography', 'Educational'],
    metadata: { season: 'all', difficulty: 'easy' }
  },
  {
    id: '8',
    title: 'Indigenous Culture',
    description: 'Learn about the rich history and traditions of the Yellowknives Dene First Nation.',
    emoji: '🎨',
    category: 'All Season',
    tags: ['Cultural', 'Educational', 'Indoor'],
    metadata: { season: 'all', difficulty: 'easy' }
  },
];

export default function DiscoverPage() {
  const { t } = useLanguage();
  const [savedCards, setSavedCards] = useState<CardData[]>([]);
  const [skippedCards, setSkippedCards] = useState<CardData[]>([]);

  // Enable swipe gestures for page navigation
  useSwipePageNavigation({
    left: '/living',
    right: '/visiting',
  });

  const handleSwipeRight = (card: CardData) => {
    setSavedCards([...savedCards, card]);
    console.log('Saved:', card.title);
  };

  const handleSwipeLeft = (card: CardData) => {
    setSkippedCards([...skippedCards, card]);
    console.log('Skipped:', card.title);
  };

  const handleCardsExhausted = () => {
    console.log('All cards viewed!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10 z-30 safe-top">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-gray-400 hover:text-white transition-colors">
              ← Back
            </Link>
            <h1 className="text-xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-white bg-clip-text text-transparent">
              Discover Activities
            </h1>
            <div className="w-16" /> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Instructions */}
      <div className="pt-24 pb-6 px-4 text-center">
        <p className="text-gray-300 text-sm mb-2">
          Swipe right to save • Swipe left to skip
        </p>
        <div className="flex justify-center gap-6 text-xs text-gray-500">
          <span>💚 Saved: {savedCards.length}</span>
          <span>⏭️ Skipped: {skippedCards.length}</span>
        </div>
      </div>

      {/* Swipeable Cards */}
      <div className="px-4 pb-32">
        <SwipeableCards
          cards={activityCards}
          onSwipeRight={handleSwipeRight}
          onSwipeLeft={handleSwipeLeft}
          onCardExhausted={handleCardsExhausted}
        />
      </div>

      {/* Saved Activities Section */}
      {savedCards.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-dark-900 via-dark-900 to-transparent p-4 safe-bottom">
          <Link
            href="#saved"
            className="block w-full bg-gradient-to-r from-aurora-green to-aurora-blue text-white text-center py-3 rounded-lg font-semibold hover:shadow-aurora transition-all"
          >
            View {savedCards.length} Saved {savedCards.length === 1 ? 'Activity' : 'Activities'}
          </Link>
        </div>
      )}

      {/* Info Panel */}
      <div className="px-4 pb-8">
        <div className="max-w-md mx-auto bg-gray-800/30 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3">How it works</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li className="flex items-start gap-2">
              <span className="text-aurora-green mt-0.5">→</span>
              <span>Swipe right or tap ❤️ to save activities to your trip plan</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-red-400 mt-0.5">←</span>
              <span>Swipe left or tap ✕ to skip activities you're not interested in</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-aurora-blue mt-0.5">•</span>
              <span>Use the action buttons at the bottom of each card</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-aurora-purple mt-0.5">•</span>
              <span>Your saved activities will be added to your personalized itinerary</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile UX Features Showcase */}
      <div className="px-4 pb-12">
        <div className="max-w-md mx-auto bg-gradient-to-br from-aurora-green/10 via-aurora-blue/10 to-aurora-purple/10 backdrop-blur-lg border border-aurora-green/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <span>📱</span> Mobile-First Features
          </h3>
          <div className="space-y-3 text-sm text-gray-300">
            <div className="flex items-center gap-3">
              <span className="text-2xl">👆</span>
              <div>
                <p className="font-semibold text-white">Swipe Gestures</p>
                <p className="text-xs text-gray-400">Natural, intuitive card navigation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-semibold text-white">One-Handed Design</p>
                <p className="text-xs text-gray-400">Easy thumb-zone interactions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚡</span>
              <div>
                <p className="font-semibold text-white">PWA Support</p>
                <p className="text-xs text-gray-400">Install as an app for offline use</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎨</span>
              <div>
                <p className="font-semibold text-white">Contextual Actions</p>
                <p className="text-xs text-gray-400">FAB adapts to your current page</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
