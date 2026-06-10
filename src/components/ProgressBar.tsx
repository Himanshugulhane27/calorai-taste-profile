/**
 * ProgressBar — animated horizontal progress indicator.
 *
 * Uses react-native-reanimated for smooth width transitions.
 * Reusable for quiz completion, profile scores, etc.
 *
 * Animation logic is stubbed — will be implemented when
 * screens are built.
 */

import React from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import Animated from 'react-native-reanimated';
import { CalorAIColors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

// ─── Props ─────────────────────────────────────────────────────

export interface ProgressBarProps {
  /** Fill ratio from 0 to 1 */
  progress: number;
  /** Fill colour */
  color?: string;
  /** Background track colour */
  trackColor?: string;
  /** Track height in pixels */
  height?: number;
  /** Container style overrides */
  style?: StyleProp<ViewStyle>;
}

// ─── Component ─────────────────────────────────────────────────

export function ProgressBar({
  progress,
  color = CalorAIColors.progressFill,
  trackColor = CalorAIColors.progressTrack,
  height = Layout.progressBar.height,
  style,
}: ProgressBarProps) {
  // TODO: replace with useAnimatedStyle + shared value
  const clampedProgress = Math.min(Math.max(progress, 0), 1);

  return (
    <View
      style={[
        styles.track,
        {
          height,
          borderRadius: Layout.progressBar.borderRadius,
          backgroundColor: trackColor,
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.fill,
          {
            width: `${clampedProgress * 100}%`,
            backgroundColor: color,
            borderRadius: Layout.progressBar.borderRadius,
          },
        ]}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  track: {
    width: '100%',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
  },
});
