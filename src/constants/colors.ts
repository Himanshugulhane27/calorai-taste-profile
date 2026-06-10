/**
 * CalorAI brand colour palette.
 *
 * This file extends (does not replace) the existing theme.ts Colors.
 * theme.ts owns platform-agnostic light/dark tokens.
 * This file owns CalorAI-specific brand tokens.
 */

export const CalorAIColors = {
  // Primary brand gradient
  gradientStart: '#6366F1',
  gradientEnd: '#8B5CF6',

  // Glass card tokens
  glassBg: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',

  // Swipe feedback overlays
  liked: '#34D399',
  disliked: '#F87171',

  // Progress bar
  progressTrack: 'rgba(255, 255, 255, 0.15)',
  progressFill: '#6366F1',

  // Text on dark / gradient backgrounds
  textOnGradient: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.7)',
} as const;
