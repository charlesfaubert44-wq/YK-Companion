'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GarageSale } from '@/types/garage-sales.types';

interface SimpleMapProps {
  sales: GarageSale[];
}

export default function SimpleMap({ sales }: SimpleMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!mapboxToken) {
      setMapError('Mapbox token not configured');
      return;
    }

    if (!mapContainer.current || map.current) return;

    // Initialize map
    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: [-114.3718, 62.4540], // Yellowknife coordinates
        zoom: 11,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  useEffect(() => {
    if (!map.current || !sales.length) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add markers for each sale
    sales.forEach((sale) => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.cssText = `
        width: 40px;
        height: 40px;
        background-color: #10B981;
        border: 3px solid white;
        border-radius: 50%;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        transition: all 0.2s;
      `;
      el.innerHTML = '📍';

      // Add hover effect
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.2)';
        el.style.zIndex = '10';
      });
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)';
        el.style.zIndex = '1';
      });

      // Create popup
      const popup = new mapboxgl.Popup({ offset: 25, closeButton: false }).setHTML(`
        <div style="padding: 8px; min-width: 200px;">
          <h3 style="font-weight: bold; margin-bottom: 8px; color: #1f2937;">${sale.title}</h3>
          <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">${sale.address}</p>
          <div style="font-size: 12px; color: #10B981; margin-bottom: 8px;">
            ${new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            • ${sale.start_time}
          </div>
          ${sale.items_description ? `<p style="font-size: 11px; color: #9ca3af; font-style: italic;">${sale.items_description.substring(0, 60)}${sale.items_description.length > 60 ? '...' : ''}</p>` : ''}
        </div>
      `);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([sale.longitude, sale.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.push(marker);
    });

    // Fit map to show all markers
    if (sales.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      sales.forEach(sale => {
        bounds.extend([sale.longitude, sale.latitude]);
      });

      map.current.fitBounds(bounds, {
        padding: 50,
        maxZoom: 14,
        duration: 1000,
      });
    }
  }, [sales]);

  if (mapError) {
    return (
      <div className="h-[400px] bg-dark-800 rounded-xl flex flex-col items-center justify-center border border-gray-700">
        <div className="text-6xl mb-4">🗺️</div>
        <div className="text-gray-400 text-center">
          <p className="font-semibold mb-2">Map Not Available</p>
          <p className="text-sm">{mapError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={mapContainer}
        className="h-[400px] md:h-[500px] w-full rounded-xl overflow-hidden border border-gray-700 shadow-xl"
      />
      <div className="absolute top-4 left-4 bg-dark-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium border border-aurora-green/20">
        {sales.length} {sales.length === 1 ? 'sale' : 'sales'} on map
      </div>
    </div>
  );
}
