import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, Button } from 'react-native';
import { Text, Surface } from 'react-native-paper';
import { Colors, Spacing } from '../constants/colors';
import apiService from '../services/api';

// Simple debug screen to test API connectivity
const DebugScreen = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState({});

  const runTest = async (testName, testFunction) => {
    setLoading(prev => ({ ...prev, [testName]: true }));
    try {
      const result = await testFunction();
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: true, result, timestamp: new Date().toISOString() }
      }));
      Alert.alert('Success', `Test ${testName} passed!`);
    } catch (error) {
      setTestResults(prev => ({
        ...prev,
        [testName]: { success: false, error: error.message, timestamp: new Date().toISOString() }
      }));
      Alert.alert('Error', `Test ${testName} failed: ${error.message}`);
    } finally {
      setLoading(prev => ({ ...prev, [testName]: false }));
    }
  };

  const tests = {
    'ping-server': async () => {
      // Test basic connectivity by trying to get user profile
      // This will fail if not authenticated, but should show network connectivity
      try {
        const result = await apiService.getProfile();
        return result;
      } catch (error) {
        if (error.message.includes('401')) {
          // This is expected if not logged in, but means we can reach the server
          return { message: 'Server reachable, but not authenticated (401 expected)' };
        }
        throw error;
      }
    },
    'get-points-balance': async () => {
      return await apiService.getPointsBalance();
    },
    'get-tasks': async () => {
      return await apiService.getTasks();
    },
    'get-notifications': async () => {
      return await apiService.getNotifications();
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text variant="headlineSmall" style={styles.title}>API Debug Screen</Text>
        <Text style={styles.subtitle}>Test API connectivity and functionality</Text>
      </View>

      <Surface style={styles.card} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>API Connectivity Tests</Text>
        
        {Object.keys(tests).map((testName) => (
          <View key={testName} style={styles.testRow}>
            <Button
              title={loading[testName] ? 'Testing...' : `Run ${testName}`}
              onPress={() => runTest(testName, tests[testName])}
              disabled={loading[testName]}
            />
            {testResults[testName] && (
              <View style={styles.resultContainer}>
                <Text style={[
                  styles.resultText, 
                  { color: testResults[testName].success ? Colors.success : Colors.error }
                ]}>
                  {testResults[testName].success ? '✓ Success' : '✗ Failed'} - {testResults[testName].timestamp}
                </Text>
                {testResults[testName].success && (
                  <Text style={styles.resultDetails} numberOfLines={2}>
                    Result: {JSON.stringify(testResults[testName].result).substring(0, 100)}...
                  </Text>
                )}
                {!testResults[testName].success && (
                  <Text style={styles.resultDetails}>
                    Error: {testResults[testName].error}
                  </Text>
                )}
              </View>
            )}
          </View>
        ))}
      </Surface>

      <Surface style={styles.card} elevation={2}>
        <Text variant="titleMedium" style={styles.sectionTitle}>Server Information</Text>
        <Text style={styles.infoText}>Base URL: {apiService.baseURL}</Text>
        <Text style={styles.infoText}>Environment: {__DEV__ ? 'Development' : 'Production'}</Text>
      </Surface>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    padding: Spacing.l,
    backgroundColor: Colors.surface,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  subtitle: {
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  card: {
    margin: Spacing.m,
    padding: Spacing.m,
    backgroundColor: Colors.white,
    borderRadius: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: Spacing.m,
  },
  testRow: {
    marginBottom: Spacing.m,
    paddingVertical: Spacing.s,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  resultContainer: {
    marginTop: Spacing.s,
  },
  resultText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  resultDetails: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.text,
    marginBottom: 4,
  },
});

export default DebugScreen;