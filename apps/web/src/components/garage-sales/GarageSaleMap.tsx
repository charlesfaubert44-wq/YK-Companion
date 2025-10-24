'use client';

import { GarageSale } from '@/types/garage-sales.types';
import { useState } from 'react';

interface Props {
  sales: GarageSale[];
  selectedSales: string[];
  onToggleSelection: (saleId: string) => void;
}

export default function GarageSaleMap({ sales, selectedSales, onToggleSelection }: Props) {
  const [selectedSale, setSelectedSale] = useState<GarageSale | null>(null);

  // In production, integrate with Google Maps, Mapbox, or similar
  // For now, showing a simple visual representation

  return (
    <div className="space-y-4">
      {/* Map Placeholder */}
      <div className="bg-dark-800 rounded-xl border border-aurora-green/20 overflow-hidden">
        <div className="relative h-[500px] bg-gradient-to-br from-northern-midnight to-dark-900 flex items-center justify-center">
          {/* Map Container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-4">🗺️</div>
              <h3 className="text-xl font-bold text-white mb-2">Interactive Map</h3>
              <p className="text-gray-400 mb-4">
                Map integration with Google Maps or Mapbox
              </p>
              <div className="inline-block px-4 py-2 bg-aurora-green/20 text-aurora-green rounded-lg text-sm">
                Map API integration needed
              </div>
            </div>
          </div>

          {/* Markers Visualization */}
          <div className="absolute inset-0 pointer-events-none">
            {sales.map((sale, index) => {
              const isSelected = selectedSales.includes(sale.id);
              const x = 20 + (index % 5) * 18;
              const y = 20 + Math.floor(index / 5) * 20;

              return (
                <div
                  key={sale.id}
                  className="absolute pointer-events-auto cursor-pointer"
                  style={{ left: `${x}%`, top: `${y}%` }}
                  onClick={() => {
                    setSelectedSale(sale);
                    onToggleSelection(sale.id);
                  }}
                >
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xl transition-all transform hover:scale-125 ${
                      isSelected
                        ? 'bg-aurora-green shadow-aurora animate-pulse'
                        : 'bg-aurora-blue/80 hover:bg-aurora-blue'
                    }`}
                  >
                    📍
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Map Controls */}
        <div className="bg-dark-900 px-6 py-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="text-gray-400">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500"></div>
                <span className="text-gray-400">This Week</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-400">Upcoming</span>
              </div>
            </div>
            <button className="px-4 py-2 bg-dark-800 text-gray-400 hover:text-white rounded-lg transition-colors text-sm">
              📍 Use My Location
            </button>
          </div>
        </div>
      </div>

      {/* Selected Sale Info */}
      {selectedSale && (
        <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">{selectedSale.title}</h3>
              <p className="text-gray-400 text-sm">📍 {selectedSale.address}</p>
            </div>
            <button
              onClick={() => setSelectedSale(null)}
              className="text-gray-400 hover:text-white transition-colors text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-2">
            <button className="flex-1 px-4 py-2 bg-aurora-green/20 text-aurora-green hover:bg-aurora-green/30 rounded-lg transition-colors font-medium">
              Get Directions
            </button>
            <button className="flex-1 px-4 py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition-colors font-medium">
              View Details
            </button>
          </div>
        </div>
      )}

      {/* Sales List Below Map */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sales.map(sale => (
          <div
            key={sale.id}
            onClick={() => setSelectedSale(sale)}
            className={`bg-dark-800 rounded-lg p-4 border-2 cursor-pointer transition-all hover:shadow-lg ${
              selectedSale?.id === sale.id
                ? 'border-aurora-green'
                : 'border-gray-700 hover:border-aurora-green/40'
            }`}
          >
            <h4 className="font-bold text-white mb-2">{sale.title}</h4>
            <p className="text-sm text-gray-400 mb-2">{sale.address}</p>
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>{sale.sale_date}</span>
              <span>{sale.start_time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
