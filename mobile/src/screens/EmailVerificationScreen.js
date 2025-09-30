import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import {
  Text,
  Button,
  Card,
  Title,
  Paragraph,
  TextInput,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

import useAuthStore from '../store/authStore';

export default function EmailVerificationScreen({ navigation, route }) {
  const { email: routeEmail, message } = route.params || {};
  const [email, setEmail] = useState(routeEmail || '');
  
  const { resendVerificationEmail, loading } = useAuthStore();

  const handleResendEmail = async () => {
    if (!email.trim()) {
      Alert.alert('Error', 'Please enter your email address');
      return;
    }

    const result = await resendVerificationEmail(email.trim());
    
    if (result.success) {
      Alert.alert(
        'Email Sent', 
        'Verification email has been sent. Please check your inbox.',
        [{ text: 'OK' }]
      );
    } else {
      Alert.alert('Error', result.message);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.iconContainer}>
            <Ionicons name="mail-outline" size={64} color="#6366f1" />
          </View>
          
          <Title style={styles.title}>Verify Your Email</Title>
          
          <Paragraph style={styles.message}>
            {message || 'Please check your email and click the verification link to activate your account.'}
          </Paragraph>

          <TextInput
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
          />

          <Button
            mode="contained"
            onPress={handleResendEmail}
            style={styles.resendButton}
            loading={loading}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </Button>

          <Button
            mode="text"
            onPress={handleBackToLogin}
            style={styles.backButton}
            disabled={loading}
          >
            Back to Login
          </Button>

          <View style={styles.infoContainer}>
            <Paragraph style={styles.infoText}>
              • Check your spam/junk folder
            </Paragraph>
            <Paragraph style={styles.infoText}>
              • Verification link expires in 24 hours
            </Paragraph>
            <Paragraph style={styles.infoText}>
              • Contact support if you need help
            </Paragraph>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  card: {
    elevation: 4,
    borderRadius: 12,
  },
  cardContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  iconContainer: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#1e293b',
  },
  message: {
    textAlign: 'center',
    marginBottom: 32,
    color: '#64748b',
    fontSize: 16,
    lineHeight: 24,
  },
  input: {
    width: '100%',
    marginBottom: 24,
  },
  resendButton: {
    width: '100%',
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 16,
  },
  backButton: {
    marginBottom: 24,
  },
  infoContainer: {
    width: '100%',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  infoText: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 8,
    textAlign: 'left',
  },
});