# BetterBuddy Habit Tracker

A motivational habit tracker where you build self-improvement habits to keep your virtual buddy alive and well. Your companion reacts to your progress, earning XP and streaks, and sends reminders if you forget.

## Technology Stack & Dependencies

This project is a modern web application built with the following technologies:

### Runtimes
*   **Node.js**: A JavaScript runtime environment (v18 or newer recommended).
*   **npm**: The default package manager for Node.js.

### Frameworks & Libraries
*   **React**: The core library for building the user interface.
*   **TypeScript**: Provides static typing for JavaScript, improving code quality and maintainability.
*   **Tailwind CSS**: A utility-first CSS framework for rapid UI development.
*   **Recharts**: A composable charting library for creating the progress analytics graphs.
*   **date-fns**: A lightweight and modern library for date manipulation.
*   **@lottiefiles/lottie-player**: A web component for rendering smooth, high-quality Lottie animations.

### APIs & Services
*   **Google Gemini API (`@google/genai`)**: Powers the AI-driven motivational messages, insights, and SMART goal suggestions from your buddy.

## Project Setup

To run this project locally, you will need to have Node.js and npm installed.

### 1. Clone the Repository

First, get the project files onto your local machine.

### 2. Install Dependencies

Navigate to the project directory in your terminal and run the following command to install all the necessary libraries:

```bash
npm install
```

### 3. Set Up Environment Variables

This project requires an API key from Google AI Studio to use the Gemini API.

1.  Create a new file named `.env` in the root of the project directory.
2.  Copy the contents of `.env.example` into your new `.env` file.
3.  Replace the placeholder text with your actual Google Gemini API key:

    ```
    VITE_API_KEY=YOUR_GEMINI_API_KEY_HERE
    ```

    **Note**: Your API key is sensitive. The `.env` file is included in `.gitignore` by default to prevent it from being committed to version control.

### 4. Run the Development Server

Once the dependencies are installed and your API key is configured, you can start the local development server:

```bash
npm run dev
```

This will start the application, typically on `http://localhost:5173`. You can now open this URL in your web browser to use the BetterBuddy Habit Tracker.

## Licensing

This project utilizes several open-source libraries and assets. The full license information for each third-party module can be found in the [LICENSES.md](./LICENSES.md) file.
