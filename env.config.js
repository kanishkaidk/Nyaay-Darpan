// Environment configuration for Vite
// This file can be imported to access environment variables

export const config = {
  VITE_API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000'
};

// For development, you can also set the environment variable directly
// Add this to your .env file (create it manually):
// VITE_API_URL=http://localhost:5000
