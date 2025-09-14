import React, { useState } from 'react';
import { CloseIcon } from './Icons';

interface SchedulerProps {
    isOpen: boolean;
    onClose: () => void;
    themeClasses: Record<string, string>;
    onExportToCalendar: () => void;
}

interface Activity {
    id: number;
    day: string;
    text: string;
}

// This is a simplified scheduler using local state. A full implementation
// would persist these events in the main application state.
const Scheduler: React.FC<SchedulerProps> = ({ isOpen, onClose, themeClasses, onExportToCalendar }) => {
    const [activities, setActivities] = useState<Activity[]>([]);
    const [newActivityText, setNewActivityText] = useState('');
    const [selectedDay, setSelectedDay] = useState('');

    if (!isOpen) return null;

    const days = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() + i);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
    });

    if (selectedDay === '' && days.length > 0) {
        setSelectedDay(days[0]);
    }

    const handleAddActivity = (e: React.FormEvent) => {
        e.preventDefault();
        if (newActivityText.trim() && selectedDay) {
            setActivities([...activities, { id: Date.now(), day: selectedDay, text: newActivityText.trim() }]);
            setNewActivityText('');
        }
    };

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[1000] p-4"
            onClick={onClose}
        >
            <div 
                className={`rounded-2xl shadow-xl p-6 sm:p-8 w-full max-w-2xl ${themeClasses.cardBg} relative`}
                onClick={(e) => e.stopPropagation()}
            >
                <button onClick={onClose} className={`absolute top-4 right-4 ${themeClasses.textMuted} hover:text-red-500`} aria-label="Close modal">
                    <CloseIcon size={24} />
                </button>
                <div className="flex justify-between items-center mb-4">
                    <h2 className={`text-2xl font-bold ${themeClasses.textStrong}`}>Activity Scheduler</h2>
                    <button onClick={onExportToCalendar} className="text-sm bg-blue-500 text-white font-semibold py-2 px-3 rounded-lg hover:bg-blue-600 transition">
                        Export to Calendar
                    </button>
                </div>
                <p className={`${themeClasses.textMuted} mb-6 text-sm`}>Plan your week ahead. (Note: This is a demo and activities are not saved).</p>
                
                <div className="flex border-b mb-4 overflow-x-auto" role="tablist">
                    {days.map(day => (
                        <button key={day} onClick={() => setSelectedDay(day)} role="tab" aria-selected={selectedDay === day}
                            className={`py-2 px-4 font-semibold whitespace-nowrap ${selectedDay === day ? `border-b-2 border-blue-500 ${themeClasses.textStrong}` : themeClasses.textMuted}`}>
                            {day}
                        </button>
                    ))}
                </div>

                <div className="space-y-3 min-h-[150px]">
                    {activities.filter(a => a.day === selectedDay).map(activity => (
                        <div key={activity.id} className={`p-3 rounded-lg flex justify-between items-center ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700/50' : 'bg-gray-200/50'}`}>
                            <p className={themeClasses.text}>{activity.text}</p>
                            <button onClick={() => setActivities(activities.filter(a => a.id !== activity.id))} className="text-red-500 font-bold">
                                <CloseIcon size={20} />
                            </button>
                        </div>
                    ))}
                     {activities.filter(a => a.day === selectedDay).length === 0 && (
                        <p className={`text-center pt-10 ${themeClasses.textMuted}`}>No activities planned for this day.</p>
                     )}
                </div>

                <form onSubmit={handleAddActivity} className="mt-6 flex gap-2">
                    <input type="text" value={newActivityText} onChange={(e) => setNewActivityText(e.target.value)} placeholder="e.g., 30min jog at 6pm" 
                        className={`flex-grow px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 transition ${themeClasses.inputBg} ${themeClasses.border} ${themeClasses.text}`} />
                    <button type="submit" disabled={!newActivityText.trim()} className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-slate-600 transition">Add</button>
                </form>
            </div>
        </div>
    );
};

export default Scheduler;