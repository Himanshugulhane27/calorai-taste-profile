/**
 * FoodCard — swipeable card for the taste quiz.
 *
 * Displays a food item inside a GlassCard.
 * Swipe gestures and animations are stubbed — will be
 * implemented with react-native-gesture-handler Gesture.Pan()
 * and react-native-reanimated when screens are built.
 *
 * Uses expo-image for efficient image loading with caching.
 */

import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { Image } from 'expo-image';
import { GlassCard } from '@/components/GlassCard';
import { Layout } from '@/constants/layout';
import { CalorAIColors } from '@/constants/colors';
import type { Food, SwipeDirection } from '@/types/food';

// ─── Props ─────────────────────────────────────────────────────

export interface FoodCardProps {
  /** The food item to display */
  food: Food;
  /** Callback fired after a completed swipe */
  onSwipe: (direction: SwipeDirection) => void;
  /** Whether this card accepts gestures (default: true) */
  isActive?: boolean;
  /** Container style overrides */
  style?: StyleProp<ViewStyle>;
}

// ─── Component ─────────────────────────────────────────────────

export function FoodCard({
  food,
  onSwipe: _onSwipe,
  isActive: _isActive = true,
  style,
}: FoodCardProps) {
  // TODO: add PanGesture handler
  // TODO: add animated translateX/Y and rotation
  // TODO: add like/dislike overlay based on swipe direction

  return (
    <GlassCard
      style={[
        {
          width: Layout.card.width,
          height: Layout.card.height,
        },
        style,
      ]}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: food.image }}
          style={styles.image}
          contentFit="cover"
          transition={200}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.name}>{food.name}</Text>
        <Text style={styles.category}>{food.category}</Text>

        <View style={styles.tagsContainer}>
          {food.tags.map((tag) => (
            <View key={tag} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      </View>
    </GlassCard>
  );
}

// ─── Styles ────────────────────────────────────────────────────

const styles = StyleSheet.create({
  imageContainer: {
    flex: 1,
    overflow: 'hidden',
    borderTopLeftRadius: Layout.card.borderRadius,
    borderTopRightRadius: Layout.card.borderRadius,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: CalorAIColors.textOnGradient,
  },
  category: {
    fontSize: 14,
    color: CalorAIColors.textMuted,
    marginTop: 4,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    gap: 8,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: CalorAIColors.glassBg,
    borderWidth: 1,
    borderColor: CalorAIColors.glassBorder,
  },
  tagText: {
    fontSize: 12,
    color: CalorAIColors.textOnGradient,
  },
});
