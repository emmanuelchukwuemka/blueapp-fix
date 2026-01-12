import React, { useState } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, Alert } from 'react-native';
import apiService from '../services/api';

const DebugScreen = () => {
  const [testResults, setTestResults] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const runApiTests = async () => {
    setIsLoading(true);
    setTestResults('Running API tests...\n');
    
    try {
      // Test 1: Check if we can make a request to the server
      setTestResults(prev => prev + '1. Testing basic API connection...\n');
      
      try {
        // This should return 401 since we don't have a token, but it will confirm the server is reachable
        await apiService.request('/auth/profile', { method: 'GET' });
        setTestResults(prev => prev + '   ✓ Server is accessible\n');
      } catch (error) {
        if (error.message.includes('401')) {
          setTestResults(prev => prev + '   ✓ Server is accessible (401 - authentication required)\n');
        } else if (error.message.includes('Network request failed')) {
          setTestResults(prev => prev + '   ✗ Network error - server may be unreachable\n');
        } else {
          setTestResults(prev => prev + `   ? Server response: ${error.message}\n`);
        }
      }

      // Test 2: Test endpoints configuration
      setTestResults(prev => prev + '\n2. Testing endpoints configuration...\n');
      
      // Check if the endpoints file is properly loaded
      try {
        // We'll try to access the endpoints by importing them
        const endpoints = require('../../myfigpoint_api_endpoints.json');
        if (endpoints && endpoints.endpoints) {
          setTestResults(prev => prev + '   ✓ Endpoints configuration loaded successfully\n');
          setTestResults(prev => prev + `   ✓ Found ${Object.keys(endpoints.endpoints).length} endpoint categories\n`);
        } else {
          setTestResults(prev => prev + '   ✗ Endpoints configuration not found\n');
        }
      } catch (error) {
        setTestResults(prev => prev + `   ✗ Error loading endpoints: ${error.message}\n`);
      }

      // Test 3: Test specific API calls
      setTestResults(prev => prev + '\n3. Testing specific API methods...\n');
      
      // Test if the API service methods exist
      const methodsToTest = [
        { name: 'login', exists: typeof apiService.login === 'function' },
        { name: 'register', exists: typeof apiService.register === 'function' },
        { name: 'getProfile', exists: typeof apiService.getProfile === 'function' },
        { name: 'getPointsBalance', exists: typeof apiService.getPointsBalance === 'function' },
        { name: 'getTasks', exists: typeof apiService.getTasks === 'function' },
        { name: 'redeemCode', exists: typeof apiService.redeemCode === 'function' },
      ];

      methodsToTest.forEach(method => {
        setTestResults(prev => prev + `   ${method.exists ? '✓' : '✗'} ${method.name} method: ${method.exists ? 'Available' : 'Missing'}\n`);
      });

      setTestResults(prev => prev + '\nAPI Integration Test Completed!');
      
    } catch (error) {
      setTestResults(prev => prev + `\nError during testing: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults('');
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>API Integration Debug Screen</Text>
        <Text style={styles.description}>
          This screen tests the API integration with the backend server based on the API documentation.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Button 
            title={isLoading ? "Testing..." : "Run API Tests"} 
            onPress={runApiTests} 
            disabled={isLoading}
            color="#007AFF"
          />
        </View>
        
        <View style={styles.buttonContainer}>
          <Button 
            title="Clear Results" 
            onPress={clearResults} 
            color="#FF3B30"
          />
        </View>
        
        {testResults ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>Test Results:</Text>
            <Text style={styles.resultsText}>{testResults}</Text>
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    lineHeight: 22,
  },
  buttonContainer: {
    marginBottom: 15,
    borderRadius: 8,
    overflow: 'hidden',
  },
  resultsContainer: {
    marginTop: 20,
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  resultsText: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#333',
    lineHeight: 20,
  },
});

export default DebugScreen;