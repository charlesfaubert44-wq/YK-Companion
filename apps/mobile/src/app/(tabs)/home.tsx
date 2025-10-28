import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, RefreshControl } from 'react-native';
import { colors } from '../../theme/colors';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setRefreshing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  }, []);

  const handleNavigation = (path: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push(path as any);
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          tintColor={colors.aurora.green}
          colors={[colors.aurora.green, colors.aurora.blue, colors.aurora.purple]}
          progressBackgroundColor={colors.background.card}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>TRUE NORTH TRIPS</Text>
        <Text style={styles.subtitle}>Navigate the North with Confidence</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>I'm...</Text>
        <View style={styles.cardGrid}>
          <TouchableOpacity
            style={[styles.typeCard, styles.visitingCard]}
            activeOpacity={0.7}
            onPress={() => handleNavigation('/(tabs)/plan')}
          >
            <Text style={styles.cardEmoji}>🧳</Text>
            <Text style={styles.cardTitle}>Visiting</Text>
            <Text style={styles.cardText}>Plan your trip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeCard, styles.livingCard]}
            activeOpacity={0.7}
            onPress={() => handleNavigation('/(tabs)/explore')}
          >
            <Text style={styles.cardEmoji}>🏠</Text>
            <Text style={styles.cardTitle}>Living Here</Text>
            <Text style={styles.cardText}>Local guide</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.typeCard, styles.movingCard]}
            activeOpacity={0.7}
            onPress={() => handleNavigation('/(tabs)/explore')}
          >
            <Text style={styles.cardEmoji}>📦</Text>
            <Text style={styles.cardTitle}>Moving Here</Text>
            <Text style={styles.cardText}>Relocation help</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => handleNavigation('/(tabs)/aurora')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionEmoji}>🌌</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Aurora Forecast</Text>
              <Text style={styles.actionSubtitle}>Check tonight's viewing conditions</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => handleNavigation('/(tabs)/plan')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionEmoji}>📅</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Plan Trip</Text>
              <Text style={styles.actionSubtitle}>Create your itinerary</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => handleNavigation('/(tabs)/explore')}
        >
          <View style={styles.actionContent}>
            <Text style={styles.actionEmoji}>🎯</Text>
            <View style={styles.actionText}>
              <Text style={styles.actionTitle}>Explore Activities</Text>
              <Text style={styles.actionSubtitle}>Discover things to do</Text>
            </View>
            <Text style={styles.actionArrow}>→</Text>
          </View>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Current in Yellowknife</Text>
        <View style={styles.conditionsCard}>
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Temperature</Text>
            <Text style={styles.conditionValue}>-15°C</Text>
          </View>
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Aurora Activity</Text>
            <Text style={[styles.conditionValue, { color: colors.aurora.green }]}>MODERATE</Text>
          </View>
          <View style={styles.conditionRow}>
            <Text style={styles.conditionLabel}>Best Viewing</Text>
            <Text style={styles.conditionValue}>11:00 PM</Text>
          </View>
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
    paddingTop: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.aurora.green,
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
  cardGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  typeCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 120,
  },
  visitingCard: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.aurora.green,
  },
  livingCard: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.aurora.blue,
  },
  movingCard: {
    backgroundColor: colors.background.card,
    borderWidth: 2,
    borderColor: colors.aurora.purple,
  },
  cardEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: colors.text.primary,
    marginBottom: 4,
    textAlign: 'center',
  },
  cardText: {
    fontSize: 11,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  actionButton: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
  },
  actionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  actionEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  actionText: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
    marginBottom: 2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  actionArrow: {
    fontSize: 20,
    color: colors.aurora.green,
  },
  conditionsCard: {
    backgroundColor: colors.background.card,
    borderRadius: 12,
    padding: 16,
  },
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  conditionLabel: {
    fontSize: 15,
    color: colors.text.secondary,
  },
  conditionValue: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text.primary,
  },
});
