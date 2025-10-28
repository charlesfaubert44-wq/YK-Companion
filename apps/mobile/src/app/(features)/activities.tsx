import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Mock activities data
const mockActivities = [
  {
    id: '1',
    name: 'Dog Sledding Adventure',
    description:
      'Experience the thrill of mushing your own team of huskies across frozen lakes and through snowy forests.',
    category: 'adventure',
    seasons: ['winter'],
    difficulty: 'moderate',
    duration: 180,
    price: 295,
    location: {
      address: 'Old Airport Road',
      city: 'Yellowknife',
      distance: '15 km',
    },
    images: [],
    tags: ['dog sledding', 'winter', 'adventure', 'family-friendly'],
    rating: 4.9,
    reviewCount: 127,
    isIndigenousOwned: false,
    isIndoorOption: false,
  },
  {
    id: '2',
    name: 'Aurora Viewing Tour',
    description:
      'Prime aurora viewing location with heated cabin, hot beverages, and expert guides.',
    category: 'aurora',
    seasons: ['winter', 'fall', 'spring'],
    difficulty: 'easy',
    duration: 240,
    price: 189,
    location: {
      address: 'Aurora Village',
      city: 'Yellowknife',
      distance: '25 km',
    },
    images: [],
    tags: ['aurora', 'photography', 'night tour', 'heated cabin'],
    rating: 4.8,
    reviewCount: 342,
    isIndigenousOwned: false,
    isIndoorOption: false,
  },
  {
    id: '3',
    name: 'Ice Fishing Experience',
    description:
      'Learn traditional ice fishing techniques and catch your own northern pike or lake trout.',
    category: 'fishing',
    seasons: ['winter'],
    difficulty: 'easy',
    duration: 240,
    price: 175,
    location: {
      address: 'Great Slave Lake',
      city: 'Yellowknife',
      distance: '10 km',
    },
    images: [],
    tags: ['fishing', 'ice fishing', 'winter', 'food'],
    rating: 4.7,
    reviewCount: 89,
    isIndigenousOwned: true,
    isIndoorOption: false,
  },
  {
    id: '4',
    name: 'Cultural Heritage Tour',
    description:
      'Learn about Dene and Métis history, traditions, and contemporary culture from Indigenous guides.',
    category: 'culture',
    seasons: ['winter', 'spring', 'summer', 'fall'],
    difficulty: 'easy',
    duration: 150,
    price: 125,
    location: {
      address: 'Prince of Wales Northern Heritage Centre',
      city: 'Yellowknife',
      distance: '2 km',
    },
    images: [],
    tags: ['culture', 'indigenous', 'history', 'museum'],
    rating: 4.9,
    reviewCount: 215,
    isIndigenousOwned: true,
    isIndoorOption: true,
  },
  {
    id: '5',
    name: 'Houseboat Adventure',
    description:
      'Explore Great Slave Lake on a unique houseboat stay with fishing, kayaking, and wilderness views.',
    category: 'summer_activities',
    seasons: ['summer'],
    difficulty: 'easy',
    duration: 1440, // Full day
    price: 450,
    location: {
      address: 'Yellowknife Bay',
      city: 'Yellowknife',
      distance: '5 km',
    },
    images: [],
    tags: ['houseboat', 'summer', 'water activities', 'unique'],
    rating: 5.0,
    reviewCount: 67,
    isIndigenousOwned: false,
    isIndoorOption: false,
  },
  {
    id: '6',
    name: 'Snowmobiling Tour',
    description:
      'Ride across frozen tundra and through boreal forests on a guided snowmobile adventure.',
    category: 'winter_sports',
    seasons: ['winter'],
    difficulty: 'moderate',
    price: 325,
    duration: 240,
    location: {
      address: 'Ingraham Trail',
      city: 'Yellowknife',
      distance: '20 km',
    },
    images: [],
    tags: ['snowmobile', 'winter', 'adventure', 'speed'],
    rating: 4.8,
    reviewCount: 103,
    isIndigenousOwned: false,
    isIndoorOption: false,
  },
];

const categories = [
  { id: 'all', label: 'All', emoji: '🏔️' },
  { id: 'aurora', label: 'Aurora', emoji: '🌌' },
  { id: 'adventure', label: 'Adventure', emoji: '🎿' },
  { id: 'culture', label: 'Culture', emoji: '🏛️' },
  { id: 'wildlife', label: 'Wildlife', emoji: '🐻' },
  { id: 'fishing', label: 'Fishing', emoji: '🎣' },
  { id: 'winter_sports', label: 'Winter', emoji: '⛷️' },
  { id: 'summer_activities', label: 'Summer', emoji: '☀️' },
];

export default function ActivitiesScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      activity.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return '#10B981';
      case 'moderate':
        return '#F59E0B';
      case 'challenging':
        return '#EF4444';
      default:
        return '#9CA3AF';
    }
  };

  const formatPrice = (price: number) => {
    return `$${price}`;
  };

  const formatDuration = (minutes: number) => {
    if (minutes >= 1440) return 'Full Day';
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      return `${hours}h`;
    }
    return `${minutes}m`;
  };

  const handleActivityPress = (activity: (typeof mockActivities)[0]) => {
    Alert.alert(
      activity.name,
      `${activity.description}\n\n⏱️ Duration: ${formatDuration(activity.duration)}\n💵 Price: ${formatPrice(activity.price)}\n📍 ${activity.location.address}\n${activity.isIndigenousOwned ? '🪶 Indigenous-owned\n' : ''}⭐ ${activity.rating} (${activity.reviewCount} reviews)`,
      [
        { text: 'Book Now', onPress: () => Alert.alert('Booking', 'Opening booking system...') },
        { text: 'Save', onPress: () => Alert.alert('Saved', 'Added to your saved activities!') },
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
        <Text style={styles.title}>Activities</Text>
        <View style={styles.headerRight}>
          <Text style={styles.countText}>{filteredActivities.length} found</Text>
        </View>
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
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
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
        {filteredActivities.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No activities found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or filters</Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {filteredActivities.map((activity) => (
              <TouchableOpacity
                key={activity.id}
                style={styles.activityCard}
                onPress={() => handleActivityPress(activity)}
              >
                {/* Image Placeholder */}
                <View style={styles.imagePlaceholder}>
                  <Text style={styles.imagePlaceholderEmoji}>
                    {categories.find((c) => c.id === activity.category)?.emoji || '🏔️'}
                  </Text>
                </View>

                <View style={styles.activityContent}>
                  {/* Header */}
                  <View style={styles.activityHeader}>
                    <View style={styles.activityTitleRow}>
                      <Text style={styles.activityName} numberOfLines={2}>
                        {activity.name}
                      </Text>
                      {activity.isIndigenousOwned && <Text style={styles.indigenousBadge}>🪶</Text>}
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
                    <Text style={styles.priceText}>{formatPrice(activity.price)}</Text>
                    <Text style={styles.perPersonText}>per person</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
});
