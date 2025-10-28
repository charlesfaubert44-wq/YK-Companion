'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { GarageSale, CreateGarageSaleInput } from '@/types/garage-sales.types';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import Header from '@/components/Header';
import { createClient } from '@/lib/supabase/client';

// Dynamically import map to avoid SSR issues
const MapView = dynamic(() => import('@/components/garage-sales/SimpleMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] bg-dark-800 rounded-xl flex items-center justify-center">
      <div className="text-gray-400">Loading map...</div>
    </div>
  ),
});

type ViewMode = 'list' | 'map' | 'calendar';

export default function GarageSalesPage() {
  const { user } = useAuth();
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [garageSales, setGarageSales] = useState<GarageSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSale, setEditingSale] = useState<GarageSale | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch garage sales from Supabase
  const fetchGarageSales = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const today = new Date().toISOString().split('T')[0];

      // Query garage sales with joined profile data for host_name
      const { data, error } = await supabase
        .from('garage_sales')
        .select(`
          *,
          profiles!garage_sales_user_id_fkey (
            full_name,
            email
          )
        `)
        .eq('status', 'active')
        .eq('is_active', true)
        .gte('sale_date', today)
        .order('sale_date', { ascending: true });

      if (error) {
        console.error('Error fetching garage sales:', error);
        // Fallback to mock data for demo
        loadMockData();
        return;
      }

      // Transform data to match GarageSale type with host_name
      const transformedSales: GarageSale[] = (data || []).map((sale: any) => ({
        ...sale,
        host_name: sale.profiles?.full_name || 'Anonymous',
        host_email: sale.profiles?.email,
      }));

      setGarageSales(transformedSales);
    } catch (error) {
      console.error('Error fetching garage sales:', error);
      // Fallback to mock data for demo
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

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
        tags: ['furniture', 'appliances', 'tools'],
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
        tags: ['kids', 'toys', 'clothes'],
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
    setGarageSales(mockSales);
  };

  useEffect(() => {
    fetchGarageSales();
  }, []);

  // Filter sales based on search
  const filteredSales = garageSales.filter(sale => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      sale.title.toLowerCase().includes(query) ||
      sale.description?.toLowerCase().includes(query) ||
      sale.items_description?.toLowerCase().includes(query) ||
      sale.tags.some(tag => tag.toLowerCase().includes(query))
    );
  });

  const handleAddSale = () => {
    if (!user) {
      alert('Please sign in to add a garage sale');
      return;
    }
    setEditingSale(null);
    setShowAddForm(true);
  };

  const handleEditSale = (sale: GarageSale) => {
    if (!user || sale.user_id !== user.id) {
      alert('You can only edit your own garage sales');
      return;
    }
    setEditingSale(sale);
    setShowAddForm(true);
  };

  const handleDeleteSale = async (saleId: string) => {
    if (!user) return;
    if (!confirm('Are you sure you want to delete this garage sale?')) return;

    try {
      const supabase = createClient();

      const { error } = await supabase
        .from('garage_sales')
        .delete()
        .eq('id', saleId)
        .eq('user_id', user.id); // Ensure user can only delete their own sales

      if (error) {
        console.error('Error deleting garage sale:', error);
        alert('Failed to delete garage sale');
        return;
      }

      setGarageSales(prev => prev.filter(s => s.id !== saleId));
    } catch (error) {
      console.error('Error deleting garage sale:', error);
      alert('Error deleting garage sale');
    }
  };

  if (loading) {
    return (
      <>
        <Header />
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
      <Header />
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
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                Garage Sales
              </h1>
              <p className="text-gray-400">
                {filteredSales.length} active {filteredSales.length === 1 ? 'sale' : 'sales'}
              </p>
            </div>

            <button
              onClick={handleAddSale}
              className="px-4 py-2 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all text-sm whitespace-nowrap"
            >
              + Add Sale
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="Search sales..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 bg-dark-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none"
            />
            <svg className="absolute left-3 top-3.5 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* View Toggle */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setViewMode('list')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list'
                  ? 'bg-aurora-green text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'calendar'
                  ? 'bg-aurora-green text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              📅 Calendar
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'map'
                  ? 'bg-aurora-green text-white'
                  : 'bg-dark-800 text-gray-400 hover:text-white'
              }`}
            >
              🗺️ Map
            </button>
          </div>

          {/* Main Content */}
          <div>
            {/* Add/Edit Form */}
            {showAddForm && (
              <AddEditSaleForm
                sale={editingSale}
                onClose={() => {
                  setShowAddForm(false);
                  setEditingSale(null);
                }}
                onSave={(sale) => {
                  if (editingSale) {
                    setGarageSales(prev => prev.map(s => s.id === sale.id ? sale : s));
                  } else {
                    setGarageSales(prev => [sale, ...prev]);
                  }
                  setShowAddForm(false);
                  setEditingSale(null);
                }}
              />
            )}

            {/* List View */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredSales.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📦</div>
                    <h3 className="text-xl font-bold text-white mb-2">No garage sales found</h3>
                    <p className="text-gray-400 mb-6">
                      {searchQuery ? 'Try a different search' : 'Be the first to add one!'}
                    </p>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="px-6 py-3 bg-dark-800 text-white rounded-lg hover:bg-dark-700 transition-all"
                    >
                      Clear Search
                    </button>
                  </div>
                ) : (
                  filteredSales.map(sale => (
                    <SaleCard
                      key={sale.id}
                      sale={sale}
                      currentUserId={user?.id}
                      onEdit={() => handleEditSale(sale)}
                      onDelete={() => handleDeleteSale(sale.id)}
                    />
                  ))
                )}
              </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && (
              <div className="space-y-4">
                <MapView sales={filteredSales} />

                {/* Mini List Below Map */}
                <div className="space-y-3">
                  {filteredSales.map(sale => (
                    <div key={sale.id} className="bg-dark-800 rounded-lg p-3 border border-gray-700">
                      <h3 className="font-semibold text-white text-sm mb-1">{sale.title}</h3>
                      <p className="text-xs text-gray-400 mb-2">{sale.address}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-aurora-green">
                          {new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          {' • '}
                          {sale.start_time}
                        </span>
                        <a
                          href={`https://www.google.com/maps/dir/?api=1&destination=${sale.latitude},${sale.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-aurora-blue hover:underline"
                        >
                          Get Directions →
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              filteredSales.map(sale => (
                <div key={sale.id} id={`sale-${sale.id}`}>
                  <SaleCard
                    sale={sale}
                    currentUserId={user?.id}
                    onEdit={() => handleEditSale(sale)}
                    onDelete={() => handleDeleteSale(sale.id)}
                  />
                </div>
              ))
            )}
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <CalendarView
            sales={filteredSales}
            onSaleClick={(sale) => {
              // Could open a modal or navigate to detail view
              const saleCard = document.getElementById(`sale-${sale.id}`);
              if (saleCard) {
                setViewMode('list');
                setTimeout(() => saleCard.scrollIntoView({ behavior: 'smooth', block: 'center' }), 100);
              }
            }}
          />
        )}

        {/* Map View */}
        {viewMode === 'map' && (
          <div className="space-y-4">
            <MapView sales={filteredSales} />

            {/* Mini List Below Map */}
            <div className="space-y-3">
              {filteredSales.map(sale => (
                <div key={sale.id} className="bg-dark-800 rounded-lg p-3 border border-gray-700">
                  <h3 className="font-semibold text-white text-sm mb-1">{sale.title}</h3>
                  <p className="text-xs text-gray-400 mb-2">{sale.address}</p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-aurora-green">
                      {new Date(sale.sale_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      {' • '}
                      {sale.start_time}
                    </span>
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${sale.latitude},${sale.longitude}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-aurora-blue hover:underline"
                    >
                      Get Directions →
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

// Sale Card Component
function SaleCard({
  sale,
  currentUserId,
  onEdit,
  onDelete,
}: {
  sale: GarageSale;
  currentUserId?: string;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const isOwner = currentUserId === sale.user_id;
  const saleDate = new Date(sale.sale_date);
  const today = new Date();
  const daysUntil = Math.ceil((saleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-dark-800 rounded-xl p-4 border border-gray-700 hover:border-aurora-green/30 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-white mb-1">{sale.title}</h3>
          <p className="text-sm text-gray-400">{sale.host_name}</p>
        </div>

        {isOwner && (
          <div className="flex gap-2">
            <button
              onClick={onEdit}
              className="p-2 text-aurora-blue hover:bg-dark-700 rounded-lg transition-all"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="p-2 text-red-400 hover:bg-dark-700 rounded-lg transition-all"
            >
              🗑️
            </button>
          </div>
        )}
      </div>

      {/* Description */}
      {sale.description && (
        <p className="text-sm text-gray-300 mb-3">{sale.description}</p>
      )}

      {/* Date & Time */}
      <div className="flex items-center gap-4 mb-3 text-sm flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-aurora-green">📅</span>
          <span className="text-white font-medium">
            {saleDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
          </span>
          {daysUntil === 0 && (
            <span className="px-2 py-0.5 bg-red-500/20 text-red-400 rounded text-xs font-medium">
              TODAY
            </span>
          )}
          {daysUntil === 1 && (
            <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 rounded text-xs font-medium">
              TOMORROW
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-aurora-blue">🕐</span>
          <span className="text-gray-400">{sale.start_time} - {sale.end_time}</span>
        </div>
      </div>

      {/* Location */}
      <div className="flex items-start gap-2 mb-3">
        <span className="text-aurora-purple mt-0.5">📍</span>
        <div className="flex-1">
          <p className="text-sm text-gray-300">{sale.address}</p>
          {sale.location_details && (
            <p className="text-xs text-gray-500 mt-1">{sale.location_details}</p>
          )}
        </div>
      </div>

      {/* Tags */}
      {sale.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {sale.tags.slice(0, 5).map(tag => (
            <span
              key={tag}
              className="px-2 py-1 bg-dark-700 text-gray-300 text-xs rounded-lg"
            >
              {tag}
            </span>
          ))}
          {sale.tags.length > 5 && (
            <span className="px-2 py-1 text-gray-500 text-xs">
              +{sale.tags.length - 5} more
            </span>
          )}
        </div>
      )}

      {/* Items */}
      {sale.items_description && (
        <p className="text-sm text-gray-400 mb-3 italic">
          Items: {sale.items_description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-700 flex-wrap gap-3">
        <div className="flex gap-3 text-xs">
          {sale.cash_only && (
            <span className="text-green-400">💵 Cash Only</span>
          )}
          {sale.early_birds_welcome && (
            <span className="text-yellow-400">🐦 Early Birds OK</span>
          )}
        </div>

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${sale.latitude},${sale.longitude}`}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition-all text-sm font-medium"
        >
          Get Directions →
        </a>
      </div>
    </div>
  );
}

// Add/Edit Form Component
function AddEditSaleForm({
  sale,
  onClose,
  onSave,
}: {
  sale: GarageSale | null;
  onClose: () => void;
  onSave: (sale: GarageSale) => void;
}) {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateGarageSaleInput>({
    title: sale?.title || '',
    description: sale?.description || '',
    address: sale?.address || '',
    latitude: sale?.latitude || 62.4540,
    longitude: sale?.longitude || -114.3718,
    location_details: sale?.location_details || '',
    sale_date: sale?.sale_date || new Date().toISOString().split('T')[0],
    start_time: sale?.start_time || '09:00',
    end_time: sale?.end_time || '17:00',
    tags: sale?.tags || [],
    items_description: sale?.items_description || '',
    cash_only: sale?.cash_only || false,
    early_birds_welcome: sale?.early_birds_welcome || false,
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSaving(true);
    try {
      const supabase = createClient();

      if (sale) {
        // Update existing garage sale
        const { data, error } = await supabase
          .from('garage_sales')
          .update({
            ...formData,
            updated_at: new Date().toISOString(),
          })
          .eq('id', sale.id)
          .eq('user_id', user.id) // Ensure user can only update their own sales
          .select(`
            *,
            profiles!garage_sales_user_id_fkey (
              full_name,
              email
            )
          `)
          .single();

        if (error) {
          console.error('Error updating garage sale:', error);
          alert('Failed to update garage sale');
          return;
        }

        const savedSale: GarageSale = {
          ...data,
          host_name: data.profiles?.full_name || 'Anonymous',
          host_email: data.profiles?.email,
        };
        onSave(savedSale);
      } else {
        // Create new garage sale
        const { data, error } = await supabase
          .from('garage_sales')
          .insert({
            ...formData,
            user_id: user.id,
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

        if (error) {
          console.error('Error creating garage sale:', error);
          alert('Failed to create garage sale');
          return;
        }

        const savedSale: GarageSale = {
          ...data,
          host_name: data.profiles?.full_name || 'Anonymous',
          host_email: data.profiles?.email,
        };
        onSave(savedSale);
      }
    } catch (error) {
      console.error('Error saving garage sale:', error);
      alert('Error saving garage sale');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-4 bg-black/80 overflow-y-auto">
      <div className="w-full max-w-2xl bg-dark-800 rounded-xl border border-gray-700 my-8">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-700">
          <h2 className="text-xl font-bold text-white">
            {sale ? 'Edit Garage Sale' : 'Add Garage Sale'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g., Moving Sale - Everything Must Go!"
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Brief description of your garage sale..."
              rows={3}
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none"
            />
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Address *
            </label>
            <input
              type="text"
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="e.g., 50 Street, Yellowknife, NT"
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none"
            />
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Date *
              </label>
              <input
                type="date"
                required
                value={formData.sale_date}
                onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:border-aurora-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                required
                value={formData.start_time}
                onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:border-aurora-green focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                End Time *
              </label>
              <input
                type="time"
                required
                value={formData.end_time}
                onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white focus:border-aurora-green focus:outline-none"
              />
            </div>
          </div>

          {/* Items Description */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              What are you selling?
            </label>
            <textarea
              value={formData.items_description}
              onChange={(e) => setFormData({ ...formData, items_description: e.target.value })}
              placeholder="e.g., Furniture, appliances, tools, winter gear..."
              rows={2}
              className="w-full px-4 py-2 bg-dark-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:border-aurora-green focus:outline-none"
            />
          </div>

          {/* Checkboxes */}
          <div className="space-y-2">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.cash_only}
                onChange={(e) => setFormData({ ...formData, cash_only: e.target.checked })}
                className="w-5 h-5 bg-dark-700 border-gray-600 rounded text-aurora-green focus:ring-aurora-green"
              />
              <span className="text-sm text-gray-300">Cash Only</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.early_birds_welcome}
                onChange={(e) => setFormData({ ...formData, early_birds_welcome: e.target.checked })}
                className="w-5 h-5 bg-dark-700 border-gray-600 rounded text-aurora-green focus:ring-aurora-green"
              />
              <span className="text-sm text-gray-300">Early Birds Welcome</span>
            </label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 bg-dark-700 text-white font-semibold rounded-lg hover:bg-dark-600 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : sale ? 'Update Sale' : 'Add Sale'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Calendar View Component
function CalendarView({
  sales,
  onSaleClick,
}: {
  sales: GarageSale[];
  onSaleClick: (sale: GarageSale) => void;
}) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get sales grouped by date
  const salesByDate = sales.reduce((acc, sale) => {
    const date = sale.sale_date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(sale);
    return acc;
  }, {} as Record<string, GarageSale[]>);

  // Get calendar days for current month
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(year, month + 1, 1));
  };

  const formatDateKey = (day: number) => {
    const date = new Date(year, month, day);
    return date.toISOString().split('T')[0];
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation */}
      <div className="flex items-center justify-between bg-dark-800 rounded-xl p-4 border border-gray-700">
        <button
          onClick={goToPreviousMonth}
          className="p-2 text-aurora-green hover:bg-dark-700 rounded-lg transition-all"
        >
          ← Previous
        </button>
        <h3 className="text-xl font-bold text-white">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button
          onClick={goToNextMonth}
          className="p-2 text-aurora-green hover:bg-dark-700 rounded-lg transition-all"
        >
          Next →
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-dark-800 rounded-xl p-4 border border-gray-700">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center text-xs font-semibold text-gray-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            if (day === null) {
              return <div key={`empty-${index}`} className="aspect-square" />;
            }

            const dateKey = formatDateKey(day);
            const daySales = salesByDate[dateKey] || [];
            const hasMultipleSales = daySales.length > 1;

            return (
              <div
                key={day}
                className={`aspect-square relative rounded-lg border transition-all ${
                  isToday(day)
                    ? 'border-aurora-green bg-aurora-green/10'
                    : daySales.length > 0
                    ? 'border-aurora-blue bg-aurora-blue/10 cursor-pointer hover:bg-aurora-blue/20'
                    : 'border-gray-700 bg-dark-700'
                }`}
              >
                {/* Day Number */}
                <div className="absolute top-1 left-1">
                  <span
                    className={`text-xs font-medium ${
                      isToday(day)
                        ? 'text-aurora-green'
                        : daySales.length > 0
                        ? 'text-white'
                        : 'text-gray-500'
                    }`}
                  >
                    {day}
                  </span>
                </div>

                {/* Sale Indicators */}
                {daySales.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1">
                    {hasMultipleSales ? (
                      <div className="text-center">
                        <span className="inline-block px-1.5 py-0.5 bg-aurora-blue text-white text-xs font-bold rounded">
                          {daySales.length}
                        </span>
                      </div>
                    ) : (
                      <div className="text-center">
                        <span className="text-aurora-blue text-lg">📦</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Click handler */}
                {daySales.length > 0 && (
                  <button
                    onClick={() => {
                      if (daySales.length === 1) {
                        onSaleClick(daySales[0]);
                      } else {
                        // Show list of sales for this day
                        const dayDiv = document.getElementById(`day-sales-${dateKey}`);
                        if (dayDiv) {
                          dayDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                      }
                    }}
                    className="absolute inset-0"
                    aria-label={`View ${daySales.length} sale${daySales.length > 1 ? 's' : ''} on ${day}`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Sales by Date Below Calendar */}
      {Object.keys(salesByDate).length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-white">Upcoming Sales</h3>
          {Object.entries(salesByDate)
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
            .map(([date, dateSales]) => {
              const saleDate = new Date(date + 'T00:00:00');
              return (
                <div key={date} id={`day-sales-${date}`} className="space-y-3">
                  <h4 className="text-md font-semibold text-aurora-green">
                    {saleDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                    })}
                    <span className="ml-2 text-sm text-gray-400">
                      ({dateSales.length} sale{dateSales.length > 1 ? 's' : ''})
                    </span>
                  </h4>
                  <div className="space-y-3">
                    {dateSales.map(sale => (
                      <div
                        key={sale.id}
                        className="bg-dark-700 rounded-lg p-3 border border-gray-700 hover:border-aurora-green/30 transition-all cursor-pointer"
                        onClick={() => onSaleClick(sale)}
                      >
                        <h5 className="font-semibold text-white text-sm mb-1">{sale.title}</h5>
                        <p className="text-xs text-gray-400 mb-2">{sale.address}</p>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-aurora-blue">
                            🕐 {sale.start_time} - {sale.end_time}
                          </span>
                          <span className="text-gray-500">
                            {sale.tags.slice(0, 2).join(', ')}
                            {sale.tags.length > 2 && ' +' + (sale.tags.length - 2)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {Object.keys(salesByDate).length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📅</div>
          <h3 className="text-xl font-bold text-white mb-2">No garage sales this month</h3>
          <p className="text-gray-400">Check back later or add one yourself!</p>
        </div>
      )}
    </div>
  );
}
