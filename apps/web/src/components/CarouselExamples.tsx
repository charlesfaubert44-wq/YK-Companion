'use client';

import Carousel, { CarouselCard } from './Carousel';

/**
 * Example Usage File for Carousel Component
 *
 * This file demonstrates various ways to use the Carousel component
 * Copy and adapt these examples for your use case
 */

// Example 1: Basic Carousel with simple content
export function BasicCarouselExample() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Basic Carousel</h2>
      <Carousel showDots showArrows loop>
        <div className="bg-aurora-green/20 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Slide 1</h3>
          <p>This is a simple slide with content</p>
        </div>
        <div className="bg-aurora-blue/20 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Slide 2</h3>
          <p>Another slide with different content</p>
        </div>
        <div className="bg-aurora-purple/20 rounded-xl p-8 text-white">
          <h3 className="text-xl font-bold mb-2">Slide 3</h3>
          <p>Third slide example</p>
        </div>
      </Carousel>
    </div>
  );
}

// Example 2: Autoplay Carousel
export function AutoplayCarouselExample() {
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Autoplay Carousel (5s interval)</h2>
      <Carousel
        autoplayInterval={5000}
        showDots
        showArrows
        loop
      >
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="bg-gradient-to-br from-aurora-green/20 to-aurora-blue/20 rounded-xl p-12 text-white text-center">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-2xl font-bold">Auto Slide {num}</h3>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

// Example 3: Responsive Items Per View
export function ResponsiveCarouselExample() {
  const items = [
    { id: 1, emoji: '🏔️', title: 'Mountains', color: 'from-blue-500/20 to-blue-600/10' },
    { id: 2, emoji: '🌲', title: 'Forest', color: 'from-green-500/20 to-green-600/10' },
    { id: 3, emoji: '❄️', title: 'Snow', color: 'from-cyan-500/20 to-cyan-600/10' },
    { id: 4, emoji: '🌌', title: 'Aurora', color: 'from-purple-500/20 to-purple-600/10' },
    { id: 5, emoji: '🏡', title: 'Cabin', color: 'from-orange-500/20 to-orange-600/10' },
    { id: 6, emoji: '🛶', title: 'Lake', color: 'from-teal-500/20 to-teal-600/10' },
  ];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">
        Responsive Carousel (1 mobile / 2 tablet / 3 desktop)
      </h2>
      <Carousel
        showDots
        showArrows
        loop
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap={16}
      >
        {items.map((item) => (
          <CarouselCard key={item.id}>
            <div className={`bg-gradient-to-br ${item.color} rounded-xl p-6 text-white text-center h-48 flex flex-col items-center justify-center`}>
              <div className="text-5xl mb-3">{item.emoji}</div>
              <h3 className="text-xl font-bold">{item.title}</h3>
            </div>
          </CarouselCard>
        ))}
      </Carousel>
    </div>
  );
}

