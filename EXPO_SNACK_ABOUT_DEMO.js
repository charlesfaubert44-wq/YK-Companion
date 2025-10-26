// YK Buddy - About Screen Demo for Expo Snack
// Copy this entire file to https://snack.expo.dev/

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';

const teamMembers = [
  {
    name: 'Sarah Johnson',
    role: 'Founder & Community Lead',
    emoji: '👩‍💼',
    bio: 'Born in Yellowknife, passionate about connecting visitors with authentic Northern experiences.',
  },
  {
    name: 'Mike Chen',
    role: 'Developer',
    emoji: '👨‍💻',
    bio: 'Building tech solutions that work even at -40°C. Former visitor turned permanent resident.',
  },
  {
    name: 'Emma Wilson',
    role: 'Content Creator',
    emoji: '✍️',
    bio: 'Storyteller and aurora chaser. Documenting the magic of the North one photo at a time.',
  },
];

const features = [
  { icon: '🌌', title: 'Aurora Forecast', description: 'Real-time northern lights predictions' },
  { icon: '🎯', title: 'Curated Activities', description: 'Hand-picked Northern experiences' },
  { icon: '🛒', title: 'Community Events', description: 'Local garage sales and festivals' },
  { icon: '🗺️', title: 'Interactive Maps', description: 'Navigate with confidence' },
  { icon: '❄️', title: 'Winter Survival', description: 'Essential tips for -40°C' },
  { icon: '🏘️', title: 'Local Community', description: 'Connect with residents' },
];

export default function App() {
  const [expandedMember, setExpandedMember] = useState(null);

  const toggleMember = (index) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About YK Buddy</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>YK</Text>
            </View>
          </View>
          <Text style={styles.heroTitle}>YK Buddy</Text>
          <Text style={styles.heroTagline}>
            Because Nobody Should Face -40° Alone
          </Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <View style={styles.storyCard}>
            <Text style={styles.storyEmoji}>🏔️</Text>
            <Text style={styles.storyText}>
              YK Buddy was born from a simple idea: Yellowknife is an incredible place,
              but navigating life at 62° North can be challenging. We're here to help
              you make the most of your Northern experience.
            </Text>
          </View>
        </View>

        {/* Features Grid */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>What We Offer</Text>
          <View style={styles.featuresGrid}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Team Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Meet the Team</Text>
          {teamMembers.map((member, index) => (
            <TouchableOpacity
              key={index}
              style={styles.teamCard}
              onPress={() => toggleMember(index)}
            >
              <View style={styles.teamHeader}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamEmoji}>{member.emoji}</Text>
                </View>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamRole}>{member.role}</Text>
                </View>
                <Text style={styles.expandIcon}>
                  {expandedMember === index ? '−' : '+'}
                </Text>
              </View>
              {expandedMember === index && (
                <View style={styles.teamBio}>
                  <Text style={styles.teamBioText}>{member.bio}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Stats */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>By the Numbers</Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>2,500+</Text>
              <Text style={styles.statLabel}>Active Users</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>150+</Text>
              <Text style={styles.statLabel}>Activities</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>50+</Text>
              <Text style={styles.statLabel}>Local Partners</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>-40°C</Text>
              <Text style={styles.statLabel}>Still Works!</Text>
            </View>
          </View>
        </View>

        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={styles.creditsText}>
            Made with ❤️ in Yellowknife, Northwest Territories
          </Text>
          <Text style={styles.creditsSubtext}>
            On the traditional territory of the Yellowknives Dene First Nation
          </Text>
        </View>

        {/* Demo Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>🎨 YK Buddy About Screen Demo</Text>
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
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logoCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    borderWidth: 4,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#10B981',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroTagline: {
    fontSize: 16,
    color: '#9CA3AF',
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: '#6B7280',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  storyCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(16, 185, 129, 0.3)',
    borderRadius: 16,
    padding: 20,
  },
  storyEmoji: {
    fontSize: 48,
    marginBottom: 16,
    textAlign: 'center',
  },
  storyText: {
    fontSize: 15,
    color: '#E5E7EB',
    lineHeight: 24,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 16,
  },
  featureIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  featureDescription: {
    fontSize: 12,
    color: '#9CA3AF',
    lineHeight: 18,
  },
  teamCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 16,
    marginBottom: 12,
  },
  teamHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  teamEmoji: {
    fontSize: 28,
  },
  teamInfo: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  teamRole: {
    fontSize: 13,
    color: '#10B981',
  },
  expandIcon: {
    fontSize: 24,
    color: '#10B981',
    fontWeight: 'bold',
    width: 30,
    textAlign: 'center',
  },
  teamBio: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.1)',
  },
  teamBioText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 2,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#F59E0B',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  creditsSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 20,
    alignItems: 'center',
  },
  creditsText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 4,
  },
  creditsSubtext: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  demoInfo: {
    padding: 8,
    marginBottom: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    alignItems: 'center',
  },
  demoText: {
    color: '#9CA3AF',
    fontSize: 11,
  },
});
