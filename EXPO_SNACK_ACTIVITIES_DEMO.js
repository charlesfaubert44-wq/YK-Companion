// YK Buddy - Activities Screen Demo for Expo Snack
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

const mockActivities = [
  {
    id: '1',
    name: 'Dog Sledding Adventure',
    description: 'Experience mushing your own team of huskies across frozen lakes.',
    category: 'adventure',
    difficulty: 'moderate',
    duration: 180,
    price: 295,
    location: { address: 'Old Airport Road', distance: '15 km' },
    rating: 4.9,
    reviewCount: 127,
    isIndigenousOwned: false,
  },
  {
    id: '2',
    name: 'Aurora Viewing Tour',
    description: 'Prime aurora viewing with heated cabin and expert guides.',
    category: 'aurora',
    difficulty: 'easy',
    duration: 240,
    price: 189,
    location: { address: 'Aurora Village', distance: '25 km' },
    rating: 4.8,
    reviewCount: 342,
    isIndigenousOwned: false,
  },
  {
    id: '3',
    name: 'Ice Fishing Experience',
    description: 'Learn traditional ice fishing and catch northern pike.',
    category: 'fishing',
    difficulty: 'easy',
    duration: 240,
    price: 175,
    location: { address: 'Great Slave Lake', distance: '10 km' },
    rating: 4.7,
    reviewCount: 89,
    isIndigenousOwned: true,
  },
  {
    id: '4',
    name: 'Cultural Heritage Tour',
    description: 'Learn about Dene and Métis history from Indigenous guides.',
    category: 'culture',
    difficulty: 'easy',
    duration: 150,
    price: 125,
    location: { address: 'Heritage Centre', distance: '2 km' },
    rating: 4.9,
    reviewCount: 215,
    isIndigenousOwned: true,
  },
];

const categories = [
  { id: 'all', label: 'All', emoji: '🏔️' },
  { id: 'aurora', label: 'Aurora', emoji: '🌌' },
  { id: 'adventure', label: 'Adventure', emoji: '🎿' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'fishing', label: 'Fishing', emoji: '🎣' },
];

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = mockActivities.filter(activity => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesSearch = searchQuery === '' ||
      activity.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'challenging': return '#EF4444';
      default: return '#9CA3AF';
    }
  };

  const formatDuration = (minutes) => {
    if (minutes >= 1440) return 'Full Day';
    if (minutes >= 60) return `${Math.floor(minutes / 60)}h`;
    return `${minutes}m`;
  };

  const handleActivityPress = (activity) => {
    Alert.alert(
      activity.name,
      `${activity.description}\n\n⏱️ ${formatDuration(activity.duration)}\n💵 $${activity.price}\n📍 ${activity.location.address}\n⭐ ${activity.rating} (${activity.reviewCount} reviews)`,
      [
        { text: 'Book Now' },
        { text: 'Save' },
        { text: 'Close' },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Activities</Text>
        <Text style={styles.countText}>{filteredActivities.length} found</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search activities..."
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

      {/* Category Filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryChip,
              selectedCategory === category.id && styles.categoryChipActive,
            ]}
            onPress={() => setSelectedCategory(category.id)}
          >
            <Text style={styles.categoryEmoji}>{category.emoji}</Text>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category.id && styles.categoryTextActive,
              ]}
            >
              {category.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Activities List */}
      <ScrollView style={styles.content}>
        <View style={styles.listContainer}>
          {filteredActivities.map(activity => (
            <TouchableOpacity
              key={activity.id}
              style={styles.activityCard}
              onPress={() => handleActivityPress(activity)}
            >
              {/* Image Placeholder */}
              <View style={styles.imagePlaceholder}>
                <Text style={styles.imagePlaceholderEmoji}>
                  {categories.find(c => c.id === activity.category)?.emoji || '🏔️'}
                </Text>
              </View>

              <View style={styles.activityContent}>
                {/* Header */}
                <View style={styles.activityHeader}>
                  <View style={styles.activityTitleRow}>
                    <Text style={styles.activityName} numberOfLines={2}>
                      {activity.name}
                    </Text>
                    {activity.isIndigenousOwned && (
                      <Text style={styles.indigenousBadge}>🪶</Text>
                    )}
                  </View>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>⭐ {activity.rating}</Text>
                    <Text style={styles.reviewsText}>({activity.reviewCount})</Text>
                  </View>
                </View>

                {/* Description */}
                <Text style={styles.description} numberOfLines={2}>
                  {activity.description}
                </Text>

                {/* Info Row */}
                <View style={styles.infoRow}>
                  <View style={styles.infoBadge}>
                    <Text style={styles.infoText}>⏱️ {formatDuration(activity.duration)}</Text>
                  </View>
                  <View
                    style={[
                      styles.difficultyBadge,
                      { borderColor: getDifficultyColor(activity.difficulty) },
                    ]}
                  >
                    <Text
                      style={[
                        styles.difficultyText,
                        { color: getDifficultyColor(activity.difficulty) },
                      ]}
                    >
                      {activity.difficulty}
                    </Text>
                  </View>
                  <View style={styles.infoBadge}>
                    <Text style={styles.infoText}>📍 {activity.location.distance}</Text>
                  </View>
                </View>

                {/* Footer */}
                <View style={styles.activityFooter}>
                  <Text style={styles.priceText}>${activity.price}</Text>
                  <Text style={styles.perPersonText}>per person</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Demo Info */}
      <View style={styles.demoInfo}>
        <Text style={styles.demoText}>🎨 YK Buddy Activities Demo</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    margin: 16,
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
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginRight: 8,
  },
  categoryChipActive: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderColor: '#10B981',
  },
  categoryEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  categoryText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#10B981',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  listContainer: {
    padding: 16,
  },
  activityCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    marginBottom: 16,
    overflow: 'hidden',
  },
  imagePlaceholder: {
    width: 120,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderEmoji: {
    fontSize: 48,
  },
  activityContent: {
    flex: 1,
    padding: 12,
  },
  activityHeader: {
    marginBottom: 8,
  },
  activityTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  activityName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 4,
  },
  indigenousBadge: {
    fontSize: 16,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
    marginRight: 4,
  },
  reviewsText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  description: {
    fontSize: 13,
    color: '#9CA3AF',
    lineHeight: 18,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  infoBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  infoText: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  difficultyBadge: {
    borderWidth: 1,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  activityFooter: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  priceText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10B981',
    marginRight: 4,
  },
  perPersonText: {
    fontSize: 12,
    color: '#9CA3AF',
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
