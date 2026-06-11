/**
 * TasteContext — React Context + useReducer for taste-quiz state.
 *
 * Provides:
 * - TasteContext: the raw React Context object
 * - tasteReducer: pure reducer function (testable in isolation)
 * - TasteProvider: provider component to wrap the app layout
 * - initialTasteState: default state constant
 */

import React, { createContext, useReducer, type Dispatch, type ReactNode } from 'react';
import type { TasteState, TasteAction, TasteProfile } from '@/types/food';

// ─── Initial State ─────────────────────────────────────────────

const emptyProfile: TasteProfile = {
  title: '',
  description: '',
  traits: [],
  topCategories: [],
  topTags: [],
};

export const initialTasteState: TasteState = {
  reactions: [],
  profile: emptyProfile,
  currentIndex: 0,
  isComplete: false,
};

// ─── Reducer ───────────────────────────────────────────────────

export function tasteReducer(state: TasteState, action: TasteAction): TasteState {
  switch (action.type) {
    case 'REACT_TO_FOOD':
      return {
        ...state,
        reactions: [...state.reactions, action.payload]
      };

    case 'NEXT_FOOD':
      return { ...state, currentIndex: state.currentIndex + 1 };

    case 'RESET':
      return initialTasteState;

    case 'SET_COMPLETE':
      return { ...state, isComplete: true };

    default:
      return state;
  }
}

// ─── Context ───────────────────────────────────────────────────

interface TasteContextValue {
  state: TasteState;
  dispatch: Dispatch<TasteAction>;
}

export const TasteContext = createContext<TasteContextValue | null>(null);

// ─── Provider ──────────────────────────────────────────────────

interface TasteProviderProps {
  children: ReactNode;
}

export function TasteProvider({ children }: TasteProviderProps) {
  const [state, dispatch] = useReducer(tasteReducer, initialTasteState);

  return (
    <TasteContext.Provider value={{ state, dispatch }}>
      {children}
    </TasteContext.Provider>
  );
}
