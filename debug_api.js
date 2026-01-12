// Debug API integration
import apiService from './src/services/api';
import endpoints from './src/config/apiEndpoints';

console.log('API Endpoints Configuration:');
console.log(JSON.stringify(endpoints, null, 2));

// Function to test each endpoint individually
async function debugAPI() {
  console.log('Debugging API integration...');
  
  // Check if the base URL is configured correctly
  console.log('Base URL from API config:', apiService.baseURL);
  
  // Test a simple endpoint that should work
  try {
    console.log('Testing a simple GET endpoint...');
    // You can uncomment and modify this based on what endpoints you know work
    // await apiService.getProfile(); 
  } catch (error) {
    console.log('Error with API call:', error.message);
    console.log('Full error:', error);
  }
  
  // Log all endpoint definitions
  console.log('\nAuthentication endpoints:');
  console.log('- Login:', endpoints.endpoints.authentication.login);
  console.log('- Register:', endpoints.endpoints.authentication.register);
  
  console.log('\nCodes endpoints:');
  console.log('- Redeem:', endpoints.endpoints.codes.redeemCode);
  console.log('- History:', endpoints.endpoints.codes.getHistory);
  console.log('- Validate:', endpoints.endpoints.codes.validateCode);
  
  console.log('\nPoints endpoints:');
  console.log('- Balance:', endpoints.endpoints.points.getBalance);
  
  console.log('\nTasks endpoints:');
  console.log('- Get tasks:', endpoints.endpoints.tasks.getTasks);
  
  console.log('\nDebugging completed.');
}

debugAPI();