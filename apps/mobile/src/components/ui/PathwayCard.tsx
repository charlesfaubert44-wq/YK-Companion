import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Platform,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

interface PathwayCardProps {
  title: string;
  icon: string;
  description: string;
  color: string;
  onPress: () => void;
}

/**
 * PathwayCard - Mobile pathway card with stunning visuals and interactions
 *
 * Features:
 * - Glassmorphic design with backdrop blur effect
 * - Animated press interactions with spring physics
 * - Gradient overlays and glow effects
 * - Accessible with proper labels and touch feedback
 * - Optimized performance with native animations
 *
 * @example
 * <PathwayCard
 *   title="Visiting"
 *   icon="✈️"
 *   description="Explore the North"
 *   color="#00ff88"
 *   onPress={() => navigate('visiting')}
 * />
 */
export function PathwayCard({ title, icon, description, color, onPress }: PathwayCardProps) {
  // Reanimated shared values for 60fps animations
  const pressed = useSharedValue(0);
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);
  const iconScale = useSharedValue(1);
  const arrowTranslateX = useSharedValue(0);

  // Gesture handler for tap
  const tapGesture = Gesture.Tap()
    .onBegin(() => {
      'worklet';
      pressed.value = 1;
      scale.value = withSpring(0.96, {
        damping: 15,
        stiffness: 300,
      });
      glowOpacity.value = withTiming(1, { duration: 200 });
      iconScale.value = withSpring(1.1, {
        damping: 10,
        stiffness: 200,
      });
      arrowTranslateX.value = withTiming(4, { duration: 200 });
    })
    .onFinalize((_, success) => {
      'worklet';
      pressed.value = 0;
      scale.value = withSpring(1, {
        damping: 15,
        stiffness: 300,
      });
      glowOpacity.value = withTiming(0, { duration: 300 });
      iconScale.value = withSpring(1, {
        damping: 10,
        stiffness: 200,
      });
      arrowTranslateX.value = withTiming(0, { duration: 300 });

      if (success) {
        // Trigger haptic feedback on main thread
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress();
      }
    });

  // Convert hex color to rgba for glow effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Animated styles using Reanimated
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowOpacity.value, [0, 1], [0, 0.6]),
    shadowOpacity: interpolate(glowOpacity.value, [0, 1], [0.3, 0.6]),
  }));

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const arrowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: arrowTranslateX.value }],
  }));

  const shimmerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(glowOpacity.value, [0, 1], [0, 0.3]),
  }));

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View
        style={[styles.cardContainer, containerAnimatedStyle]}
        accessible={true}
        accessibilityLabel={`${title} pathway. ${description}`}
        accessibilityRole="button"
        accessibilityHint="Tap to explore this pathway"
      >
        {/* Outer glow effect */}
        <Animated.View
          style={[
            styles.glowContainer,
            glowAnimatedStyle,
            {
              backgroundColor: hexToRgba(color, 0.15),
              shadowColor: color,
            },
          ]}
        />

        <View style={[styles.card, { borderColor: color }]}>
        {/* Gradient overlay for depth */}
        <View style={styles.gradientOverlay}>
          <View style={[styles.gradientTop, { backgroundColor: hexToRgba(color, 0.05) }]} />
          <View style={styles.gradientBottom} />
        </View>

        {/* Animated icon container with glassmorphism */}
        <Animated.View
          style={[
            styles.iconContainer,
            iconAnimatedStyle,
            {
              backgroundColor: hexToRgba(color, 0.15),
              borderColor: hexToRgba(color, 0.3),
            },
          ]}
        >
          {/* Inner glow for icon */}
          <View
            style={[
              styles.iconGlow,
              { backgroundColor: hexToRgba(color, 0.1) },
            ]}
          />
          <Text style={styles.icon} accessibilityLabel={`${title} icon`}>
            {icon}
          </Text>
        </Animated.View>

        {/* Content section */}
        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
            {description}
          </Text>

          {/* Decorative progress dots */}
          <View style={styles.dotsContainer}>
            <View style={[styles.dot, { backgroundColor: color }]} />
            <View style={[styles.dot, { backgroundColor: hexToRgba(color, 0.5) }]} />
            <View style={[styles.dot, { backgroundColor: hexToRgba(color, 0.25) }]} />
          </View>
        </View>

        {/* Animated arrow indicator */}
        <Animated.View style={[styles.arrow, arrowAnimatedStyle]}>
          <View style={[styles.arrowCircle, { backgroundColor: hexToRgba(color, 0.15) }]}>
            <Text style={[styles.arrowText, { color }]} accessibilityLabel="Navigate arrow">
              →
            </Text>
          </View>
        </Animated.View>

        {/* Shimmer effect overlay */}
        <Animated.View style={[styles.shimmer, shimmerAnimatedStyle]} />
        </View>
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 16,
    width: width - 48,
  },
  glowContainer: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 20,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 16,
    borderWidth: 2,
    padding: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  gradientOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'column',
  },
  gradientTop: {
    flex: 1,
  },
  gradientBottom: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    borderWidth: 2,
    overflow: 'hidden',
  },
  iconGlow: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 32,
  },
  icon: {
    fontSize: 32,
    zIndex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FFFFFF',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  description: {
    fontSize: 14,
    color: '#CBD5E1',
    lineHeight: 20,
    marginBottom: 6,
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  arrow: {
    marginLeft: 8,
  },
  arrowCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    left: -100,
    width: 100,
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    transform: [{ skewX: '-20deg' }],
  },
});
