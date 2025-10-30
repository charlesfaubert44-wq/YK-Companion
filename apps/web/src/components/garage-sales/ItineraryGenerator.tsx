'use client';

import { useState, useEffect } from 'react';
import { GarageSale, GarageSaleItinerary, RouteWaypoint } from '@/types/garage-sales.types';
import { calculateDistance } from '@/lib/utils';

interface Props {
  allSales: GarageSale[];
  selectedSaleIds: string[];
  onSelectionChange: (saleIds: string[]) => void;
}

export default function ItineraryGenerator({
  allSales,
  selectedSaleIds,
  onSelectionChange,
}: Props) {
  const [itinerary, setItinerary] = useState<GarageSaleItinerary | null>(null);
  const [optimizing, setOptimizing] = useState(false);
  const [startLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 62.454, // Yellowknife center
    longitude: -114.3718,
  });

  const selectedSales = allSales.filter(sale => selectedSaleIds.includes(sale.id));

  const optimizeRoute = async () => {
    if (selectedSales.length < 2) {
      alert('Please select at least 2 garage sales to create a route');
      return;
    }

    setOptimizing(true);

    // Simulate optimization delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Nearest Neighbor Algorithm for TSP (Traveling Salesman Problem)
    const optimizedOrder = nearestNeighborTSP(selectedSales, startLocation);

    // Calculate route details
    const waypoints: RouteWaypoint[] = [];
    let totalDistance = 0;
    let totalDuration = 0;
    let currentLat = startLocation.latitude;
    let currentLng = startLocation.longitude;
    let currentTime = parseTime(optimizedOrder[0].start_time);

    optimizedOrder.forEach((sale, index) => {
      const distance = calculateDistance(currentLat, currentLng, sale.latitude, sale.longitude);
      const durationMinutes = Math.ceil(distance * 3); // Approximate: 3 min per km in city

      totalDistance += distance;
      totalDuration += durationMinutes;

      // Add travel time to current time
      currentTime += durationMinutes;

      // Estimate 30 min per sale
      const saleStartTime = currentTime;
      const saleDuration = 30;

      waypoints.push({
        sale_id: sale.id,
        order: index + 1,
        coordinates: {
          latitude: sale.latitude,
          longitude: sale.longitude,
        },
        estimated_arrival_time: formatMinutesToTime(currentTime),
        distance_from_previous_km: distance,
        duration_from_previous_minutes: durationMinutes,
      });

      currentLat = sale.latitude;
      currentLng = sale.longitude;
      currentTime = saleStartTime + saleDuration;
    });

    const newItinerary: GarageSaleItinerary = {
      id: crypto.randomUUID(),
      user_id: 'current-user',
      name: `Garage Sale Route - ${new Date().toLocaleDateString()}`,
      date: selectedSales[0].sale_date,
      sale_ids: optimizedOrder.map(s => s.id),
      optimized_route: {
        waypoints,
        total_distance_km: Math.round(totalDistance * 100) / 100,
        total_duration_minutes: totalDuration,
        start_location: startLocation,
        end_location: {
          latitude: optimizedOrder[optimizedOrder.length - 1].latitude,
          longitude: optimizedOrder[optimizedOrder.length - 1].longitude,
        },
      },
      total_distance_km: Math.round(totalDistance * 100) / 100,
      estimated_duration_minutes: totalDuration,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      sales: optimizedOrder,
    };

    setItinerary(newItinerary);
    setOptimizing(false);
  };

  // Nearest Neighbor TSP Algorithm
  function nearestNeighborTSP(
    sales: GarageSale[],
    start: { latitude: number; longitude: number }
  ): GarageSale[] {
    const unvisited = [...sales];
    const route: GarageSale[] = [];
    let currentLat = start.latitude;
    let currentLng = start.longitude;

    while (unvisited.length > 0) {
      let nearestIndex = 0;
      let nearestDistance = Infinity;

      unvisited.forEach((sale, index) => {
        const distance = calculateDistance(currentLat, currentLng, sale.latitude, sale.longitude);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      const nearest = unvisited.splice(nearestIndex, 1)[0];
      route.push(nearest);
      currentLat = nearest.latitude;
      currentLng = nearest.longitude;
    }

    return route;
  }

  function parseTime(timeStr: string): number {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  }

  function formatMinutesToTime(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  }

  return (
    <div className="space-y-6">
      {/* Instructions */}
      <div className="bg-gradient-to-r from-aurora-purple/20 to-aurora-blue/20 rounded-xl p-6 border border-aurora-purple/30">
        <h2 className="text-2xl font-bold text-white mb-2">🛣️ Smart Route Planner</h2>
        <p className="text-gray-300 mb-4">
          Select multiple garage sales and we'll create the most efficient route for you!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <div className="font-bold text-white">Select Sales</div>
              <div className="text-gray-400">Choose sales to visit</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <div className="font-bold text-white">Optimize Route</div>
              <div className="text-gray-400">Get best order to visit</div>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">3️⃣</span>
            <div>
              <div className="font-bold text-white">Hit the Road!</div>
              <div className="text-gray-400">Follow the itinerary</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Panel */}
      <div className="bg-dark-800 rounded-xl p-6 border border-aurora-green/20">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Selected Sales ({selectedSales.length})</h3>
          <button
            onClick={optimizeRoute}
            disabled={selectedSales.length < 2 || optimizing}
            className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-bold rounded-lg hover:shadow-aurora transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {optimizing ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin">⚙️</span> Optimizing...
              </span>
            ) : (
              '🚀 Generate Route'
            )}
          </button>
        </div>

        {selectedSales.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <div className="text-4xl mb-2">👆</div>
            <p>Select sales from the list or map above</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {selectedSales.map(sale => (
              <div
                key={sale.id}
                className="bg-dark-900 rounded-lg p-3 border border-gray-700 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="font-medium text-white text-sm mb-1">{sale.title}</div>
                  <div className="text-xs text-gray-400">{sale.address}</div>
                  <div className="text-xs text-gray-500 mt-1">{sale.start_time}</div>
                </div>
                <button
                  onClick={() => onSelectionChange(selectedSaleIds.filter(id => id !== sale.id))}
                  className="text-gray-500 hover:text-red-400 transition-colors ml-2"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Optimized Itinerary */}
      {itinerary && itinerary.optimized_route && (
        <div className="bg-gradient-to-br from-aurora-green/10 to-aurora-blue/10 rounded-xl p-6 border-2 border-aurora-green/30">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">✅ Your Optimized Route</h3>
              <div className="flex gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">🎯 Total Distance:</span>
                  <span className="font-bold text-aurora-green">
                    {itinerary.total_distance_km} km
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">⏱️ Estimated Time:</span>
                  <span className="font-bold text-aurora-blue">
                    {Math.floor(itinerary.estimated_duration_minutes! / 60)}h{' '}
                    {itinerary.estimated_duration_minutes! % 60}m
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">📍 Stops:</span>
                  <span className="font-bold text-aurora-purple">{itinerary.sale_ids.length}</span>
                </div>
              </div>
            </div>
            <button className="px-4 py-2 bg-aurora-green/20 text-aurora-green hover:bg-aurora-green/30 rounded-lg transition-colors font-medium text-sm">
              💾 Save Itinerary
            </button>
          </div>

          {/* Route Steps */}
          <div className="space-y-3">
            {itinerary.optimized_route.waypoints.map((waypoint, index) => {
              const sale = itinerary.sales?.find(s => s.id === waypoint.sale_id);
              if (!sale) return null;

              return (
                <div key={waypoint.sale_id} className="relative">
                  {/* Connector Line */}
                  {index < itinerary.optimized_route!.waypoints.length - 1 && (
                    <div className="absolute left-[23px] top-[60px] w-0.5 h-[calc(100%+12px)] bg-gradient-to-b from-aurora-green to-aurora-blue"></div>
                  )}

                  <div className="bg-dark-800 rounded-lg p-4 border border-gray-700 hover:border-aurora-green/40 transition-all">
                    <div className="flex items-start gap-4">
                      {/* Step Number */}
                      <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-aurora-green to-aurora-blue flex items-center justify-center text-white font-bold text-lg">
                        {waypoint.order}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="font-bold text-white text-lg">{sale.title}</h4>
                            <p className="text-sm text-gray-400">📍 {sale.address}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-aurora-green">
                              {waypoint.estimated_arrival_time}
                            </div>
                            <div className="text-xs text-gray-500">Estimated Arrival</div>
                          </div>
                        </div>

                        {/* Travel Info */}
                        {index > 0 && (
                          <div className="flex gap-4 text-sm text-gray-400 mb-2">
                            <span>
                              🚗 {waypoint.distance_from_previous_km.toFixed(1)} km from previous
                            </span>
                            <span>⏱️ ~{waypoint.duration_from_previous_minutes} min drive</span>
                          </div>
                        )}

                        {/* Sale Tags */}
                        <div className="flex flex-wrap gap-2">
                          {sale.tags.slice(0, 3).map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-aurora-purple/20 text-aurora-purple rounded text-xs"
                            >
                              {tag}
                            </span>
                          ))}
                          <span className="px-2 py-1 bg-dark-900 text-gray-400 rounded text-xs">
                            {sale.start_time} - {sale.end_time}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="mt-6 flex gap-3">
            <button className="flex-1 px-6 py-3 bg-aurora-green text-white font-bold rounded-lg hover:bg-aurora-green/90 transition-colors">
              🗺️ Open in Maps
            </button>
            <button className="flex-1 px-6 py-3 bg-aurora-blue text-white font-bold rounded-lg hover:bg-aurora-blue/90 transition-colors">
              📤 Share Itinerary
            </button>
            <button className="flex-1 px-6 py-3 bg-aurora-purple text-white font-bold rounded-lg hover:bg-aurora-purple/90 transition-colors">
              📅 Add to Calendar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
