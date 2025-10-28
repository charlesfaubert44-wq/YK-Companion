// YK Buddy - Garage Sales Screen Demo for Expo Snack
// Copy this entire file to https://snack.expo.dev/

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';

// Mock garage sales data
const mockGarageSales = [
  {
    id: '1',
    title: 'Moving Sale - Everything Must Go!',
    description: 'Furniture, appliances, winter gear, and more',
    address: '123 Franklin Ave, Yellowknife',
    sale_date: '2025-06-15',
    start_time: '09:00',
    end_time: '16:00',
    tags: ['furniture', 'winter gear', 'household'],
    cash_only: true,
    host_name: 'Sarah M.',
    distance_km: 2.3,
  },
  {
    id: '2',
    title: 'Kids Toys & Clothes',
    description: 'Baby gear, toys, and clothing sizes 0-5',
    address: '456 Old Airport Rd, Yellowknife',
    sale_date: '2025-06-15',
    start_time: '10:00',
    end_time: '14:00',
    tags: ['kids', 'toys', 'baby gear', 'clothes'],
    cash_only: false,
    host_name: 'Mike & Anna',
    distance_km: 4.1,
  },
  {
    id: '3',
    title: 'Fishing & Camping Gear',
    description: 'Rods, tackle, tents, and outdoor equipment',
    address: '789 Range Lake Rd, Yellowknife',
    sale_date: '2025-06-22',
    start_time: '09:00',
    end_time: '15:00',
    tags: ['fishing', 'camping', 'outdoor', 'sports'],
    cash_only: true,
    host_name: 'John D.',
    distance_km: 5.7,
  },
];

const popularTags = ['furniture', 'winter gear', 'kids', 'tools', 'electronics', 'outdoor'];

export default function App() {
  const [viewMode, setViewMode] = useState('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState([]);

  const toggleTag = (tag) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const filteredSales = mockGarageSales.filter(sale => {
    const matchesSearch =
      searchQuery === '' ||
      sale.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sale.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTags =
      selectedTags.length === 0 ||
      selectedTags.some(tag => sale.tags.includes(tag));

    return matchesSearch && matchesTags;
  });

  const handleSalePress = (sale) => {
    Alert.alert(
      sale.title,
      `${sale.description}\n\n📍 ${sale.address}\n⏰ ${sale.start_time} - ${sale.end_time}\n💵 ${sale.cash_only ? 'Cash only' : 'Cash or e-transfer'}`,
      [
        { text: 'Get Directions' },
        { text: 'Save' },
        { text: 'Close' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Garage Sales</Text>
        <Text style={styles.countText}>{filteredSales.length} sales</Text>
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
        {popularTags.map(tag => (
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
          <View style={styles.listContainer}>
            {filteredSales.map(sale => (
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
                    <Text style={styles.infoText}>{sale.address.split(',')[0]}</Text>
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
            ))}
          </View>
        ) : (
          <View style={styles.mapPlaceholder}>
            <Text style={styles.mapEmoji}>🗺️</Text>
            <Text style={styles.mapText}>Map View</Text>
            <Text style={styles.mapSubtext}>{filteredSales.length} sales in Yellowknife</Text>
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

      {/* Demo Info */}
      <View style={styles.demoInfo}>
        <Text style={styles.demoText}>🎨 YK Buddy Garage Sales Demo</Text>
      </View>
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
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
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
    padding: 60,
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
    color: '#10B981',
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
  demoInfo: {
    padding: 8,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
  },
  demoText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
});
