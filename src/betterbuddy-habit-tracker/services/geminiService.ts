import { GoogleGenAI, Type } from "@google/genai";
import type { AiMessageData, GetBuddyMessageParams } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getPrompt = (params: GetBuddyMessageParams): string => {
    switch(params.reason) {
        case 'welcome': return `I'm your new buddy! I'm so excited to start building healthy habits with you. Let's do this!`;
        case 'onboarding_complete': return `I'm ready to go! Thanks for sharing a bit about your lifestyle. Your inputs set our starting health—let's log some habits to improve it together!`;
        case 'reminder': return `I'm feeling a bit tired because my health is getting low. Let's complete a task together to perk me up!`;
        case 'streak': return `A streak of ${params.streakCount}! You're on fire! We've unlocked a special bonus. Total XP is ${params.xp}!`;
        case 'habit_complete': return `Yay! You did it! I'm so proud of you. Our total XP is now ${params.xp}! What's next?`;
        case 'long_absence': return `I've missed you! It's been over 12 hours. Remember to take care of your buddy as you take care of yourself.`;
        case 'low_health': return `URGENT: I'm feeling really weak, my health is critical! Please, let's complete a habit right away.`;
        case 'compulsory_reminder': return `The weather outside is tricky! Let's complete our special weather task so we can both feel safe and strong!`;
        case 'analytics_insight': return `Based on this user data summary: "${params.analyticsSummary}", what is one encouraging and actionable tip you can provide to help them improve their habits? Focus on one specific area.`;
        case 'smart_goal': return `A user wants to set a new goal: "${params.analyticsSummary}". Analyze this goal based on SMART principles (Specific, Measurable, Achievable, Relevant, Time-bound). Provide one short, actionable suggestion to make it 'smarter'. If it's already good, just give encouragement.`;
        case 'negative_habit_relapse': return `Oh no, a relapse. It happens. The important thing is to get back on track. We can do this.`;
    }
};

export const getBuddyMessage = async (params: GetBuddyMessageParams): Promise<AiMessageData> => {
    const prompt = getPrompt(params);

    const isInsight = params.reason === 'analytics_insight' || params.reason === 'smart_goal';

    // Determine personality based on health or request type
    const systemInstruction = 
        params.reason === 'smart_goal'
        ? `You are ${params.buddyName}, a helpful coach. You are helping a user refine their goal. Based on the provided goal, give one concrete suggestion to make it a SMART goal. For example, if the goal is "exercise more", suggest "try exercising 3 times a week for 30 minutes". Be concise and encouraging. Generate a JSON object with a 'message' and 2 short 'options' like "Update Goal" or "Keep Original".`
        : isInsight
        ? `You are ${params.buddyName}, a helpful and insightful ${params.buddyType}. Based on the user's habit data, provide one short, positive, and actionable tip. Keep it under 50 words. Be specific if possible. Generate a JSON object with a 'message' and 2 short, encouraging 'options'.`
        : params.health < 50
        ? `You are ${params.buddyName}, a ${params.buddyType}. You are cranky, grumpy, and tired because your health is low. Your responses must be short, snarky, under 40 words, and begrudgingly encouraging. Never break character. Generate a JSON object with a 'message' and 2 short, impatient 'options'.`
        : `You are ${params.buddyName}, a fun, motivational, and empathetic ${params.buddyType}. You are happy and energetic. Your responses must be short, cheerful, under 70 words, and encouraging. Never break character. End your response by generating a JSON object with a 'message' and a list of 2-3 short, actionable 'options' for the user to click.`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        message: { type: Type.STRING },
                        options: { type: Type.ARRAY, items: { type: Type.STRING } }
                    }
                }
            }
        });

        const parsedResponse = JSON.parse(response.text.trim());
        if (parsedResponse && typeof parsedResponse.message === 'string' && Array.isArray(parsedResponse.options)) {
            return parsedResponse as AiMessageData;
        } else {
            throw new Error("Invalid JSON structure from Gemini");
        }
    } catch (error) {
        console.error("Error generating content from Gemini:", error);
        return { // Fallback message
            message: params.health < 50 ? "Ugh, fine. Let's just do something." : "You're doing great! Keep it up!",
            options: ["Okay", "Let's go"]
        };
    }
};