import { View, Text } from 'react-native';

export default function Index() {
  return (
    <View style={{ flex: 1, backgroundColor: '#0a1128', justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 40, color: '#00ff88' }}>TRUE NORTH TRIPS</Text>
      <Text style={{ fontSize: 20, color: 'white', marginTop: 20 }}>Welcome!</Text>
    </View>
  );
}
