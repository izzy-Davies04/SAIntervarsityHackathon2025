import React from 'react';
import type { CompulsoryHabit } from '../types';
import { ExclamationIcon } from './Icons';

interface CompulsoryHabitsProps {
  habits: CompulsoryHabit[];
  onComplete: (habitId: string) => void;
  themeClasses: Record<string, string>;
}

const CompulsoryHabits: React.FC<CompulsoryHabitsProps> = ({ habits, onComplete, themeClasses }) => {
  const incompleteHabits = habits.filter(h => !h.completed);

  if (incompleteHabits.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
        {incompleteHabits.map(habit => (
            <div key={habit.id} className={`p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-2 border-amber-500/80 ${themeClasses.bg === 'bg-slate-900' ? 'bg-amber-500/10' : 'bg-amber-500/20'}`}>
                <div className="flex items-center">
                    <ExclamationIcon className="mr-2 flex-shrink-0" />
                    <div>
                        <p className={`font-bold text-base sm:text-lg ${themeClasses.textStrong}`}>{habit.name}</p>
                        <p className={`text-sm text-amber-500 font-semibold`}>Daily Bonus: +{habit.xp} XP</p>
                    </div>
                </div>
                <button 
                    onClick={() => onComplete(habit.id)} 
                    className="bg-amber-500 text-white font-bold py-2 px-5 rounded-lg hover:bg-amber-600 transition-transform transform hover:scale-105 whitespace-nowrap w-full sm:w-auto"
                >
                    Complete
                </button>
            </div>
        ))}
    </div>
  );
};

export default CompulsoryHabits;