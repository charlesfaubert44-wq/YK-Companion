import Link from 'next/link';
import { PixelButton, PixelCard } from '@/components/pixel';

export default function Home() {
  return (
    <div className="min-h-screen bg-pixel-starfield crt-screen overflow-hidden">
      {/* Pixel Aurora Animation Layers */}
      <div className="fixed top-0 left-0 w-full h-screen pointer-events-none">
        <div className="pixel-aurora-layer pixel-aurora-green" style={{ top: '20%' }}></div>
        <div className="pixel-aurora-layer pixel-aurora-blue" style={{ top: '35%' }}></div>
        <div className="pixel-aurora-layer pixel-aurora-purple" style={{ top: '50%' }}></div>
      </div>

      <div className="relative z-10">
        {/* Pixel Nav Bar */}
        <nav className="border-b-4 border-pixel-green bg-dark-900/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="font-pixel text-sm md:text-base text-aurora-green flex items-center gap-2 text-pixel-glow">
                <span className="animate-blink">▲</span>
                <span>TRUE NORTH TRIPS</span>
              </div>
              <div className="flex gap-4 text-xs font-pixel">
                <Link href="/quiz" className="text-pixel-white hover:text-aurora-green transition">
                  QUIZ
                </Link>
                <Link
                  href="/calculator"
                  className="text-pixel-white hover:text-aurora-blue transition"
                >
                  COST
                </Link>
                <Link
                  href="/aurora"
                  className="text-pixel-white hover:text-aurora-purple transition"
                >
                  AURORA
                </Link>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="container mx-auto px-4 py-16 md:py-24">
          <div className="text-center max-w-5xl mx-auto mb-16">
            <div className="font-pixel text-4xl md:text-6xl text-pixel-white mb-4 text-pixel-shadow animate-glitch-slow">
              NAVIGATE THE NORTH
            </div>
            <div className="font-pixel text-2xl md:text-4xl text-aurora-green mb-8 text-pixel-glow">
              &gt; WITH CONFIDENCE_
            </div>
            <p className="font-mono text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Whether you are visiting, living, or moving to Yellowknife—get the local expertise you
              need.
            </p>
          </div>

          {/* Three Segment Cards - Pixel Style */}
          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {/* Visiting Card */}
            <Link href="/visiting" className="group">
              <PixelCard borderColor="green" hover={true} icon="🎮" className="h-full">
                <h3 className="font-pixel text-xl mb-3 text-aurora-green">&gt; VISITING</h3>
                <p className="text-gray-300 mb-4">
                  Plan your trip with real costs, aurora forecasts, and personalized
                  recommendations.
                </p>
                <div className="font-pixel text-xs text-aurora-green">[START QUEST] →</div>
              </PixelCard>
            </Link>

            {/* Living Card */}
            <Link href="/living" className="group">
              <PixelCard borderColor="blue" hover={true} icon="🏠" className="h-full">
                <h3 className="font-pixel text-xl mb-3 text-aurora-blue">&gt; LIVING HERE</h3>
                <p className="text-gray-300 mb-4">
                  Local events, seasonal guides, and community recommendations for residents.
                </p>
                <div className="font-pixel text-xs text-aurora-blue">[EXPLORE MAP] →</div>
              </PixelCard>
            </Link>

            {/* Moving Card */}
            <Link href="/moving" className="group">
              <PixelCard borderColor="purple" hover={true} icon="📦" className="h-full">
                <h3 className="font-pixel text-xl mb-3 text-aurora-purple">&gt; MOVING HERE</h3>
                <p className="text-gray-300 mb-4">
                  Housing costs, job market, climate prep, and relocation checklist.
                </p>
                <div className="font-pixel text-xs text-aurora-purple">[BEGIN MOVE] →</div>
              </PixelCard>
            </Link>
          </div>

          {/* Pixel Stats Bar */}
          <div className="max-w-4xl mx-auto border-4 border-pixel-green bg-dark-900/90 p-6">
            <div className="grid grid-cols-3 gap-4 text-center font-mono">
              <div>
                <div className="text-aurora-green text-2xl font-bold">10K+</div>
                <div className="text-gray-400 text-sm">TRIPS PLANNED</div>
              </div>
              <div>
                <div className="text-aurora-blue text-2xl font-bold">LIVE</div>
                <div className="text-gray-400 text-sm">AURORA DATA</div>
              </div>
              <div>
                <div className="text-aurora-purple text-2xl font-bold">FREE</div>
                <div className="text-gray-400 text-sm">TO USE</div>
              </div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-12">
            <PixelButton variant="primary" size="lg" href="/quiz">
              &gt; START YOUR JOURNEY
            </PixelButton>
          </div>
        </section>

        {/* Pixel Footer */}
        <footer className="border-t-4 border-pixel-green bg-dark-900/95 backdrop-blur-sm mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center font-pixel text-xs text-gray-500">
              <p className="mb-2">© 2025 TRUE NORTH TRIPS</p>
              <p className="font-mono text-[10px]">POWERED BY AURORA ENERGY</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
