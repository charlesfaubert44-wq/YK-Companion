import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>TRUE NORTH TRIPS</Text>
      <Text style={styles.text}>Welcome to Yellowknife!</Text>
      <Text style={styles.subtext}>Tap the tabs below to explore</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a1128',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#00ff88',
    marginBottom: 16,
    textAlign: 'center',
  },
  text: {
    fontSize: 18,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtext: {
    fontSize: 14,
    color: '#9ca3af',
  },
});
