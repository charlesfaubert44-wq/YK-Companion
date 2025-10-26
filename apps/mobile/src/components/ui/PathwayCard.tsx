import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

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
  // Animation values for micro-interactions
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const iconScaleAnim = useRef(new Animated.Value(1)).current;
  const arrowTranslateAnim = useRef(new Animated.Value(0)).current;

  // Press animation with spring physics
  const handlePressIn = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 0.96,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: false,
      }),
      Animated.spring(iconScaleAnim, {
        toValue: 1.1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 8,
      }),
      Animated.timing(arrowTranslateAnim, {
        toValue: 4,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 50,
        bounciness: 4,
      }),
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        speed: 40,
        bounciness: 8,
      }),
      Animated.timing(arrowTranslateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Convert hex color to rgba for glow effect
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Animated glow opacity
  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 0.6],
  });

  const shadowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.cardContainer,
        {
          transform: [{ scale: scaleAnim }],
        },
      ]}
    >
      {/* Outer glow effect */}
      <Animated.View
        style={[
          styles.glowContainer,
          {
            backgroundColor: hexToRgba(color, 0.15),
            opacity: glowOpacity,
            shadowColor: color,
            shadowOpacity: shadowOpacity,
          },
        ]}
      />

      <TouchableOpacity
        style={[styles.card, { borderColor: color }]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
        accessible={true}
        accessibilityLabel={`${title} pathway. ${description}`}
        accessibilityRole="button"
        accessibilityHint="Tap to explore this pathway"
      >
        {/* Gradient overlay for depth */}
        <View style={styles.gradientOverlay}>
          <View style={[styles.gradientTop, { backgroundColor: hexToRgba(color, 0.05) }]} />
          <View style={styles.gradientBottom} />
        </View>

        {/* Animated icon container with glassmorphism */}
        <Animated.View
          style={[
            styles.iconContainer,
            {
              backgroundColor: hexToRgba(color, 0.15),
              borderColor: hexToRgba(color, 0.3),
              transform: [{ scale: iconScaleAnim }],
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
        <Animated.View
          style={[
            styles.arrow,
            {
              transform: [{ translateX: arrowTranslateAnim }],
            },
          ]}
        >
          <View style={[styles.arrowCircle, { backgroundColor: hexToRgba(color, 0.15) }]}>
            <Text style={[styles.arrowText, { color }]} accessibilityLabel="Navigate arrow">
              →
            </Text>
          </View>
        </Animated.View>

        {/* Shimmer effect overlay */}
        <Animated.View
          style={[
            styles.shimmer,
            {
              opacity: glowAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.3],
              }),
            },
          ]}
        />
      </TouchableOpacity>
    </Animated.View>
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
