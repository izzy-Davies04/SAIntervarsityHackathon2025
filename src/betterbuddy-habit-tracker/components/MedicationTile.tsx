import React from 'react';
import type { UserData } from '../types';
import { PillIcon } from './Icons';

interface MedicationTileProps {
  userData: UserData;
  themeClasses: Record<string, string>;
  onLogMedication: () => void;
}

const MedicationTile: React.FC<MedicationTileProps> = ({ userData, themeClasses, onLogMedication }) => {
  const { medsDosesTakenToday, medsDosesPerDay, medsStreak } = userData;
  // Check if all doses for the day have been logged.
  const isCompleteForToday = medsDosesTakenToday >= medsDosesPerDay;

  return (
    <div className={`rounded-2xl shadow-lg p-4 sm:p-6 ${themeClasses.cardBg}`}>
      <div className="flex items-center gap-3 mb-4">
        <PillIcon size={32} className="text-teal-500" />
        <div>
          <h3 className={`text-xl md:text-2xl font-bold ${themeClasses.textStrong}`}>Medication</h3>
          <p className={`${themeClasses.textMuted} text-sm`}>Stay consistent, stay healthy.</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 items-center">
        <div className="text-center">
          <p className={`text-2xl font-bold ${themeClasses.textStrong}`}>{medsDosesTakenToday}/{medsDosesPerDay}</p>
          <p className={`text-sm ${themeClasses.textMuted}`}>Doses Today</p>
        </div>
        <div className="text-center">
          <p className={`text-2xl font-bold ${themeClasses.textStrong}`}>{medsStreak}</p>
          <p className={`text-sm ${themeClasses.textMuted}`}>Day Streak</p>
        </div>
      </div>
      <button 
        onClick={onLogMedication}
        disabled={isCompleteForToday}
        className={`w-full mt-4 font-bold py-3 px-5 rounded-lg transition ${
          isCompleteForToday 
            ? 'bg-green-500 text-white cursor-not-allowed' 
            : 'bg-blue-500 hover:bg-blue-600 text-white'
        }`}
      >
        {isCompleteForToday ? 'All Doses Logged!' : 'Log Next Dose'}
      </button>
      {/* Privacy and safety disclaimer for the user. */}
      <p className={`text-xs text-center mt-3 ${themeClasses.textMuted}`}>
        Disclaimer: This is a tool, not medical advice. Always consult a healthcare professional.
      </p>
    </div>
  );
};

export default MedicationTile;
