import React from 'react';
import { UserData } from '../types';
import { CloseIcon } from './Icons';
import { CUSTOMIZATIONS } from '../constants';

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (customizationId: string | null) => void;
  userData: UserData;
  themeClasses: Record<string, string>;
}

const CustomizationModal: React.FC<CustomizationModalProps> = ({ isOpen, onClose, onSelect, userData, themeClasses }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1001] p-4"
        aria-modal="true" role="dialog" onClick={onClose}
    >
      <div 
        className={`rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg ${themeClasses.cardBg} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={`absolute top-4 right-4 ${themeClasses.textMuted} hover:text-red-500`} aria-label="Close modal">
          <CloseIcon size={24} />
        </button>
        <h2 className={`text-2xl font-bold mb-4 ${themeClasses.textStrong}`}>Customize Your Buddy</h2>
        <p className={`${themeClasses.textMuted} mb-6 text-sm`}>
            Select an item you've unlocked to change your buddy's appearance.
        </p>
        
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Default "None" option */}
            <button 
                onClick={() => onSelect(null)}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 aspect-square
                ${!userData.activeCustomization ? 'bg-blue-500 border-blue-500 text-white scale-105' : `${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700' : 'bg-gray-200'} border-transparent hover:border-blue-400`}`}
            >
                <div className="text-3xl">🚫</div>
                <span className="font-semibold mt-2 text-sm">None</span>
            </button>
            
            {Object.entries(CUSTOMIZATIONS).map(([id, item]) => {
                const isUnlocked = userData.unlockedCustomizations.includes(id);
                const isActive = userData.activeCustomization === id;
                return (
                    <button 
                        key={id}
                        onClick={() => isUnlocked && onSelect(id)}
                        disabled={!isUnlocked}
                        className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center transition-all duration-200 aspect-square relative
                        ${isActive ? 'bg-blue-500 border-blue-500 text-white scale-105' : `${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700' : 'bg-gray-200'} border-transparent`}
                        ${isUnlocked ? 'cursor-pointer hover:border-blue-400' : 'cursor-not-allowed opacity-50'}`}
                    >
                        <img src={item.assetUrl} alt={item.name} className="w-12 h-12 object-contain"/>
                        <span className="font-semibold mt-2 text-sm">{item.name}</span>
                        {!isUnlocked && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                                <span className="text-white font-bold text-xs">Lvl {item.level}</span>
                            </div>
                        )}
                    </button>
                )
            })}
        </div>
      </div>
    </div>
  );
};

export default CustomizationModal;
