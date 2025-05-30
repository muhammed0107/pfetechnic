import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '@/context/ThemeContext';

export default function AuthLayout() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: {
          backgroundColor: isDark ? '#111' : '#fff',
        },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}