// app/_layout.tsx
import React, { useEffect } from 'react';
import { Stack, SplashScreen } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme, View, Text } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';

import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  useFrameworkReady();
  const colorScheme = useColorScheme();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    const hideSplashScreen = async () => {
      try {
        await SplashScreen.hideAsync();
      } catch (error) {
        console.warn('Error hiding splash screen:', error);
      }
    };

    if (fontsLoaded || fontError) {
      hideSplashScreen();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (fontError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Error loading fonts. Please restart the app.</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <AuthProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: 'fade_from_bottom',
            }}
          >
            <Stack.Screen
              name="onboarding"
              options={{ gestureEnabled: false }}
            />
            <Stack.Screen name="(auth)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="(drawer)" options={{ gestureEnabled: false }} />
            <Stack.Screen name="+not-found" options={{ title: 'Oops!' }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </AuthProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
