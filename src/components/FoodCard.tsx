/**
 * FoodCard + CardStack — swipeable card system for the taste quiz.
 *
 * FoodCard (default export):
 *   - Gesture-driven swipe via react-native-gesture-handler Gesture.Pan()
 *   - Rotation interpolation: [-200, 0, 200] → [-15°, 0°, 15°]
 *   - LIKE/NOPE overlays fade in based on swipe direction
 *   - Haptic feedback when crossing the swipe threshold (once per gesture)
 *   - Exposes swipeRight()/swipeLeft() via ref for programmatic swipes
 *
 * CardStack (named export):
 *   - Renders top 3 cards in a stacked layout
 *   - Behind cards: scale(0.95/0.90), translateY(-8/-16)
 *   - Cards animate forward with withSpring when the top card exits
 *   - Exposes swipeRight()/swipeLeft() via ref for button fallback
 *
 * All animations run on the UI thread. Zero setState during gestures.
 */

import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { Image } from 'expo-image';
import * as Haptics from 'expo-haptics';

import GlassCard from '@/components/GlassCard';
import { CalorAIColors } from '@/constants/colors';
import { Layout } from '@/constants/layout';
import type { Food, SwipeDirection } from '@/types/food';

// ─── Constants (from Layout) ───────────────────────────────────

const SWIPE_THRESHOLD = Layout.swipe.threshold;
const EXIT_DISTANCE = Layout.swipe.exitDistance;
const ROTATION_IN = Layout.swipe.rotationInputRange;
const ROTATION_OUT = Layout.swipe.rotationOutputRange;
const OVERLAY_MAX = Layout.swipe.overlayMaxOpacity;

const SPRING_EXIT = {
  damping: Layout.animation.springDamping,
  stiffness: Layout.animation.springStiffness,
};
const SPRING_RETURN = {
  damping: 20,
  stiffness: 200,
};

// ═══════════════════════════════════════════════════════════════
//  FoodCard
// ═══════════════════════════════════════════════════════════════

export interface FoodCardProps {
  /** The food item to display */
  food: Food;
  /** Fires after the exit animation completes */
  onSwipe: (direction: SwipeDirection) => void;
  /** Whether this card accepts gestures (default: true) */
  isActive?: boolean;
}

export interface FoodCardRef {
  swipeRight: () => void;
  swipeLeft: () => void;
}

const FoodCard = forwardRef<FoodCardRef, FoodCardProps>(
  function FoodCard({ food, onSwipe, isActive = true }, ref) {
    // ── Shared values ──────────────────────────────────────────
    const translateX = useSharedValue(0);
    const translateY = useSharedValue(0);
    const hasTriggeredHaptic = useSharedValue(false);

    // ── JS callbacks (called from worklets via runOnJS) ────────
    const triggerHaptic = useCallback(() => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }, []);

    const emitSwipe = useCallback(
      (direction: SwipeDirection) => {
        onSwipe(direction);
      },
      [onSwipe],
    );

    // ── Programmatic swipe (for button fallback) ───────────────
    const animateExit = useCallback(
      (direction: SwipeDirection) => {
        const targetX = direction === 'right' ? EXIT_DISTANCE : -EXIT_DISTANCE;
        translateX.value = withSpring(
          targetX,
          { ...SPRING_EXIT, velocity: direction === 'right' ? 800 : -800 },
          (finished) => {
            if (finished) {
              runOnJS(emitSwipe)(direction);
            }
          },
        );
      },
      [translateX, emitSwipe],
    );

    useImperativeHandle(
      ref,
      () => ({
        swipeRight: () => animateExit('right'),
        swipeLeft: () => animateExit('left'),
      }),
      [animateExit],
    );

    // ── Pan gesture ────────────────────────────────────────────
    const panGesture = Gesture.Pan()
      .enabled(isActive)
      .onStart(() => {
        'worklet';
        hasTriggeredHaptic.value = false;
      })
      .onUpdate((event) => {
        'worklet';
        translateX.value = event.translationX;
        translateY.value = event.translationY;

        // Haptic when crossing threshold (fire once per gesture)
        if (
          !hasTriggeredHaptic.value &&
          Math.abs(event.translationX) > SWIPE_THRESHOLD
        ) {
          hasTriggeredHaptic.value = true;
          runOnJS(triggerHaptic)();
        }
      })
      .onEnd((event) => {
        'worklet';
        if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
          // ── Commit swipe ──
          const direction: SwipeDirection =
            translateX.value > 0 ? 'right' : 'left';
          const targetX =
            direction === 'right' ? EXIT_DISTANCE : -EXIT_DISTANCE;

          translateX.value = withSpring(
            targetX,
            { ...SPRING_EXIT, velocity: event.velocityX },
            (finished) => {
              if (finished) {
                runOnJS(emitSwipe)(direction);
              }
            },
          );
        } else {
          // ── Spring back ──
          translateX.value = withSpring(0, SPRING_RETURN);
          translateY.value = withSpring(0, SPRING_RETURN);
        }
      });

    // ── Animated styles (UI thread) ────────────────────────────
    const cardAnimatedStyle = useAnimatedStyle(() => {
      const rotation = interpolate(
        translateX.value,
        [...ROTATION_IN],
        [...ROTATION_OUT],
        Extrapolation.CLAMP,
      );
      return {
        transform: [
          { translateX: translateX.value },
          { translateY: translateY.value },
          { rotate: `${rotation}deg` },
        ],
      };
    });

    const likeOverlayStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [0, SWIPE_THRESHOLD],
        [0, OVERLAY_MAX],
        Extrapolation.CLAMP,
      ),
    }));

    const nopeOverlayStyle = useAnimatedStyle(() => ({
      opacity: interpolate(
        translateX.value,
        [-SWIPE_THRESHOLD, 0],
        [OVERLAY_MAX, 0],
        Extrapolation.CLAMP,
      ),
    }));

    // ── Render ─────────────────────────────────────────────────
    return (
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.cardOuter, cardAnimatedStyle]}>
          <GlassCard
            style={{
              width: Layout.card.width,
              height: Layout.card.height,
            }}
          >
            {/* Food image */}
            <View style={styles.imageContainer}>
              <Image
                source={{ uri: food.image }}
                style={styles.image}
                contentFit="cover"
                transition={200}
              />

              {/* LIKE overlay */}
              <Animated.View
                style={[styles.overlay, styles.likeOverlay, likeOverlayStyle]}
                pointerEvents="none"
              >
                <Text style={[styles.overlayLabel, styles.likeLabel]}>
                  LIKE
                </Text>
              </Animated.View>

              {/* NOPE overlay */}
              <Animated.View
                style={[styles.overlay, styles.nopeOverlay, nopeOverlayStyle]}
                pointerEvents="none"
              >
                <Text style={[styles.overlayLabel, styles.nopeLabel]}>
                  NOPE
                </Text>
              </Animated.View>
            </View>

            {/* Food info */}
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
        </Animated.View>
      </GestureDetector>
    );
  },
);

