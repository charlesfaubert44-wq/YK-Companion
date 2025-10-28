import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import type { GarageSale } from '@yk-trip-planner/types';

// Mock garage sales data
const mockGarageSales: GarageSale[] = [
  {
    id: '1',
    user_id: 'user1',
    title: 'Moving Sale - Everything Must Go!',
    description: 'Furniture, appliances, winter gear, and more',
    address: '123 Franklin Ave, Yellowknife',
    latitude: 62.454,
    longitude: -114.3718,
    location_details: 'Behind Northern United Place',
    sale_date: '2025-06-15',
    start_time: '09:00',
    end_time: '16:00',
    photos: [],
    tags: ['furniture', 'winter gear', 'household'],
    items_description: 'Moving to Vancouver - selling everything!',
    cash_only: true,
    early_birds_welcome: false,
    status: 'active',
    created_at: '2025-06-01',
    updated_at: '2025-06-01',
    host_name: 'Sarah M.',
    distance_km: 2.3,
  },
  {
    id: '2',
    user_id: 'user2',
    title: 'Kids Toys & Clothes',
    description: 'Baby gear, toys, and clothing sizes 0-5',
    address: '456 Old Airport Rd, Yellowknife',
    latitude: 62.4625,
    longitude: -114.3845,
    location_details: null,
    sale_date: '2025-06-15',
    start_time: '10:00',
    end_time: '14:00',
    photos: [],
    tags: ['kids', 'toys', 'baby gear', 'clothes'],
    items_description: 'Gently used baby items and kids toys',
    cash_only: false,
    early_birds_welcome: true,
    status: 'active',
    created_at: '2025-06-02',
    updated_at: '2025-06-02',
    host_name: 'Mike & Anna',
    distance_km: 4.1,
  },
  {
    id: '3',
    user_id: 'user3',
    title: 'Fishing & Camping Gear',
    description: 'Rods, tackle, tents, and outdoor equipment',
    address: '789 Range Lake Rd, Yellowknife',
    latitude: 62.4502,
    longitude: -114.3924,
    location_details: 'Green house on the corner',
    sale_date: '2025-06-22',
    start_time: '09:00',
    end_time: '15:00',
    photos: [],
    tags: ['fishing', 'camping', 'outdoor', 'sports'],
    items_description: 'Quality fishing and camping equipment',
    cash_only: true,
    early_birds_welcome: true,
    status: 'active',
    created_at: '2025-06-03',
    updated_at: '2025-06-03',
    host_name: 'John D.',
    distance_km: 5.7,
  },
];

