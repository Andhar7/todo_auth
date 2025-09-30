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
} from 'react-native-paper';

import useAuthStore from '../store/authStore';

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSecure, setIsSecure] = useState(true);
  const [isConfirmSecure, setIsConfirmSecure] = useState(true);

  const { register, loading, error } = useAuthStore();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleRegister = async () => {
    // Validation
    if (!username.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!validateEmail(email.trim())) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters long');
      return;
    }

    const result = await register({
      username: username.trim(),
      email: email.trim(),
      password
    });
    
    console.log('📱 Registration result:', result);
    
    if (result.success) {
      if (result.emailVerificationRequired) {
        Alert.alert(
          'Registration Successful!', 
          result.message,
          [
            {
              text: 'OK',
              onPress: () => navigation.navigate('EmailVerification', { 
                email: email.trim(),
                message: result.message 
              })
            }
          ]
        );
      }
    } else {
      console.error('📱 Registration failed with message:', result.message);
      Alert.alert('Registration Failed', result.message);
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
              <Title style={styles.title}>Create Account</Title>
              <Paragraph style={styles.subtitle}>
                Join us to manage your todos
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
                label="Email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                mode="outlined"
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                left={<TextInput.Icon icon="email" />}
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

              <TextInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
                mode="outlined"
                secureTextEntry={isConfirmSecure}
                right={
                  <TextInput.Icon 
                    icon={isConfirmSecure ? "eye" : "eye-off"}
                    onPress={() => setIsConfirmSecure(!isConfirmSecure)}
                  />
                }
                left={<TextInput.Icon icon="lock-check" />}
              />

              {error && (
                <Text style={styles.errorText}>{error}</Text>
              )}

              <Button
                mode="contained"
                onPress={handleRegister}
                style={styles.registerButton}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>

              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an account? </Text>
                <Button
                  mode="text"
                  onPress={() => navigation.navigate('Login')}
                  compact
                >
                  Sign In
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
  registerButton: {
    marginTop: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },
  loginText: {
    color: '#64748b',
    fontSize: 14,
  },
  errorText: {
    color: '#ef4444',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
});