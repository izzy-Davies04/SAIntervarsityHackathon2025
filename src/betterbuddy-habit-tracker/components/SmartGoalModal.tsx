import React from 'react';
import { AiMessageData } from '../types';
import { CloseIcon, LightbulbIcon } from './Icons';

interface SmartGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  suggestion: AiMessageData;
  onConfirm: (useSuggestion: boolean, suggestedText?: string) => void;
  themeClasses: Record<string, string>;
  originalGoal: string;
}

const SmartGoalModal: React.FC<SmartGoalModalProps> = ({ isOpen, onClose, suggestion, onConfirm, themeClasses, originalGoal }) => {
  if (!isOpen) return null;

  return (
    <div 
        className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1001] p-4"
        aria-modal="true"
        role="dialog"
    >
      <div 
        className={`rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-lg ${themeClasses.cardBg} relative`}
        onClick={(e) => e.stopPropagation()}
      >
        <button 
            onClick={onClose} 
            className={`absolute top-4 right-4 ${themeClasses.textMuted} hover:text-red-500`}
            aria-label="Close modal"
        >
          <CloseIcon size={24} />
        </button>
        <div className="flex items-start gap-4">
            <LightbulbIcon size={40} className="text-yellow-400 flex-shrink-0 mt-1" />
            <div>
                <h2 className={`text-2xl font-bold mb-2 ${themeClasses.textStrong}`}>Make Your Goal SMART?</h2>
                <p className={`${themeClasses.textMuted} mb-4`}>
                    Here's a suggestion to make your goal more specific and measurable:
                </p>
                <div className={`p-4 rounded-lg ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700/50' : 'bg-gray-100'}`}>
                    <p className={themeClasses.text}>{suggestion.message}</p>
                </div>
            </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-4">
          <button 
            onClick={() => onConfirm(true, suggestion.message)}
            className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition-transform transform hover:scale-105"
          >
            {suggestion.options[0] || "Update Goal"}
          </button>
          <button 
            onClick={() => onConfirm(false)}
            className={`w-full font-bold py-3 px-4 rounded-lg transition-transform transform hover:scale-105 ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-600 hover:bg-slate-700' : 'bg-gray-200 hover:bg-gray-300'} text-white`}
          >
            {suggestion.options[1] || "Keep Original"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmartGoalModal;
