/**
 * ProgressBar — animated horizontal progress indicator.
 *
 * Uses react-native-reanimated for smooth width transitions.
 * Features a linear gradient fill and optional label.
 */

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import { CalorAIColors } from '@/constants/colors';

// ─── Props ─────────────────────────────────────────────────────

export interface ProgressBarProps {
  /** Current progress value */
  current: number;
  /** Total maximum progress value */
  total: number;
  /** Whether to show the "X of Y" label above right */
  showLabel?: boolean;
  /** Whether to animate changes (default true) */
  animated?: boolean;
  /** Container style overrides */
  style?: StyleProp<ViewStyle>;
}

// ─── Component ─────────────────────────────────────────────────

export function ProgressBar({
  current,
  total,
  showLabel = false,
  animated = true,
  style,
}: ProgressBarProps) {
  // Ensure total > 0 to avoid division by zero, and clamp ratio between 0-1
  const safeTotal = Math.max(total, 1);
  const progressRatio = Math.min(Math.max(current / safeTotal, 0), 1);
  const percentage = progressRatio * 100;

  // Initialize to 0 so it animates up on mount
  const widthPercentage = useSharedValue(0);

  useEffect(() => {
    if (animated) {
      widthPercentage.value = withSpring(percentage, {
        damping: 20,
        stiffness: 90,
      });
    } else {
      widthPercentage.value = percentage;
    }
  }, [percentage, animated, widthPercentage]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${widthPercentage.value}%`,
  }));

  return (
    <View
      style={[styles.container, style]}
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: total, now: current }}
    >
      {showLabel && (
        <View style={styles.labelContainer}>
          <Text style={styles.label}>
            {current} of {total}
          </Text>
        </View>
      )}

      <View style={styles.track}>
        <Animated.View style={[styles.fillContainer, animatedStyle]}>
          <LinearGradient
            colors={['#4ADE80', '#22C55E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          />
        </Animated.View>
      </View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: CalorAIColors.textMuted,
    fontWeight: '500',
  },
  track: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fillContainer: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    width: '100%',
  },
});
