import React, { useState } from 'react';
import { CloseIcon, MoonIcon } from './Icons';

interface SleepModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (quality: number, hours: number) => void;
    themeClasses: Record<string, string>;
}

// FIX: Added themeClasses to props to resolve 'Cannot find name' error.
const RangeSlider = ({ label, value, min, max, step, onChange, unit, displayValue, minLabel, maxLabel, themeClasses }: { label: string, value: number, min: number, max: number, step: number, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, unit: string, displayValue?: string, minLabel?: string, maxLabel?: string, themeClasses: Record<string, string> }) => (
    <div className="w-full">
        <label className={`block text-base font-semibold ${themeClasses.text} mb-2 text-left`}>
            {label} <span className={`font-normal ${themeClasses.textMuted} text-sm`}>({displayValue || value} {unit})</span>
        </label>
        <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={onChange}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
            aria-label={label}
        />
        {(minLabel || maxLabel) && (
            <div className="flex justify-between text-xs text-slate-500 mt-1 px-1">
                <span>{minLabel}</span>
                <span>{maxLabel}</span>
            </div>
        )}
    </div>
);

const SleepModal: React.FC<SleepModalProps> = ({ isOpen, onClose, onSubmit, themeClasses }) => {
    const [quality, setQuality] = useState(3);
    const [hours, setHours] = useState(7.5);

    if (!isOpen) return null;

    const handleSubmit = () => {
        onSubmit(quality, hours);
        onClose();
    };
    
    const qualityLabels = ['Restless', 'Poor', 'Okay', 'Good', 'Excellent'];

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
                <div className="flex items-center gap-3 mb-4">
                    <MoonIcon size={28} className="text-purple-400" />
                    <h2 className={`text-2xl font-bold ${themeClasses.textStrong}`}>Log Your Sleep</h2>
                </div>
                <p className={`${themeClasses.textMuted} mb-8 text-sm`}>
                    How was your sleep last night? Good rest is crucial for your buddy's health and reduces daily health decay. You can log this once per day.
                </p>

                <div className="space-y-6">
                    <RangeSlider 
                        label="How would you rate your sleep quality?" 
                        value={quality} 
                        min={1} max={5} step={1} 
                        onChange={(e) => setQuality(parseInt(e.target.value))} 
                        unit="" 
                        displayValue={qualityLabels[quality - 1]} 
                        minLabel="Restless" maxLabel="Excellent" 
                        themeClasses={themeClasses}
                    />
                    <RangeSlider 
                        label="How many hours did you sleep?" 
                        value={hours} 
                        min={0} max={12} step={0.5} 
                        onChange={(e) => setHours(parseFloat(e.target.value))} 
                        unit="hrs" 
                        themeClasses={themeClasses}
                    />
                </div>

                <button 
                    onClick={handleSubmit}
                    className="mt-8 w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-transform transform hover:scale-105"
                >
                    Log Sleep
                </button>
            </div>
        </div>
    );
};

export default SleepModal;