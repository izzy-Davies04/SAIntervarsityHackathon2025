import { UserData } from '../types';

/**
 * Calculates the effective hourly health decay rate for the buddy.
 * This function centralizes all decay logic for maintainability.
 * @param data The complete user data object.
 * @returns The amount of health that should decay per hour.
 */
export const calculateDecayRate = (data: UserData): number => {
    // Base decay is higher if important, weather-related tasks are incomplete.
    const baseDecay = data.compulsoryHabits.some(h => !h.completed) ? 2 : 1;

    // Penalties are added if certain health stats fall below a 50% threshold.
    const gutPenalty = data.userHealth.gut < 50 ? 0.5 : 0;
    const physicalPenalty = data.userHealth.activity < 50 ? 0.5 : 0;
    
    // A penalty is added based on the user's accumulated sleep debt.
    const sleepPenalty = data.sleepDebt * 0.25;

    // A heavy penalty is applied if medication doses are missed.
    let medsPenalty = 0;
    if (data.medsEnabled && data.medsDosesPerDay > 0) {
        // Calculate the interval between doses in hours.
        const doseIntervalHours = 24 / data.medsDosesPerDay;
        // Determine how many doses should have been taken by the current hour of the day.
        const expectedDosesByNow = Math.floor(new Date().getHours() / doseIntervalHours);
        // If the user has taken fewer doses than expected, apply a penalty.
        if (data.medsDosesTakenToday < expectedDosesByNow) {
            medsPenalty = 1.0; // This adds a significant 1.0 to the hourly decay rate.
        }
    }

    // A factor is applied based on the user's reported sedentary lifestyle from onboarding.
    let sedentaryFactor = 1.0;
    if (data.onboardingSurvey) {
        if (data.onboardingSurvey.sedentaryHours > 10) {
            sedentaryFactor = 1.5;
        } else if (data.onboardingSurvey.sedentaryHours < 4) {
            sedentaryFactor = 0.75;
        }
    }

    // Combine all factors. The decayMultiplier is a value that can be reduced by daily boosters.
    const totalDecay = (baseDecay + gutPenalty + physicalPenalty + sleepPenalty + medsPenalty) * sedentaryFactor * data.decayMultiplier;

    return totalDecay;
};