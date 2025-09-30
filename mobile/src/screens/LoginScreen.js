import React, { useState } from 'react';
import {
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  Title,
  Paragraph,
  ActivityIndicator
} from 'react-native-paper';

import useAuthStore from '../store/authStore';

export default function LoginScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);

  const { login, loading, error } = useAuthStore();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await login({ username: username.trim(), password });
    
    if (!result.success) {
      if (result.emailVerificationRequired) {
        navigation.navigate('EmailVerification', { 
          email: username.trim(),
          message: result.message 
        });
      } else {
        Alert.alert('Login Failed', result.message);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          <Card style={styles.card}>
            <Card.Content>
              <Title style={styles.title}>Welcome Back</Title>
              <Paragraph style={styles.subtitle}>
                Sign in to access your todos
              </Paragraph>

              <TextInput
                label="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                autoCorrect={false}
                left={<TextInput.Icon icon="account" />}
              />

              <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry={isSecure}
                right={
                  <TextInput.Icon 
                    icon={isSecure ? "eye" : "eye-off"}
                    onPress={() => setIsSecure(!isSecure)}
                  />
                }
                left={<TextInput.Icon icon="lock" />}
              />

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleLogin}
                style={styles.loginButton}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>

              <View style={styles.registerContainer}>
                <Text style={styles.registerText}>Don't have an account? </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Register')}
                  compact
                >
                  Sign Up
                </Button>
              </View>

              <View style={styles.debugContainer}>
                <Button
                  mode="outlined"
                  onPress={() => navigation.navigate('Debug')}
                  compact
                  style={styles.debugButton}
                >
                  🔧 Debug Connection
                </Button>
              </View>
            </Card.Content>
          </Card>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#1e293b',
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#64748b',
    fontSize: 16,
  },
  input: {
    marginBottom: 16,
  },
  loginButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  registerText: {
    color: '#64748b',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
  debugContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  debugButton: {
    borderColor: '#64748b',
  },
});