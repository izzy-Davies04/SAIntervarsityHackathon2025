import React, { useState, useEffect, useRef } from 'react';
import '@lottiefiles/lottie-player'; // Import to register the custom element
import type { UserData, BuddyStatus, BuddyType, Theme, BuddySize, Notification, AiMessageData, AiInsightReason, BuddyAction, LottiePlayerElement } from '../types';
import { formatDistanceToNow, differenceInDays } from 'date-fns';
import HealthBar from './HealthBar';
import CompulsoryHabits from './CompulsoryHabits';
import VitaminModal from './VitaminModal';
import PhysicalModal from './PhysicalModal';
import Scheduler from './Scheduler';
import ProgressTile from './ProgressTile';
import AnalyticsModal from './AnalyticsModal';
import { BellIcon, GearIcon, HabitsIcon, LightbulbIcon, CalendarIcon, CloseIcon, WardrobeIcon, UsersIcon } from './Icons';
import SmartGoalModal from './SmartGoalModal';
import { LEVEL_THRESHOLDS, CUSTOMIZATIONS, THEME_CLASSES } from '../constants';
import CustomizationModal from './CustomizationModal';
import MedicationTile from './MedicationTile'; // Import the new component

const LOTTIE_ASSETS: Record<BuddyType, Record<BuddyStatus | 'celebrating' | 'relapsed', string>> = {
    dog: {
        happy: "https://assets10.lottiefiles.com/packages/lf20_t1ga2e1n.json",
        tired: "https://assets10.lottiefiles.com/packages/lf20_poun2o94.json",
        celebrating: "https://assets3.lottiefiles.com/packages/lf20_96bov5h7.json",
        relapsed: "https://assets9.lottiefiles.com/packages/lf20_gdazd125.json"
    },
    cat: {
        happy: "https://assets10.lottiefiles.com/packages/lf20_jpxs2n.json",
        tired: "https://assets10.lottiefiles.com/packages/lf20_42B8ZJ.json",
        celebrating: "https://assets2.lottiefiles.com/packages/lf20_5f0d36e2.json",
        relapsed: "https://assets8.lottiefiles.com/packages/lf20_1s2qavww.json"
    },
    eagle: {
        happy: "https://assets10.lottiefiles.com/packages/lf20_kz2q3v.json",
        tired: "https://assets10.lottiefiles.com/packages/lf20_1uR8aT.json",
        celebrating: "https://assets2.lottiefiles.com/packages/lf20_t88L1i.json",
        relapsed: "https://assets10.lottiefiles.com/packages/lf20_1uR8aT.json"
    }
};

const BUDDY_ICONS: Record<BuddyType, string> = { dog: '🐶', cat: '🐱', eagle: '🦅' };
const HAPPY_QUOTES = ["The secret of getting ahead is getting started.", "Well done is better than well said.", "A little progress each day adds up to big results.", "Believe you can and you're halfway there."];
const SAD_QUOTES = ["The first step to getting somewhere is to decide you're not going to stay where you are.", "It's okay to not be okay, as long as you don't give up.", "Even the darkest night will end and the sun will rise.", "You have to fight through some bad days to earn the best days of your life."];

function useOutsideAlerter(ref: React.RefObject<HTMLDivElement>, callback: () => void) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}

interface DashboardProps {
  userData: UserData; buddyStatus: BuddyStatus; buddyAction: BuddyAction; notifications: Notification[]; showBalloons: boolean;
  onLogHabit: (habitId: number) => void; onAddHabit: (habitName: string, isNegative: boolean) => void;
  onCompleteCompulsoryHabit: (habitId: string) => void; onDismissNotification: (id: number) => void;
  onUpdateSettings: (settings: { theme?: Theme; buddySize?: BuddySize }) => void; onResetData: () => void;
  onExportData: () => void; onLogVitamins: () => void; onLogPhysicalActivity: () => void;
  onGetAiInsight: (reason: AiInsightReason, data: string) => Promise<AiMessageData | null>;
  onExportToCalendar: () => void;
  onSelectCustomization: (customizationId: string | null) => void;
  onOpenSleepModal: () => void;
  onLogMedication: () => void; // New prop for medication
  onToggleMeds: (enabled: boolean, dosesPerDay?: number) => void; // New prop for toggling
}

