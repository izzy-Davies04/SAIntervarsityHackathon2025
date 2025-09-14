import React, { useState } from 'react';
import { UserData, AiMessageData } from '../types';
import { CloseIcon, LightbulbIcon } from './Icons';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, Legend } from 'recharts';
import { subDays, isAfter } from 'date-fns';

interface AnalyticsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData;
  themeClasses: Record<string, string>;
  onGetAiInsight: (summary: string) => Promise<AiMessageData | null>;
}

const COLORS = ['#0ea5e9', '#8b5cf6', '#f97316', '#10b981', '#f59e0b'];

const categorizeHabit = (name: string): string => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes('water') || lowerName.includes('hydrate')) return 'Hydration';
    if (lowerName.includes('walk') || lowerName.includes('run') || lowerName.includes('gym') || lowerName.includes('exercise')) return 'Physical';
    if (lowerName.includes('read') || lowerName.includes('study') || lowerName.includes('meditate')) return 'Mental';
    if (lowerName.includes('fiber') || lowerName.includes('veg')) return 'Gut';
    return 'General';
};


const AnalyticsModal: React.FC<AnalyticsModalProps> = ({ isOpen, onClose, userData, themeClasses, onGetAiInsight }) => {
    const [aiInsight, setAiInsight] = useState<AiMessageData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    
    if (!isOpen) return null;

    const handleGetInsight = async () => {
        setIsLoading(true);
        setAiInsight(null);
        const sevenDaysAgo = subDays(new Date(), 7);
        const habitsCompletedLast7Days = userData.habits.filter(h => isAfter(new Date(h.lastCompleted), sevenDaysAgo)).length;
        const weeklyCompletion = userData.habits.length > 0 ? Math.round((habitsCompletedLast7Days / userData.habits.length) * 100) : 0;
        // The summary sent to the AI now includes sleep data for more relevant insights.
        const summary = `Current streak is ${userData.streak} days. User has ${userData.habits.length} habits with a weekly completion rate of ${weeklyCompletion}%. Current sleep debt is ${userData.sleepDebt}.`;
        const insight = await onGetAiInsight(summary);
        setAiInsight(insight);
        setIsLoading(false);
    };

    const handleExport = () => {
        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Habit Name,Last Completed\r\n";
        userData.habits.forEach(habit => {
            const row = `"${habit.name.replace(/"/g, '""')}",${new Date(habit.lastCompleted).toLocaleString()}`;
            csvContent += row + "\r\n";
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "better_buddy_habits.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // --- Data processing for charts ---

    // Streak data for the streak progression chart
    const streakData = userData.streak > 0 
        ? Array.from({ length: Math.min(30, userData.streak) }, (_, i) => ({
            day: `-${Math.min(30, userData.streak) - i -1}d`,
            streak: i + 1,
          })).concat([{ day: 'Today', streak: userData.streak }])
        : [{ day: 'Today', streak: 0 }];

    // Habit category data for the pie chart
    const categoryCounts = userData.habits.reduce((acc, habit) => {
        const category = categorizeHabit(habit.name);
        acc[category] = (acc[category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const pieData = Object.keys(categoryCounts).map(key => ({
        name: key,
        value: categoryCounts[key]
    }));
    
    // New: Sleep data for the sleep patterns chart
    const sleepData = userData.sleepLogs.slice(-14).map(log => ({
        date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        quality: log.quality,
        hours: log.hours,
    }));


  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-[100] p-4" onClick={onClose} aria-modal="true" role="dialog">
      <div className={`rounded-2xl shadow-xl p-4 sm:p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto ${themeClasses.cardBg} relative`} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className={`absolute top-4 right-4 ${themeClasses.textMuted} hover:text-red-500`} aria-label="Close modal"><CloseIcon size={24} /></button>
        <h2 className={`text-2xl sm:text-3xl font-bold mb-4 ${themeClasses.textStrong}`}>Your Progress Analytics</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Streak Chart */}
          <div className={`${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-900/50' : 'bg-gray-100/50'} rounded-lg p-4`}>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.textStrong}`}>Streak Progression</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={streakData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                  <XAxis dataKey="day" stroke={themeClasses.textMuted} fontSize={12} />
                  <YAxis stroke={themeClasses.textMuted} fontSize={12} allowDecimals={false}/>
                  <Tooltip contentStyle={{ backgroundColor: themeClasses.cardBg, border: `1px solid ${themeClasses.border}` }} />
                  <Line type="monotone" dataKey="streak" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Habit Categories */}
          <div className={`${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-900/50' : 'bg-gray-100/50'} rounded-lg p-4`}>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.textStrong}`}>Habit Categories</h3>
            <div className="h-64 w-full">
               <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        {/* FIX: Added an 'any' type cast to the label prop's arguments to resolve a TypeScript error where the 'percent' property was not found on the inferred type. */}
                        <Pie data={pieData} cx="50%" cy="50%" labelLine={false} outerRadius={80} fill="#8884d8" dataKey="value" nameKey="name" label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}>
                            {pieData.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: themeClasses.cardBg, border: `1px solid ${themeClasses.border}` }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
          </div>
          
          {/* New: Sleep Chart */}
          <div className={`${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-900/50' : 'bg-gray-100/50'} rounded-lg p-4 lg:col-span-2`}>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.textStrong}`}>Recent Sleep Patterns (14 Days)</h3>
            <div className="h-64 w-full">
                {sleepData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={sleepData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                            <XAxis dataKey="date" stroke={themeClasses.textMuted} fontSize={10} interval="preserveStartEnd" />
                            <YAxis yAxisId="left" stroke="#8884d8" fontSize={12} domain={[0, 'dataMax + 1']} label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: '#8884d8', offset: 10 }} />
                            <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" fontSize={12} domain={[1, 5]} allowDecimals={false} label={{ value: 'Quality', angle: 90, position: 'insideRight', fill: '#82ca9d' }} />
                            <Tooltip contentStyle={{ backgroundColor: themeClasses.cardBg, border: `1px solid ${themeClasses.border}` }} />
                            <Legend wrapperStyle={{fontSize: "12px"}} />
                            <Line yAxisId="left" type="monotone" dataKey="hours" stroke="#8884d8" strokeWidth={2} name="Sleep Hours" />
                            <Line yAxisId="right" type="step" dataKey="quality" stroke="#82ca9d" strokeWidth={2} name="Sleep Quality (1-5)" />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className={themeClasses.textMuted}>Log your sleep to see your patterns here!</p>
                    </div>
                )}
            </div>
          </div>

          {/* AI Insight */}
          <div className={`lg:col-span-2 ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-900/50' : 'bg-gray-100/50'} rounded-lg p-4`}>
            <h3 className={`text-lg font-semibold mb-2 ${themeClasses.textStrong}`}>Buddy's Insights</h3>
            {aiInsight ? (
                 <div className="flex items-start gap-3">
                    <LightbulbIcon size={32} className="text-yellow-400 flex-shrink-0 mt-1" />
                    <div>
                        <p className={themeClasses.text}>{aiInsight.message}</p>
                        <div className="flex gap-2 mt-2">
                            {aiInsight.options.map((opt, i) => <button key={i} onClick={onClose} className="text-xs bg-blue-500 text-white font-bold py-1 px-3 rounded-full hover:bg-blue-600 transition">{opt}</button>)}
                        </div>
                    </div>
                </div>
            ) : (
                <p className={themeClasses.textMuted}>Get a personalized tip from {userData.buddyName} based on your progress.</p>
            )}
            <button onClick={handleGetInsight} disabled={isLoading} className="mt-3 bg-blue-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-600 disabled:bg-slate-600 transition">
                {isLoading ? 'Thinking...' : 'Get AI Tip'}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end">
            <button onClick={handleExport} className={`font-semibold py-2 px-4 rounded-lg transition ${themeClasses.bg === 'bg-slate-900' ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-200 hover:bg-gray-300'}`}>
                Export to CSV
            </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsModal;