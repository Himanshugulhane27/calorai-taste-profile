/**
 * GlassCard — reusable glassmorphism container.
 *
 * Uses expo-blur BlurView + expo-linear-gradient for the
 * frosted-glass aesthetic. This is the base visual primitive
 * composed by FoodCard and screen layouts.
 *
 * No animation logic — this is a pure presentational wrapper.
 */

import React, { type ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { CalorAIColors } from '@/constants/colors';
import { Layout } from '@/constants/layout';

// ─── Props ─────────────────────────────────────────────────────

export interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  intensity?: number;
  borderRadius?: number;
}

// ─── Component ─────────────────────────────────────────────────

export function GlassCard({
  children,
  style,
  intensity = 40,
  borderRadius = Layout.card.borderRadius,
}: GlassCardProps) {
  return (
    <View style={[styles.container, { borderRadius }, style]}>
      <BlurView intensity={intensity} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient
        colors={[CalorAIColors.glassBg, 'transparent']}
        style={StyleSheet.absoluteFill}
      />
      <View style={styles.content}>{children}</View>
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: CalorAIColors.glassBorder,
  },
  content: {
    flex: 1,
  },
});
