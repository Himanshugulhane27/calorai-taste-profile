import { useMemo } from 'react';
import type { Food, TasteProfile } from '@/types/food';
import { useTaste } from '@/hooks/useTaste';
import foodsData from '@/data/foods.json';

// Define the sets mapping to profile criteria
const PROTEIN_TAGS = ['seafood', 'pork', 'chicken', 'meat', 'beef'];
const PLANT_TAGS = ['vegetarian', 'vegetables', 'vegan', 'plant-based'];
const COMFORT_TAGS = ['cheese', 'fried', 'chocolate', 'sweet', 'pastry', 'creamy'];
const HEALTHY_TAGS = ['healthy', 'whole-grain', 'salad'];
const GLOBAL_CATEGORIES = ['Japanese', 'Italian', 'Mexican'];

/**
 * Pure function to analyze liked/disliked foods and generate a TasteProfile.
 */
export function profileAnalysis(liked: Food[], disliked: Food[]): TasteProfile {
  if (!liked || liked.length === 0) {
    return {
      title: "The Blank Canvas",
      description: "You haven't liked anything yet! Are you a picky eater or just hard to please?",
      traits: ["Picky Eater", "Undecided", "Blank Slate"],
      topCategories: [],
      topTags: []
    };
  }

  const tagCounts: Record<string, number> = {};
  const categoryCounts: Record<string, number> = {};

  // Count frequencies
  liked.forEach(food => {
    categoryCounts[food.category] = (categoryCounts[food.category] || 0) + 1;
    food.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });

  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count);

  const topCategories = Object.entries(categoryCounts)
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);

  // Compute percentages
  const totalLiked = liked.length;
  
  const getTagMatchCount = (tagsList: string[]) => 
    liked.filter(f => f.tags.some(t => tagsList.includes(t.toLowerCase()))).length;
    
  const getCategoryMatchCount = (categoriesList: string[]) => 
    liked.filter(f => categoriesList.includes(f.category)).length;

  const proteinPct = getTagMatchCount(PROTEIN_TAGS) / totalLiked;
  const plantPct = getTagMatchCount(PLANT_TAGS) / totalLiked;
  const comfortPct = getTagMatchCount(COMFORT_TAGS) / totalLiked;
  const healthyPct = getTagMatchCount(HEALTHY_TAGS) / totalLiked;
  const globalPct = getCategoryMatchCount(GLOBAL_CATEGORIES) / totalLiked;

  // Determine dominant profile
  let title = "The Adventurous Eater";
  let description = "You have a diverse and exciting palate, always ready to try something new and bold.";

  if (proteinPct > 0.4) {
    title = "The Protein Enthusiast";
    description = "You gravitate towards hearty, protein-rich meals that keep you fueled and satisfied.";
  } else if (plantPct > 0.3) {
    title = "The Plant Pioneer";
    description = "You love fresh, plant-based flavors and prioritize vibrant, vegetable-forward dishes.";
  } else if (comfortPct > 0.3) {
    title = "The Comfort Seeker";
    description = "You seek out rich, indulgent, and comforting foods that hit the spot every time.";
  } else if (healthyPct > 0.3) {
    title = "The Clean Eater";
    description = "You prefer clean, wholesome, and nutritious foods that make you feel energized.";
  } else if (globalPct > 0.3) {
    title = "The Global Explorer";
    description = "Your taste buds love traveling! You frequently enjoy rich international cuisines.";
  }

  // Generate 3 traits
  const traits = topTags.slice(0, 3).map(t => {
    const capitalized = t.tag.charAt(0).toUpperCase() + t.tag.slice(1);
    if (COMFORT_TAGS.includes(t.tag.toLowerCase())) return `Indulgent ${capitalized}`;
    if (PROTEIN_TAGS.includes(t.tag.toLowerCase())) return `High Protein`;
    if (PLANT_TAGS.includes(t.tag.toLowerCase())) return `Plant-Based`;
    return `${capitalized} Lover`;
  });

  // Ensure we always have exactly 3 traits
  while (traits.length < 3) {
    traits.push("Adventurous");
  }

  return {
    title,
    description,
    traits: traits.slice(0, 3),
    topCategories,
    topTags
  };
}

/**
 * Hook to automatically read from TasteContext and memoize the profile analysis.
 */
export function useTasteProfile() {
  const { state } = useTaste();

  return useMemo(() => {
    const likedFoods: Food[] = [];
    const dislikedFoods: Food[] = [];
    
    state.reactions.forEach(reaction => {
      const food = foodsData.find(f => f.id === reaction.foodId);
      if (food) {
        if (reaction.direction === 'right') likedFoods.push(food as Food);
        if (reaction.direction === 'left') dislikedFoods.push(food as Food);
      }
    });

    const profile = profileAnalysis(likedFoods, dislikedFoods);

    return {
      profile,
      likedFoods,
      dislikedFoods,
      isLoading: false
    };
  }, [state.reactions]);
}
