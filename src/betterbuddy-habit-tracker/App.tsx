import React, { useState, useEffect, useCallback, useRef } from 'react';
import SignIn from './components/SignIn';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import { UserData, Habit, BuddyStatus, Theme, BuddySize, Notification, UserHealthStats, CompulsoryHabit, WeatherCondition, OnboardingSurveyData, BuddyType, AiMessageData, BuddyAction } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { getBuddyMessage } from './services/geminiService';
import { calculateDecayRate } from './services/decayManager';
import { DEFAULT_HABITS, LEVEL_THRESHOLDS, CUSTOMIZATIONS, THEME_CLASSES } from './constants';
import { isSameDay, subDays } from 'date-fns';
import LevelUpModal from './components/LevelUpModal';
import SleepModal from './components/SleepModal';

// --- Sound Effect Player ---
// Create a single, reusable Audio instance to prevent issues with on-the-fly creation and garbage collection.
const audioPlayer = new Audio();

/**
 * Plays a sound effect from a given URL.
 * Reuses a single Audio element to be more efficient and avoid browser playback restrictions.
 * This helps prevent the "src attribute or assigned media provider object was not suitable" error.
 * @param soundUrl The URL of the sound file to play.
 * @param volume The volume to play the sound at (0.0 to 1.0).
 */
const playSound = (soundUrl: string, volume: number = 0.5) => {
    // Set the source of the audio player
    audioPlayer.src = soundUrl;
    // Set the volume for the playback
    audioPlayer.volume = volume;
    // The play() method returns a Promise which resolves when playback has begun.
    const playPromise = audioPlayer.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => {
            // This catch is important to handle autoplay policies that might block the sound.
            console.warn(`Audio playback for ${soundUrl} was blocked by the browser.`, error);
        });
    }
};

// --- Weather Simulation ---
const getMockWeather = (): { temp: number; condition: WeatherCondition } => {
    return { temp: 5, condition: 'cold' }; 
};

