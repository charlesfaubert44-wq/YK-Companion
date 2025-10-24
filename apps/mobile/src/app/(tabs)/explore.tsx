import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

const activities = [
  { id: 1, title: 'Aurora Viewing', emoji: '🌌', season: 'Winter', difficulty: 'Easy' },
  { id: 2, title: 'Dog Sledding', emoji: '🐕', season: 'Winter', difficulty: 'Moderate' },
  { id: 3, title: 'Ice Fishing', emoji: '🎣', season: 'Winter', difficulty: 'Easy' },
  { id: 4, title: 'Snowmobiling', emoji: '🛷', season: 'Winter', difficulty: 'Moderate' },
  { id: 5, title: 'Kayaking', emoji: '🚣', season: 'Summer', difficulty: 'Moderate' },
  { id: 6, title: 'Hiking', emoji: '🥾', season: 'Summer', difficulty: 'Varies' },
  { id: 7, title: 'Wildlife Viewing', emoji: '🦌', season: 'All Year', difficulty: 'Easy' },
  { id: 8, title: 'Indigenous Culture', emoji: '🎨', season: 'All Year', difficulty: 'Easy' },
];

export default function ExploreScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore Activities</Text>
        <Text style={styles.subtitle}>Discover what Yellowknife has to offer</Text>
      </View>

      <View style={styles.filterSection}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
          <TouchableOpacity style={[styles.filterButton, styles.filterButtonActive]}>
            <Text style={styles.filterTextActive}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Winter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Summer</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Easy</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Moderate</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      <View style={styles.activitiesSection}>
        {activities.map((activity) => (
          <TouchableOpacity key={activity.id} style={styles.activityCard}>
            <Text style={styles.activityEmoji}>{activity.emoji}</Text>
            <View style={styles.activityInfo}>
              <Text style={styles.activityTitle}>{activity.title}</Text>
              <View style={styles.activityMeta}>
                <Text style={styles.activityMetaText}>{activity.season}</Text>
                <Text style={styles.activityMetaDot}>•</Text>
                <Text style={styles.activityMetaText}>{activity.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.activityArrow}>→</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.background.card,
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: colors.aurora.green,
  },
  filterText: {
    color: colors.text.secondary,
    fontSize: 14,
  },
  filterTextActive: {
    color: colors.background.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  activitiesSection: {
    padding: 20,
    paddingTop: 10,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  activityEmoji: {
    fontSize: 32,
    marginRight: 12,
  },
  activityInfo: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 4,
  },
  activityMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityMetaText: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  activityMetaDot: {
    fontSize: 13,
    color: colors.text.secondary,
    marginHorizontal: 6,
  },
  activityArrow: {
    fontSize: 20,
    color: colors.aurora.green,
  },
});
