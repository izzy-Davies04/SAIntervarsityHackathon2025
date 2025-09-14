import React from 'react';
import type { UserData } from '../types';
import { ChartBarIcon } from './Icons';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import { isAfter, subDays } from 'date-fns';

interface ProgressTileProps {
  userData: UserData;
  themeClasses: Record<string, string>;
  onClick: () => void;
}

// Mock data for sparkline as we don't store daily history
const sparklineData = [
  { day: 'D-6', completions: Math.floor(Math.random() * 2) + 1 },
  { day: 'D-5', completions: Math.floor(Math.random() * 3) + 1 },
  { day: 'D-4', completions: Math.floor(Math.random() * 2) + 2 },
  { day: 'D-3', completions: Math.floor(Math.random() * 2) + 1 },
  { day: 'D-2', completions: Math.floor(Math.random() * 3) + 2 },
  { day: 'D-1', completions: Math.floor(Math.random() * 2) + 3 },
  { day: 'Today', completions: Math.floor(Math.random() * 3) + 2 },
];

const ProgressTile: React.FC<ProgressTileProps> = ({ userData, themeClasses, onClick }) => {
  const { habits, streak } = userData;
  const sevenDaysAgo = subDays(new Date(), 7);

  const habitsCompletedLast7Days = habits.filter(h => isAfter(new Date(h.lastCompleted), sevenDaysAgo)).length;
  const totalHabits = habits.length;
  const weeklyCompletion = totalHabits > 0 ? Math.round((habitsCompletedLast7Days / totalHabits) * 100) : 0;
  
  const mostRecentHabit = totalHabits > 0 ? habits.reduce((latest, current) => 
    current.lastCompleted > latest.lastCompleted ? current : latest
  ) : null;

  return (
    <div 
      className={`rounded-2xl shadow-lg p-4 sm:p-6 ${themeClasses.cardBg} cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all duration-200`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && onClick()}
    >
      <div className="flex items-center gap-3 mb-4">
        <ChartBarIcon size={32} className="text-blue-500" />
        <div>
          <h3 className={`text-xl md:text-2xl font-bold ${themeClasses.textStrong}`}>Progress Analytics</h3>
          <p className={`${themeClasses.textMuted} text-sm`}>Click to see your detailed progress!</p>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="col-span-2 sm:col-span-1">
          <p className={`text-2xl font-bold ${themeClasses.textStrong}`}>{streak}</p>
          <p className={`text-sm ${themeClasses.textMuted}`}>Day Streak</p>
        </div>
        <div>
          <p className={`text-2xl font-bold ${themeClasses.textStrong}`}>{weeklyCompletion}%</p>
          <p className={`text-sm ${themeClasses.textMuted}`}>Weekly %</p>
        </div>
        <div className="truncate">
          <p className={`text-2xl font-bold ${themeClasses.textStrong} truncate`}>{mostRecentHabit ? mostRecentHabit.name : 'N/A'}</p>
          <p className={`text-sm ${themeClasses.textMuted}`}>Recent Habit</p>
        </div>
        <div className="h-12 w-full opacity-70 hidden sm:block">
            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 5 }}>
                    <Area type="monotone" dataKey="completions" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.3} />
                </AreaChart>
            </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProgressTile;
