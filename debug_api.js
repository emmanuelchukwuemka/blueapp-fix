const fs = require('fs');
const path = require('path');

// Read the config file
const configContent = fs.readFileSync('./src/config/index.js', 'utf8');
const configMatch = configContent.match(/BASE_URL:\s*'([^']+)'/);
const BASE_URL = configMatch ? configMatch[1] : 'https://myfigpoints.com';

// Define a simple endpoints object for testing
const endpoints = {
  endpoints: {
    authentication: {
      login: {
        url: '/api/auth/login',
        method: 'POST'
      }
    }
  }
};

const API_CONFIG = {
  BASE_URL: BASE_URL
};

console.log('Testing API connection to production server...');
console.log('Base URL:', API_CONFIG.BASE_URL);

// Simple test to check if the server is reachable
async function testConnection() {
  try {
    console.log('Attempting to reach the server...');
    
    // Test with a simple GET request to the base URL
    const response = await fetch(API_CONFIG.BASE_URL);
    console.log('Server response status:', response.status);
    
    if (response.ok) {
      console.log('✅ Successfully connected to the production server!');
      
      // Now try to test an actual API endpoint (login as an example)
      console.log('\nTesting authentication endpoint...');
      const authEndpoint = endpoints.endpoints.authentication.login.url;
      console.log('Auth endpoint:', authEndpoint);
      
      const fullUrl = API_CONFIG.BASE_URL + authEndpoint;
      console.log('Full URL:', fullUrl);
      
      // This should return a 405 (Method Not Allowed) or 400 (Bad Request) if the endpoint exists
      // since we're sending a GET request instead of POST with proper body
      const authResponse = await fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log('Authentication endpoint response status:', authResponse.status);
      if (authResponse.status !== 405 && authResponse.status !== 400) {
        console.log('⚠️  Unexpected response from auth endpoint. May need to check if backend is properly configured.');
      } else {
        console.log('✅ Auth endpoint is accessible');
      }
    } else {
      console.log('❌ Failed to connect to the server. Status:', response.status);
    }
  } catch (error) {
    console.error('❌ Error connecting to the server:', error.message);
    console.log('This could be due to:');
    console.log('- Network connectivity issues');
    console.log('- Firewall blocking the request');
    console.log('- Server not running at the specified URL');
    console.log('- CORS policy restrictions');
  }
}

// Run the test
testConnection();