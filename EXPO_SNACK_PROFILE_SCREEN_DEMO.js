// YK Buddy - Profile Screen Demo for Expo Snack
// Copy this entire file to https://snack.expo.dev/

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
} from 'react-native';

// ============================================
// MAIN PROFILE SCREEN
// ============================================

export default function App() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [auroraAlerts, setAuroraAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(false);
  const [selectedType, setSelectedType] = useState('visiting');

  const handleSignOut = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: () => Alert.alert('Signed Out', 'You have been signed out successfully.'),
        },
      ]
    );
  };

  const handleSettingPress = (setting) => {
    Alert.alert(setting, `Navigate to ${setting} screen`, [{ text: 'OK' }]);
  };

  return (
    <View style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>
          <Text style={styles.name}>johndoe</Text>
          <Text style={styles.userType}>johndoe@example.com</Text>
        </View>

        {/* Profile Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Profile Type</Text>
          <View style={styles.typeSelector}>
            <TouchableOpacity
              style={[
                styles.typeOption,
                selectedType === 'visiting' && styles.typeOptionActive,
              ]}
              onPress={() => setSelectedType('visiting')}
            >
              <Text style={styles.typeEmoji}>✈️</Text>
              <Text
                style={
                  selectedType === 'visiting'
                    ? styles.typeOptionTextActive
                    : styles.typeOptionText
                }
              >
                Visiting
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                selectedType === 'living' && styles.typeOptionActive,
              ]}
              onPress={() => setSelectedType('living')}
            >
              <Text style={styles.typeEmoji}>🏠</Text>
              <Text
                style={
                  selectedType === 'living'
                    ? styles.typeOptionTextActive
                    : styles.typeOptionText
                }
              >
                Living Here
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeOption,
                selectedType === 'moving' && styles.typeOptionActive,
              ]}
              onPress={() => setSelectedType('moving')}
            >
              <Text style={styles.typeEmoji}>📦</Text>
              <Text
                style={
                  selectedType === 'moving'
                    ? styles.typeOptionTextActive
                    : styles.typeOptionText
                }
              >
                Moving Here
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceLabel}>Notifications</Text>
              <Text style={styles.preferenceDescription}>
                Receive app notifications
              </Text>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{ false: '#1F2937', true: '#10B981' }}
              thumbColor="#0A1128"
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceLabel}>Aurora Alerts</Text>
              <Text style={styles.preferenceDescription}>
                Get notified of aurora activity
              </Text>
            </View>
            <Switch
              value={auroraAlerts}
              onValueChange={setAuroraAlerts}
              trackColor={{ false: '#1F2937', true: '#10B981' }}
              thumbColor="#0A1128"
              disabled={!notificationsEnabled}
            />
          </View>

          <View style={styles.preferenceItem}>
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceLabel}>Weather Alerts</Text>
              <Text style={styles.preferenceDescription}>
                Severe weather notifications
              </Text>
            </View>
            <Switch
              value={weatherAlerts}
              onValueChange={setWeatherAlerts}
              trackColor={{ false: '#1F2937', true: '#10B981' }}
              thumbColor="#0A1128"
              disabled={!notificationsEnabled}
            />
          </View>
        </View>

        {/* Trip Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Trip Settings</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleSettingPress('My Trips')}
          >
            <Text style={styles.settingEmoji}>📅</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>My Trips</Text>
              <Text style={styles.settingDescription}>View saved itineraries</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleSettingPress('Saved Activities')}
          >
            <Text style={styles.settingEmoji}>⭐</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Saved Activities</Text>
              <Text style={styles.settingDescription}>
                Your favorite experiences
              </Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleSettingPress('Offline Maps')}
          >
            <Text style={styles.settingEmoji}>🗺️</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Offline Maps</Text>
              <Text style={styles.settingDescription}>Download for offline use</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* About */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleSettingPress('About YK Buddy')}
          >
            <Text style={styles.settingEmoji}>ℹ️</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>About YK Buddy</Text>
              <Text style={styles.settingDescription}>Version 1.0.0</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleSettingPress('Contact Support')}
          >
            <Text style={styles.settingEmoji}>📧</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Contact Support</Text>
              <Text style={styles.settingDescription}>Get help</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={() => handleSettingPress('Privacy & Terms')}
          >
            <Text style={styles.settingEmoji}>⚖️</Text>
            <View style={styles.settingText}>
              <Text style={styles.settingLabel}>Privacy & Terms</Text>
              <Text style={styles.settingDescription}>Legal information</Text>
            </View>
            <Text style={styles.settingArrow}>→</Text>
          </TouchableOpacity>
        </View>

        {/* Sign Out */}
        <View style={styles.section}>
          <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          <Text style={styles.versionText}>YK Buddy v1.0.0</Text>
        </View>

        {/* Demo Info */}
        <View style={styles.demoInfo}>
          <Text style={styles.demoText}>🎨 YK Buddy Profile Screen Demo</Text>
          <Text style={styles.demoText}>
            Toggle switches, change profile type, or tap settings!
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
  header: {
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 3,
    borderColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 40,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  userType: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  section: {
    padding: 20,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  // Profile Type Styles
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: '#10B981',
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeOptionText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  typeOptionTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0A1128',
    textAlign: 'center',
  },
  // Preference Styles
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  preferenceText: {
    flex: 1,
  },
  preferenceLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  // Setting Item Styles
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  settingEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  settingText: {
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  settingArrow: {
    fontSize: 20,
    color: '#10B981',
  },
  // Sign Out Styles
  signOutButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 2,
    borderColor: '#EF4444',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
  },
  versionText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginBottom: 20,
  },
  // Demo Info Styles
  demoInfo: {
    margin: 20,
    marginTop: 0,
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
