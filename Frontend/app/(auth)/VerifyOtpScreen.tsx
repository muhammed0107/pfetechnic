// app/verify-otp.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { verifyOtp, isLoading, error } = useAuth();
  const [otp, setOtp] = useState('');

  const handleVerify = async () => {
    try {
      await verifyOtp(email, otp);
      router.push({
        pathname: '/(auth)/ResetPasswordScreen',
        params: { email },
      });
    } catch {
      // error displayed by useAuth
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify Code</Text>
      <Text style={styles.subtitle}>We sent a code to {email}</Text>
      <TextInput
        placeholder="Enter code"
        style={styles.input}
        keyboardType="numeric"
        value={otp}
        onChangeText={setOtp}
      />
      {error && <Text style={styles.error}>{error}</Text>}
      <Button
        title="Verify"
        onPress={handleVerify}
        loading={isLoading}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 16, marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  error: { color: 'red', marginBottom: 16 },
});
