import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { useState } from 'react';
import { colors } from '../../theme/colors';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [auroraAlerts, setAuroraAlerts] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(false);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>👤</Text>
        </View>
        <Text style={styles.name}>Traveler</Text>
        <Text style={styles.userType}>Visiting Yellowknife</Text>
      </View>

      {/* Profile Type */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Type</Text>
        <View style={styles.typeSelector}>
          <TouchableOpacity style={[styles.typeOption, styles.typeOptionActive]}>
            <Text style={styles.typeEmoji}>🧳</Text>
            <Text style={styles.typeOptionTextActive}>Visiting</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.typeOption}>
            <Text style={styles.typeEmoji}>🏠</Text>
            <Text style={styles.typeOptionText}>Living Here</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.typeOption}>
            <Text style={styles.typeEmoji}>📦</Text>
            <Text style={styles.typeOptionText}>Moving Here</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Preferences */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceText}>
            <Text style={styles.preferenceLabel}>Notifications</Text>
            <Text style={styles.preferenceDescription}>Receive app notifications</Text>
          </View>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
            trackColor={{ false: colors.background.secondary, true: colors.aurora.green }}
            thumbColor={colors.background.primary}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceText}>
            <Text style={styles.preferenceLabel}>Aurora Alerts</Text>
            <Text style={styles.preferenceDescription}>Get notified of aurora activity</Text>
          </View>
          <Switch
            value={auroraAlerts}
            onValueChange={setAuroraAlerts}
            trackColor={{ false: colors.background.secondary, true: colors.aurora.green }}
            thumbColor={colors.background.primary}
            disabled={!notificationsEnabled}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceText}>
            <Text style={styles.preferenceLabel}>Weather Alerts</Text>
            <Text style={styles.preferenceDescription}>Severe weather notifications</Text>
          </View>
          <Switch
            value={weatherAlerts}
            onValueChange={setWeatherAlerts}
            trackColor={{ false: colors.background.secondary, true: colors.aurora.green }}
            thumbColor={colors.background.primary}
            disabled={!notificationsEnabled}
          />
        </View>
      </View>

      {/* Trip Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trip Settings</Text>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingEmoji}>📅</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>My Trips</Text>
            <Text style={styles.settingDescription}>View saved itineraries</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingEmoji}>⭐</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Saved Activities</Text>
            <Text style={styles.settingDescription}>Your favorite experiences</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
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

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingEmoji}>ℹ️</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>About TRUE NORTH TRIPS</Text>
            <Text style={styles.settingDescription}>Version 1.0.0</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingEmoji}>📧</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Contact Support</Text>
            <Text style={styles.settingDescription}>Get help</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.settingItem}>
          <Text style={styles.settingEmoji}>⚖️</Text>
          <View style={styles.settingText}>
            <Text style={styles.settingLabel}>Privacy & Terms</Text>
            <Text style={styles.settingDescription}>Legal information</Text>
          </View>
          <Text style={styles.settingArrow}>→</Text>
        </TouchableOpacity>
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
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.background.card,
    borderWidth: 3,
    borderColor: colors.aurora.green,
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
    color: colors.text.primary,
    marginBottom: 4,
  },
  userType: {
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
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
  },
  typeOption: {
    flex: 1,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.background.card,
    alignItems: 'center',
  },
  typeOptionActive: {
    backgroundColor: colors.aurora.green,
  },
  typeEmoji: {
    fontSize: 24,
    marginBottom: 4,
  },
  typeOptionText: {
    fontSize: 12,
    color: colors.text.secondary,
    textAlign: 'center',
  },
  typeOptionTextActive: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.background.primary,
    textAlign: 'center',
  },
  preferenceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.background.card,
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
    color: colors.text.primary,
    marginBottom: 4,
  },
  preferenceDescription: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
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
    color: colors.text.primary,
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.text.secondary,
  },
  settingArrow: {
    fontSize: 20,
    color: colors.aurora.green,
  },
});
