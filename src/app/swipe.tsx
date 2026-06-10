import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import foodsData from '@/data/foods.json';
import type { Food, SwipeDirection } from '@/types/food';
import { useTaste } from '@/hooks/useTaste';
import { CalorAIColors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';

import GlassCard from '@/components/GlassCard';
import { ProgressBar } from '@/components/ProgressBar';
import { CardStack, type CardStackRef } from '@/components/FoodCard';

const TOTAL_FOODS = foodsData.length;

export default function SwipeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { dispatch } = useTaste();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const isAnimating = useRef(false);
  const cardStackRef = useRef<CardStackRef>(null);

  const visibleFoods = useMemo(() => {
    return foodsData.slice(currentIndex, currentIndex + Layout.stack.maxVisible);
  }, [currentIndex]);

  // Image prefetch
  useEffect(() => {
    const next1 = foodsData[currentIndex + 1];
    const next2 = foodsData[currentIndex + 2];
    if (next1?.image) Image.prefetch(next1.image);
    if (next2?.image) Image.prefetch(next2.image);
  }, [currentIndex]);

  const navigateToResults = useCallback(() => {
    // router.replace prevents going back to the empty swipe deck
    router.replace('/results');
  }, [router]);

  const handleSwipe = useCallback((direction: SwipeDirection) => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const food = foodsData[currentIndex];
    
    // Dispatch reaction BEFORE navigation logic
    dispatch({
      type: 'REACT_TO_FOOD',
      payload: {
        foodId: food.id,
        direction,
        timestamp: Date.now(),
      },
    });

    const nextIndex = currentIndex + 1;
    if (nextIndex >= TOTAL_FOODS) {
      navigateToResults();
    } else {
      setCurrentIndex(nextIndex);
      dispatch({ type: 'NEXT_FOOD' });
      isAnimating.current = false;
    }
  }, [currentIndex, dispatch, navigateToResults]);

  const onPressLike = () => {
    if (isAnimating.current) return;
    cardStackRef.current?.swipeRight();
  };

  const onPressDislike = () => {
    if (isAnimating.current) return;
    cardStackRef.current?.swipeLeft();
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <StatusBar style="light" translucent={true} backgroundColor="transparent" />
      
      <LinearGradient
        colors={[CalorAIColors.bgGradientStart, CalorAIColors.bgGradientEnd]}
        style={styles.container}
      >
        <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
          {/* Header Row */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Ionicons name="chevron-back" size={28} color={CalorAIColors.textPrimary} />
            </Pressable>
            <Text style={styles.title}>Taste Profile</Text>
            <Text style={styles.counter}>{currentIndex} / {TOTAL_FOODS}</Text>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressContainer}>
            <ProgressBar 
              current={currentIndex} 
              total={TOTAL_FOODS} 
              animated={true} 
            />
          </View>

          {/* Card Stack Area */}
          <View style={styles.cardArea}>
            {visibleFoods.length > 0 ? (
              <CardStack
                ref={cardStackRef}
                foods={foodsData as Food[]}
                currentIndex={currentIndex}
                onSwipe={handleSwipe}
              />
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No foods available</Text>
              </View>
            )}
          </View>

          {/* Action Buttons Row */}
          {visibleFoods.length > 0 && (
            <View style={[styles.actionRow, { paddingBottom: Math.max(insets.bottom, Spacing.six) }]}>
              <Pressable onPress={onPressDislike}>
                <GlassCard intensity={40} borderRadius={36}>
                  <View style={styles.actionButton}>
                    <Ionicons name="close" size={32} color={CalorAIColors.disliked} />
                  </View>
                </GlassCard>
              </Pressable>

              <Pressable onPress={onPressLike}>
                <GlassCard intensity={40} borderRadius={36}>
                  <View style={styles.actionButton}>
                    <Ionicons name="heart" size={32} color={CalorAIColors.liked} />
                  </View>
                </GlassCard>
              </Pressable>
            </View>
          )}
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.pagePadding,
    paddingVertical: Spacing.four,
  },
  backButton: {
    width: 40,
    alignItems: 'flex-start',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: CalorAIColors.textPrimary,
  },
  counter: {
    width: 40,
    fontSize: 16,
    color: CalorAIColors.textMuted,
    textAlign: 'right',
  },
  progressContainer: {
    paddingHorizontal: Layout.spacing.pagePadding,
    paddingBottom: Spacing.four,
  },
  cardArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 48,
    paddingTop: Spacing.four,
  },
  actionButton: {
    width: 72,
    height: 72,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: CalorAIColors.textPrimary,
    fontSize: 18,
  },
});
