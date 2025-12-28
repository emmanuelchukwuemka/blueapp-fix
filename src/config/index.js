// API Configuration
const API_CONFIG = {
  // Production URL - update this to your actual production server
  PRODUCTION_URL: 'http://72.62.4.119/api',
  
  // Development URL - update this to your local development server if needed
  DEVELOPMENT_URL: 'http://localhost:3000/api', // Example for local development
  
  // Use production URL for both development and production
  BASE_URL: 'http://72.62.4.119/api',
  
  // Timeout configuration (in milliseconds)
  TIMEOUT: 30000, // 30 seconds
  
  // Retry configuration
  MAX_RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

export default API_CONFIG;