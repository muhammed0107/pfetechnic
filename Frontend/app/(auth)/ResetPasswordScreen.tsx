// app/reset-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email: string }>();
  const { resetPassword, isLoading, error } = useAuth();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [matchError, setMatchError] = useState('');

  const handleReset = async () => {
    if (password !== confirm) {
      setMatchError("Passwords don't match");
      return;
    }
    try {
      await resetPassword(email, password);
      router.replace('/(auth)/login');
    } catch {
      // error from useAuth
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reset Password</Text>
      <TextInput
        placeholder="New Password"
        secureTextEntry
        style={styles.input}
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry
        style={styles.input}
        value={confirm}
        onChangeText={setConfirm}
      />
      {(matchError || error) && (
        <Text style={styles.error}>{matchError || error}</Text>
      )}
      <Button
        title="Reset"
        onPress={handleReset}
        loading={isLoading}
        fullWidth
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 16 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  error: { color: 'red', marginBottom: 12 },
});
