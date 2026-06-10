/**
 * Haptic feedback helpers.
 *
 * Wraps expo-haptics into short-hand functions with silent
 * fallback on platforms that don't support haptics (web).
 */

import * as Haptics from 'expo-haptics';

export async function lightTap(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // Silently ignore on platforms without haptic support
  }
}

export async function mediumTap(): Promise<void> {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {
    // Silently ignore on platforms without haptic support
  }
}

export async function successNotification(): Promise<void> {
  try {
    await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  } catch {
    // Silently ignore on platforms without haptic support
  }
}
