import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

interface AnimatedTabIconProps {
  icon: string;
  focused: boolean;
  color: string;
}

/**
 * AnimatedTabIcon - Animated tab bar icon with scale and haptic feedback
 *
 * Features:
 * - Scale animation when tab becomes active
 * - Bounce effect for visual feedback
 * - Haptic feedback on tab press
 * - 60fps performance with Reanimated
 */
export function AnimatedTabIcon({ icon, focused }: AnimatedTabIconProps) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (focused) {
      // Trigger haptic feedback when tab is selected
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      // Bounce animation: scale up then settle
      scale.value = withSequence(
        withSpring(1.2, {
          damping: 10,
          stiffness: 300,
        }),
        withSpring(1, {
          damping: 12,
          stiffness: 250,
        })
      );
    } else {
      // Smoothly scale down when not focused
      scale.value = withTiming(0.9, { duration: 200 });
    }
  }, [focused]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={[styles.icon, { opacity: focused ? 1 : 0.6 }]}>
        {icon}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 24,
  },
});
