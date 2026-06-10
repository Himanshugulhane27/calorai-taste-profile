// ─── Assignment Schema (exact match) ───────────────────────────

/**
 * A single food item as defined by the CalorAI assignment.
 * This interface MUST match the shape of objects in foods.json.
 */
export interface Food {
  id: number;
  name: string;
  image: string;
  category: string;
  tags: string[];
}

// ─── Swipe / Reaction Types ────────────────────────────────────

/** Direction the user swiped a FoodCard */
export type SwipeDirection = 'left' | 'right';

/** One recorded user reaction to a food item */
export interface FoodReaction {
  foodId: number;
  direction: SwipeDirection;
  timestamp: number;
}

// ─── Taste Profile (derived from reactions) ────────────────────

export interface TasteProfile {
  title: string;
  description: string;
  traits: string[];
  topCategories: { category: string; count: number }[];
  topTags: { tag: string; count: number }[];
}

// ─── Context State & Actions ───────────────────────────────────

/** State managed by TasteContext */
export interface TasteState {
  reactions: FoodReaction[];
  profile: TasteProfile;
  currentIndex: number;
  isComplete: boolean;
}

/** All possible actions the taste reducer handles */
export type TasteAction =
  | { type: 'REACT_TO_FOOD'; payload: FoodReaction }
  | { type: 'NEXT_FOOD' }
  | { type: 'RESET' }
  | { type: 'SET_COMPLETE' };
