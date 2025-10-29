'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GarageSale, Coordinates } from '@/types/garage-sales.types';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import InteractiveHeader from '@/components/InteractiveHeader';
import SaleFilters from '@/components/garage-sales/SaleFilters';
import ListView from '@/components/garage-sales/ListView';
import CalendarView from '@/components/garage-sales/CalendarView';
import AddSaleModal from '@/components/garage-sales/AddSaleModal';
import { useGarageSales } from '@/hooks/useGarageSales';

// Dynamically import MapView to avoid SSR issues with Mapbox
const MapView = dynamic(() => import('@/components/garage-sales/MapView'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] md:h-[500px] bg-dark-800 rounded-xl flex items-center justify-center border border-gray-700">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-aurora-green border-t-transparent mb-4"></div>
        <div className="text-gray-400">Loading map...</div>
      </div>
    </div>
  ),
});

type ViewMode = 'list' | 'map' | 'calendar';

/**
 * Garage Sales Page
 * 
 * Complete garage sales marketplace with:
 * - Multiple view modes (list, map, calendar)
 * - Advanced filtering (search, date, distance, tags)
 * - User location support
 * - Add/Edit/Delete sales (auth required)
 * - Favorite/save sales
 * - Responsive design
 * 
 * Features:
 * - Real-time filtering
 * - Distance calculations from user location
 * - Interactive map with markers
 * - Monthly calendar view
 * - Detailed sale cards
 */
