'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useBannerSettings } from '@/lib/banners/useBannerSettings';
import { BANNER_THEMES, BannerTheme } from '@/components/banners/BannerThemes';

export default function BannerShowcasePage() {
  const { currentTheme, settings, setActiveTheme, toggleAutoDetect } = useBannerSettings();
  const [previewTheme, setPreviewTheme] = useState<BannerTheme>(currentTheme);

  const bannerVariations = [
    // Seasonal Banners
    { id: 'winter' as BannerTheme, name: 'Winter', category: 'seasonal', description: 'Aurora and frozen landscapes' },
    { id: 'spring' as BannerTheme, name: 'Spring', category: 'seasonal', description: 'Ice breakup and returning birds' },
    { id: 'summer' as BannerTheme, name: 'Summer', category: 'seasonal', description: 'Midnight sun and wildflowers' },
    { id: 'fall' as BannerTheme, name: 'Fall', category: 'seasonal', description: 'Autumn colors and migrating geese' },

    // Holiday Themes
    { id: 'halloween' as BannerTheme, name: 'Halloween', category: 'holiday', description: 'Spooky northern lights and pumpkins' },
    { id: 'remembrance' as BannerTheme, name: 'Remembrance Day', category: 'holiday', description: 'Respectful tribute with poppies' },
    { id: 'christmas' as BannerTheme, name: 'Christmas', category: 'holiday', description: 'Festive northern lights' },
    { id: 'newyear' as BannerTheme, name: 'New Year', category: 'holiday', description: 'Fireworks over Great Slave Lake' },
    { id: 'canada' as BannerTheme, name: 'Canada Day', category: 'holiday', description: 'Red and white with maple leaves' },
    { id: 'indigenous' as BannerTheme, name: 'Indigenous Peoples Day', category: 'holiday', description: 'Cultural celebration' },
    { id: 'easter' as BannerTheme, name: 'Easter', category: 'holiday', description: 'Spring renewal theme' },
  ];

  const categories = {
    seasonal: bannerVariations.filter(b => b.category === 'seasonal'),
    holiday: bannerVariations.filter(b => b.category === 'holiday'),
  };

  const handleSetActive = () => {
    setActiveTheme(previewTheme);
    alert(`Banner set to: ${bannerVariations.find(b => b.id === previewTheme)?.name}`);
  };

  const PreviewBanner = BANNER_THEMES[previewTheme];

  return (
    <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900">
      {/* Header */}
      <div className="bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link
                href="/admin"
                className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-2"
              >
                ← Back to Admin
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Banner Management
              </h1>
              <p className="text-gray-300 mt-2">
                Preview and manage all banner variations
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar - Variation Selector */}
          <div className="lg:col-span-1">
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20 sticky top-24">
              <h2 className="text-xl font-bold text-white mb-4">Variations</h2>

              {/* Auto Mode Toggle */}
              <div className="mb-6 p-4 bg-dark-700/50 rounded-lg border border-aurora-green/20">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.autoDetect}
                    onChange={toggleAutoDetect}
                    className="w-5 h-5"
                  />
                  <div>
                    <div className="text-white font-semibold">Auto Mode</div>
                    <div className="text-xs text-gray-400">Detect season & holidays</div>
                  </div>
                </label>
              </div>

              {/* Seasonal */}
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Seasonal</h3>
                <div className="space-y-2">
                  {categories.seasonal.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setPreviewTheme(variation.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        previewTheme === variation.id
                          ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora'
                          : 'bg-dark-700/50 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Holidays */}
              <div>
                <h3 className="text-sm font-semibold text-gray-400 mb-2 uppercase tracking-wide">Holidays</h3>
                <div className="space-y-2">
                  {categories.holiday.map((variation) => (
                    <button
                      key={variation.id}
                      onClick={() => setPreviewTheme(variation.id)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-all ${
                        previewTheme === variation.id
                          ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora'
                          : 'bg-dark-700/50 text-gray-300 hover:bg-dark-700'
                      }`}
                    >
                      {variation.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Preview Area */}
          <div className="lg:col-span-3">
            {/* Banner Preview */}
            <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {bannerVariations.find(b => b.id === previewTheme)?.name}
                  </h2>
                  <p className="text-gray-400 text-sm">
                    {bannerVariations.find(b => b.id === previewTheme)?.description}
                  </p>
                </div>
                <button
                  onClick={handleSetActive}
                  className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
                >
                  Set as Active
                </button>
              </div>

              {/* Preview Container */}
              <div className="bg-dark-900 rounded-lg overflow-hidden border-2 border-gray-700">
                <PreviewBanner temperature={-25} />
              </div>

              {/* Status */}
              {currentTheme === previewTheme && (
                <div className="mt-4 p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                  <div className="flex items-center gap-2 text-emerald-400">
                    <span className="text-xl">✓</span>
                    <span className="font-semibold">This banner is currently active on your site</span>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Info */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-blue/20">
                <h3 className="text-white font-semibold mb-4">Current Settings</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Active Theme:</span>
                    <span className="text-white font-semibold capitalize">{currentTheme}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Auto Detection:</span>
                    <span className={`font-semibold ${settings.autoDetect ? 'text-emerald-400' : 'text-gray-400'}`}>
                      {settings.autoDetect ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Themes:</span>
                    <span className="text-white font-semibold">11</span>
                  </div>
                </div>
              </div>

              <div className="bg-dark-800 rounded-xl p-6 border border-aurora-purple/20">
                <h3 className="text-white font-semibold mb-4">How It Works</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex gap-2">
                    <span className="text-aurora-green">•</span>
                    <span>Auto mode switches banners based on season</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-aurora-blue">•</span>
                    <span>Holiday themes appear 2 weeks before holidays</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-aurora-purple">•</span>
                    <span>Manual mode lets you pick any theme</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
