'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GarageSale, GarageSaleFilters as GarageSaleFiltersType } from '@/types/garage-sales.types';
import GarageSaleMap from '@/components/garage-sales/GarageSaleMap';
import GarageSaleList from '@/components/garage-sales/GarageSaleList';
import GarageSaleFilters from '@/components/garage-sales/GarageSaleFilters';
import ItineraryGenerator from '@/components/garage-sales/ItineraryGenerator';
import AddSaleButton from '@/components/garage-sales/AddSaleButton';
import FunnyLoginPrompt from '@/components/auth/FunnyLoginPrompt';
import Link from 'next/link';

type ViewMode = 'map' | 'list' | 'calendar' | 'itinerary';

export default function GarageSalesPage() {
  const { user, loading: authLoading } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('map');
  const [garageSales, setGarageSales] = useState<GarageSale[]>([]);
  const [filteredSales, setFilteredSales] = useState<GarageSale[]>([]);
  const [filters, setFilters] = useState<GarageSaleFiltersType>({});
  const [loading, setLoading] = useState(true);
  const [selectedSales, setSelectedSales] = useState<string[]>([]);

  const fetchGarageSales = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual Supabase call
      // const { data, error } = await supabase
      //   .from('garage_sales')
      //   .select('*')
      //   .eq('status', 'active')
      //   .gte('sale_date', new Date().toISOString().split('T')[0])
      //   .order('sale_date', { ascending: true });

      // Mock data for now
      const mockSales: GarageSale[] = [
        {
          id: '1',
          user_id: '1',
          title: 'Moving Sale - Everything Must Go!',
          description: 'We\'re moving south and need to sell everything! Furniture, appliances, tools, winter gear, and more.',
          address: '50 Street, Yellowknife, NT',
          latitude: 62.4540,
          longitude: -114.3718,
          location_details: null,
          sale_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          start_time: '09:00',
          end_time: '17:00',
          photos: [],
          tags: ['furniture', 'appliances', 'tools', 'winter gear'],
          items_description: 'Sectional couch, dining table set, KitchenAid mixer, snow blower, skis, camping equipment',
          cash_only: true,
          early_birds_welcome: false,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          host_name: 'John Smith',
          save_count: 12,
        },
        {
          id: '2',
          user_id: '2',
          title: 'Multi-Family Garage Sale',
          description: 'Three families combined for a huge sale! Kids toys, clothes, household items, and more.',
          address: 'Bretzlaff Drive, Yellowknife, NT',
          latitude: 62.4620,
          longitude: -114.3950,
          location_details: 'Driveway and garage',
          sale_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          start_time: '10:00',
          end_time: '16:00',
          photos: [],
          tags: ['kids', 'toys', 'clothes', 'household'],
          items_description: 'Baby gear, toys (ages 0-10), books, kitchen items, decorations',
          cash_only: false,
          early_birds_welcome: true,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          host_name: 'The Johnsons',
          save_count: 8,
        },
        {
          id: '3',
          user_id: '3',
          title: 'Tools & Equipment Sale',
          description: 'Downsizing workshop. Power tools, hand tools, fishing gear, and outdoor equipment.',
          address: 'Lessard Drive, Yellowknife, NT',
          latitude: 62.4450,
          longitude: -114.3600,
          location_details: 'Basement entrance on side of house',
          sale_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          start_time: '08:00',
          end_time: '14:00',
          photos: [],
          tags: ['tools', 'fishing', 'outdoor'],
          items_description: 'Dewalt drill set, table saw, fishing rods, tackle boxes, canoe paddles',
          cash_only: true,
          early_birds_welcome: true,
          status: 'active',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          host_name: 'Mike Thompson',
          save_count: 5,
        },
      ];

      setGarageSales(mockSales);
    } catch (error) {
      console.error('Error fetching garage sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...garageSales];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(sale =>
        sale.title.toLowerCase().includes(searchLower) ||
        sale.description?.toLowerCase().includes(searchLower) ||
        sale.items_description?.toLowerCase().includes(searchLower) ||
        sale.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      filtered = filtered.filter(sale =>
        filters.tags!.some(tag => sale.tags.includes(tag))
      );
    }

    // Date range filter
    if (filters.date_from) {
      filtered = filtered.filter(sale => sale.sale_date >= filters.date_from!);
    }
    if (filters.date_to) {
      filtered = filtered.filter(sale => sale.sale_date <= filters.date_to!);
    }

    // Cash only filter
    if (filters.cash_only) {
      filtered = filtered.filter(sale => sale.cash_only);
    }

    // Early birds filter
    if (filters.early_birds_only) {
      filtered = filtered.filter(sale => sale.early_birds_welcome);
    }

    setFilteredSales(filtered);
  };

  const handleToggleSelection = (saleId: string) => {
    setSelectedSales(prev =>
      prev.includes(saleId)
        ? prev.filter(id => id !== saleId)
        : [...prev, saleId]
    );
  };

  // Fetch garage sales from Supabase
  useEffect(() => {
    if (user) {
      fetchGarageSales();
    }
  }, [user]);

  // Apply filters whenever filters or sales change
  useEffect(() => {
    applyFilters();
  }, [filters, garageSales, applyFilters]);

  // Show funny login prompt if not authenticated
  if (!authLoading && !user) {
    return <FunnyLoginPrompt section="living" featureName="Garage Sale Planner" />;
  }

  // Show loading state while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-northern-midnight flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-aurora-green border-t-transparent mb-4"></div>
          <p className="text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-900 via-dark-800 to-northern-midnight">
      {/* Header */}
      <div className="bg-northern-midnight/80 backdrop-blur-lg border-b border-aurora-green/10 sticky top-0 z-30">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link
                href="/living"
                className="text-aurora-green hover:text-aurora-blue transition-colors inline-flex items-center gap-2 mb-2"
              >
                ← Back to Living
              </Link>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-aurora-green via-aurora-blue to-aurora-purple bg-clip-text text-transparent">
                Garage Sale Planner
              </h1>
              <p className="text-gray-300 mt-2">
                Find garage sales in Yellowknife • Plan your route • Save your favorites
              </p>
            </div>
            <AddSaleButton />
          </div>

          {/* View Mode Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            {[
              { mode: 'map' as ViewMode, label: '🗺️ Map', icon: 'map' },
              { mode: 'list' as ViewMode, label: '📋 List', icon: 'list' },
              { mode: 'calendar' as ViewMode, label: '📅 Calendar', icon: 'calendar' },
              { mode: 'itinerary' as ViewMode, label: '🛣️ Route Planner', icon: 'route' },
            ].map(({ mode, label }) => (
              <button
                key={mode}
                onClick={() => setViewMode(mode)}
                className={`
                  px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all
                  ${viewMode === mode
                    ? 'bg-gradient-to-r from-aurora-green to-aurora-blue text-white shadow-aurora'
                    : 'bg-dark-800 text-gray-400 hover:text-white hover:bg-dark-700'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-4 py-6">
        <GarageSaleFilters
          filters={filters}
          onFiltersChange={setFilters}
          resultsCount={filteredSales.length}
        />
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 pb-12">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-aurora-green border-t-transparent mb-4"></div>
              <p className="text-gray-400">Loading garage sales...</p>
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'map' && (
              <GarageSaleMap
                sales={filteredSales}
                selectedSales={selectedSales}
                onToggleSelection={handleToggleSelection}
              />
            )}

            {viewMode === 'list' && (
              <GarageSaleList
                sales={filteredSales}
                selectedSales={selectedSales}
                onToggleSelection={handleToggleSelection}
                enableSelection={false}
              />
            )}

            {viewMode === 'calendar' && (
              <div className="bg-dark-800 rounded-xl p-8 border border-aurora-green/20">
                <h2 className="text-2xl font-bold text-white mb-6">📅 Calendar View</h2>
                <p className="text-gray-400">Calendar view coming soon...</p>
                {/* TODO: Implement calendar view */}
              </div>
            )}

            {viewMode === 'itinerary' && (
              <ItineraryGenerator
                allSales={filteredSales}
                selectedSaleIds={selectedSales}
                onSelectionChange={setSelectedSales}
              />
            )}
          </>
        )}

        {/* Empty State */}
        {!loading && filteredSales.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-white mb-2">No garage sales found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your filters or check back later
            </p>
            <button
              onClick={() => setFilters({})}
              className="px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>

      {/* Floating Stats */}
      {filteredSales.length > 0 && (
        <div className="fixed bottom-6 right-6 bg-dark-800 border border-aurora-green/20 rounded-lg px-6 py-4 shadow-xl">
          <div className="text-center">
            <div className="text-3xl font-bold text-aurora-green">{filteredSales.length}</div>
            <div className="text-sm text-gray-400">Active Sales</div>
          </div>
          {selectedSales.length > 0 && (
            <div className="text-center mt-3 pt-3 border-t border-gray-700">
              <div className="text-2xl font-bold text-aurora-blue">{selectedSales.length}</div>
              <div className="text-sm text-gray-400">Selected</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
