/**
 * Shared layout metrics for the CalorAI Taste Profile feature.
 * Centralises dimensions, radii, and animation tuning so
 * components never contain magic numbers.
 */

import { Dimensions } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const Layout = {
  screen: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  card: {
    width: SCREEN_WIDTH * 0.88,
    height: SCREEN_HEIGHT * 0.55,
    borderRadius: 24,
  },
  progressBar: {
    height: 6,
    borderRadius: 3,
  },
  button: {
    height: 56,
    borderRadius: 16,
  },
  swipe: {
    /** Fraction of screen width to trigger a swipe */
    threshold: SCREEN_WIDTH * 0.35,
    /** How far off-screen to animate the exiting card */
    exitDistance: SCREEN_WIDTH * 1.5,
    /** Rotation interpolation input range (px) */
    rotationInputRange: [-200, 0, 200] as const,
    /** Rotation interpolation output range (deg) */
    rotationOutputRange: [-15, 0, 15] as const,
    /** Max overlay opacity when swiping */
    overlayMaxOpacity: 0.8,
  },
  stack: {
    /** How many cards to render in the visible stack */
    maxVisible: 3,
    /** Scale decrease per card behind the top card */
    scaleDecrement: 0.05,
    /** TranslateY offset per card behind the top card */
    translateYOffset: 8,
  },
  animation: {
    /** Swipe card exit duration (ms) */
    swipeDuration: 300,
    springDamping: 15,
    springStiffness: 150,
    /** Entrance animation duration (ms) */
    entranceDuration: 600,
    /** translateY distance for entrance slide-up */
    entranceTranslateY: 20,
    /** Stagger delays for intro screen elements (ms) */
    stagger: {
      logo: 300,
      title: 400,
      subtitle: 550,
      button: 700,
    },
  },
  spacing: {
    /** Horizontal page padding */
    pagePadding: 24,
    /** Gap between intro screen content sections */
    sectionGap: 16,
  },
} as const;