export default function GarageSalesScreen() {
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const popularTags = ['furniture', 'winter gear', 'kids', 'tools', 'electronics', 'outdoor'];

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const filteredSales = mockGarageSales.filter((sale) => {
    const matchesSearch =
      searchQuery === '' ||
      sale.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.description?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 || selectedTags.some((tag) => sale.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleSalePress = (sale: GarageSale) => {
    Alert.alert(
      sale.title,
      `${sale.description}\n\n📍 ${sale.address}\n⏰ ${sale.start_time} - ${sale.end_time}\n💵 ${sale.cash_only ? 'Cash only' : 'Cash or e-transfer'}\n\n${sale.items_description}`,
      [
        { text: 'Get Directions', onPress: () => Alert.alert('Directions', 'Opening maps...') },
        { text: 'Save', onPress: () => Alert.alert('Saved', 'Added to your saved sales!') },
        { text: 'Close' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Garage Sales</Text>
        <View style={styles.headerRight}>
          <Text style={styles.countText}>{filteredSales.length} sales</Text>
        </View>
      </View>

      {/* View Mode Toggle */}
      <View style={styles.viewModeContainer}>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'list' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('list')}
        >
          <Text style={[styles.viewModeText, viewMode === 'list' && styles.viewModeTextActive]}>
            📋 List
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.viewModeButton, viewMode === 'map' && styles.viewModeButtonActive]}
          onPress={() => setViewMode('map')}
        >
          <Text style={[styles.viewModeText, viewMode === 'map' && styles.viewModeTextActive]}>
            🗺️ Map
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search garage sales..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery !== '' && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.clearText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Tag Filters */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tagsContainer}>
        {popularTags.map((tag) => (
          <TouchableOpacity
            key={tag}
            style={[styles.tagChip, selectedTags.includes(tag) && styles.tagChipActive]}
            onPress={() => toggleTag(tag)}
          >
            <Text style={[styles.tagText, selectedTags.includes(tag) && styles.tagTextActive]}>
              {tag}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.content}>
        {viewMode === 'list' ? (
          // List View
          <View style={styles.listContainer}>
            {filteredSales.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyEmoji}>🔍</Text>
                <Text style={styles.emptyText}>No garage sales found</Text>
                <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
              </View>
            ) : (
              filteredSales.map((sale) => (
                <TouchableOpacity
                  key={sale.id}
                  style={styles.saleCard}
                  onPress={() => handleSalePress(sale)}
                >
                  <View style={styles.saleHeader}>
                    <Text style={styles.saleTitle}>{sale.title}</Text>
                    <Text style={styles.saleDistance}>{sale.distance_km} km</Text>
                  </View>

                  <Text style={styles.saleDescription} numberOfLines={2}>
                    {sale.description}
                  </Text>

                  <View style={styles.saleInfo}>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>📍</Text>
                      <Text style={styles.infoText} numberOfLines={1}>
                        {sale.address.split(',')[0]}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>📅</Text>
                      <Text style={styles.infoText}>
                        {new Date(sale.sale_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </Text>
                    </View>
                    <View style={styles.infoRow}>
                      <Text style={styles.infoIcon}>⏰</Text>
                      <Text style={styles.infoText}>
                        {sale.start_time} - {sale.end_time}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.saleTags}>
                    {sale.tags.slice(0, 3).map((tag, idx) => (
                      <View key={idx} style={styles.saleTag}>
                        <Text style={styles.saleTagText}>{tag}</Text>
                      </View>
                    ))}
                    {sale.tags.length > 3 && (
                      <Text style={styles.moreTagsText}>+{sale.tags.length - 3}</Text>
                    )}
                  </View>

                  <View style={styles.saleFooter}>
                    <Text style={styles.hostName}>👤 {sale.host_name}</Text>
                    {sale.cash_only && (
                      <View style={styles.cashBadge}>
                        <Text style={styles.cashBadgeText}>💵 Cash only</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </View>
        ) : (
          // Map View Placeholder
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapSubtext}>Interactive map with garage sale locations</Text>
            <Text style={styles.mapNote}>{filteredSales.length} sales in Yellowknife</Text>
            <TouchableOpacity
              style={styles.mapButton}
              onPress={() => Alert.alert('Map View', 'Map integration coming soon!')}
            >
              <Text style={styles.mapButtonText}>View on Map</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Add Sale Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => Alert.alert('Add Sale', 'Create a new garage sale listing')}
      >
        <Text style={styles.addButtonText}>+ Add Your Sale</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
  },
  backButton: {
    padding: 8,
  },
  backText: {
    color: '#10B981',
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    minWidth: 70,
    alignItems: 'flex-end',
  },
  countText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  viewModeContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  viewModeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  viewModeButtonActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  viewModeText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '600',
  },
  viewModeTextActive: {
    color: '#10B981',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginHorizontal: 16,
    marginBottom: 12,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 12,
  },
  clearText: {
    color: '#9CA3AF',
    fontSize: 18,
    padding: 4,
  },
  tagsContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  tagChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  tagChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  tagText: {
    color: '#9CA3AF',
    fontSize: 14,
  },
  tagTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  saleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 16,
    marginBottom: 16,
  },
  saleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  saleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 8,
  },
  saleDistance: {
    fontSize: 14,
    color: '#10B981',
    fontWeight: '600',
  },
  saleDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 12,
    lineHeight: 20,
  },
  saleInfo: {
    gap: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoIcon: {
    fontSize: 14,
    marginRight: 8,
    width: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#FFFFFF',
    flex: 1,
  },
  saleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  saleTag: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saleTagText: {
    fontSize: 12,
    color: '#10B981',
  },
  moreTagsText: {
    fontSize: 12,
    color: '#9CA3AF',
    alignSelf: 'center',
  },
  saleFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  hostName: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  cashBadge: {
    backgroundColor: 'rgba(251, 191, 36, 0.1)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  cashBadgeText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '600',
  },
  mapPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  mapEmoji: {
    fontSize: 80,
    marginBottom: 16,
  },
  mapText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  mapSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 24,
  },
  mapNote: {
    fontSize: 14,
    color: '#10B981',
    marginBottom: 24,
  },
  mapButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  mapButtonText: {
    color: '#0A1128',
    fontSize: 16,
    fontWeight: '600',
  },
  addButton: {
    backgroundColor: '#10B981',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#0A1128',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
