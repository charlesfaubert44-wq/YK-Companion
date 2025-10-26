import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { PathwayCard } from '../../components/ui/PathwayCard';
import { useAuth } from '../../contexts/AuthContext';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Welcome to YK Buddy</Text>
          <Text style={styles.subtitle}>
            Because Nobody Should Face -40° Alone
          </Text>
        </View>

        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoText}>YK</Text>
          </View>
        </View>

        {/* Pathway Cards */}
        <View style={styles.pathwaysContainer}>
          <Text style={styles.pathwaysTitle}>Choose Your Path</Text>

          <PathwayCard
            icon="✈️"
            title="VISITING"
            description="Planning a trip? Find the best things to do, see, and experience."
            color="#10B981"
            onPress={() => router.push('/(pathways)/visiting')}
          />

          <PathwayCard
            icon="🏠"
            title="LIVING"
            description="Already here? Discover local gems, events, and community resources."
            color="#3B82F6"
            onPress={() => router.push('/(pathways)/living')}
          />

          <PathwayCard
            icon="📦"
            title="MOVING"
            description="Relocating soon? Get essential info for settling into life in YK."
            color="#F59E0B"
            onPress={() => router.push('/(pathways)/moving')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Access</Text>
          <View style={styles.quickActionsGrid}>
            <View style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>🌌</Text>
              <Text style={styles.quickActionText}>Aurora Forecast</Text>
            </View>
            <View style={styles.quickActionCard}>
              <Text style={styles.quickActionIcon}>🛒</Text>
              <Text style={styles.quickActionText}>Garage Sales</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1128',
  },
  scrollContent: {
    padding: 24,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#10B981',
  },
  pathwaysContainer: {
    marginBottom: 32,
  },
  pathwaysTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickActions: {
    marginBottom: 32,
  },
  quickActionsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    padding: 20,
    alignItems: 'center',
  },
  quickActionIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: '#FFFFFF',
    fontWeight: '600',
    textAlign: 'center',
  },
});
