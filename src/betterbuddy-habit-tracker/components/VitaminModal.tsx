import React from 'react';
import { CloseIcon } from './Icons';

interface VitaminModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: () => void;
    themeClasses: Record<string, string>;
}

const VitaminModal: React.FC<VitaminModalProps> = ({ isOpen, onClose, onSubmit, themeClasses }) => {
    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit();
        onClose();
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
            aria-modal="true"
            role="dialog"
            onClick={onClose}
        >
            <div 
                className={`rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-md ${themeClasses.cardBg} relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <button 
                    onClick={onClose} 
                    className={`absolute top-4 right-4 ${themeClasses.textMuted} hover:text-red-500`}
                    aria-label="Close modal"
                >
                    <CloseIcon size={24} />
                </button>
                <h2 className={`text-2xl font-bold mb-4 ${themeClasses.textStrong}`}>Log Gut Health Boosters</h2>
                <p className={`${themeClasses.textMuted} mb-6 text-sm`}>
                    Logging vitamins or probiotics will boost your gut health and slow your buddy's health decay for the day. This can only be done once per day.
                </p>
                <div className="space-y-4 text-left">
                    <div>
                        <p className={`font-semibold mb-2 ${themeClasses.textStrong}`}>Key Vitamins (taken today?)</p>
                        <div className="flex flex-col sm:flex-row gap-4">
                            {['B12', 'D', 'K'].map(vit => (
                                <label key={vit} className="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" className="form-checkbox h-5 w-5 rounded text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500" />
                                    <span className={themeClasses.text}>{`Vitamin ${vit}`}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                     <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input type="checkbox" className="form-checkbox h-5 w-5 rounded text-blue-500 bg-slate-700 border-slate-600 focus:ring-blue-500" />
                            <span className={themeClasses.text}>Logged Probiotic / Fermented Food?</span>
                        </label>
                    </div>
                </div>
                <button 
                    onClick={handleSubmit}
                    className="mt-8 w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                    Log & Boost
                </button>
            </div>
        </div>
    );
};

export default VitaminModal;