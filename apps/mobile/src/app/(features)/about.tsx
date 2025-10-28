import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Linking,
} from 'react-native';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

interface TeamMember {
  name: string;
  role: string;
  emoji: string;
  bio: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
}

const teamMembers: TeamMember[] = [
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

const features: Feature[] = [
  {
    icon: '🌌',
    title: 'Aurora Forecast',
    description: 'Real-time northern lights predictions with the best viewing spots',
  },
  {
    icon: '🎯',
    title: 'Curated Activities',
    description: 'Hand-picked experiences from dog sledding to cultural tours',
  },
  {
    icon: '🛒',
    title: 'Community Events',
    description: 'Local garage sales, festivals, and neighborhood gatherings',
  },
  {
    icon: '🗺️',
    title: 'Interactive Maps',
    description: 'Navigate Yellowknife with confidence, even in winter darkness',
  },
  {
    icon: '❄️',
    title: 'Winter Survival',
    description: "Essential tips for thriving in Canada's coldest capital",
  },
  {
    icon: '🏘️',
    title: 'Local Community',
    description: 'Connect with residents and fellow explorers',
  },
];

export default function AboutScreen() {
  const router = useRouter();
  const [expandedMember, setExpandedMember] = useState<number | null>(null);
  const [animatedValue] = useState(new Animated.Value(0));

  const toggleMember = (index: number) => {
    setExpandedMember(expandedMember === index ? null : index);
  };

  const openWebsite = () => {
    Linking.openURL('https://ykbuddy.com');
  };

  const openGitHub = () => {
    Linking.openURL('https://github.com/ykbuddy');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>About YK Buddy</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>YK</Text>
            </View>
            <View style={styles.auroraGlow} />
          </View>
          <Text style={styles.heroTitle}>YK Buddy</Text>
          <Text style={styles.heroTagline}>Because Nobody Should Face -40° Alone</Text>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>

        {/* Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <View style={styles.storyCard}>
            <Text style={styles.storyEmoji}>🏔️</Text>
            <Text style={styles.storyText}>
              YK Buddy was born from a simple idea: Yellowknife is an incredible place, but
              navigating life at 62° North can be challenging. Whether you're visiting to see the
              aurora, moving here for work, or already call this place home, we're here to help you
              make the most of your Northern experience.
            </Text>
            <Text style={styles.storyText} style={{ marginTop: 12 }}>
              From finding the best dog sledding tours to discovering this weekend's garage sales,
              from aurora forecasts to winter survival tips—we've got your back in Canada's coldest
              capital.
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
              activeOpacity={0.7}
            >
              <View style={styles.teamHeader}>
                <View style={styles.teamAvatar}>
                  <Text style={styles.teamEmoji}>{member.emoji}</Text>
                </View>
                <View style={styles.teamInfo}>
                  <Text style={styles.teamName}>{member.name}</Text>
                  <Text style={styles.teamRole}>{member.role}</Text>
                </View>
                <Text style={styles.expandIcon}>{expandedMember === index ? '−' : '+'}</Text>
              </View>
              {expandedMember === index && (
                <View style={styles.teamBio}>
                  <Text style={styles.teamBioText}>{member.bio}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Values Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Values</Text>
          <View style={styles.valueCard}>
            <Text style={styles.valueEmoji}>🤝</Text>
            <Text style={styles.valueTitle}>Community First</Text>
            <Text style={styles.valueText}>
              We're built by Northerners, for Northerners. Every feature serves the community.
            </Text>
          </View>
          <View style={styles.valueCard}>
            <Text style={styles.valueEmoji}>🪶</Text>
            <Text style={styles.valueTitle}>Respect & Reconciliation</Text>
            <Text style={styles.valueText}>
              We honor Indigenous cultures and support Indigenous-owned businesses.
            </Text>
          </View>
          <View style={styles.valueCard}>
            <Text style={styles.valueEmoji}>💚</Text>
            <Text style={styles.valueTitle}>Sustainable Tourism</Text>
            <Text style={styles.valueText}>
              We promote responsible travel that protects our pristine environment.
            </Text>
          </View>
        </View>

        {/* Stats Section */}
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

        {/* Links Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Connect With Us</Text>
          <TouchableOpacity style={styles.linkCard} onPress={openWebsite}>
            <Text style={styles.linkIcon}>🌐</Text>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Visit Our Website</Text>
              <Text style={styles.linkUrl}>ykbuddy.com</Text>
            </View>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.linkCard} onPress={openGitHub}>
            <Text style={styles.linkIcon}>💻</Text>
            <View style={styles.linkContent}>
              <Text style={styles.linkTitle}>Open Source</Text>
              <Text style={styles.linkUrl}>github.com/ykbuddy</Text>
            </View>
            <Text style={styles.linkArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Credits */}
        <View style={styles.creditsSection}>
          <Text style={styles.creditsText}>Made with ❤️ in Yellowknife, Northwest Territories</Text>
          <Text style={styles.creditsSubtext}>
            On the traditional territory of the Yellowknives Dene First Nation
          </Text>
          <Text style={styles.creditsSubtext} style={{ marginTop: 8 }}>
            © 2025 YK Buddy. All rights reserved.
          </Text>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerRight: {
    width: 50,
  },
  content: {
    flex: 1,
  },
  // Hero Section
  heroSection: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  logoContainer: {
    position: 'relative',
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
  auroraGlow: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#10B981',
    opacity: 0.2,
    top: -10,
    left: -10,
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
  // Sections
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
  // Story Card
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
  // Features Grid
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
  // Team Cards
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
  // Values Cards
  valueCard: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  valueEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  valueText: {
    fontSize: 14,
    color: '#9CA3AF',
    lineHeight: 20,
  },
  // Stats Grid
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
  // Link Cards
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
    padding: 16,
    marginBottom: 12,
  },
  linkIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  linkUrl: {
    fontSize: 13,
    color: '#10B981',
  },
  linkArrow: {
    fontSize: 24,
    color: '#10B981',
  },
  // Credits
  creditsSection: {
    padding: 20,
    paddingTop: 10,
    paddingBottom: 40,
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
});
