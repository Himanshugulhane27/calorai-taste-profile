/**
 * useTaste — convenience hook for consuming TasteContext.
 *
 * Throws if used outside of a <TasteProvider>.
 * Saves every consumer from null-checking the context value.
 */

import { useContext } from 'react';
import { TasteContext } from '@/context/TasteContext';
import type { TasteState, TasteAction } from '@/types/food';
import type { Dispatch } from 'react';

interface UseTasteReturn {
  state: TasteState;
  dispatch: Dispatch<TasteAction>;
}

export function useTaste(): UseTasteReturn {
  const ctx = useContext(TasteContext);

  if (!ctx) {
    throw new Error('useTaste must be used within a <TasteProvider>');
  }

  return ctx;
}
