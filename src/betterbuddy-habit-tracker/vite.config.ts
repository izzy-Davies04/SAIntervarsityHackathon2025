import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    define: {
      // Expose the API key to the app from the .env file,
      // making it available as process.env.API_KEY in the code.
      'process.env.API_KEY': JSON.stringify(env.VITE_API_KEY),
    }
  }
});
