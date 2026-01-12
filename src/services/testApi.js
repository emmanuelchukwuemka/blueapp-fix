import apiService from './api';

// Test function to verify API connection
export const testApiConnection = async () => {
  try {
    console.log('Testing API connection...');
    
    // Test a simple endpoint that doesn't require authentication
    // For example, we could test the server status or a simple health check
    // Since we don't have a specific health check endpoint in our config,
    // we'll try to access a protected endpoint which should return 401 if the server is reachable
    
    try {
      const response = await apiService.request('/auth/profile', { method: 'GET' });
      console.log('API connection test result:', response);
      return { success: true, message: 'API is accessible', data: response };
    } catch (error) {
      // If we get a 401 error, it means the server is reachable but we don't have a token
      if (error.message.includes('401')) {
        console.log('API server is accessible but authentication required');
        return { success: true, message: 'API server reachable, authentication required', error: error.message };
      } else {
        console.log('API connection error:', error.message);
        return { success: false, message: error.message };
      }
    }
  } catch (error) {
    console.log('API connection failed:', error);
    return { success: false, message: error.message };
  }
};

// Test function to try login with test credentials
export const testLogin = async (email = 'test@example.com', password = 'password') => {
  try {
    console.log('Testing login with credentials...');
    const credentials = { email, password };
    const response = await apiService.login(credentials);
    console.log('Login test result:', response);
    return { success: true, data: response };
  } catch (error) {
    console.log('Login test failed:', error);
    return { success: false, message: error.message };
  }
};

// Export the API service for direct use
export default apiService;