import { Habit, Theme } from './types';

const distantPast = new Date().getTime() - (5 * 60 * 60 * 1000); // 5 hours ago

export const DEFAULT_HABITS: Habit[] = [
    { id: 1, name: 'Drink Water', lastCompleted: distantPast }
];

// Cumulative XP required for each level. Index 0 is level 1.
export const LEVEL_THRESHOLDS = [
    0,      // Level 1
    100,    // Level 2
    250,    // Level 3
    500,    // Level 4
    800,    // Level 5
    1200,   // Level 6
    1700,   // Level 7
    2300,   // Level 8
    3000,   // Level 9
    4000    // Level 10
];

export const CUSTOMIZATIONS: Record<string, { level: number; name: string; assetUrl: string; }> = {
    'party_hat': {
        level: 2,
        name: 'Party Hat',
        assetUrl: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CiAgPHBvbHlnb24gcG9pbnRzPSI1MCw1IDgwLDkwIDIwLDkwIiBmaWxsPSIjNGFjNGY2IiAvPgogIDxjaXJjbGUgY3g9IjUwIiBjeT0iNSIgcj0iNSIgZmlsbD0iI2YyYjQ0ZiIgLz4KICA8Y2lyY2xlIGN4PSI0MCIgY3k9IjYwIiByPSI1IiBmaWxsPSIjZTg0YzNkIiAvPgogIDxjaXJjbGUgY3g9IjYwIiBjeT0iNzUiIHI9IjUiIGZpbGw9IiNkZjdhN2EiIC8+Cjwvc3ZnPg==`
    },
    'sunglasses': {
        level: 5,
        name: 'Cool Shades',
        assetUrl: `data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjQwIiB2aWV3Qm94PSIwIDAgMTAwIDQwIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxyZWN0IHg9IjUiIHk9IjUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgcng9IjE1IiByeT0iMTUiIGZpbGw9IiMxYTFhMWIiIC8+CiAgPHJlY3QgeD0iNTUiIHk9IjUiIHdpZHRoPSI0MCIgaGVpZ2h0PSIzMCIgcng9IjE1IiByeT0iMTUiIGZpbGw9IiMxYTFhMWIiIC8+CiAgPHBhdGggZD0iTTQ1IDIgTDU1IDIiIHN0cm9rZT0iIzFhMWExYiIgc3Ryb2tlLXdpZHRoPSI1IiAvPgo8L3N2Zz4=`
    }
};

// FIX: Moved THEME_CLASSES to constants.ts to be shared across components.
export const THEME_CLASSES: Record<Theme, Record<string, string>> = { nervy_blue: { bg: 'bg-slate-900', cardBg: 'bg-slate-800', text: 'text-slate-200', textMuted: 'text-slate-400', textStrong: 'text-white', inputBg: 'bg-slate-700', border: 'border-slate-600' }, light: { bg: 'bg-gray-100', cardBg: 'bg-white', text: 'text-gray-800', textMuted: 'text-gray-500', textStrong: 'text-black', inputBg: 'bg-gray-200', border: 'border-gray-300' }};
