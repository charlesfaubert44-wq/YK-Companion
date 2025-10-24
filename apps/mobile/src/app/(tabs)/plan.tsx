import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

export default function PlanScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Trip Planner</Text>
        <Text style={styles.subtitle}>Build your perfect itinerary</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Your Trips</Text>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>+ Create New Trip</Text>
        </TouchableOpacity>

        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>📅</Text>
          <Text style={styles.emptyTitle}>No trips yet</Text>
          <Text style={styles.emptyText}>
            Start planning your Yellowknife adventure!
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Planning Tools</Text>
        
        <TouchableOpacity style={styles.toolCard}>
          <View style={styles.toolContent}>
            <Text style={styles.toolEmoji}>💰</Text>
            <View style={styles.toolText}>
              <Text style={styles.toolTitle}>Cost Calculator</Text>
              <Text style={styles.toolSubtitle}>Estimate your trip budget</Text>
            </View>
            <Text style={styles.toolArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolCard}>
          <View style={styles.toolContent}>
            <Text style={styles.toolEmoji}>🎯</Text>
            <View style={styles.toolText}>
              <Text style={styles.toolTitle}>Traveler Quiz</Text>
              <Text style={styles.toolSubtitle}>Get personalized recommendations</Text>
            </View>
            <Text style={styles.toolArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.toolCard}>
          <View style={styles.toolContent}>
            <Text style={styles.toolEmoji}>📦</Text>
            <View style={styles.toolText}>
              <Text style={styles.toolTitle}>Packing List</Text>
              <Text style={styles.toolSubtitle}>What to bring for -40°C</Text>
            </View>
            <Text style={styles.toolArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Suggested Itineraries</Text>
        
        <View style={styles.itineraryCard}>
          <Text style={styles.itineraryTitle}>Weekend Aurora Hunter</Text>
          <Text style={styles.itineraryDuration}>3 days • Winter</Text>
          <Text style={styles.itineraryDescription}>
            Perfect for aurora viewing with flexible activities
          </Text>
        </View>

        <View style={styles.itineraryCard}>
          <Text style={styles.itineraryTitle}>Summer Explorer</Text>
          <Text style={styles.itineraryDuration}>5 days • Summer</Text>
          <Text style={styles.itineraryDescription}>
            Kayaking, hiking, and midnight sun experiences
          </Text>
        </View>
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
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 12,
  },
  createButton: {
    backgroundColor: colors.aurora.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
  },
  createButtonText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  toolCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 12,
  },
  toolContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  toolEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  toolText: {
    flex: 1,
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  toolSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  toolArrow: {
    fontSize: 20,
    color: colors.aurora.green,
  },
  itineraryCard: {
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itineraryTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 6,
  },
  itineraryDuration: {
    fontSize: 13,
    color: colors.aurora.blue,
    marginBottom: 8,
  },
  itineraryDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    lineHeight: 20,
  },
});
