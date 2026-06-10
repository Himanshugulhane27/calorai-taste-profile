/**
 * GlassCard — frosted-glass container with platform-aware rendering.
 *
 * iOS:     expo-blur BlurView + semi-transparent overlay
 * Android: opaque dark background (no BlurView — it doesn't render
 *          reliably on Android, so we use a visually appealing fallback)
 *
 * @example
 * ```tsx
 * import GlassCard from '@/components/GlassCard';
 *
 * function MyScreen() {
 *   return (
 *     <GlassCard style={{ padding: 20 }}>
 *       <Text style={{ color: '#fff' }}>Hello from inside the glass</Text>
 *     </GlassCard>
 *   );
 * }
 *
 * // With custom blur intensity (iOS only) and border radius:
 * <GlassCard intensity={40} borderRadius={24}>
 *   {children}
 * </GlassCard>
 * ```
 */

import React, { type ReactNode } from 'react';
import { Platform, StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

// ─── Constants ─────────────────────────────────────────────────

const GLASS_BORDER_COLOR = 'rgba(255, 255, 255, 0.15)';
const IOS_OVERLAY_COLOR = 'rgba(255, 255, 255, 0.08)';
const ANDROID_BG_COLOR = 'rgba(18, 22, 28, 0.92)';

const DEFAULT_INTENSITY = 25;
const DEFAULT_BORDER_RADIUS = 16;

// ─── Props ─────────────────────────────────────────────────────

export interface GlassCardProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  /** iOS blur intensity (ignored on Android). Default: 25 */
  intensity?: number;
  /** Corner radius. Default: 16 */
  borderRadius?: number;
}

// ─── Component ─────────────────────────────────────────────────

function GlassCard({
  children,
  style,
  intensity = DEFAULT_INTENSITY,
  borderRadius = DEFAULT_BORDER_RADIUS,
}: GlassCardProps) {
  const isIOS = Platform.OS === 'ios';

  return (
    <View
      style={[
        styles.container,
        {
          borderRadius,
          backgroundColor: isIOS ? 'transparent' : ANDROID_BG_COLOR,
        },
        style,
      ]}
    >
      {/* ── iOS: real blur + semi-transparent overlay ── */}
      {isIOS && (
        <>
          <BlurView
            intensity={intensity}
            tint="dark"
            style={StyleSheet.absoluteFill}
          />
          <View
            style={[StyleSheet.absoluteFill, styles.iosOverlay]}
            pointerEvents="none"
          />
        </>
      )}

      {/* ── Content ── */}
      {children}
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: GLASS_BORDER_COLOR,
  },
  iosOverlay: {
    backgroundColor: IOS_OVERLAY_COLOR,
  },
});

export default GlassCard;
