# How to Use BetterBuddy

This guide provides instructions on how to set up and run the BetterBuddy application locally, followed by a step-by-step walkthrough of its features.

## How to Launch the App

To run this project on your local machine, you'll need Node.js (v18 or newer) and npm installed.

### Step 1: Clone the Repository

First, download the project files to your computer.

### Step 2: Install Dependencies

Open your terminal, navigate into the project's root directory, and run the following command. This will download and install all the necessary software packages the project relies on.

```bash
npm install
```

### Step 3: Configure Your API Key

BetterBuddy uses the Google Gemini API to provide AI-powered motivational messages. You'll need to get a free API key from Google AI Studio.

1.  In the project's root folder, create a new file named `.env`.
2.  Copy the contents from the `.env.example` file and paste them into your new `.env` file.
3.  Replace the placeholder text with your actual Gemini API key.

    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

### Step 4: Start the Application

Once the installation is complete and your API key is set, run the following command in your terminal:

```bash
npm run dev
```

This will launch the local development server. You can now open your web browser and navigate to the local URL provided (usually `http://localhost:5173`) to start using BetterBuddy!

---

## How to Use the App: A Step-by-Step Guide

Welcome to BetterBuddy! Here's how to get started on your self-improvement journey.

### 1. First Launch: Sign In or Continue as Guest

When you first open the app, you'll see a sign-in screen.
-   **Sign In**: This feature is for returning users (currently under development).
-   **Continue as Guest**: As a new user, click this button to jump right into the experience.

### 2. Onboarding: Create Your Buddy

Next, you'll go through a quick and important onboarding process. Your answers here determine your buddy's starting health!

1.  **Name & Type**: Give your new companion a name and choose its type (Dog, Cat, or Eagle).
2.  **Lifestyle Survey**: You'll answer a few simple questions about your daily physical, nutritional, and mental habits. Be honest—this helps set a realistic starting point for your journey.
3.  **Medication Tracking (Optional)**: In the final step, you can choose to enable a medication tracker that will appear on your dashboard. You can set how many doses you take per day. This can be changed later in the settings.
4.  **Complete Onboarding**: Click "Let's Get Started!" to finish and meet your new buddy on the main dashboard.

### 3. The Dashboard: Your Daily Hub

The dashboard is where you'll interact with your buddy and track your habits.

#### The Buddy Panel (Left Side)
-   **Buddy Animation**: Your buddy's appearance and animation change based on its health. A healthy buddy is happy and energetic, while a low-health buddy looks tired.
-   **Level & XP**: Completing habits earns you Experience Points (XP). As you gain XP, your buddy levels up, unlocking new customizations.
-   **Customize Button**: Click this to open the Customization Modal, where you can equip cool accessories like hats or sunglasses that you've unlocked.

#### Health & Wellness Bars
-   **Overall Wellness**: The large bar at the top shows your buddy's overall health percentage. This slowly decays over time, so you need to complete habits to keep it up!
-   **Detailed Stats**: Below are four specific health stats: **Hydration**, **Physical**, **Mental**, and **Gut**. Certain habits boost specific stats.
-   **Clickable Boosts**: You can click on the **Physical**, **Mental**, and **Gut** stats once per day to log special activities (like taking vitamins or going for a walk) for a small health boost and to slow health decay. The "Mental" stat opens the sleep logger.

#### Managing Your Habits
-   **Completing a Habit**: Click the **"Complete"** button next to a positive habit. Your buddy will celebrate, and you'll gain XP and health.
-   **Logging a Relapse**: If you have a negative habit (one you want to avoid) and you slip up, click the **"Relapsed"** button. This will lower your buddy's health and reset your progress for that habit, but your buddy will offer encouragement.
-   **Adding a New Habit**: Use the form at the bottom to add a new goal. The app uses AI to analyze your goal and may suggest making it a "SMART" goal (Specific, Measurable, Achievable, Relevant, Time-bound) for better results.

#### Special Tiles
-   **Medication Tile**: If enabled, this tile shows your daily dosage progress and your consistency streak.
-   **Progress Analytics**: This tile gives you a quick overview of your current streak and weekly performance. Click it to open a modal with detailed charts.

### 4. Exploring Advanced Features (Modals)

-   **Progress Analytics Modal**: Here you can see charts visualizing your streak progression over time, a breakdown of your habit categories, and your recent sleep patterns. Click **"Get AI Tip"** for a personalized insight from your buddy based on your data.
-   **Notifications (Bell Icon)**: Your buddy will send you messages here—reminders, congratulations on a long streak, or urgent pleas if its health gets too low.
-   **Settings (Gear Icon)**:
    -   **Toggle Theme**: Switch between light and dark modes.
    -   **Enable/Disable Meds Tracker**: Turn the medication tile on or off.
    -   **Export Data**: Download your progress.
    -   **Reset Data**: Start over from scratch.
-   **Scheduler (Calendar Icon)**: Plan out your habits and activities for the week ahead and export them to your personal calendar (.ics file).
