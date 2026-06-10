/**
 * Root layout — wraps the app in providers and sets up
 * stack-based navigation for the Taste Profile flow.
 *
 * Route stack: index (Intro) → swipe → results
 *
 * GestureHandlerRootView is required at the root for
 * react-native-gesture-handler v2 Gesture API to work.
 */

import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { TasteProvider } from '@/context/TasteContext';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
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
    </GestureHandlerRootView>
  );
}
