/**
 * IntroScreen — the landing page of the CalorAI Taste Profile flow.
 *
 * Full-screen dark gradient with staggered entrance animations:
 *   Logo  → 300ms delay  (fade)
 *   Title → 400ms delay  (fade + slide up)
 *   Sub   → 550ms delay  (fade + slide up)
 *   CTA   → 700ms delay  (fade + slide up)
 *
 * All animations run on the UI thread via react-native-reanimated
 * shared values. No Animated from react-native.
 */

import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

import { CalorAIColors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';

// ─── Animation hook ────────────────────────────────────────────

const TIMING_CONFIG = {
  duration: Layout.animation.entranceDuration,
  easing: Easing.out(Easing.cubic),
};

/**
 * Returns an Animated style that fades in and optionally slides up.
 * @param delay  - ms before the animation starts
 * @param slide  - whether to include a translateY entrance
 */
function useEntranceAnimation(delay: number, slide = true) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(
    slide ? Layout.animation.entranceTranslateY : 0,
  );

  useEffect(() => {
    opacity.value = withDelay(delay, withTiming(1, TIMING_CONFIG));
    if (slide) {
      translateY.value = withDelay(delay, withTiming(0, TIMING_CONFIG));
    }
  }, [delay, slide, opacity, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return animatedStyle;
}

// ─── Component ─────────────────────────────────────────────────

export default function IntroScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Staggered entrance animations
  const logoStyle = useEntranceAnimation(Layout.animation.stagger.logo, false);
  const titleStyle = useEntranceAnimation(Layout.animation.stagger.title);
  const subtitleStyle = useEntranceAnimation(Layout.animation.stagger.subtitle);
  const buttonStyle = useEntranceAnimation(Layout.animation.stagger.button);

  function handleGetStarted() {
    router.push('/swipe');
  }

  return (
    <LinearGradient
      colors={[CalorAIColors.bgGradientStart, CalorAIColors.bgGradientEnd]}
      style={styles.gradient}
    >
      <View
        style={[
          styles.container,
          {
            paddingTop: insets.top + Spacing.six,
            paddingBottom: insets.bottom + Spacing.four,
          },
        ]}
      >
        {/* ── Logo / Icon Area ── */}
        <Animated.View style={[styles.logoContainer, logoStyle]}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🍽️</Text>
          </View>
        </Animated.View>

        {/* ── Copy ── */}
        <View style={styles.copyContainer}>
          <Animated.Text style={[styles.title, titleStyle]}>
            Discover Your{'\n'}Taste Profile
          </Animated.Text>

          <Animated.Text style={[styles.subtitle, subtitleStyle]}>
            Swipe to tell us what you love
          </Animated.Text>
        </View>

        {/* ── CTA Button ── */}
        <Animated.View style={[styles.buttonWrapper, buttonStyle]}>
          <Pressable
            onPress={handleGetStarted}
            style={({ pressed }) => [
              styles.button,
              pressed && styles.buttonPressed,
            ]}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: Layout.spacing.pagePadding,
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  // Logo
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.six,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoEmoji: {
    fontSize: 44,
  },

  // Copy
  copyContainer: {
    alignItems: 'center',
    gap: Layout.spacing.sectionGap,
  },
  title: {
    fontSize: 34,
    fontWeight: '800',
    color: CalorAIColors.textPrimary,
    textAlign: 'center',
    lineHeight: 42,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 17,
    color: CalorAIColors.textMuted,
    textAlign: 'center',
    lineHeight: 24,
  },

  // Button
  buttonWrapper: {
    width: '100%',
  },
  button: {
    height: Layout.button.height,
    borderRadius: Layout.button.borderRadius,
    backgroundColor: CalorAIColors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: {
    backgroundColor: CalorAIColors.accentPressed,
    transform: [{ scale: 0.98 }],
  },
  buttonText: {
    fontSize: 18,
    fontWeight: '700',
    color: CalorAIColors.textOnAccent,
    letterSpacing: 0.3,
  },
});