const Balloon: React.FC<{ color: string; delay: number; left: number }> = ({ color, delay, left }) => <div className="balloon" style={{ backgroundColor: color, left: `${left}%`, animationDelay: `${delay}s` }}><div style={{ borderBottomColor: color }}></div></div>;

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { userData, buddyStatus, buddyAction, notifications, showBalloons, onLogHabit, onAddHabit, onCompleteCompulsoryHabit, onDismissNotification, onUpdateSettings, onResetData, onExportData, onLogVitamins, onLogPhysicalActivity, onGetAiInsight, onExportToCalendar, onSelectCustomization, onOpenSleepModal, onLogMedication, onToggleMeds } = props;
  const [newHabitName, setNewHabitName] = useState('');
  const [isNegativeHabit, setIsNegativeHabit] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isVitaminModalOpen, setIsVitaminModalOpen] = useState(false);
  const [isPhysicalModalOpen, setIsPhysicalModalOpen] = useState(false);
  const [isSchedulerOpen, setIsSchedulerOpen] = useState(false);
  const [isAnalyticsModalOpen, setIsAnalyticsModalOpen] = useState(false);
  const [isSmartGoalModalOpen, setIsSmartGoalModalOpen] = useState(false);
  const [smartGoalSuggestion, setSmartGoalSuggestion] = useState<AiMessageData | null>(null);
  const [isCustomizationModalOpen, setIsCustomizationModalOpen] = useState(false);
  const [showCommunityToast, setShowCommunityToast] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);
  const notificationsRef = useRef<HTMLDivElement>(null);
  const lottiePlayerRef = useRef<LottiePlayerElement>(null);

  useOutsideAlerter(settingsRef, () => setSettingsOpen(false));
  useOutsideAlerter(notificationsRef, () => setNotificationsOpen(false));
  
  const theme = THEME_CLASSES[userData.theme];
  const buddySizeStyle = { width: '100%', height: userData.buddySize === 'big' ? '300px' : '200px' };
  
  const currentLevelXp = LEVEL_THRESHOLDS[userData.level - 1];
  const nextLevelXp = LEVEL_THRESHOLDS[userData.level] ?? userData.xp;
  const xpForCurrentLevel = userData.xp - currentLevelXp;
  const xpToNextLevel = nextLevelXp - currentLevelXp;
  const xpProgress = xpToNextLevel > 0 ? (xpForCurrentLevel / xpToNextLevel) * 100 : 100;

  useEffect(() => {
    const player = lottiePlayerRef.current;
    const container = player?.parentElement;
    if (!player || !container) return;

    let targetAnimationState: BuddyStatus | 'celebrating' | 'relapsed' = buddyStatus;
    if (buddyAction === 'celebrating') targetAnimationState = 'celebrating';
    else if (buddyAction === 'relapsed') targetAnimationState = 'relapsed';

    const newSrc = LOTTIE_ASSETS[userData.buddyType][targetAnimationState];
    const currentSrc = player.getAttribute('src');

    if (newSrc !== currentSrc) {
      container.classList.add('fading-out');
      setTimeout(() => { player.load(newSrc); container.classList.remove('fading-out'); }, 200);
    }
    
    player.loop = buddyAction === 'idle';

  }, [buddyAction, buddyStatus, userData.buddyType]);


  const handleAddHabitSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const trimmedName = newHabitName.trim();
      if (trimmedName) {
          const suggestion = await onGetAiInsight('smart_goal', trimmedName);
          if (suggestion) {
              setSmartGoalSuggestion(suggestion);
              setIsSmartGoalModalOpen(true);
          } else {
              onAddHabit(trimmedName, isNegativeHabit);
              setNewHabitName('');
              setIsNegativeHabit(false);
          }
      }
  };

  const handleSmartGoalChoice = (useSuggestion: boolean, suggestedText?: string) => {
      const finalHabitName = useSuggestion && suggestedText ? suggestedText.replace(/\"/g, '') : newHabitName.trim();
      onAddHabit(finalHabitName, isNegativeHabit);
      setNewHabitName('');
      setIsNegativeHabit(false);
      setIsSmartGoalModalOpen(false);
      setSmartGoalSuggestion(null);
  };
  
  const handleCommunityClick = () => {
    if (showCommunityToast) return;
    setShowCommunityToast(true);
    setTimeout(() => {
        setShowCommunityToast(false);
    }, 3000);
  };

  const DropdownItem: React.FC<{ onClick: () => void, children: React.ReactNode, className?: string}> = ({ onClick, children, className }) => <button onClick={onClick} className={`block w-full text-left px-4 py-2 text-sm transition-colors ${theme.text} hover:bg-slate-700/50 ${className ?? ''}`}>{children}</button>;
  
  const randomQuote = userData.health > 50 
    ? HAPPY_QUOTES[Math.floor(Math.random() * HAPPY_QUOTES.length)]
    : SAD_QUOTES[Math.floor(Math.random() * SAD_QUOTES.length)];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${theme.bg} ${theme.text}`}>
      {showBalloons && Array.from({ length: 10 }).map((_, i) => <Balloon key={i} color={['#ff6b6b', '#f9c74f', '#90be6d', '#43aa8b', '#577590'][i % 5]} delay={Math.random() * 2} left={Math.random() * 95} />)}
      
      <header className="fixed top-0 left-0 right-0 h-16 bg-transparent z-50 p-4 flex justify-between items-center pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <div ref={notificationsRef} className="relative">
            <button onPointerDown={(e) => { e.preventDefault(); setNotificationsOpen(o => !o); }} className={`relative p-2 rounded-full transition ${theme.cardBg === 'bg-white' ? 'bg-white/80' : 'bg-slate-800/80'} backdrop-blur-sm shadow-lg`} aria-label={`Show notifications (${notifications.length} unread)`} aria-haspopup="true" aria-expanded={notificationsOpen}>
              <BellIcon size={24} className={`${theme.textStrong}`} />
              {notifications.length > 0 && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-red-500 border-2 border-white" />}
            </button>
            {notificationsOpen && ( <div className={`absolute left-0 mt-2 w-[calc(100vw-2rem)] sm:w-80 max-h-96 overflow-y-auto rounded-lg shadow-xl ${theme.cardBg} ${theme.border} border z-[60]`}>
                <div className={`p-3 border-b ${theme.border} sticky top-0 ${theme.cardBg}`}><h4 className={`font-bold ${theme.textStrong}`}>Notifications</h4></div>
                {notifications.length > 0 ? (<ul>{notifications.slice(0, 10).map((n) => (<li key={n.id} className={`p-3 text-sm flex justify-between items-start gap-2 border-b ${theme.border} last:border-b-0`}><div><p className={theme.text}>{n.message}</p><p className={`text-xs ${theme.textMuted} mt-1`}>{formatDistanceToNow(new Date(n.timestamp), { addSuffix: true })}</p></div><button onClick={() => onDismissNotification(n.id)} className={`flex-shrink-0 ml-2 ${theme.textMuted} hover:text-red-500`} aria-label="Dismiss notification"><CloseIcon size={20}/></button></li>))}</ul>) : (<p className={`p-4 text-center text-sm ${theme.textMuted}`}>No new notifications.</p>)}
            </div> )}
          </div>
          <button onClick={() => setIsSchedulerOpen(true)} className={`p-2 rounded-full transition ${theme.cardBg === 'bg-white' ? 'bg-white/80' : 'bg-slate-800/80'} backdrop-blur-sm shadow-lg`}>
              <CalendarIcon size={24} className={`${theme.textStrong}`} />
          </button>
        </div>
        <div ref={settingsRef} className="relative pointer-events-auto">
          <button onClick={() => setSettingsOpen(!settingsOpen)} className={`p-2 rounded-full transition ${theme.cardBg === 'bg-white' ? 'bg-white/80' : 'bg-slate-800/80'} backdrop-blur-sm shadow-lg`} aria-label="Open settings menu" aria-haspopup="true" aria-expanded={settingsOpen}> <GearIcon size={24} className={`${theme.textStrong}`} /> </button>
          {settingsOpen && ( <div className={`absolute right-0 mt-2 w-56 rounded-lg shadow-xl py-1 ${theme.cardBg} ${theme.border} border z-[60]`}>
            <DropdownItem onClick={() => { onUpdateSettings({ theme: userData.theme === 'light' ? 'nervy_blue' : 'light' }); setSettingsOpen(false); }}>Toggle Theme</DropdownItem>
            <DropdownItem onClick={() => { onToggleMeds(!userData.medsEnabled, userData.medsDosesPerDay || 1); setSettingsOpen(false); }}>{userData.medsEnabled ? 'Disable' : 'Enable'} Meds Tracker</DropdownItem>
            <DropdownItem onClick={() => { onExportData(); setSettingsOpen(false); }}>Export Data</DropdownItem>
            <div className={`h-px my-1 ${theme.bg === 'bg-slate-900' ? 'bg-slate-700' : 'bg-gray-200'}`} />
            <DropdownItem onClick={() => { onResetData(); setSettingsOpen(false); }} className="!text-red-400">Reset Data</DropdownItem>
          </div> )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pt-20 p-4 sm:p-6 lg:p-8">
        <aside className="lg:col-span-1 space-y-6">
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 text-center sticky top-20 ${theme.cardBg}`}>
            <h2 className={`text-2xl md:text-3xl font-bold ${theme.textStrong} mb-4`}>{BUDDY_ICONS[userData.buddyType]} {userData.buddyName}</h2>
            
            <div className="flex justify-center items-center gap-4">
                <div className="lottie-container relative flex-grow">
                    {userData.activeCustomization && ( <img src={CUSTOMIZATIONS[userData.activeCustomization]?.assetUrl} alt={CUSTOMIZATIONS[userData.activeCustomization]?.name} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2/5 pointer-events-none z-10" /> )}
                    <lottie-player ref={lottiePlayerRef} src={LOTTIE_ASSETS[userData.buddyType][buddyStatus]} background="transparent" speed="1" style={buddySizeStyle} loop autoplay />
                </div>
                <div className="flex-shrink-0 flex flex-col items-center space-y-2" role="progressbar" aria-valuenow={xpProgress} aria-valuemin={0} aria-valuemax={100} aria-label="XP progress to next level">
                    <span className={`font-bold text-lg text-yellow-400`}>Lvl {userData.level}</span>
                    <div className={`relative w-6 h-48 rounded-full overflow-hidden ${theme.bg === 'bg-slate-900' ? 'bg-slate-700' : 'bg-gray-200'}`}>
                        <div className="absolute bottom-0 left-0 w-full bg-yellow-500 transition-all duration-500" style={{ height: `${xpProgress}%` }}></div>
                    </div>
                    <span className={`text-xs ${theme.textMuted}`}>{userData.xp} / {nextLevelXp} XP</span>
                </div>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4">
                <button onClick={() => setIsCustomizationModalOpen(true)} className={`flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 ${theme.bg === 'bg-slate-900' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}> <WardrobeIcon size={20} /> Customize </button>
                <button onClick={handleCommunityClick} className={`flex items-center justify-center gap-2 font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 ${theme.bg === 'bg-slate-900' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}> <UsersIcon size={20} /> Community </button>
            </div>
          </div>
        </aside>

        <main className="lg:col-span-2 space-y-6">
          <HealthBar userHealth={userData.userHealth} themeClasses={theme} onGutHealthClick={() => setIsVitaminModalOpen(true)} onPhysicalActivityClick={() => setIsPhysicalModalOpen(true)} onMentalHealthClick={onOpenSleepModal} />
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 ${theme.cardBg} flex items-center gap-4`}>
              <LightbulbIcon size={48} className="text-yellow-400 flex-shrink-0" />
              <div>
                  <h3 className={`text-lg font-bold ${theme.textStrong}`}>Daily Motivation</h3>
                  <p className={`text-sm ${theme.textMuted}`}>"{randomQuote}"</p>
              </div>
          </div>

          {userData.medsEnabled && ( <MedicationTile userData={userData} themeClasses={theme} onLogMedication={onLogMedication} /> )}
          <ProgressTile userData={userData} themeClasses={theme} onClick={() => setIsAnalyticsModalOpen(true)} />

          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 ${theme.cardBg}`}>
             <div className="flex items-center gap-3 mb-6"> <HabitsIcon size={32} className={`${theme.textStrong}`} /> <div> <h3 className={`text-xl md:text-2xl font-bold ${theme.textStrong}`}>Your Habits</h3> <p className={`${theme.textMuted} text-sm sm:text-base`}>Complete a habit to boost your buddy's mood!</p> </div> </div>
             <CompulsoryHabits habits={userData.compulsoryHabits} onComplete={onCompleteCompulsoryHabit} themeClasses={theme} />
             
             <ul className="space-y-3">
                {userData.habits.map(habit => {
                    const daysSince = habit.isNegative ? differenceInDays(new Date(), new Date(habit.createdAt || Date.now())) : 0;
                    return (
                        <li key={habit.id} className={`p-3 rounded-lg flex items-center justify-between gap-4 ${theme.bg === 'bg-slate-900' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                            <div>
                                <p className={`font-semibold ${theme.textStrong}`}>{habit.name}</p>
                                {habit.isNegative ? ( <p className={`text-sm font-bold text-green-400`}>Streak: {daysSince} Day{daysSince !== 1 && 's'} Since Start</p> ) : ( <p className={`text-xs ${theme.textMuted}`}>Last completed: {habit.lastCompleted ? formatDistanceToNow(new Date(habit.lastCompleted), { addSuffix: true }) : 'never'}</p> )}
                            </div>
                            <button onClick={() => onLogHabit(habit.id)} className={`font-bold py-2 px-4 rounded-lg transition-transform transform hover:scale-105 text-sm ${habit.isNegative ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}> {habit.isNegative ? 'Relapsed' : 'Complete'} </button>
                        </li>
                    )
                })}
             </ul>
          </div>
          <div className={`rounded-2xl shadow-lg p-4 sm:p-6 ${theme.cardBg}`}>
            <h3 className={`text-xl md:text-2xl font-bold mb-4 ${theme.textStrong}`}>Add a New Habit</h3>
            <form onSubmit={handleAddHabitSubmit} className="space-y-4">
              <input type="text" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} placeholder="e.g., Study for 30 minutes" className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${theme.inputBg} ${theme.border} ${theme.text}`} />
              <div className="flex items-center justify-between">
                <label htmlFor="is-negative-toggle" className="flex items-center cursor-pointer">
                  <div className="relative">
                    <input type="checkbox" id="is-negative-toggle" className="sr-only" checked={isNegativeHabit} onChange={() => setIsNegativeHabit(!isNegativeHabit)} />
                    <div className="block bg-slate-600 w-14 h-8 rounded-full"></div>
                    <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition"></div>
                  </div>
                  <div className={`ml-3 ${theme.textMuted}`}>Is this a habit to avoid?</div>
                </label>
                <button type="submit" disabled={!newHabitName.trim()} className="bg-blue-500 text-white font-bold py-3 px-5 rounded-lg hover:bg-blue-600 disabled:bg-slate-600 transition">Add</button>
              </div>
            </form>
          </div>
        </main>
      </div>

      <style>{`
        .lottie-container { transition: opacity 0.2s ease-in-out; opacity: 1; }
        .lottie-container.fading-out { opacity: 0; }
        #is-negative-toggle:checked ~ .dot { transform: translateX(100%); background-color: #34d399; }
        .community-toast { animation: fadeInOutToast 3s ease-in-out forwards; position: fixed; bottom: 40px; left: 50%; z-index: 1100; }
        @keyframes fadeInOutToast { 0% { opacity: 0; transform: translate(-50%, 20px); } 15% { opacity: 1; transform: translate(-50%, 0); } 85% { opacity: 1; transform: translate(-50%, 0); } 100% { opacity: 0; transform: translate(-50%, 20px); } }
      `}</style>
      
      {showCommunityToast && ( <div className={`community-toast ${theme.cardBg} ${theme.textStrong} py-2 px-5 rounded-full shadow-lg`} role="alert"> Community feature is under development. Coming soon! </div> )}

      <VitaminModal isOpen={isVitaminModalOpen} onClose={() => setIsVitaminModalOpen(false)} onSubmit={onLogVitamins} themeClasses={theme} />
      <PhysicalModal isOpen={isPhysicalModalOpen} onClose={() => setIsPhysicalModalOpen(false)} onSubmit={onLogPhysicalActivity} themeClasses={theme} />
      <Scheduler isOpen={isSchedulerOpen} onClose={() => setIsSchedulerOpen(false)} themeClasses={theme} onExportToCalendar={onExportToCalendar} />
      <AnalyticsModal isOpen={isAnalyticsModalOpen} onClose={() => setIsAnalyticsModalOpen(false)} userData={userData} themeClasses={theme} onGetAiInsight={(summary) => onGetAiInsight('analytics_insight', summary)} />
      {smartGoalSuggestion && <SmartGoalModal isOpen={isSmartGoalModalOpen} onClose={() => setIsSmartGoalModalOpen(false)} suggestion={smartGoalSuggestion} onConfirm={(useSuggestion, text) => handleSmartGoalChoice(useSuggestion, text)} themeClasses={theme} originalGoal={newHabitName} />}
      <CustomizationModal isOpen={isCustomizationModalOpen} onClose={() => setIsCustomizationModalOpen(false)} onSelect={onSelectCustomization} userData={userData} themeClasses={theme} />

    </div>
  );
};

export default Dashboard;