const App: React.FC = () => {
  const [userData, setUserData] = useLocalStorage<UserData | null>('betterBuddyData', null);
  const [notifications, setNotifications] = useLocalStorage<Notification[]>('betterBuddyNotifications', []);
  const [showOnboarding, setShowOnboarding] = useState(false); // State to control onboarding flow for guests
  const [buddyStatus, setBuddyStatus] = useState<BuddyStatus>('happy');
  const [buddyAction, setBuddyAction] = useState<BuddyAction>('idle');
  const [showBalloons, setShowBalloons] = useState(false);
  const [levelUpInfo, setLevelUpInfo] = useState<{ level: number, unlocked: string[] } | null>(null);
  const [isSleepModalOpen, setIsSleepModalOpen] = useState(false);


  const createAiNotification = useCallback(async (reason: 'welcome' | 'reminder' | 'streak' | 'habit_complete' | 'long_absence' | 'low_health' | 'compulsory_reminder' | 'onboarding_complete' | 'negative_habit_relapse') => {
    if (!userData) return;
    try {
      const response = await getBuddyMessage({
        buddyName: userData.buddyName,
        buddyType: userData.buddyType,
        reason,
        streakCount: userData.streak,
        xp: userData.xp,
        health: userData.health,
      });
      const newNotification: Notification = {
        id: Date.now(),
        message: response.message,
        timestamp: Date.now(),
      };
      setNotifications(prev => [newNotification, ...prev]);
    } catch (error) {
      console.error("Failed to fetch AI message:", error);
    }
  }, [userData, setNotifications]);
    
  useEffect(() => {
    if (!userData) return;
    const checkWeatherAndGenerateHabits = () => {
        const now = Date.now();
        if (!isSameDay(new Date(userData.lastWeatherCheck), new Date(now))) {
            const weather = getMockWeather();
            let newCompulsoryHabits: CompulsoryHabit[] = [];
            if (weather.condition === 'cold') newCompulsoryHabits.push({ id: 'compulsory-cold', name: 'Wear warm clothes', completed: false, weather: 'cold', xp: 30 });
            setUserData(prev => prev ? { ...prev, compulsoryHabits: newCompulsoryHabits, lastWeatherCheck: now } : null);
        }
    };
    checkWeatherAndGenerateHabits();
  }, [userData?.lastWeatherCheck, setUserData]);

  // Effect for handling health decay and daily resets
  useEffect(() => {
    if (!userData) return;

    const applyOfflineDecay = () => {
      const now = Date.now();
      const hoursPassed = Math.floor((now - userData.lastActive) / 3600000);

      if (hoursPassed > 0) {
        setUserData(prev => {
          if (!prev) return null;
          const decayAmount = hoursPassed * calculateDecayRate(prev);
          const newHealth = Math.max(0, prev.health - decayAmount);
          const sleepStatDecayTotal = hoursPassed * (prev.sleepDebt * 0.1);
          const newUserHealth: UserHealthStats = {
              hydration: Math.max(0, prev.userHealth.hydration - sleepStatDecayTotal),
              activity: Math.max(0, prev.userHealth.activity - sleepStatDecayTotal),
              mental: Math.max(0, prev.userHealth.mental - (sleepStatDecayTotal * 1.5)),
              gut: Math.max(0, prev.userHealth.gut - sleepStatDecayTotal),
              overall: 0,
          };
          newUserHealth.overall = Math.round((newUserHealth.hydration + newUserHealth.activity + newUserHealth.mental + newUserHealth.gut) / 4);
          return { ...prev, health: newHealth, userHealth: newUserHealth, lastActive: now };
        });
      }
    };
    applyOfflineDecay();

    const intervalId = setInterval(() => {
      setUserData(prev => {
        if (!prev) return null;
        
        const now = new Date();
        let updatedData = { ...prev };

        // Reset daily medication counter if it's a new day
        if (updatedData.medsEnabled && !isSameDay(new Date(updatedData.lastMedDoseTimestamp), now)) {
            updatedData.medsDosesTakenToday = 0;
        }

        const buddyDecayRate = calculateDecayRate(updatedData);
        const newHealth = Math.max(0, updatedData.health - buddyDecayRate);

        const sleepStatDecay = updatedData.sleepDebt * 0.1;
        const newUserHealth: UserHealthStats = {
            hydration: Math.max(0, updatedData.userHealth.hydration - sleepStatDecay),
            activity: Math.max(0, updatedData.userHealth.activity - sleepStatDecay),
            mental: Math.max(0, updatedData.userHealth.mental - (sleepStatDecay * 1.5)),
            gut: Math.max(0, updatedData.userHealth.gut - sleepStatDecay),
            overall: 0,
        };
        newUserHealth.overall = Math.round((newUserHealth.hydration + newUserHealth.activity + newUserHealth.mental + newUserHealth.gut) / 4);
        
        if (newHealth < 20 && updatedData.health >= 20) createAiNotification('low_health');
        
        return { ...updatedData, health: newHealth, userHealth: newUserHealth, lastActive: now.getTime() };
      });
    }, 3600000);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        setUserData(prev => (prev ? { ...prev, lastActive: Date.now() } : null));
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [userData?.lastActive, setUserData, createAiNotification]);

  const checkBuddyStatus = useCallback(() => {
    if (!userData) return;
    const newStatus = userData.health < 50 ? 'tired' : 'happy';
    if (newStatus !== buddyStatus) setBuddyStatus(newStatus);
  }, [userData, buddyStatus]);

  useEffect(() => {
    checkBuddyStatus();
  }, [checkBuddyStatus]);

  // Handler for guest login from the sign-in page
  const handleGuestLogin = () => {
    setShowOnboarding(true);
  };

  // Handler for standard sign-in (mocked for now)
  const handleSignIn = (email: string, phone: string) => {
    // In a real app, this would involve an API call for authentication.
    alert("Sign-in feature is under development. Please 'Continue as Guest' to explore the app.");
  };

  const handleOnboardingComplete = (data: { name: string; type: BuddyType; survey: OnboardingSurveyData; medsEnabled: boolean; medsDosesPerDay: number; }) => {
    const now = Date.now();
    const { survey, medsEnabled, medsDosesPerDay } = data;

    const hydrationScore = Math.round(Math.min(1, survey.waterIntake / 8) * 100);
    const activityScore = Math.max(0, Math.min(100, Math.round( ((Math.min(1, survey.moveHours / 1.5) * 0.3) + (survey.exerciseFrequency / 7 * 0.3) + ((1 - (survey.sedentaryHours / 16)) * 0.1) + (((survey.sleepQuality - 1) / 4) * 0.15) + (Math.min(1, survey.sleepHours / 8) * 0.15) ) * 100 )));
    const mentalScore = Math.max(0, Math.min(100, Math.round( ((Math.min(1, survey.readHours / 1) * 0.25) + (((10 - survey.stressLevel) / 9) * 0.35) + (((survey.socialConnection - 1) / 4) * 0.2) + ((1 - Math.min(1, survey.screenTimeHours / 6)) * 0.2) ) * 100 )));
    const gutScore = Math.max(0, Math.min(100, Math.round( ((Math.min(1, survey.fiberGrams / 30) * 0.6) + (((5 - survey.processedFoodConsumption) / 4) * 0.4) ) * 100 )));
    const overallHealth = Math.round((hydrationScore + activityScore + mentalScore + gutScore) / 4);

    setUserData({
      buddyName: data.name,
      buddyType: data.type,
      xp: 50,
      streak: 0,
      habits: DEFAULT_HABITS,
      compulsoryHabits: [],
      theme: 'nervy_blue',
      buddySize: 'regular',
      lastOpened: now,
      openCount: 0,
      health: overallHealth,
      userHealth: { overall: overallHealth, hydration: hydrationScore, activity: activityScore, mental: mentalScore, gut: gutScore },
      lastActive: now,
      lastWeatherCheck: 0,
      onboardingSurvey: data.survey,
      decayMultiplier: 1,
      lastVitaminLog: 0,
      lastPhysicalActivityLog: 0,
      hasCrossed50Health: false,
      level: 1,
      unlockedCustomizations: [],
      activeCustomization: null,
      sleepLogs: [],
      lastSleepLog: 0,
      sleepDebt: 0,
      medsEnabled: medsEnabled,
      medsDosesPerDay: medsDosesPerDay,
      medsDosesTakenToday: 0,
      lastMedDoseTimestamp: 0,
      medsStreak: 0,
      lastCompletedMedDay: 0,
    });
    setBuddyStatus(overallHealth < 50 ? 'tired' : 'happy');
    createAiNotification('onboarding_complete');
    setShowOnboarding(false); // Clean up guest state after onboarding
  };

  const applyHealthAndXpBoosts = ( userData: UserData, healthBoost: number, xpBoost: number, healthStatUpdater: (stats: UserHealthStats) => UserHealthStats ): Partial<UserData> => {
      const newHealth = Math.min(100, userData.health + healthBoost);
      const newXp = userData.xp + xpBoost;
      const newUserHealth = healthStatUpdater(userData.userHealth);
      newUserHealth.overall = Math.round((newUserHealth.hydration + newUserHealth.activity + newUserHealth.mental + newUserHealth.gut) / 4);
      let currentLevel = userData.level;
      const newlyUnlocked: string[] = [];
      while (currentLevel < LEVEL_THRESHOLDS.length && newXp >= LEVEL_THRESHOLDS[currentLevel]) {
          currentLevel++;
          playSound('https://actions.google.com/sounds/v1/achievements/achievement_bell.ogg', 0.8);
          Object.entries(CUSTOMIZATIONS).forEach(([id, cust]) => { if (cust.level === currentLevel) newlyUnlocked.push(id); });
      }
      if (currentLevel > userData.level) setLevelUpInfo({ level: currentLevel, unlocked: newlyUnlocked.map(id => CUSTOMIZATIONS[id].name) });
      const newUnlockedCustomizations = [...new Set([...userData.unlockedCustomizations, ...newlyUnlocked])];
      return { health: newHealth, xp: newXp, userHealth: newUserHealth, level: currentLevel, unlockedCustomizations: newUnlockedCustomizations };
  }

  const handleLogHabit = (habitId: number) => {
    if (!userData) return;
    const habit = userData.habits.find(h => h.id === habitId);
    if (!habit) return;
    const now = new Date();
    if (habit.isNegative) {
        playSound('https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg', 0.5);
        setBuddyAction('relapsed');
        setTimeout(() => setBuddyAction('idle'), 3000);
        createAiNotification('negative_habit_relapse');
        const updatedHabits = userData.habits.map(h => h.id === habitId ? { ...h, lastCompleted: now.getTime(), negativeStreak: 0 } : h);
        const newHealth = Math.max(0, userData.health - 25);
        const newXp = Math.max(0, userData.xp - 50);
        setUserData({ ...userData, health: newHealth, xp: newXp, habits: updatedHabits, lastActive: now.getTime() });
        return;
    }
    playSound('https://actions.google.com/sounds/v1/achievements/achievement_bell.ogg', 0.4);
    setBuddyAction('celebrating');
    setTimeout(() => setBuddyAction('idle'), 3000);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const lastHabitCompletion = Math.max(...userData.habits.filter(h => !h.isNegative).map(h => h.lastCompleted));
    const lastCompletionDay = new Date(new Date(lastHabitCompletion).getFullYear(), new Date(lastHabitCompletion).getMonth(), new Date(lastHabitCompletion).getDate()).getTime();
    let newStreak = (today > lastCompletionDay) ? userData.streak + 1 : userData.streak;
    if (newStreak >= 5 && newStreak % 5 === 0) {
      setShowBalloons(true);
      setTimeout(() => setShowBalloons(false), 5000);
      createAiNotification('streak');
    } else {
      createAiNotification('habit_complete');
    }
    const updatedHabits = userData.habits.map(h => h.id === habitId ? { ...h, lastCompleted: now.getTime() } : h);
    const boosts = applyHealthAndXpBoosts(userData, 10, 20, (stats) => {
        if (habit?.name.toLowerCase().includes('water')) stats.hydration = Math.min(100, stats.hydration + 15);
        else if (habit?.name.toLowerCase().includes('fiber')) stats.gut = Math.min(100, stats.gut + 5);
        else { stats.activity = Math.min(100, stats.activity + 10); stats.mental = Math.min(100, stats.mental + 5); }
        return stats;
    });
    setUserData({ ...userData, ...boosts, habits: updatedHabits, streak: newStreak, lastActive: now.getTime() });
    setBuddyStatus('happy');
  };
  
  const handleCompleteCompulsoryHabit = (habitId: string) => {
      if (!userData) return;
      const habit = userData.compulsoryHabits.find(h => h.id === habitId);
      if (!habit) return;
      playSound('https://actions.google.com/sounds/v1/achievements/achievement_bell.ogg', 0.6);
      setBuddyAction('celebrating');
      setTimeout(() => setBuddyAction('idle'), 3000);
      const boosts = applyHealthAndXpBoosts(userData, 10, habit.xp, stats => stats);
      const updatedCompulsoryHabits = userData.compulsoryHabits.map(h => h.id === habitId ? { ...h, completed: true } : h);
      setUserData({ ...userData, ...boosts, compulsoryHabits: updatedCompulsoryHabits, lastActive: Date.now() });
      setBuddyStatus('happy');
  };

  const handleAddHabit = (habitName: string, isNegative: boolean) => {
    if(!userData) return;
    const newHabit: Habit = { id: Date.now(), name: habitName, lastCompleted: 0, isNegative, negativeStreak: isNegative ? 0 : undefined, createdAt: Date.now() };
    const boosts = applyHealthAndXpBoosts(userData, 0, 10, s => s);
    setUserData({ ...userData, ...boosts, habits: [...userData.habits, newHabit] });
  };

  const handleLogVitamins = () => {
    if (!userData || isSameDay(new Date(userData.lastVitaminLog), new Date())) return;
    playSound('https://actions.google.com/sounds/v1/switches/switch_on.ogg', 0.4);
    const boosts = applyHealthAndXpBoosts(userData, 0, 0, stats => ({ ...stats, gut: Math.min(100, stats.gut + 10) }));
    const newMultiplier = Math.max(0.25, userData.decayMultiplier * 0.75);
    setUserData({ ...userData, ...boosts, decayMultiplier: newMultiplier, lastVitaminLog: Date.now() });
  };

  const handleLogPhysicalActivity = () => {
    if (!userData || isSameDay(new Date(userData.lastPhysicalActivityLog), new Date())) return;
    playSound('https://actions.google.com/sounds/v1/switches/switch_on.ogg', 0.4);
    const boosts = applyHealthAndXpBoosts(userData, 0, 0, stats => ({ ...stats, activity: Math.min(100, stats.activity + 10) }));
    const newMultiplier = Math.max(0.25, userData.decayMultiplier * 0.75);
    setUserData({ ...userData, ...boosts, decayMultiplier: newMultiplier, lastPhysicalActivityLog: Date.now() });
  };
  
  const handleLogSleep = (quality: number, hours: number) => {
      if (!userData || isSameDay(new Date(userData.lastSleepLog), new Date())) return;
      playSound('https://actions.google.com/sounds/v1/switches/switch_on.ogg', 0.4);
      const now = Date.now();
      const isGoodSleep = quality >= 3 && hours >= 7;
      const healthBoost = isGoodSleep ? 5 : -5;
      const xpBoost = 15;
      const newSleepDebt = isGoodSleep ? Math.max(0, userData.sleepDebt - 1) : userData.sleepDebt + 1;
      const boosts = applyHealthAndXpBoosts(userData, healthBoost, xpBoost, (stats) => {
          stats.mental = Math.min(100, stats.mental + (isGoodSleep ? 10 : 0));
          return stats;
      });
      const newLog = { date: now, quality, hours };
      setUserData({ ...userData, ...boosts, sleepDebt: newSleepDebt, lastSleepLog: now, sleepLogs: [...userData.sleepLogs, newLog].slice(-30) });
  };

  const handleLogMedication = () => {
      if (!userData || !userData.medsEnabled || userData.medsDosesTakenToday >= userData.medsDosesPerDay) return;
      const now = new Date();
      const newDosesTaken = userData.medsDosesTakenToday + 1;
      let newStreak = userData.medsStreak;
      let newLastCompletedDay = userData.lastCompletedMedDay;

      if (newDosesTaken === userData.medsDosesPerDay) {
          const yesterday = subDays(now, 1);
          newStreak = isSameDay(new Date(userData.lastCompletedMedDay), yesterday) ? userData.medsStreak + 1 : 1;
          newLastCompletedDay = now.getTime();
      }
      const boosts = applyHealthAndXpBoosts(userData, 10, 50, (stats) => stats);
      setUserData({ ...userData, ...boosts, medsDosesTakenToday: newDosesTaken, medsStreak: newStreak, lastCompletedMedDay: newLastCompletedDay, lastMedDoseTimestamp: now.getTime() });
  };
  
  const handleToggleMeds = (enabled: boolean, dosesPerDay = 1) => {
      if (!userData) return;
      setUserData({ ...userData, medsEnabled: enabled, medsDosesPerDay: enabled ? dosesPerDay : 0, medsDosesTakenToday: 0, medsStreak: 0 });
  };

  const handleUpdateSettings = (settings: { theme?: Theme; buddySize?: BuddySize }) => {
    if (!userData) return;
    setUserData({ ...userData, ...settings });
  };

  const handleSelectCustomization = (customizationId: string | null) => {
    if (!userData) return;
    setUserData({ ...userData, activeCustomization: customizationId });
  };
  
  const handleDismissNotification = (id: number) => setNotifications(prev => prev.filter(n => n.id !== id));
  
  const handleResetData = () => {
    if (window.confirm('Are you sure you want to reset all your data? This action cannot be undone.')) {
        setUserData(null);
        setNotifications([]);
    }
  };
  
  const handleExportData = () => {
    try {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify({ userData, notifications }, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = "better-buddy-progress.json";
        link.click();
    } catch(error) {
        console.error("Failed to export data", error);
        alert("Sorry, there was an error exporting your data.");
    }
  };

  const getAiInsight = useCallback(async (reason: 'analytics_insight' | 'smart_goal', data: string): Promise<AiMessageData | null> => {
    if (!userData) return null;
    try {
      const response = await getBuddyMessage({ buddyName: userData.buddyName, buddyType: userData.buddyType, reason, health: userData.health, analyticsSummary: data, });
      return response;
    } catch (error) {
      console.error(`Failed to fetch AI insight for ${reason}:`, error);
      return { message: "Looks like I'm a bit tired. Let's try again later!", options: ["Okay"] };
    }
  }, [userData]);

  const handleExportToCalendar = () => {
    if (!userData) return;
    const vCalendarStart = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//BetterBuddy//Habit Tracker//EN\n";
    let vCalendarEvents = "";
    const vCalendarEnd = "END:VCALENDAR";
    const now = new Date();
    const dtStamp = now.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
    userData.habits.forEach(habit => {
        const uid = `${habit.id}@betterbuddy.app`;
        const summary = `Reminder: ${habit.name}`;
        const description = `Time to complete your daily habit: "${habit.name}"! Your buddy ${userData.buddyName} is counting on you.`;
        const dtStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);
        const dtStartStr = dtStart.toISOString().replace(/[-:.]/g, '').slice(0, 15) + 'Z';
        vCalendarEvents += `BEGIN:VEVENT\nUID:${uid}\nDTSTAMP:${dtStamp}\nDTSTART;TZID=Etc/UTC:${dtStartStr}\nRRULE:FREQ=DAILY\nSUMMARY:${summary}\nDESCRIPTION:${description}\nEND:VEVENT\n`;
    });
    const icsFileContent = vCalendarStart + vCalendarEvents + vCalendarEnd;
    const blob = new Blob([icsFileContent], { type: 'text/calendar' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'BetterBuddy_Habits.ics';
    link.click();
  };

  // If user data doesn't exist and they haven't chosen to be a guest, show the sign-in page.
  if (!userData && !showOnboarding) {
    return <SignIn onSignIn={handleSignIn} onGuestLogin={handleGuestLogin} />;
  }
  
  // If user data doesn't exist but they've chosen guest mode, show the onboarding page.
  if (!userData && showOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }
  
  // If user data exists, render the main dashboard.
  if (!userData) return null; // Should not happen with the logic above, but good for type safety.

  return <>
    <Dashboard 
      userData={userData}
      buddyStatus={buddyStatus}
      buddyAction={buddyAction}
      notifications={notifications}
      showBalloons={showBalloons}
      onLogHabit={handleLogHabit}
      onAddHabit={handleAddHabit}
      onCompleteCompulsoryHabit={handleCompleteCompulsoryHabit}
      onDismissNotification={handleDismissNotification}
      onUpdateSettings={handleUpdateSettings}
      onResetData={handleResetData}
      onExportData={handleExportData}
      onLogVitamins={handleLogVitamins}
      onLogPhysicalActivity={handleLogPhysicalActivity}
      onGetAiInsight={getAiInsight}
      onExportToCalendar={handleExportToCalendar}
      onSelectCustomization={handleSelectCustomization}
      onOpenSleepModal={() => setIsSleepModalOpen(true)}
      onLogMedication={handleLogMedication}
      onToggleMeds={handleToggleMeds}
    />
    <LevelUpModal isOpen={!!levelUpInfo} onClose={() => setLevelUpInfo(null)} levelUpInfo={levelUpInfo} themeClasses={THEME_CLASSES[userData.theme]} />
    <SleepModal isOpen={isSleepModalOpen} onClose={() => setIsSleepModalOpen(false)} onSubmit={handleLogSleep} themeClasses={THEME_CLASSES[userData.theme]} />
  </>;
};

export default App;