import React from 'react';
import type { UserHealthStats } from '../types';
import { WaterDropIcon, BoltIcon, BrainIcon, StomachIcon, MoonIcon } from './Icons';

interface HealthBarProps {
  userHealth: UserHealthStats;
  themeClasses: Record<string, string>;
  onGutHealthClick: () => void;
  onPhysicalActivityClick: () => void;
  onMentalHealthClick: () => void; // New prop for opening sleep modal
}

const HealthStat: React.FC<{ icon: React.ReactNode; label: string; value: number; color: string; themeClasses: Record<string, string>; onClick?: () => void; isClickable?: boolean; }> = ({ icon, label, value, color, themeClasses, onClick, isClickable }) => (
    <div 
      className={`flex-1 text-center px-2 min-w-[80px] ${isClickable ? 'cursor-pointer transform hover:scale-105 transition-transform' : ''}`}
      onClick={onClick}
      role={isClickable ? 'button' : undefined}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={isClickable ? (e) => (e.key === 'Enter' || e.key === ' ') && onClick?.() : undefined}
      aria-label={isClickable ? `Open details for ${label}` : undefined}
    >
        <div className={`flex items-center justify-center gap-1.5 ${themeClasses.textMuted} text-xs sm:text-sm`}> {icon} <span>{label}</span> </div>
        <div className={`w-full rounded-full h-2 mt-1 ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700' : 'bg-gray-200'}`}> <div className={`${color} h-2 rounded-full transition-all duration-500`} style={{ width: `${value}%` }}></div> </div>
        <span className={`text-xs font-semibold ${themeClasses.textStrong}`}>{value}%</span>
    </div>
);

const HealthBar: React.FC<HealthBarProps> = ({ userHealth, themeClasses, onGutHealthClick, onPhysicalActivityClick, onMentalHealthClick }) => {
    const overallHealthColor = userHealth.overall < 30 ? 'bg-red-500' : userHealth.overall < 70 ? 'bg-yellow-500' : 'bg-green-500';

    return (
        <div className={`rounded-2xl shadow-lg p-4 sm:p-6 transition-colors duration-300 ${themeClasses.cardBg}`}>
            <h3 className={`text-lg font-bold mb-3 ${themeClasses.textStrong}`}>Your Overall Wellness</h3>
            <div className={`relative w-full h-6 rounded-full overflow-hidden border ${themeClasses.border} ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700/50' : 'bg-gray-200'}`}>
                <div className={`absolute top-0 left-0 h-full transition-all duration-500 ${overallHealthColor}`} style={{ width: `${userHealth.overall}%` }}></div>
                <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-white" style={{textShadow:'1px 1px 2px rgba(0,0,0,0.6)'}}> Overall Health: {userHealth.overall}% </span>
            </div>
            <div className="flex justify-around items-start mt-4 -mx-2 flex-wrap sm:flex-nowrap gap-y-3">
                <HealthStat icon={<WaterDropIcon />} label="Hydration" value={userHealth.hydration} color="bg-blue-500" themeClasses={themeClasses} />
                <HealthStat icon={<BoltIcon />} label="Physical" value={userHealth.activity} color="bg-orange-500" themeClasses={themeClasses} onClick={onPhysicalActivityClick} isClickable={true} />
                <HealthStat icon={<><BrainIcon /><MoonIcon size={12} className="ml-1 opacity-70" /></>} label="Mental" value={userHealth.mental} color="bg-purple-500" themeClasses={themeClasses} onClick={onMentalHealthClick} isClickable={true} />
                <HealthStat icon={<StomachIcon />} label="Gut" value={userHealth.gut} color="bg-yellow-500" themeClasses={themeClasses} onClick={onGutHealthClick} isClickable={true} />
            </div>
        </div>
    );
};

export default HealthBar;