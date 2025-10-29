'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { GarageSale, GarageSaleFilters, Coordinates } from '@/types/garage-sales.types';

/**
 * Custom hook for managing garage sales data and operations
 * 
 * Provides:
 * - Fetching garage sales from Supabase
 * - Filtering by search, date range, distance, etc.
 * - CRUD operations for garage sales
 * - Distance calculations from user location
 * - Favorites/saved sales management
 * 
 * @example
 * ```tsx
 * const { sales, loading, fetchSales, addSale, deleteSale } = useGarageSales();
 * ```
 */
export function useGarageSales(userLocation?: Coordinates) {
  const [sales, setSales] = useState<GarageSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState<GarageSaleFilters>({});

  /**
   * Calculate distance between two coordinates in kilometers using Haversine formula
   */
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, []);

  /**
   * Fetch garage sales from Supabase with optional filters
   */
  const fetchSales = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      let query = supabase
        .from('garage_sales')
        .select(`
          *,
          profiles!garage_sales_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq('status', 'active')
        .eq('is_active', true);

      // Apply date filters
      if (filters.date_from) {
        query = query.gte('sale_date', filters.date_from);
      } else {
        // Default: only show future sales
        query = query.gte('sale_date', today);
      }

      if (filters.date_to) {
        query = query.lte('sale_date', filters.date_to);
      }

      // Apply cash_only filter
      if (filters.cash_only !== undefined) {
        query = query.eq('cash_only', filters.cash_only);
      }

      // Apply early_birds filter
      if (filters.early_birds_only !== undefined) {
        query = query.eq('early_birds_welcome', filters.early_birds_only);
      }

      query = query.order('sale_date', { ascending: true });

      const { data, error: fetchError } = await query;

      if (fetchError) {
        console.error('Error fetching garage sales:', fetchError);
        throw fetchError;
      }

      // Transform data to match GarageSale type with host_name and distance
      let transformedSales: GarageSale[] = (data || []).map((sale: any) => {
        const transformedSale: GarageSale = {
          ...sale,
          host_name: sale.profiles?.full_name || 'Anonymous',
          host_email: sale.profiles?.email,
        };

        // Calculate distance if user location is provided
        if (userLocation) {
          transformedSale.distance_km = calculateDistance(
            userLocation.latitude,
            userLocation.longitude,
            sale.latitude,
            sale.longitude
          );
        }

        return transformedSale;
      });

      // Apply search filter (client-side)
      if (filters.search) {
        const query = filters.search.toLowerCase();
        transformedSales = transformedSales.filter(sale =>
          sale.title.toLowerCase().includes(query) ||
          sale.description?.toLowerCase().includes(query) ||
          sale.items_description?.toLowerCase().includes(query) ||
          sale.address.toLowerCase().includes(query) ||
          sale.tags.some(tag => tag.toLowerCase().includes(query))
        );
      }

      // Apply tag filter
      if (filters.tags && filters.tags.length > 0) {
        transformedSales = transformedSales.filter(sale =>
          filters.tags!.some(filterTag => sale.tags.includes(filterTag))
        );
      }

      // Apply distance filter
      if (filters.max_distance_km !== undefined && userLocation) {
        transformedSales = transformedSales.filter(sale =>
          sale.distance_km !== undefined && sale.distance_km <= filters.max_distance_km!
        );
      }

      // Sort by distance if available
      if (userLocation) {
        transformedSales.sort((a, b) => {
          const distA = a.distance_km ?? Infinity;
          const distB = b.distance_km ?? Infinity;
          return distA - distB;
        });
      }

      setSales(transformedSales);
    } catch (err) {
      const error = err as Error;
      console.error('Error in fetchSales:', error);
      setError(error);
      
      // Load mock data for demo purposes
      loadMockData();
    } finally {
      setLoading(false);
    }
  }, [filters, userLocation, calculateDistance]);

  /**
   * Load mock data for demo/fallback
   */
  const loadMockData = () => {
    const mockSales: GarageSale[] = [
      {
        id: '1',
        user_id: '1',
        title: 'Moving Sale - Everything Must Go!',
        description: 'We\'re moving south! Furniture, appliances, tools, winter gear.',
        address: '50 Street, Yellowknife, NT',
        latitude: 62.4540,
        longitude: -114.3718,
        location_details: null,
        sale_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '09:00',
        end_time: '17:00',
        photos: [],
        tags: ['furniture', 'appliances', 'tools', 'winter gear'],
        items_description: 'Couch, dining table, snow blower, skis',
        cash_only: true,
        early_birds_welcome: false,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host_name: 'John Smith',
      },
      {
        id: '2',
        user_id: '2',
        title: 'Multi-Family Garage Sale',
        description: 'Three families! Kids toys, clothes, household items.',
        address: 'Bretzlaff Drive, Yellowknife, NT',
        latitude: 62.4620,
        longitude: -114.3950,
        location_details: 'Driveway and garage',
        sale_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '10:00',
        end_time: '16:00',
        photos: [],
        tags: ['kids', 'toys', 'clothes', 'household'],
        items_description: 'Baby gear, toys, books, kitchen items',
        cash_only: false,
        early_birds_welcome: true,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host_name: 'The Johnsons',
      },
      {
        id: '3',
        user_id: '3',
        title: 'Tools & Equipment Sale',
        description: 'Downsizing workshop. Power tools, hand tools, fishing gear.',
        address: 'Lessard Drive, Yellowknife, NT',
        latitude: 62.4450,
        longitude: -114.3600,
        location_details: null,
        sale_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        start_time: '08:00',
        end_time: '14:00',
        photos: [],
        tags: ['tools', 'fishing', 'outdoor'],
        items_description: 'Dewalt drill set, fishing rods, canoe paddles',
        cash_only: true,
        early_birds_welcome: true,
        status: 'active',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        host_name: 'Mike Thompson',
      },
    ];

    // Calculate distances if user location is available
    if (userLocation) {
      mockSales.forEach(sale => {
        sale.distance_km = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          sale.latitude,
          sale.longitude
        );
      });
    }

    setSales(mockSales);
  };

  /**
   * Add or update a garage sale
   */
  const saveSale = useCallback(async (saleData: Partial<GarageSale>, userId: string): Promise<GarageSale | null> => {
    try {
      const supabase = createClient();

      if (saleData.id) {
        // Update existing sale
        const { data, error } = await supabase
          .from('garage_sales')
          .update({
            ...saleData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', saleData.id)
          .eq('user_id', userId)
          .select(`
            *,
            profiles!garage_sales_user_id_fkey (
              full_name,
              email
            )
          `)
          .single();

        if (error) throw error;

        const savedSale: GarageSale = {
          ...data,
          host_name: data.profiles?.full_name || 'Anonymous',
          host_email: data.profiles?.email,
        };

        // Update local state
        setSales(prev => prev.map(s => s.id === savedSale.id ? savedSale : s));
        return savedSale;
      } else {
        // Create new sale
        const { data, error } = await supabase
          .from('garage_sales')
          .insert({
            ...saleData,
            user_id: userId,
            status: 'active',
            is_active: true,
          })
          .select(`
            *,
            profiles!garage_sales_user_id_fkey (
              full_name,
              email
            )
          `)
          .single();

        if (error) throw error;

        const savedSale: GarageSale = {
          ...data,
          host_name: data.profiles?.full_name || 'Anonymous',
          host_email: data.profiles?.email,
        };

        // Add to local state
        setSales(prev => [savedSale, ...prev]);
        return savedSale;
      }
    } catch (error) {
      console.error('Error saving garage sale:', error);
      setError(error as Error);
      return null;
    }
  }, []);

  /**
   * Delete a garage sale
   */
  const deleteSale = useCallback(async (saleId: string, userId: string): Promise<boolean> => {
    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('garage_sales')
        .delete()
        .eq('id', saleId)
        .eq('user_id', userId);

      if (error) throw error;

      // Remove from local state
      setSales(prev => prev.filter(s => s.id !== saleId));
      return true;
    } catch (error) {
      console.error('Error deleting garage sale:', error);
      setError(error as Error);
      return false;
    }
  }, []);

  /**
   * Toggle favorite/saved status for a sale
   */
  const toggleFavorite = useCallback(async (saleId: string, userId: string): Promise<boolean> => {
    try {
      const supabase = createClient();

      // Check if already saved
      const { data: existing } = await supabase
        .from('saved_garage_sales')
        .select('id')
        .eq('user_id', userId)
        .eq('sale_id', saleId)
        .single();

      if (existing) {
        // Remove from favorites
        const { error } = await supabase
          .from('saved_garage_sales')
          .delete()
          .eq('user_id', userId)
          .eq('sale_id', saleId);

        if (error) throw error;
        return false;
      } else {
        // Add to favorites
        const { error } = await supabase
          .from('saved_garage_sales')
          .insert({
            user_id: userId,
            sale_id: saleId,
          });

        if (error) throw error;
        return true;
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return false;
    }
  }, []);

  /**
   * Get saved/favorite sales for a user
   */
  const getFavorites = useCallback(async (userId: string): Promise<string[]> => {
    try {
      const supabase = createClient();

      const { data, error } = await supabase
        .from('saved_garage_sales')
        .select('sale_id')
        .eq('user_id', userId);

      if (error) throw error;

      return data.map((item: { sale_id: string }) => item.sale_id);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  }, []);

  // Fetch sales on mount and when filters change
  useEffect(() => {
    fetchSales();
  }, [fetchSales]);

  return {
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
  };
}

