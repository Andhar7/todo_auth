import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Button, Card, Title } from 'react-native-paper';
import axios from 'axios';
import { getBaseURL, API_CONFIG } from '../utils/config';

export default function DebugScreen() {
  const [testResults, setTestResults] = useState([]);
  const [testing, setTesting] = useState(false);

  const addResult = (test, success, message) => {
    setTestResults(prev => [...prev, { test, success, message, time: new Date().toLocaleTimeString() }]);
  };

  const testConnection = async (url, label) => {
    try {
      const response = await axios.get(url + '/api/auth/login/', { timeout: 5000 });
      addResult(label, false, `Expected error but got: ${response.status}`);
    } catch (error) {
      if (error.response && error.response.status === 405) {
        addResult(label, true, `Connected! Server responded with 405 (expected for GET)`);
      } else if (error.code === 'NETWORK_ERROR' || error.message.includes('Network Error')) {
        addResult(label, false, `Network Error: Cannot connect to ${url}`);
      } else {
        addResult(label, true, `Connected! Error: ${error.response?.status || error.message}`);
      }
    }
  };

  const runAllTests = async () => {
    setTesting(true);
    setTestResults([]);

    addResult('Configuration', true, `Current URL: ${getBaseURL()}`);

    // Test all possible URLs
    await testConnection(API_CONFIG.ANDROID_EMULATOR, 'Android Emulator');
    await testConnection(API_CONFIG.IOS_SIMULATOR, 'iOS Simulator');
    await testConnection(API_CONFIG.PHYSICAL_DEVICE, 'Physical Device');
    await testConnection('http://localhost:8000', 'Localhost');

    setTesting(false);
  };

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>Connection Debug Tool</Title>
          <Text style={styles.subtitle}>
            Use this tool to test which backend URL works for your setup
          </Text>

          <Button
            mode="contained"
            onPress={runAllTests}
            loading={testing}
            disabled={testing}
            style={styles.button}
          >
            {testing ? 'Testing Connections...' : 'Test All Connections'}
          </Button>

          <View style={styles.configInfo}>
            <Text style={styles.configTitle}>Current Configuration:</Text>
            <Text>Base URL: {getBaseURL()}</Text>
            <Text>Android Emulator: {API_CONFIG.ANDROID_EMULATOR}</Text>
            <Text>iOS Simulator: {API_CONFIG.IOS_SIMULATOR}</Text>
            <Text>Physical Device: {API_CONFIG.PHYSICAL_DEVICE}</Text>
          </View>

          {testResults.length > 0 && (
            <View style={styles.results}>
              <Text style={styles.resultsTitle}>Test Results:</Text>
              {testResults.map((result, index) => (
                <View key={index} style={styles.resultItem}>
                  <Text style={[
                    styles.resultText,
                    { color: result.success ? '#10b981' : '#ef4444' }
                  ]}>
                    {result.success ? '✅' : '❌'} {result.test}: {result.message}
                  </Text>
                  <Text style={styles.timestamp}>{result.time}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.instructions}>
            <Text style={styles.instructionsTitle}>Instructions:</Text>
            <Text style={styles.instructionText}>
              1. Make sure Django is running: python manage.py runserver 0.0.0.0:8000
            </Text>
            <Text style={styles.instructionText}>
              2. Run the tests above to see which URL works
            </Text>
            <Text style={styles.instructionText}>
              3. Update src/utils/config.js if needed
            </Text>
            <Text style={styles.instructionText}>
              4. For physical devices, use your computer's IP address
            </Text>
          </View>
        </Card.Content>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    padding: 16,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  subtitle: {
    color: '#64748b',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    marginBottom: 20,
  },
  configInfo: {
    backgroundColor: '#f1f5f9',
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
  },
  configTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#1e293b',
  },
  results: {
    marginBottom: 20,
  },
  resultsTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#1e293b',
  },
  resultItem: {
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 4,
  },
  resultText: {
    fontSize: 14,
    marginBottom: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  instructions: {
    backgroundColor: '#fef3c7',
    padding: 16,
    borderRadius: 8,
  },
  instructionsTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#92400e',
  },
  instructionText: {
    color: '#92400e',
    marginBottom: 4,
  },
});