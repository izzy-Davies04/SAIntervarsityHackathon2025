import React from 'react';
import { CloseIcon } from './Icons';
import { CUSTOMIZATIONS } from '../constants';

interface LevelUpModalProps {
    isOpen: boolean;
    onClose: () => void;
    levelUpInfo: { level: number; unlocked: string[] } | null;
    themeClasses: Record<string, string>;
}

const LevelUpModal: React.FC<LevelUpModalProps> = ({ isOpen, onClose, levelUpInfo, themeClasses }) => {
    if (!isOpen || !levelUpInfo) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1002] p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className={`rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md text-center ${themeClasses.cardBg} relative border-2 border-yellow-400`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className={`absolute top-4 right-4 ${themeClasses.textMuted} hover:text-red-500`}
                    aria-label="Close modal"
                >
                    <CloseIcon size={24} />
                </button>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className={`text-3xl font-bold mb-2 text-yellow-400`}>Level Up!</h2>
                <p className={`text-xl font-semibold ${themeClasses.textStrong}`}>
                    Your buddy has reached Level {levelUpInfo.level}!
                </p>
                {levelUpInfo.unlocked.length > 0 && (
                    <div className="mt-6">
                        <p className={`${themeClasses.textMuted} mb-3`}>You've unlocked:</p>
                        <div className="space-y-2">
                            {levelUpInfo.unlocked.map(itemName => (
                                <div key={itemName} className={`p-3 rounded-lg font-semibold text-lg ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700/50' : 'bg-gray-200'}`}>
                                    {itemName}
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                <button 
                    onClick={onClose}
                    className="mt-8 w-full bg-yellow-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-yellow-600 transition-transform transform hover:scale-105"
                >
                    Awesome!
                </button>
            </div>
        </div>
    );
};

export default LevelUpModal;
