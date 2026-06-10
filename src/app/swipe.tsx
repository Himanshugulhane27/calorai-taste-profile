/**
 * SwipeScreen — placeholder for the food swipe quiz.
 * Will be implemented in a follow-up task.
 */

import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

import { CalorAIColors } from '@/constants/colors';

export default function SwipeScreen() {
  return (
    <LinearGradient
      colors={[CalorAIColors.bgGradientStart, CalorAIColors.bgGradientEnd]}
      style={styles.gradient}
    >
      <View style={styles.container}>
        <Text style={styles.text}>Swipe Screen — Coming Soon</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    color: CalorAIColors.textPrimary,
  },
});
