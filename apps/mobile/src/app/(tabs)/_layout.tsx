import { Tabs } from 'expo-router';
import { colors } from '../../theme/colors';
import { AnimatedTabIcon } from '../../components/ui/AnimatedTabIcon';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.aurora.green,
        tabBarInactiveTintColor: colors.text.secondary,
        tabBarStyle: {
          backgroundColor: colors.background.secondary,
          borderTopColor: colors.border,
          height: 85,
          paddingBottom: 25,
          paddingTop: 10,
        },
        headerStyle: {
          backgroundColor: colors.background.primary,
        },
        headerTintColor: colors.text.primary,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon icon="🏠" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon icon="🎯" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="plan"
        options={{
          title: 'Plan',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon icon="📅" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="aurora"
        options={{
          title: 'Aurora',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon icon="🌌" focused={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused, color }) => (
            <AnimatedTabIcon icon="👤" focused={focused} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
