import React from 'react';

// Define a common props interface for icons
interface IconProps extends React.SVGProps<SVGSVGElement> {
    size?: number | string;
    color?: string;
}

// Settings Gear Icon
export const GearIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

// Notifications Bell Icon
export const BellIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill={color} viewBox="0 0 16 16" {...props}>
        <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
    </svg>
);

// Habits Checklist Icon
export const HabitsIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
);

// Lightbulb Motivation Icon
export const LightbulbIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-1.414 1.414M21 12h-1M4 12H3m3.343-5.657l-1.414-1.414m12.728 12.728l-1.414-1.414M12 18a6 6 0 01-6-6c0-3.314 2.686-6 6-6s6 2.686 6 6c0 3.314-2.686 6-6 6z" />
    </svg>
);

// Calendar Icon
export const CalendarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
);

// Exclamation Icon
export const ExclamationIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 20 20" fill={color} {...props}>
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.21 3.03-1.742 3.03H4.42c-1.532 0-2.492-1.696-1.742-3.03l5.58-9.92zM10 13a1 1 0 110-2 1 1 0 010 2zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
    </svg>
);

// Water Drop Icon
export const WaterDropIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 20 20" fill={color} {...props}>
        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 14.5a.5.5 0 01-.5-.5v-13a.5.5 0 01.354-.462l4-2A.5.5 0 0110 1.207V14.5a.5.5 0 01-.5.5h-4z" clipRule="evenodd" />
    </svg>
);

// Bolt Icon
export const BoltIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 20 20" fill={color} {...props}>
        <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
    </svg>
);

// Brain Icon
export const BrainIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 20 20" fill={color} {...props}>
        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
    </svg>
);

// Stomach Icon
export const StomachIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 20 20" fill={color} {...props}>
        <path d="M10 3.5c-2 0-3.5 1-4.5 2.5s-1.5 3.5-1.5 5.5c0 2.5 1 4.5 3 5.5s4 1.5 6 0 3-3 3-5.5-0.5-4-1.5-5.5S12 3.5 10 3.5zM6 7a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 4a1 1 0 100 2h4a1 1 0 100-2H7z" />
    </svg>
);

// Close Icon
export const CloseIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2.5} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

// Chart Bar Icon
export const ChartBarIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
);

// Check Circle Icon
export const CheckCircleIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// X Circle Icon
export const XCircleIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

// Wardrobe Icon for Customizations
export const WardrobeIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h12a2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V6z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 9h16M9 9v11M15 9v11" />
    </svg>
);

// Moon Icon
export const MoonIcon: React.FC<IconProps> = ({ size = 20, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} viewBox="0 0 20 20" fill={color} {...props}>
        <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
    </svg>
);

// Users Icon for Community
export const UsersIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.653-.121-1.28-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.653.121-1.28.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

// Pill Icon for Medication
export const PillIcon: React.FC<IconProps> = ({ size = 24, color = 'currentColor', className, ...props }) => (
    <svg width={size} height={size} className={className} fill="none" viewBox="0 0 24 24" stroke={color} strokeWidth={2} {...props}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.63 3.063a1 1 0 01.52.278l8.485 8.485a1 1 0 010 1.414l-8.485 8.485a1 1 0 01-1.414 0L3.25 14.243a1 1 0 010-1.414L11.735 3.34a1 1 0 01-.105-.277z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 6.5l-8 8" />
    </svg>
);


// Dynamic Icon wrapper
const iconMap = {
    gear: GearIcon,
    bell: BellIcon,
    habits: HabitsIcon,
    lightbulb: LightbulbIcon,
    calendar: CalendarIcon,
    exclamation: ExclamationIcon,
    water: WaterDropIcon,
    bolt: BoltIcon,
    brain: BrainIcon,
    stomach: StomachIcon,
    close: CloseIcon,
    chart: ChartBarIcon,
    checkCircle: CheckCircleIcon,
    xCircle: XCircleIcon,
    wardrobe: WardrobeIcon,
    moon: MoonIcon,
    users: UsersIcon,
    pill: PillIcon,
};

type IconName = keyof typeof iconMap;

interface DynamicIconProps extends IconProps {
    name: IconName;
}

const Icon: React.FC<DynamicIconProps> = ({ name, ...props }) => {
    const IconComponent = iconMap[name];
    if (!IconComponent) {
        return null;
    }
    return <IconComponent {...props} />;
};

export default Icon;