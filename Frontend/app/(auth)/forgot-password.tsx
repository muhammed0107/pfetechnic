// app/forgot-password.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { ArrowLeft } from 'lucide-react-native';

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { forgotPassword, isLoading, error } = useAuth();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const [email, setEmail] = useState('');
  const [validationError, setValidationError] = useState('');

  const validate = () => {
    if (!email) {
      setValidationError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setValidationError('Invalid email address');
      return false;
    }
    setValidationError('');
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      await forgotPassword(email);
      router.push({ pathname: '/VerifyOtpScreen', params: { email } });
    } catch {
      // error shown by useAuth
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.container,
          { backgroundColor: isDark ? '#111' : '#fff' },
        ]}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={isDark ? '#fff' : '#333'} />
          </TouchableOpacity>
          <ThemeToggle />
        </View>

        <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
          Forgot Password?
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#bbb' : '#666' }]}>
          Enter your email to receive a verification code
        </Text>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            error={validationError}
          />
          {error && <Text style={styles.errorText}>{error}</Text>}
          <Button
            title="Send Code"
            onPress={handleSubmit}
            loading={isLoading}
            fullWidth
            style={styles.submitButton}
          />
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.cancelContainer}
          >
            <Text
              style={[styles.cancelText, { color: isDark ? '#bbb' : '#666' }]}
            >
              Back to Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
  },
  backButton: { padding: 8 },
  title: { fontSize: 28, fontFamily: 'Inter-Bold', marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    marginBottom: 32,
    textAlign: 'center',
  },
  form: { width: '100%' },
  errorText: {
    color: '#DC2626',
    fontFamily: 'Inter-Regular',
    marginTop: 8,
    marginBottom: 16,
  },
  submitButton: { marginTop: 16 },
  cancelContainer: { alignItems: 'center', marginTop: 24 },
  cancelText: { fontSize: 16, fontFamily: 'Inter-Regular' },
});