export default FoodCard;

// ═══════════════════════════════════════════════════════════════
//  AnimatedCardWrapper (internal)
// ═══════════════════════════════════════════════════════════════

interface AnimatedCardWrapperProps {
  children: React.ReactNode;
  stackIndex: number;
}

/**
 * Wraps a card in an Animated.View that applies scale and
 * translateY based on its position in the stack. When
 * stackIndex changes (e.g. 2→1→0), the values spring animate.
 */
function AnimatedCardWrapper({ children, stackIndex }: AnimatedCardWrapperProps) {
  const targetScale = 1 - stackIndex * Layout.stack.scaleDecrement;
  const targetTranslateY = -stackIndex * Layout.stack.translateYOffset;

  const scale = useSharedValue(targetScale);
  const tY = useSharedValue(targetTranslateY);

  useEffect(() => {
    scale.value = withSpring(targetScale, SPRING_RETURN);
    tY.value = withSpring(targetTranslateY, SPRING_RETURN);
  }, [targetScale, targetTranslateY, scale, tY]);

  const wrapperStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: tY.value }],
  }));

  return (
    <Animated.View
      style={[stackStyles.cardWrapper, wrapperStyle]}
      pointerEvents={stackIndex === 0 ? 'auto' : 'none'}
    >
      {children}
    </Animated.View>
  );
}

// ═══════════════════════════════════════════════════════════════
//  CardStack
// ═══════════════════════════════════════════════════════════════

export interface CardStackProps {
  /** Full list of food items */
  foods: Food[];
  /** Index of the currently visible top card */
  currentIndex: number;
  /** Fires when the top card is swiped */
  onSwipe: (direction: SwipeDirection) => void;
}

export interface CardStackRef {
  swipeRight: () => void;
  swipeLeft: () => void;
}

export const CardStack = forwardRef<CardStackRef, CardStackProps>(
  function CardStack({ foods, currentIndex, onSwipe }, ref) {
    const topCardRef = useRef<FoodCardRef>(null);

    useImperativeHandle(
      ref,
      () => ({
        swipeRight: () => topCardRef.current?.swipeRight(),
        swipeLeft: () => topCardRef.current?.swipeLeft(),
      }),
      [],
    );

    const visibleFoods = foods.slice(
      currentIndex,
      currentIndex + Layout.stack.maxVisible,
    );

    // Render back-to-front so the top card (stackIndex 0) is
    // the last element and visually on top.
    return (
      <View style={stackStyles.container}>
        {[...visibleFoods].reverse().map((food) => {
          const stackIndex =
            foods.indexOf(food) - currentIndex;

          return (
            <AnimatedCardWrapper key={food.id} stackIndex={stackIndex}>
              <FoodCard
                ref={stackIndex === 0 ? topCardRef : undefined}
                food={food}
                onSwipe={onSwipe}
                isActive={stackIndex === 0}
              />
            </AnimatedCardWrapper>
          );
        })}
      </View>
    );
  },
);

// ═══════════════════════════════════════════════════════════════
//  Styles
// ═══════════════════════════════════════════════════════════════

const styles = StyleSheet.create({
  cardOuter: {
    alignSelf: 'center',
  },
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

  // ── Swipe overlays ──
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  likeOverlay: {
    backgroundColor: 'rgba(74, 222, 128, 0.25)',
  },
  nopeOverlay: {
    backgroundColor: 'rgba(248, 113, 113, 0.25)',
  },
  overlayLabel: {
    fontSize: 48,
    fontWeight: '900',
    letterSpacing: 4,
  },
  likeLabel: {
    color: CalorAIColors.liked,
    borderWidth: 4,
    borderColor: CalorAIColors.liked,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    overflow: 'hidden',
  },
  nopeLabel: {
    color: CalorAIColors.disliked,
    borderWidth: 4,
    borderColor: CalorAIColors.disliked,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 4,
    overflow: 'hidden',
  },

  // ── Food info ──
  infoContainer: {
    padding: 20,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: CalorAIColors.textPrimary,
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
    color: CalorAIColors.textPrimary,
  },
});

const stackStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardWrapper: {
    position: 'absolute',
  },
});
