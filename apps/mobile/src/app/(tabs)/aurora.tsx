import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

const mockForecast = [
  { time: '9:00 PM', kp: 3 },
  { time: '12:00 AM', kp: 5 },
  { time: '3:00 AM', kp: 4 },
  { time: '6:00 AM', kp: 2 },
];

export default function AuroraScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Aurora Forecast</Text>
        <Text style={styles.subtitle}>Northern Lights viewing conditions</Text>
      </View>

      {/* Current KP Index */}
      <View style={styles.currentCard}>
        <Text style={styles.currentLabel}>Current Activity</Text>
        <Text style={styles.currentKp}>KP 5</Text>
        <Text style={styles.currentStatus}>MODERATE</Text>
        <Text style={styles.currentDescription}>Good aurora visibility expected tonight</Text>
      </View>

      {/* Viewing Conditions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Viewing Conditions</Text>
        <View style={styles.conditionsGrid}>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionEmoji}>☁️</Text>
            <Text style={styles.conditionLabel}>Cloud Cover</Text>
            <Text style={styles.conditionValue}>25%</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionEmoji}>👁️</Text>
            <Text style={styles.conditionLabel}>Visibility</Text>
            <Text style={styles.conditionValue}>Excellent</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionEmoji}>🌡️</Text>
            <Text style={styles.conditionLabel}>Temperature</Text>
            <Text style={styles.conditionValue}>-15°C</Text>
          </View>
          <View style={styles.conditionItem}>
            <Text style={styles.conditionEmoji}>🌙</Text>
            <Text style={styles.conditionLabel}>Moon Phase</Text>
            <Text style={styles.conditionValue}>New Moon</Text>
          </View>
        </View>
      </View>

      {/* 3-Hour Forecast */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3-Hour Forecast</Text>
        {mockForecast.map((item, index) => (
          <View key={index} style={styles.forecastItem}>
            <Text style={styles.forecastTime}>{item.time}</Text>
            <View style={styles.forecastBar}>
              <View style={[styles.forecastBarFill, { width: `${(item.kp / 9) * 100}%` }]} />
            </View>
            <Text style={styles.forecastKp}>KP {item.kp}</Text>
          </View>
        ))}
      </View>

      {/* Best Viewing Times */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Best Viewing Times</Text>
        <View style={styles.viewingCard}>
          <Text style={styles.viewingTime}>10:00 PM - 2:00 AM</Text>
          <Text style={styles.viewingDescription}>Peak activity expected around midnight</Text>
        </View>
      </View>

      {/* Alerts */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Aurora Alerts</Text>
        <View style={styles.alertCard}>
          <Text style={styles.alertEmoji}>🔔</Text>
          <Text style={styles.alertText}>Get notified when aurora activity increases</Text>
        </View>
        <TouchableOpacity style={styles.enableButton}>
          <Text style={styles.enableButtonText}>Enable Alerts</Text>
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
  currentCard: {
    margin: 20,
    marginTop: 10,
    padding: 24,
    backgroundColor: colors.background.card,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.aurora.green,
  },
  currentLabel: {
    fontSize: 14,
    color: colors.text.secondary,
    marginBottom: 8,
  },
  currentKp: {
    fontSize: 48,
    fontWeight: 'bold',
    color: colors.aurora.green,
    marginBottom: 4,
  },
  currentStatus: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.aurora.green,
    marginBottom: 12,
  },
  currentDescription: {
    fontSize: 14,
    color: colors.text.secondary,
    textAlign: 'center',
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
  conditionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  conditionItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  conditionEmoji: {
    fontSize: 32,
    marginBottom: 8,
  },
  conditionLabel: {
    fontSize: 12,
    color: colors.text.secondary,
    marginBottom: 4,
  },
  conditionValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text.primary,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  forecastTime: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text.primary,
    width: 80,
  },
  forecastBar: {
    flex: 1,
    height: 8,
    backgroundColor: colors.background.secondary,
    borderRadius: 4,
    marginHorizontal: 12,
    overflow: 'hidden',
  },
  forecastBarFill: {
    height: '100%',
    backgroundColor: colors.aurora.green,
    borderRadius: 4,
  },
  forecastKp: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.aurora.green,
    width: 50,
    textAlign: 'right',
  },
  viewingCard: {
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
  },
  viewingTime: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.aurora.blue,
    marginBottom: 8,
  },
  viewingDescription: {
    fontSize: 14,
    color: colors.text.secondary,
  },
  alertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background.card,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  alertEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  alertText: {
    flex: 1,
    fontSize: 14,
    color: colors.text.secondary,
  },
  enableButton: {
    backgroundColor: colors.aurora.green,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  enableButtonText: {
    color: colors.background.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});