// Example 4: Image Carousel
export function ImageCarouselExample() {
  const images = [
    { url: '/images/aurora1.jpg', title: 'Northern Lights 1', description: 'Beautiful aurora borealis' },
    { url: '/images/aurora2.jpg', title: 'Northern Lights 2', description: 'Dancing lights' },
    { url: '/images/aurora3.jpg', title: 'Northern Lights 3', description: 'Arctic sky' },
  ];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Image Carousel</h2>
      <Carousel
        autoplayInterval={4000}
        showDots
        showArrows
        loop
        onSlideChange={(index) => console.log('Slide changed to:', index)}
      >
        {images.map((image, index) => (
          <div key={index} className="relative rounded-xl overflow-hidden bg-dark-800 h-80">
            {/* Placeholder for image - replace with actual <img> or <Image> */}
            <div className="absolute inset-0 bg-gradient-to-br from-aurora-green/30 to-aurora-blue/30 flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">📸</div>
                <h3 className="text-2xl font-bold mb-2">{image.title}</h3>
                <p className="text-gray-300">{image.description}</p>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

// Example 5: Card Carousel with Actions
export function CardCarouselExample() {
  const cards = [
    {
      id: 1,
      title: 'Yellowknife Guide',
      description: 'Everything you need to know about visiting Yellowknife',
      category: 'Travel',
      icon: '✈️',
    },
    {
      id: 2,
      title: 'Aurora Viewing',
      description: 'Best spots and times to see the northern lights',
      category: 'Activities',
      icon: '🌌',
    },
    {
      id: 3,
      title: 'Local Restaurants',
      description: 'Top dining spots in the city',
      category: 'Food',
      icon: '🍽️',
    },
    {
      id: 4,
      title: 'Winter Activities',
      description: 'Things to do in the Arctic winter',
      category: 'Activities',
      icon: '❄️',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Card Carousel with CTAs</h2>
      <Carousel
        showDots
        showArrows
        loop={false}
        itemsPerView={{ mobile: 1, tablet: 2, desktop: 3 }}
        gap={20}
      >
        {cards.map((card) => (
          <CarouselCard key={card.id}>
            <div className="bg-dark-800 rounded-xl border-2 border-aurora-blue/30 hover:border-aurora-blue transition-all p-6 h-full flex flex-col">
              <div className="text-4xl mb-4">{card.icon}</div>
              <span className="text-xs text-aurora-blue uppercase tracking-wider mb-2">
                {card.category}
              </span>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-gray-300 text-sm mb-4 flex-grow">
                {card.description}
              </p>
              <button className="w-full py-2 px-4 bg-aurora-blue/20 hover:bg-aurora-blue/30 text-aurora-blue rounded-lg transition-colors font-medium">
                Learn More
              </button>
            </div>
          </CarouselCard>
        ))}
      </Carousel>
    </div>
  );
}

// Example 6: Minimal Carousel (no dots, no arrows)
export function MinimalCarouselExample() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-white mb-4">Minimal Carousel (swipe only)</h2>
      <Carousel showDots={false} showArrows={false} loop>
        {['🌟', '🎯', '🔥', '✨', '💎'].map((emoji, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-aurora-purple/20 to-aurora-pink/20 rounded-xl p-16 text-center"
          >
            <div className="text-8xl">{emoji}</div>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

// Example 7: All Examples Together
export default function CarouselExamples() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight to-dark-900 py-12 space-y-16">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white mb-4">Carousel Component Examples</h1>
        <p className="text-gray-400">Various implementations of the mobile-first carousel</p>
      </div>

      <BasicCarouselExample />
      <AutoplayCarouselExample />
      <ResponsiveCarouselExample />
      <ImageCarouselExample />
      <CardCarouselExample />
      <MinimalCarouselExample />

      <div className="max-w-4xl mx-auto p-8 bg-dark-800 rounded-xl border-2 border-aurora-green/30">
        <h2 className="text-2xl font-bold text-white mb-4">Usage Tips</h2>
        <ul className="text-gray-300 space-y-2 list-disc list-inside">
          <li>Use <code className="bg-dark-900 px-2 py-1 rounded text-aurora-blue">showDots</code> for pagination indicators</li>
          <li>Use <code className="bg-dark-900 px-2 py-1 rounded text-aurora-blue">showArrows</code> for navigation buttons</li>
          <li>Set <code className="bg-dark-900 px-2 py-1 rounded text-aurora-blue">autoplayInterval</code> for auto-advance (in ms)</li>
          <li>Configure <code className="bg-dark-900 px-2 py-1 rounded text-aurora-blue">itemsPerView</code> for responsive layouts</li>
          <li>Use <code className="bg-dark-900 px-2 py-1 rounded text-aurora-blue">loop</code> for infinite scrolling</li>
          <li>Wrap items in <code className="bg-dark-900 px-2 py-1 rounded text-aurora-blue">CarouselCard</code> for consistent spacing</li>
          <li>Swipe gestures work automatically on touch devices</li>
          <li>Keyboard navigation: Arrow keys, Home, End</li>
        </ul>
      </div>
    </div>
  );
}
