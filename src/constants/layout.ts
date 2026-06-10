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
  animation: {
    swipeDuration: 300,
    springDamping: 15,
    springStiffness: 150,
  },
} as const;
