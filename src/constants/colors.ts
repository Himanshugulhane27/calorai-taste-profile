/**
 * CalorAI brand colour palette.
 *
 * This file extends (does not replace) the existing theme.ts Colors.
 * theme.ts owns platform-agnostic light/dark tokens.
 * This file owns CalorAI-specific brand tokens.
 */

export const CalorAIColors = {
  // ─── Background gradient (dark theme) ────────────────────────
  bgGradientStart: '#0A0E1A',
  bgGradientEnd: '#1A1F35',

  // ─── Brand accent ────────────────────────────────────────────
  accent: '#4ADE80',
  accentPressed: '#22C55E',

  // ─── Glass card tokens ───────────────────────────────────────
  glassBg: 'rgba(255, 255, 255, 0.12)',
  glassBorder: 'rgba(255, 255, 255, 0.18)',

  // ─── Swipe feedback overlays ─────────────────────────────────
  liked: '#34D399',
  disliked: '#F87171',

  // ─── Progress bar ────────────────────────────────────────────
  progressTrack: 'rgba(255, 255, 255, 0.15)',
  progressFill: '#4ADE80',

  // ─── Text ────────────────────────────────────────────────────
  textPrimary: '#FFFFFF',
  textMuted: 'rgba(255, 255, 255, 0.6)',
  textOnAccent: '#0A0E1A',
} as const;
