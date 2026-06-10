/**
 * Root layout — wraps the app in providers and sets up
 * stack-based navigation for the Taste Profile flow.
 *
 * Route stack: index (Intro) → swipe → results
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { TasteProvider } from '@/context/TasteContext';

export default function RootLayout() {
  return (
    <TasteProvider>
      <StatusBar style="light" />
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'fade',
          contentStyle: { backgroundColor: 'transparent' },
        }}
      />
    </TasteProvider>
  );
}
