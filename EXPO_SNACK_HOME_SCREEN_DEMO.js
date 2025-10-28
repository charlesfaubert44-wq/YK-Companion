// YK Buddy - Home Screen Demo for Expo Snack
// Copy this entire file to https://snack.expo.dev/

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
} from 'react-native';

const { width } = Dimensions.get('window');

// ============================================
// PATHWAY CARD COMPONENT
// ============================================

function PathwayCard({ icon, title, description, color, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: color }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
      <View style={styles.arrow}>
        <Text style={[styles.arrowText, { color }]}>→</Text>
      </View>
    </TouchableOpacity>
  );
}

// ============================================
// MAIN HOME SCREEN
// ============================================

export default function App() {
  const handlePathwayPress = (pathway) => {
    Alert.alert(
      `${pathway} Pathway`,
      `You selected the ${pathway} pathway. This will navigate to detailed ${pathway.toLowerCase()} content.`,
      [{ text: 'OK' }]
    );
  };

  const handleQuickActionPress = (action) => {
    Alert.alert(
      action,
      `Quick access to ${action}`,
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Welcome to YK Buddy</Text>
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
            onPress={() => handlePathwayPress('VISITING')}
          />

          <PathwayCard
            icon="🏠"
            title="LIVING"
            description="Already here? Discover local gems, events, and community resources."
            color="#3B82F6"
            onPress={() => handlePathwayPress('LIVING')}
          />

          <PathwayCard
            icon="📦"
            title="MOVING"
            description="Relocating soon? Get essential info for settling into life in YK."
            color="#F59E0B"
            onPress={() => handlePathwayPress('MOVING')}
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.quickActionsTitle}>Quick Access</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickActionPress('Aurora Forecast')}
            >
              <Text style={styles.quickActionIcon}>🌌</Text>
              <Text style={styles.quickActionText}>Aurora Forecast</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionCard}
              onPress={() => handleQuickActionPress('Garage Sales')}
            >
              <Text style={styles.quickActionIcon}>🛒</Text>
              <Text style={styles.quickActionText}>Garage Sales</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Demo Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>
            🎨 YK Buddy Home Screen Demo
          </Text>
          <Text style={styles.demoText}>
            Tap any pathway card or quick action to see navigation!
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

// ============================================
// STYLES
// ============================================

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
  headerTitle: {
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
  // Pathway Card Styles
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    marginBottom: 16,
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  icon: {
    fontSize: 32,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  arrow: {
    marginLeft: 8,
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  // Quick Actions Styles
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
  // Demo Info Styles
  demoInfo: {
    marginTop: 20,
    padding: 16,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  demoText: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 4,
  },
});
