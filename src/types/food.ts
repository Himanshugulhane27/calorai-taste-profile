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

/**
 * Per-category score computed from the user's swipe history.
 * Keys are the `category` strings found in foods.json —
 * not a hardcoded union, so this works with any dataset.
 */
export type TasteScores = Record<string, number>;

/** The user's computed taste profile */
export interface TasteProfile {
  scores: TasteScores;
  topCategories: string[];
  totalReactions: number;
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
