'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { GarageSale, Coordinates } from '@/types/garage-sales.types';

interface MapViewProps {
  sales: GarageSale[];
  userLocation?: Coordinates;
  highlightedSaleId?: string | null;
  onSaleClick?: (sale: GarageSale) => void;
  onMarkerHover?: (saleId: string | null) => void;
}

/**
 * MapView Component
 * 
 * Interactive map displaying garage sale locations with:
 * - Mapbox integration
 * - Custom markers for each sale
 * - User location marker
 * - Popups with sale details
 * - Marker highlighting
 * - Auto-fit bounds to show all sales
 * - Navigation and fullscreen controls
 * 
 * @example
 * ```tsx
 * <MapView
 *   sales={garageSales}
 *   userLocation={userLocation}
 *   highlightedSaleId={selectedId}
 *   onSaleClick={handleSaleClick}
 * />
 * ```
 */
export default function MapView({
  sales,
  userLocation,
  highlightedSaleId,
  onSaleClick,
  onMarkerHover,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<Map<string, mapboxgl.Marker>>(new Map());
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);

  // Initialize map
  useEffect(() => {
    const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    if (!mapboxToken) {
      setMapError('Mapbox token not configured. Please add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to your .env.local file');
      return;
    }

    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = mapboxToken;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: userLocation 
          ? [userLocation.longitude, userLocation.latitude] 
          : [-114.3718, 62.4540], // Default to Yellowknife
        zoom: userLocation ? 12 : 11,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');

      // Add geolocation control if user location is available
      if (userLocation) {
        map.current.addControl(
          new mapboxgl.GeolocateControl({
            positionOptions: {
              enableHighAccuracy: true
            },
            trackUserLocation: true,
            showUserHeading: true
          }),
          'top-right'
        );
      }

      map.current.on('load', () => {
        setMapReady(true);
      });

    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map. Please check your Mapbox configuration.');
    }

    return () => {
      markers.current.forEach(marker => marker.remove());
      markers.current.clear();
      userMarker.current?.remove();
      map.current?.remove();
      map.current = null;
    };
  }, []); // Empty deps - only initialize once

  // Create sale marker element
  const createSaleMarkerElement = useCallback((sale: GarageSale, isHighlighted: boolean) => {
    const el = document.createElement('div');
    el.className = 'sale-marker';
    el.style.cssText = `
      width: ${isHighlighted ? '48px' : '40px'};
      height: ${isHighlighted ? '48px' : '40px'};
      background: ${isHighlighted ? 'linear-gradient(135deg, #10B981, #3B82F6)' : '#10B981'};
      border: 3px solid white;
      border-radius: 50%;
      cursor: pointer;
      box-shadow: ${isHighlighted ? '0 4px 12px rgba(16, 185, 129, 0.5)' : '0 2px 8px rgba(0,0,0,0.3)'};
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: ${isHighlighted ? '24px' : '20px'};
      transition: all 0.3s ease;
      z-index: ${isHighlighted ? '10' : '1'};
    `;
    el.innerHTML = '📍';

    // Hover effects
    el.addEventListener('mouseenter', () => {
      el.style.transform = 'scale(1.2)';
      el.style.zIndex = '10';
      if (onMarkerHover) onMarkerHover(sale.id);
    });

    el.addEventListener('mouseleave', () => {
      el.style.transform = isHighlighted ? 'scale(1.1)' : 'scale(1)';
      el.style.zIndex = isHighlighted ? '10' : '1';
      if (onMarkerHover) onMarkerHover(null);
    });

    // Click handler
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (onSaleClick) onSaleClick(sale);
    });

    return el;
  }, [onSaleClick, onMarkerHover]);

  // Create popup for sale
  const createSalePopup = useCallback((sale: GarageSale) => {
    const saleDate = new Date(sale.sale_date);
    const today = new Date();
    const daysUntil = Math.ceil((saleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    let dateLabel = '';
    if (daysUntil === 0) dateLabel = '<span style="background: #ef4444; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">TODAY</span>';
    else if (daysUntil === 1) dateLabel = '<span style="background: #f59e0b; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">TOMORROW</span>';
    else if (daysUntil > 1 && daysUntil <= 7) dateLabel = `<span style="background: #3b82f6; color: white; padding: 2px 6px; border-radius: 4px; font-size: 10px;">${daysUntil} DAYS</span>`;

    return new mapboxgl.Popup({ 
      offset: 25, 
      closeButton: false,
      maxWidth: '300px',
    }).setHTML(`
      <div style="padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
        <h3 style="font-weight: bold; margin-bottom: 8px; color: #1f2937; font-size: 14px;">${sale.title}</h3>
        <p style="font-size: 11px; color: #6b7280; margin-bottom: 4px;">
          👤 ${sale.host_name || 'Anonymous'}
        </p>
        <p style="font-size: 12px; color: #6b7280; margin-bottom: 8px;">
          📍 ${sale.address}
        </p>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 12px; color: #10B981; margin-bottom: 8px;">
          <span>📅 ${saleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
          <span>🕐 ${sale.start_time}</span>
          ${dateLabel}
        </div>
        ${sale.distance_km !== undefined ? `
          <p style="font-size: 11px; color: #a855f7; margin-bottom: 8px;">
            📏 ${sale.distance_km < 1 ? Math.round(sale.distance_km * 1000) + 'm' : sale.distance_km.toFixed(1) + 'km'} away
          </p>
        ` : ''}
        ${sale.tags.length > 0 ? `
          <div style="display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 8px;">
            ${sale.tags.slice(0, 3).map(tag => 
              `<span style="background: #f3f4f6; color: #374151; padding: 2px 8px; border-radius: 4px; font-size: 10px; text-transform: capitalize;">${tag}</span>`
            ).join('')}
            ${sale.tags.length > 3 ? `<span style="color: #9ca3af; font-size: 10px;">+${sale.tags.length - 3}</span>` : ''}
          </div>
        ` : ''}
        ${sale.items_description ? `
          <p style="font-size: 11px; color: #9ca3af; font-style: italic; margin-bottom: 8px;">
            ${sale.items_description.substring(0, 80)}${sale.items_description.length > 80 ? '...' : ''}
          </p>
        ` : ''}
        <div style="display: flex; gap: 8px; font-size: 10px; color: #6b7280;">
          ${sale.cash_only ? '<span>💵 Cash</span>' : ''}
          ${sale.early_birds_welcome ? '<span>🐦 Early Birds</span>' : ''}
        </div>
      </div>
    `);
  }, []);

  // Update markers when sales change
  useEffect(() => {
    if (!map.current || !mapReady) return;

    // Clear existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current.clear();

    // Add markers for each sale
    sales.forEach((sale) => {
      const isHighlighted = sale.id === highlightedSaleId;
      const el = createSaleMarkerElement(sale, isHighlighted);
      const popup = createSalePopup(sale);

      const marker = new mapboxgl.Marker(el)
        .setLngLat([sale.longitude, sale.latitude])
        .setPopup(popup)
        .addTo(map.current!);

      markers.current.set(sale.id, marker);

      // Show popup for highlighted sale
      if (isHighlighted) {
        marker.togglePopup();
      }
    });

    // Fit map to show all markers
    if (sales.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      
      sales.forEach(sale => {
        bounds.extend([sale.longitude, sale.latitude]);
      });

      // Include user location in bounds if available
      if (userLocation) {
        bounds.extend([userLocation.longitude, userLocation.latitude]);
      }

      map.current.fitBounds(bounds, {
        padding: { top: 80, bottom: 80, left: 80, right: 80 },
        maxZoom: 14,
        duration: 1000,
      });
    }
  }, [sales, highlightedSaleId, mapReady, createSaleMarkerElement, createSalePopup, userLocation]);

  // Update user location marker
  useEffect(() => {
    if (!map.current || !mapReady || !userLocation) return;

    // Remove existing user marker
    userMarker.current?.remove();

    // Create user location marker
    const el = document.createElement('div');
    el.style.cssText = `
      width: 24px;
      height: 24px;
      background: #3b82f6;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
      animation: pulse 2s infinite;
    `;

    userMarker.current = new mapboxgl.Marker(el)
      .setLngLat([userLocation.longitude, userLocation.latitude])
      .setPopup(
        new mapboxgl.Popup({ offset: 15, closeButton: false })
          .setHTML(`
            <div style="padding: 8px; text-align: center;">
              <p style="font-weight: bold; color: #3b82f6; font-size: 12px;">📍 You are here</p>
            </div>
          `)
      )
      .addTo(map.current);

  }, [userLocation, mapReady]);

  // Update highlighted marker
  useEffect(() => {
    if (!mapReady) return;

    markers.current.forEach((marker, saleId) => {
      const sale = sales.find(s => s.id === saleId);
      if (!sale) return;

      const isHighlighted = saleId === highlightedSaleId;
      const element = marker.getElement();
      
      if (element) {
        element.style.width = isHighlighted ? '48px' : '40px';
        element.style.height = isHighlighted ? '48px' : '40px';
        element.style.fontSize = isHighlighted ? '24px' : '20px';
        element.style.background = isHighlighted 
          ? 'linear-gradient(135deg, #10B981, #3B82F6)' 
          : '#10B981';
        element.style.boxShadow = isHighlighted 
          ? '0 4px 12px rgba(16, 185, 129, 0.5)' 
          : '0 2px 8px rgba(0,0,0,0.3)';
        element.style.zIndex = isHighlighted ? '10' : '1';
        element.style.transform = isHighlighted ? 'scale(1.1)' : 'scale(1)';
      }

      // Show/hide popup based on highlight
      const popup = marker.getPopup();
      if (popup) {
        if (isHighlighted && !popup.isOpen()) {
          marker.togglePopup();
        } else if (!isHighlighted && popup.isOpen()) {
          marker.togglePopup();
        }
      }
    });
  }, [highlightedSaleId, sales, mapReady]);

  if (mapError) {
    return (
      <div className="h-[400px] md:h-[500px] bg-dark-800 rounded-xl flex flex-col items-center justify-center border border-gray-700">
        <div className="text-6xl mb-4">🗺️</div>
        <div className="text-gray-400 text-center max-w-md px-4">
          <p className="font-semibold mb-2 text-white">Map Not Available</p>
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
      
      {/* Map overlay info */}
      <div className="absolute top-4 left-4 bg-dark-800/90 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium border border-aurora-green/20 shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-aurora-green">📍</span>
          <span>{sales.length} {sales.length === 1 ? 'sale' : 'sales'} on map</span>
        </div>
      </div>

      {/* User location indicator */}
      {userLocation && (
        <div className="absolute bottom-4 left-4 bg-aurora-blue/90 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-xs font-medium border border-aurora-blue/30 shadow-lg">
          <div className="flex items-center gap-1.5">
            <span>📍</span>
            <span>Your location shown</span>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {!mapReady && (
        <div className="absolute inset-0 bg-dark-800/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-aurora-green border-t-transparent mb-4"></div>
            <p className="text-gray-300">Loading map...</p>
          </div>
        </div>
      )}

      {/* Add pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 0 8px rgba(59, 130, 246, 0.1);
          }
        }
      `}</style>
    </div>
  );
}