export default function GarageSalesPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [userLocation, setUserLocation] = useState<Coordinates | undefined>();
  const [locationLoading, setLocationLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSale, setEditingSale] = useState<GarageSale | null>(null);
  const [highlightedSaleId, setHighlightedSaleId] = useState<string | null>(null);
  const [favoritedSaleIds, setFavoritedSaleIds] = useState<string[]>([]);

  // Use custom hook for garage sales management
  const {
    sales,
    loading,
    error,
    filters,
    setFilters,
    fetchSales,
    saveSale,
    deleteSale,
    toggleFavorite,
    getFavorites,
  } = useGarageSales(userLocation);

  // Fetch user's favorites on mount
  useEffect(() => {
    if (user) {
      getFavorites(user.id).then(setFavoritedSaleIds);
    }
  }, [user, getFavorites]);

  // Request user's location
  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationLoading(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to get your location. Please check your browser permissions.');
        setLocationLoading(false);
      }
    );
  }, []);

  // Auto-request location on mount (optional)
  useEffect(() => {
    // Uncomment to auto-request location
    // requestLocation();
  }, []);

  const handleAddSale = () => {
    if (!user) {
      alert('Please sign in to add a garage sale');
      return;
    }
    setEditingSale(null);
    setShowAddModal(true);
  };

  const handleEditSale = (sale: GarageSale) => {
    if (!user || sale.user_id !== user.id) {
      alert('You can only edit your own garage sales');
      return;
    }
    setEditingSale(sale);
    setShowAddModal(true);
  };

  const handleSaveSale = async (saleData: Partial<GarageSale>) => {
    if (!user) return;

    const savedSale = await saveSale(saleData, user.id);
    if (savedSale) {
      setShowAddModal(false);
      setEditingSale(null);
    } else {
      throw new Error('Failed to save garage sale');
    }
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!user) return;
    
    const success = await deleteSale(saleId, user.id);
    if (!success) {
      alert('Failed to delete garage sale');
    }
  };

  const handleFavorite = async (saleId: string) => {
    if (!user) {
      alert('Please sign in to save garage sales');
      return;
    }

    const isFavorited = await toggleFavorite(saleId, user.id);
    if (isFavorited) {
      setFavoritedSaleIds(prev => [...prev, saleId]);
    } else {
      setFavoritedSaleIds(prev => prev.filter(id => id !== saleId));
    }
  };

  const handleSaleClick = (sale: GarageSale) => {
    // Switch to list view and highlight the sale
    setHighlightedSaleId(sale.id);
    setViewMode('list');
    
    // Scroll to sale card
    setTimeout(() => {
      const element = document.getElementById(`sale-${sale.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 100);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  if (loading && sales.length === 0) {
    return (
      <>
        <InteractiveHeader />
        <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20 flex items-center justify-center">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-aurora-green border-t-transparent mb-4"></div>
            <p className="text-gray-400">Loading garage sales...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <InteractiveHeader />
      <div className="min-h-screen bg-gradient-to-b from-northern-midnight via-dark-800 to-gray-900 pt-20">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumbs */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <Link href="/" className="hover:text-aurora-green transition-colors">
                YK Buddy
              </Link>
              <span>›</span>
              <Link href="/living" className="hover:text-aurora-green transition-colors">
                Living
              </Link>
              <span>›</span>
              <span className="text-white">Garage Sales</span>
            </div>
          </div>

          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Garage Sales
              </h1>
              <p className="text-gray-400">
                Find great deals in your neighborhood
              </p>
            </div>

            <div className="flex gap-2">
              {!userLocation && (
                <button
                  onClick={requestLocation}
                  disabled={locationLoading}
                  className="px-4 py-2 bg-dark-800 border border-aurora-purple text-aurora-purple font-semibold rounded-lg hover:bg-aurora-purple/10 transition-all text-sm whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <span className="inline-block w-4 h-4 border-2 border-aurora-purple border-t-transparent rounded-full animate-spin"></span>
                      Getting Location...
                    </>
                  ) : (
                    <>
                      <span>📍</span>
                      <span>Enable Location</span>
                    </>
                  )}
                </button>
              )}
              
              <button
                onClick={handleAddSale}
                className="px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm whitespace-nowrap flex items-center gap-2"
              >
                <span>+</span>
                <span>Add Sale</span>
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6">
            <SaleFilters
              filters={filters}
              onFiltersChange={setFilters}
              userLocation={userLocation}
              onRequestLocation={requestLocation}
            />
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-6 overflow-x-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                viewMode === 'list'
                  ? 'bg-aurora-green text-white shadow-lg'
                  : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              <span>📋</span>
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                viewMode === 'calendar'
                  ? 'bg-aurora-green text-white shadow-lg'
                  : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              <span>📅</span>
              <span>Calendar</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 min-w-[100px] px-4 py-2 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                viewMode === 'map'
                  ? 'bg-aurora-green text-white shadow-lg'
                  : 'bg-dark-800 text-gray-400 hover:text-white border border-gray-700'
              }`}
            >
              <span>🗺️</span>
              <span>Map</span>
            </button>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">
                ⚠️ {error.message || 'An error occurred while loading garage sales'}
              </p>
            </div>
          )}

          {/* Main Content */}
          <div>
            {/* List View */}
            {viewMode === 'list' && (
              <ListView
                sales={sales}
                currentUserId={user?.id}
                favoritedSaleIds={favoritedSaleIds}
                onEdit={handleEditSale}
                onDelete={handleDeleteSale}
                onFavorite={handleFavorite}
                onSaleClick={handleSaleClick}
                loading={loading}
                emptyMessage={
                  filters.search || filters.tags?.length || filters.date_from || filters.date_to
                    ? 'No garage sales match your filters'
                    : 'No garage sales found'
                }
                emptyAction={
                  filters.search || filters.tags?.length || filters.date_from || filters.date_to
                    ? handleClearFilters
                    : undefined
                }
                emptyActionLabel="Clear Filters"
              />
            )}

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="space-y-4">
                <MapView
                  sales={sales}
                  userLocation={userLocation}
                  highlightedSaleId={highlightedSaleId}
                  onSaleClick={handleSaleClick}
                  onMarkerHover={setHighlightedSaleId}
                />

                {/* Mini List Below Map */}
                {sales.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                      <span>📍</span>
                      <span>Sales on Map ({sales.length})</span>
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {sales.map(sale => (
                        <button
                          key={sale.id}
                          onClick={() => {
                            setHighlightedSaleId(sale.id);
                            // Scroll map to show this marker
                          }}
                          className={`bg-dark-800 rounded-lg p-3 border transition-all text-left ${
                            highlightedSaleId === sale.id
                              ? 'border-aurora-green'
                              : 'border-gray-700 hover:border-gray-600'
                          }`}
                        >
                          <h3 className="font-semibold text-white text-sm mb-1">{sale.title}</h3>
                          <p className="text-xs text-gray-400 mb-2">{sale.address}</p>
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-aurora-green">
                              {new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              {' • '}
                              {sale.start_time}
                            </span>
                            {sale.distance_km !== undefined && (
                              <span className="text-aurora-purple">
                                {sale.distance_km < 1
                                  ? `${Math.round(sale.distance_km * 1000)}m`
                                  : `${sale.distance_km.toFixed(1)}km`}
                              </span>
                            )}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Calendar View */}
            {viewMode === 'calendar' && (
              <CalendarView
                sales={sales}
                onSaleClick={handleSaleClick}
              />
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AddSaleModal
        sale={editingSale}
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingSale(null);
        }}
        onSave={handleSaveSale}
      />
    </>
  );
}
