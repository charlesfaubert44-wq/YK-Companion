'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SavedGarageSalesProps {
  userId: string;
}

interface SavedGarageSale {
  id: string;
  garage_sale_id: string;
  created_at: string;
  garage_sale: {
    id: string;
    title: string;
    address: string;
    sale_date: string;
    start_time: string;
    end_time: string;
    items_description?: string;
  };
}

/**
 * SavedGarageSales Component
 *
 * Displays user's saved garage sales with ability to remove from saved.
 */
export default function SavedGarageSales({ userId }: SavedGarageSalesProps) {
  const [savedSales, setSavedSales] = useState<SavedGarageSale[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);

  useEffect(() => {
    fetchSavedSales();
  }, [userId]);

  const fetchSavedSales = async () => {
    try {
      const response = await fetch(`/api/favorites?type=garage-sales`);
      if (response.ok) {
        const data = await response.json();
        setSavedSales(data.favorites || []);
      }
    } catch (error) {
      console.error('Error fetching saved garage sales:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = async (favoriteId: string) => {
    if (!confirm('Remove this garage sale from your saved items?')) {
      return;
    }

    setRemoving(favoriteId);
    try {
      const response = await fetch(`/api/favorites?id=${favoriteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSavedSales(prev => prev.filter(sale => sale.id !== favoriteId));
      }
    } catch (error) {
      console.error('Error removing garage sale:', error);
      alert('Failed to remove garage sale');
    } finally {
      setRemoving(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-12 h-12 border-4 border-aurora-blue border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (savedSales.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🏷️</div>
        <h3 className="text-2xl font-bold text-white mb-2">No Saved Garage Sales</h3>
        <p className="text-gray-400 mb-6">You haven't saved any garage sales yet</p>
        <Link
          href="/living/garage-sales"
          className="inline-block px-6 py-3 bg-gradient-to-r from-aurora-green to-aurora-blue text-white font-semibold rounded-lg hover:shadow-aurora transition"
        >
          Browse Garage Sales
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {savedSales.map(saved => (
        <div
          key={saved.id}
          className="bg-dark-900/50 backdrop-blur-lg border border-gray-700/50 rounded-xl p-6 hover:border-aurora-green/50 transition"
        >
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white pr-4">{saved.garage_sale.title}</h3>
            <button
              onClick={() => handleRemove(saved.id)}
              disabled={removing === saved.id}
              className="text-red-400 hover:text-red-300 transition disabled:opacity-50"
              title="Remove from saved"
            >
              {removing === saved.id ? '...' : '❌'}
            </button>
          </div>

          <div className="space-y-2 text-sm text-gray-300 mb-4">
            <div className="flex items-center gap-2">
              <span>📍</span>
              <span>{saved.garage_sale.address}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{new Date(saved.garage_sale.sale_date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>🕐</span>
              <span>
                {saved.garage_sale.start_time} - {saved.garage_sale.end_time}
              </span>
            </div>
          </div>

          {saved.garage_sale.items_description && (
            <p className="text-gray-400 text-sm line-clamp-2 mb-4">
              {saved.garage_sale.items_description}
            </p>
          )}

          <Link
            href={`/living/garage-sales`}
            className="inline-block px-4 py-2 bg-aurora-blue/20 text-aurora-blue hover:bg-aurora-blue/30 rounded-lg transition text-sm font-medium"
          >
            View Details →
          </Link>

          <div className="mt-3 pt-3 border-t border-gray-700/50 text-xs text-gray-500">
            Saved {new Date(saved.created_at).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}
