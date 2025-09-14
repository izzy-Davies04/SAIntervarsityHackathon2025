// FIX: Changed to a full React import to ensure JSX namespace augmentation is applied correctly.
import React from 'react';

export type BuddyType = 'dog' | 'cat' | 'eagle';

export type BuddyStatus = 'happy' | 'tired';

export type BuddyAction = 'idle' | 'celebrating' | 'relapsed';

export type Theme = 'nervy_blue' | 'light';
export type BuddySize = 'regular' | 'big';


export interface Habit {
  id: number;
  name: string;
  lastCompleted: number; // timestamp
  isNegative?: boolean; // New: Is it a habit to avoid?
  negativeStreak?: number; // New: Days since last relapse
  createdAt?: number; // New: When the habit was added
}

export type WeatherCondition = 'cold' | 'rainy' | 'hot' | 'mild';

export interface CompulsoryHabit {
  id: string;
  name: string;
  completed: boolean;
  weather: WeatherCondition;
  xp: number;
}

export interface UserHealthStats {
  overall: number;
  hydration: number;
  activity: number;
  mental: number;
  gut: number;
}

export interface OnboardingSurveyData {
  // Physical
  moveHours: number;
  sleepHours: number;
  sedentaryHours: number;
  sleepQuality: number; // New: 1-5 scale
  exerciseFrequency: number; // New: 0-7 days/week

  // Nutrition
  fiberGrams: number;
  waterIntake: number; // New: glasses per day
  processedFoodConsumption: number; // New: 1-5 scale (rarely to often)

  // Mental
  readHours: number;
  stressLevel: number;
  socialConnection: number; // New: 1-5 scale (rarely to often)
  screenTimeHours: number; // New: non-work screen time
}

// Represents a single night's sleep log.
export interface SleepLog {
  date: number; // timestamp
  quality: number; // 1-5 scale
  hours: number;
}

export interface UserData {
  buddyName: string;
  buddyType: BuddyType;
  xp: number;
  streak: number;
  habits: Habit[];
  compulsoryHabits: CompulsoryHabit[];
  theme: Theme;
  buddySize: BuddySize;
  lastOpened: number; // timestamp
  openCount: number;
  health: number; // Buddy's health (0-100)
  userHealth: UserHealthStats;
  lastActive: number; // timestamp for health decay
  lastWeatherCheck: number; // timestamp for weather-based habits
  onboardingSurvey?: OnboardingSurveyData;
  decayMultiplier: number;
  lastVitaminLog: number;
  lastPhysicalActivityLog: number; // New: Tracks last physical activity log
  hasCrossed50Health?: boolean; // New: Tracks one-time XP bonus
  level: number; // New: Buddy's current level
  unlockedCustomizations: string[]; // New: IDs of unlocked items
  activeCustomization: string | null; // New: ID of the equipped item
  
  // --- Sleep Tracking Additions ---
  /** Stores the last 30 sleep entries to track trends. */
  sleepLogs: SleepLog[];
  /** Timestamp of the last sleep log to prevent multiple entries per day. */
  lastSleepLog: number;
  /** A penalty score that increases with consecutive poor sleep and affects health decay. */
  sleepDebt: number;

  // --- Medication Tracking Additions ---
  medsEnabled: boolean;
  medsDosesPerDay: number;
  medsDosesTakenToday: number;
  lastMedDoseTimestamp: number; // Timestamp of the last dose taken
  medsStreak: number;
  lastCompletedMedDay: number; // Timestamp of the last day all doses were taken
}

export interface AiMessageData {
    message: string;
    options: string[];
}

export type AiInsightReason = 'analytics_insight' | 'smart_goal';

export interface GetBuddyMessageParams {
  buddyName: string;
  buddyType: BuddyType;
  reason: 'welcome' | 'reminder' | 'streak' | 'habit_complete' | 'long_absence' | 'low_health' | 'compulsory_reminder' | 'onboarding_complete' | 'analytics_insight' | 'smart_goal' | 'negative_habit_relapse';
  streakCount?: number;
  xp?: number;
  health: number; // New: Pass health to determine buddy personality
  analyticsSummary?: string; // Re-purposed for smart goals as well
}

export interface Notification {
  id: number;
  message: string;
  timestamp: number;
}

// FIX: To resolve the JSX intrinsic element error, we define the LottiePlayerElement for ref-typing
// and augment the global JSX namespace to include the 'lottie-player' custom element with its attributes.
export interface LottiePlayerElement extends HTMLElement {
  load(src: string): void;
  loop: boolean;
}

// Define the custom attributes for the lottie-player element.
export interface LottiePlayerCustomAttributes {
  src: string;
  background: string;
  speed: string | number;
  loop?: boolean;
  autoplay?: boolean;
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // By combining standard HTML attributes with our custom ones and the element type,
      // we provide TypeScript with the full definition for 'lottie-player'.
      'lottie-player': React.DetailedHTMLProps<
        React.HTMLAttributes<LottiePlayerElement> & LottiePlayerCustomAttributes,
        LottiePlayerElement
      >;
    }
  }
}
