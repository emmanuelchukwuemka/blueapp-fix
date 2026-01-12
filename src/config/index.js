// API Configuration
const API_CONFIG = {
  // Production URL - update this to your actual production server
  PRODUCTION_URL: 'http://72.62.4.119:8000',
  
  // Development URL - update this to your local development server if needed
  DEVELOPMENT_URL: 'http://10.0.2.2:3000', // Use 10.0.2.2 for Android emulator to access localhost
  
  // Use production URL for both development and production
  BASE_URL: 'http://72.62.4.119:8000', // Use production server for all builds
  
  // Timeout configuration (in milliseconds)
  TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

export default API_CONFIG;