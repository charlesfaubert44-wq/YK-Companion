'use client';

import { PixelButton } from '@/components/pixel/PixelButton';
import { PixelCard } from '@/components/pixel/PixelCard';
import Link from 'next/link';

export default function PixelDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-northern-midnight">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <Link
          href="/"
          className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-8"
        >
          ← Back to Home
        </Link>

        <div className="text-center mb-12">
          <h1 className="font-pixel text-2xl md:text-4xl text-pixel-white mb-4 text-pixel-shadow">
            PIXEL UI DEMO
          </h1>
          <p className="text-gray-300 max-w-2xl mx-auto">
            Retro 8-bit inspired UI components with aurora color palette
          </p>
        </div>
      </div>

      {/* Pixel Buttons Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-pixel text-xl md:text-2xl text-aurora-green mb-8 text-pixel-shadow">
          PIXEL BUTTONS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Primary Buttons */}
          <div className="space-y-6">
            <h3 className="font-mono text-lg text-white mb-4">Primary Variant</h3>
            <PixelButton variant="primary" size="sm">
              Small Button
            </PixelButton>
            <PixelButton variant="primary" size="md">
              Medium Button
            </PixelButton>
            <PixelButton variant="primary" size="lg">
              Large Button
            </PixelButton>
          </div>

          {/* Secondary Buttons */}
          <div className="space-y-6">
            <h3 className="font-mono text-lg text-white mb-4">Secondary Variant</h3>
            <PixelButton variant="secondary" size="sm">
              Small Button
            </PixelButton>
            <PixelButton variant="secondary" size="md">
              Medium Button
            </PixelButton>
            <PixelButton variant="secondary" size="lg">
              Large Button
            </PixelButton>
          </div>

          {/* Accent Buttons */}
          <div className="space-y-6">
            <h3 className="font-mono text-lg text-white mb-4">Accent Variant</h3>
            <PixelButton variant="accent" size="sm">
              Small Button
            </PixelButton>
            <PixelButton variant="accent" size="md">
              Medium Button
            </PixelButton>
            <PixelButton variant="accent" size="lg">
              Large Button
            </PixelButton>
          </div>
        </div>

        {/* Interactive Demo */}
        <div className="bg-dark-800 border-2 border-aurora-green p-8 rounded-lg">
          <h3 className="font-mono text-lg text-white mb-4">Interactive Demo</h3>
          <div className="flex flex-wrap gap-4">
            <PixelButton
              variant="primary"
              onClick={() => alert('Primary button clicked!')}
            >
              Click Me!
            </PixelButton>
            <PixelButton
              variant="secondary"
              onClick={() => alert('Secondary button clicked!')}
            >
              Click Me Too!
            </PixelButton>
            <PixelButton
              variant="accent"
              href="#pixel-cards"
            >
              Link Button
            </PixelButton>
          </div>
        </div>
      </section>

      {/* Pixel Cards Section */}
      <section id="pixel-cards" className="container mx-auto px-4 py-12">
        <h2 className="font-pixel text-xl md:text-2xl text-aurora-blue mb-8 text-pixel-shadow">
          PIXEL CARDS
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card with icon and title */}
          <PixelCard
            borderColor="green"
            hover
            icon="🎮"
            title="GAMING"
          >
            <p className="text-gray-300">
              Retro-style gaming UI with nostalgic vibes and modern functionality
            </p>
          </PixelCard>

          {/* Card with blue border */}
          <PixelCard
            borderColor="blue"
            hover
            icon="❄️"
            title="NORTHERN"
          >
            <p className="text-gray-300">
              Aurora-inspired design capturing the magic of the northern lights
            </p>
          </PixelCard>

          {/* Card with purple border */}
          <PixelCard
            borderColor="purple"
            hover
            icon="⭐"
            title="PREMIUM"
          >
            <p className="text-gray-300">
              High-quality pixel art aesthetic with smooth animations
            </p>
          </PixelCard>

          {/* Card with pink border */}
          <PixelCard
            borderColor="pink"
            hover
            icon="🌸"
            title="ACCENT"
          >
            <p className="text-gray-300">
              Warm accent colors for special highlights and CTAs
            </p>
          </PixelCard>

          {/* Card with white border */}
          <PixelCard
            borderColor="white"
            hover
            icon="💎"
            title="CLASSIC"
          >
            <p className="text-gray-300">
              Classic white borders for a clean, minimalist look
            </p>
          </PixelCard>

          {/* Mixed content card */}
          <PixelCard
            borderColor="green"
            hover
          >
            <div className="space-y-4">
              <h3 className="font-pixel text-lg text-aurora-green">
                CUSTOM CARD
              </h3>
              <p className="text-gray-300">
                Cards can contain any custom content you need
              </p>
              <PixelButton variant="primary" size="sm">
                Action
              </PixelButton>
            </div>
          </PixelCard>
        </div>
      </section>

      {/* Color Palette Section */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="font-pixel text-xl md:text-2xl text-aurora-purple mb-8 text-pixel-shadow">
          COLOR PALETTE
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-full h-24 bg-aurora-green rounded-lg mb-2 border-2 border-white"></div>
            <p className="font-mono text-sm text-white">Aurora Green</p>
            <p className="font-mono text-xs text-gray-400">#00ff88</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 bg-aurora-blue rounded-lg mb-2 border-2 border-white"></div>
            <p className="font-mono text-sm text-white">Aurora Blue</p>
            <p className="font-mono text-xs text-gray-400">#4d94ff</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 bg-aurora-purple rounded-lg mb-2 border-2 border-white"></div>
            <p className="font-mono text-sm text-white">Aurora Purple</p>
            <p className="font-mono text-xs text-gray-400">#a366ff</p>
          </div>
          <div className="text-center">
            <div className="w-full h-24 bg-aurora-pink rounded-lg mb-2 border-2 border-white"></div>
            <p className="font-mono text-sm text-white">Aurora Pink</p>
            <p className="font-mono text-xs text-gray-400">#ff66cc</p>
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section className="container mx-auto px-4 py-12 mb-12">
        <h2 className="font-pixel text-xl md:text-2xl text-buddy-yellow mb-8 text-pixel-shadow">
          USAGE
        </h2>

        <PixelCard borderColor="white" className="max-w-4xl mx-auto">
          <div className="space-y-4">
            <h3 className="font-pixel text-lg text-white mb-4">Import Components</h3>
            <pre className="bg-dark-900 p-4 rounded text-aurora-green font-mono text-sm overflow-x-auto">
{`import { PixelButton } from '@/components/pixel/PixelButton';
import { PixelCard } from '@/components/pixel/PixelCard';`}
            </pre>

            <h3 className="font-pixel text-lg text-white mb-4 mt-6">Button Examples</h3>
            <pre className="bg-dark-900 p-4 rounded text-aurora-blue font-mono text-sm overflow-x-auto">
{`<PixelButton variant="primary" size="md">
  Click Me
</PixelButton>

<PixelButton variant="secondary" href="/link">
  Link Button
</PixelButton>`}
            </pre>

            <h3 className="font-pixel text-lg text-white mb-4 mt-6">Card Examples</h3>
            <pre className="bg-dark-900 p-4 rounded text-aurora-purple font-mono text-sm overflow-x-auto">
{`<PixelCard
  borderColor="green"
  hover
  icon="🎮"
  title="TITLE"
>
  Content goes here
</PixelCard>`}
            </pre>
          </div>
        </PixelCard>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <p className="font-pixel text-sm text-gray-500">
          YK BUDDY PIXEL UI v1.0
        </p>
      </footer>
    </div>
  );
}
