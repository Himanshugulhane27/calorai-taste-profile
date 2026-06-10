import React, { useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import Animated, { FadeIn, FadeInUp, SlideInRight, useSharedValue, withSpring, useAnimatedStyle, withDelay } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

import foodsData from '@/data/foods.json';
import type { Food } from '@/types/food';
import { useTaste } from '@/hooks/useTaste';
import { CalorAIColors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import { Spacing } from '@/constants/theme';
import GlassCard from '@/components/GlassCard';

export default function ResultsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { state, dispatch } = useTaste();

  // ─── Data Derivation ──────────────────────────────────────────
  
  const { likedFoods, dislikedFoods } = useMemo(() => {
    const liked: Food[] = [];
    const disliked: Food[] = [];
    
    state.reactions.forEach(reaction => {
      const food = foodsData.find(f => f.id === reaction.foodId);
      if (food) {
        if (reaction.direction === 'right') liked.push(food as Food);
        if (reaction.direction === 'left') disliked.push(food as Food);
      }
    });

    return { likedFoods: liked, dislikedFoods: disliked };
  }, [state.reactions]);

  const totalSwiped = likedFoods.length + dislikedFoods.length;
  const matchPercentage = totalSwiped > 0 ? Math.round((likedFoods.length / totalSwiped) * 100) : 0;

  // Derive top category
  const topCategory = useMemo(() => {
    if (likedFoods.length === 0) return 'Undecided';
    const counts: Record<string, number> = {};
    likedFoods.forEach(f => { counts[f.category] = (counts[f.category] || 0) + 1; });
    return Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b);
  }, [likedFoods]);

  // Derive simple tag breakdown
  const tagBreakdown = useMemo(() => {
    const counts: Record<string, number> = {};
    likedFoods.forEach(f => {
      f.tags.forEach(tag => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4); // Top 4 tags
  }, [likedFoods]);

  const profileLabel = likedFoods.length === 0 
    ? "The Blank Canvas"
    : `The ${topCategory} Explorer`;

  const profileDesc = likedFoods.length === 0
    ? "You didn't like anything! Are you a picky eater or just hard to please?"
    : `You have a strong affinity for ${topCategory} cuisine, with a diverse palate spanning ${tagBreakdown.length} flavor profiles.`;

  // ─── Animations ───────────────────────────────────────────────
  
  const cardScale = useSharedValue(0.9);
  const cardOpacity = useSharedValue(0);

  useEffect(() => {
    cardScale.value = withSpring(1, { damping: 15, stiffness: 100 });
    cardOpacity.value = withSpring(1);
  }, []);

  const cardAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cardScale.value }],
    opacity: cardOpacity.value,
  }));

  // ─── Handlers ─────────────────────────────────────────────────
  
  const handleStartOver = () => {
    dispatch({ type: 'RESET' });
    router.replace('/');
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
          <ScrollView 
            contentContainerStyle={[styles.scrollContent, { paddingBottom: Math.max(insets.bottom, Spacing.six) }]}
            showsVerticalScrollIndicator={false}
          >
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Your Taste Profile</Text>
            </View>

            {/* Profile Card */}
            <Animated.View style={[cardAnimatedStyle, styles.cardContainer]}>
              <GlassCard intensity={30} borderRadius={24} style={styles.profileCard}>
                <View style={styles.profileIconContainer}>
                  <Ionicons name="restaurant" size={32} color={CalorAIColors.accent} />
                </View>
                <Text style={styles.profileLabel}>{profileLabel}</Text>
                <Text style={styles.profileDesc}>{profileDesc}</Text>
                
                <View style={styles.badgesRow}>
                  {tagBreakdown.slice(0,3).map(([tag], i) => (
                    <View key={i} style={styles.badge}>
                      <Text style={styles.badgeText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </GlassCard>
            </Animated.View>

            {/* Stats Row */}
            <View style={styles.statsRow}>
              <Animated.View entering={FadeInUp.delay(100)} style={styles.statBox}>
                <Text style={styles.statValue}>{likedFoods.length}</Text>
                <Text style={styles.statLabel}>Loved</Text>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(200)} style={styles.statBox}>
                <Text style={styles.statValue}>{dislikedFoods.length}</Text>
                <Text style={styles.statLabel}>Passed</Text>
              </Animated.View>
              <Animated.View entering={FadeInUp.delay(300)} style={styles.statBox}>
                <Text style={styles.statValue}>{matchPercentage}%</Text>
                <Text style={styles.statLabel}>Match</Text>
              </Animated.View>
            </View>

            {/* Foods You Love (Horizontal Scroll) */}
            {likedFoods.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Foods You Love</Text>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScroll}
                >
                  {likedFoods.map((food, index) => (
                    <Animated.View 
                      key={food.id} 
                      entering={SlideInRight.delay(index * 60).springify()}
                      style={styles.foodItem}
                    >
                      <Image source={{ uri: food.image }} style={styles.foodImage} />
                      <Text style={styles.foodName} numberOfLines={1}>{food.name}</Text>
                      <Text style={styles.foodCategory}>{food.category}</Text>
                    </Animated.View>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Category Breakdown */}
            {tagBreakdown.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Flavor Breakdown</Text>
                <View style={styles.breakdownContainer}>
                  {tagBreakdown.map(([tag, count], i) => {
                    const widthPct = Math.max(15, (count / likedFoods.length) * 100);
                    return (
                      <Animated.View key={tag} entering={FadeIn.delay(400 + i * 100)} style={styles.breakdownRow}>
                        <Text style={styles.breakdownLabel}>{tag}</Text>
                        <View style={styles.breakdownBarContainer}>
                          <LinearGradient
                            colors={['#4ADE80', '#22C55E']}
                            start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                            style={[styles.breakdownBar, { width: `${widthPct}%` }]}
                          />
                        </View>
                        <Text style={styles.breakdownCount}>{count}</Text>
                      </Animated.View>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Start Over Button */}
            <Animated.View entering={FadeInUp.delay(600)} style={styles.buttonContainer}>
              <Pressable style={styles.button} onPress={handleStartOver}>
                <Text style={styles.buttonText}>Start Over</Text>
              </Pressable>
            </Animated.View>

          </ScrollView>
        </SafeAreaView>
      </LinearGradient>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  safeArea: { flex: 1 },
  scrollContent: {
    paddingTop: Spacing.four,
  },
  header: {
    paddingHorizontal: Layout.spacing.pagePadding,
    marginBottom: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: CalorAIColors.textPrimary,
  },
  cardContainer: {
    paddingHorizontal: Layout.spacing.pagePadding,
    marginBottom: Spacing.five,
  },
  profileCard: {
    padding: Spacing.four,
    alignItems: 'center',
  },
  profileIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(74, 222, 128, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.three,
  },
  profileLabel: {
    fontSize: 22,
    fontWeight: '700',
    color: CalorAIColors.textPrimary,
    marginBottom: Spacing.two,
    textAlign: 'center',
  },
  profileDesc: {
    fontSize: 15,
    color: CalorAIColors.textMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.four,
  },
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.two,
  },
  badge: {
    backgroundColor: CalorAIColors.glassBg,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CalorAIColors.glassBorder,
  },
  badgeText: {
    color: CalorAIColors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
    textTransform: 'capitalize',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: Layout.spacing.pagePadding,
    marginBottom: Spacing.six,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: CalorAIColors.textPrimary,
  },
  statLabel: {
    fontSize: 14,
    color: CalorAIColors.textMuted,
    marginTop: 4,
  },
  section: {
    marginBottom: Spacing.six,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: CalorAIColors.textPrimary,
    paddingHorizontal: Layout.spacing.pagePadding,
    marginBottom: Spacing.three,
  },
  horizontalScroll: {
    paddingHorizontal: Layout.spacing.pagePadding,
    gap: Spacing.three,
  },
  foodItem: {
    width: 120,
  },
  foodImage: {
    width: 120,
    height: 120,
    borderRadius: 16,
    marginBottom: Spacing.two,
  },
  foodName: {
    fontSize: 15,
    fontWeight: '600',
    color: CalorAIColors.textPrimary,
    marginBottom: 2,
  },
  foodCategory: {
    fontSize: 13,
    color: CalorAIColors.textMuted,
  },
  breakdownContainer: {
    paddingHorizontal: Layout.spacing.pagePadding,
    gap: Spacing.three,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  breakdownLabel: {
    width: 80,
    fontSize: 14,
    color: CalorAIColors.textPrimary,
    textTransform: 'capitalize',
  },
  breakdownBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: CalorAIColors.progressTrack,
    borderRadius: 4,
    marginHorizontal: Spacing.three,
    overflow: 'hidden',
  },
  breakdownBar: {
    height: '100%',
    borderRadius: 4,
  },
  breakdownCount: {
    width: 24,
    textAlign: 'right',
    fontSize: 14,
    fontWeight: '600',
    color: CalorAIColors.textPrimary,
  },
  buttonContainer: {
    paddingHorizontal: Layout.spacing.pagePadding,
    marginTop: Spacing.two,
  },
  button: {
    backgroundColor: CalorAIColors.accent,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: CalorAIColors.bgGradientStart,
    fontSize: 16,
    fontWeight: '700',
  },
});
