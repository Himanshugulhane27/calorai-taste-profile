# CalorAI — Taste Profile

A swipeable food preference interface built as a React Native internship test assignment for CalorAI. Users swipe through food cards to build a personalised taste profile, which is analysed and presented on a results screen.

---

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Installation](#installation)
- [Running the Project](#running-the-project)
- [Architecture Decisions](#architecture-decisions)
- [Android Blur Fallback Strategy](#android-blur-fallback-strategy)
- [AI Usage Disclosure](#ai-usage-disclosure)
- [Time Breakdown](#time-breakdown)
- [Known Limitations](#known-limitations)
- [Screenshots](#screenshots)
- [Demo Video](#demo-video)
- [Future Improvements](#future-improvements)

---

## Project Overview

CalorAI Taste Profile is a 3-screen React Native app built with Expo. It recreates the provided Figma designs with a frosted-glass / card-based aesthetic and smooth swipe interactions. The app runs on both iOS and Android via Expo Go.

**User story:** As a new CalorAI user, I want to swipe through foods I love and dislike, so the app can recommend meals tailored to my taste.

---

## Features

- **Animated Intro Screen** — Staggered fade-in and slide-up entrance animations on mount
- **Swipeable Food Cards** — Gesture-driven swipe with spring physics, card rotation, and like/dislike overlays
- **Card Stack** — Peek cards behind the active card, scaled and offset for visual depth
- **Button Fallback** — On-screen like/dislike buttons trigger the same animation path as a manual swipe
- **Progress Bar** — Animated fill that updates smoothly after every swipe
- **GlassCard Component** — Frosted-glass effect on iOS, intentional solid fallback on Android
- **Haptic Feedback** — Medium impact haptic fires when the swipe threshold is crossed
- **Taste Profile Generation** — Swipe data is analysed by tag and category frequency to generate a personality label and traits
- **Results Screen** — Summary of liked/disliked foods, category breakdown, and generated taste profile
- **Cross-platform** — Tested on iOS Simulator and Android Emulator via Expo Go

---

## Tech Stack

| Library | Version | Purpose |
|---|---|---|
| Expo SDK | 54 | Managed workflow, build tooling |
| Expo Router | 6 | File-based navigation |
| React Native Reanimated | 4.1.7 | UI-thread animations (swipe, transitions) |
| React Native Gesture Handler | v2 | Pan gesture recognition |
| Expo Blur | latest | Native blur for iOS glass effect |
| Expo Linear Gradient | latest | Gradient backgrounds |
| Expo Haptics | latest | Tactile feedback on swipe |
| Expo Image | latest | Performant image loading with prefetch |
| TypeScript | — | Type safety throughout |

---

## Folder Structure

```
src/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx
│   ├── swipe.tsx
│   ├── results.tsx
│   └── explore.tsx
├── components/
│   ├── FoodCard.tsx
│   ├── GlassCard.tsx
│   └── ProgressBar.tsx
├── context/
│   └── TasteContext.tsx
├── hooks/
│   ├── useTaste.ts
│   └── useTasteProfile.ts
├── data/
│   └── foods.json
├── constants/
│   ├── colors.ts
│   ├── layout.ts
│   └── theme.ts
└── types/
    └── food.ts
```

---

## Installation

**Prerequisites:** Node.js 18+, Expo Go installed on your device or an iOS Simulator / Android Emulator running.

```bash
# Clone the repository
git clone https://github.com/Himanshugulhane27/calorai-taste-profile.git
cd calorai-taste-profile

# Install dependencies
npm install

# If you encounter peer dependency issues
npm install --legacy-peer-deps
```

---

## Running the Project

```bash
# Start the Expo development server
npx expo start

# Press 'i' for iOS Simulator
# Press 'a' for Android Emulator
# Scan the QR code with Expo Go on a physical device
```

The app targets **Expo Go** — no custom dev client or EAS build is required.

---

## Architecture Decisions

### Navigation — Expo Router
File-based routing via Expo Router 6 was chosen over a manual `react-navigation` setup. The `(tabs)` group handles the bottom navigation layout, and `router.replace` is used for the swipe → results transition to prevent back-navigation to an empty deck.

### State Management — Context + useReducer
TasteContext manages swipe reactions and currentIndex, providing a single source of truth across the Swipe and Results screens. React Context with useReducer was sufficient for this project's scope, avoiding the need for external state libraries such as Redux or Zustand.

### Animations — Reanimated 4 only
All animations run on the UI thread via `useSharedValue`, `useAnimatedStyle`, and `withSpring`/`withTiming`. The legacy `Animated` API from `react-native` is not used anywhere in the project. This is enforced by the Reanimated Babel plugin.

### Performance guards
- `handleSwipe` is wrapped in `useCallback` with a stable dependency array.
- The visible card slice is memoised with `useMemo` to prevent unnecessary CardStack re-renders.
- An `isAnimating` ref (not state) guards against double-swipe on rapid button presses.
- `expo-image` prefetches the next two food images on every `currentIndex` change.

### Component boundaries
GlassCard and ProgressBar are fully decoupled UI primitives. No screen-level logic leaks into them, keeping screens thin and components independently reusable.

---

## Android Blur Fallback Strategy

Android does not support the native blur used by `expo-blur`'s `BlurView` in the same way iOS does. Rather than rendering a broken or transparent card, a deliberate fallback was implemented inside the `GlassCard` component using `Platform.OS`:

**iOS** — `BlurView` with `intensity={25}` and `tint="dark"`, overlaid with a `rgba(255, 255, 255, 0.08)` semi-transparent layer to match the frosted-glass look in the Figma designs.

**Android** — A solid `View` with `backgroundColor: rgba(18, 22, 28, 0.92)` and the same `borderWidth`, `borderColor`, and `borderRadius` as the iOS variant. The slightly higher opacity compensates for the absence of blur and keeps the card visually grounded against the gradient background.

Both variants share the same `1px rgba(255, 255, 255, 0.15)` border and `16px` border radius, so the layout and spacing are identical across platforms.

Additional Android-specific care:
- `StatusBar` is set to `style="light"` with `translucent={true}` and `backgroundColor="transparent"` on the swipe screen to preserve the full-bleed gradient.
- `useSafeAreaInsets().bottom` is used explicitly for the action button row padding rather than relying on `SafeAreaView` alone, which behaves inconsistently with absolute-positioned bottom elements on Android.

---

## AI Usage Disclosure

AI tools were used extensively throughout this project, in line with CalorAI's stated expectation that candidates treat AI as a coding partner.

**Tools used:**
- **Claude (Anthropic)** — Architecture planning, component structure design, Reanimated animation patterns, Android fallback strategy, and generating this README.
- **GitHub Copilot** — Inline autocompletion during implementation of gesture handler logic and TypeScript interfaces.

**How AI was used:**
- Initial folder structure and component hierarchy were designed with Claude before any code was written.
- Detailed per-component prompts were written specifying exact props, acceptance criteria, and constraints (do-not-rebuild rules, performance guards). AI-generated code was reviewed, tested on device, and adjusted rather than pasted verbatim.
- No AI tool had access to the Figma file — pixel-matching was done manually by comparing the running app to the design.

All architectural decisions, platform-specific debugging, and device testing were done by me. AI accelerated implementation; it did not replace judgement.

---

## Time Breakdown

| Phase | Task | Time |
|---|---|---|
| Setup | Project init, dependencies, Babel config, theme constants, foods.ts | ~30 min |
| Core UI | GlassCard, FoodCard, ProgressBar | ~45 min |
| Intro Screen | Layout, entrance animations, CTA navigation | ~30 min |
| Swipe Screen | CardStack wiring, gesture callbacks, context integration, progress, navigation | ~2 hrs |
| Results Screen | Taste profile logic, category breakdown, liked foods grid, animations | ~45 min |
| Polish | Undo swipe, Android fixes, safe area, image prefetch, edge cases | ~45 min |
| Testing | iOS Simulator + Android Emulator, Expo Go on physical Android device | ~30 min |
| Docs | README, commit cleanup | ~30 min |
| **Total** | | **~6 hrs 15 min** |

---

## Known Limitations

- **Android blur** — Native frosted blur is not available on Android. The fallback is intentional and documented above, but the visual result differs from iOS.
- **Unsplash images** — Food images are loaded from Unsplash URLs. A slow network connection will show a loading placeholder briefly before each image appears. This is mitigated by `expo-image` prefetching but not fully eliminated.
- **No persistence** — Swipe results are held in React context and are lost when the app is closed. A production version would persist to AsyncStorage or a backend.
- **Fixed food list** — The 30-item food list is hardcoded. Adding new foods requires a code change.
- **Taste profile heuristics** — The profile generation logic uses simple tag frequency rules. It works well for the provided dataset but would need a more robust scoring model for a larger food catalogue.

---


## Demo Video

📹 **Walkthrough video:** [https://drive.google.com/file/d/1dVJWNWe7FN6PQz--mvNv4M2Bo7Uybet1/view?usp=sharing]

The video covers:
- Full app demo on iOS Simulator and Android Emulator
- Glass morphism behaviour on each platform
- Architectural decisions walkthrough
- Android fallback strategy explanation
- Bonus features demonstrated

---

## Future Improvements

- **Persistence** — Save swipe results to AsyncStorage so the profile survives app restarts
- **Onboarding flow** — Multi-step onboarding before the taste profile to collect dietary preferences
- **Expanded taste profile** — Replace the tag-frequency heuristic with a weighted scoring model across more dimensions (spice tolerance, meal time, cuisine origin)
- **Undo animation** — Card fly-back animation when undoing the last swipe
- **Cuisine preference screen** — Swipe through cuisine types (Italian, Japanese, etc.) using the provided `cuisines` data
- **Shareable results** — Export the taste profile as an image card
- **Backend integration** — POST swipe results to a CalorAI API endpoint for real meal recommendations
- **Accessibility** — Add `accessibilityLabel` and `accessibilityHint` to all interactive elements; test with VoiceOver and TalkBack