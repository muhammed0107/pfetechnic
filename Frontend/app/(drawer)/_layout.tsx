// app/_layout.tsx   (or wherever your DrawerLayout lives)
import React from 'react';
import { Drawer } from 'expo-router/drawer';
import { useTheme } from '@/context/ThemeContext';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerContent } from '@/components/DrawerContent';
import {
  Home as HomeIcon,
  Activity,
  Dumbbell,
  HeartPulse,
  MessageSquare,
  Stethoscope, // ← use any icon you like
} from 'lucide-react-native';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { LinearGradient } from 'expo-linear-gradient';
import { Animated } from 'react-native';

export default function DrawerLayout() {
  const { actualTheme, toggleTheme } = useTheme();
  const colorScheme = useColorScheme();
  const router = useRouter();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <LinearGradient
          colors={
            actualTheme === 'dark'
              ? ['#1a1a1a', '#2a2a2a', '#1a1a1a']
              : ['#f8f9fa', '#ffffff', '#f8f9fa']
          }
          style={styles.gradient}
        />
        <View
          style={[
            styles.pattern,
            {
              backgroundColor:
                actualTheme === 'dark'
                  ? 'rgba(255,255,255,0.03)'
                  : 'rgba(0,0,0,0.03)',
            },
          ]}
        />
        <Drawer
          screenOptions={{
            headerStyle: {
              backgroundColor: actualTheme === 'dark' ? '#111' : '#fff',
            },
            headerTintColor: actualTheme === 'dark' ? '#fff' : '#000',
            drawerStyle: {
              backgroundColor: actualTheme === 'dark' ? '#111' : '#fff',
            },
            drawerActiveTintColor: '#6D28D9',
            drawerInactiveTintColor: actualTheme === 'dark' ? '#fff' : '#000',
            headerRight: () => (
              <TouchableOpacity
                onPress={toggleTheme}
                style={{ marginRight: 15 }}
              >
                <Ionicons
                  name={actualTheme === 'dark' ? 'sunny' : 'moon'}
                  size={24}
                  color={actualTheme === 'dark' ? '#fff' : '#000'}
                />
              </TouchableOpacity>
            ),
          }}
          drawerContent={(props) => (
            <View style={styles.drawerContainer}>
              <DrawerContent {...props} />
              <View style={styles.logoutContainer}>
                <Drawer.Screen
                  name="Logout"
                  options={{
                    drawerLabel: 'Logout',
                    title: '',
                    drawerIcon: ({ color, size }) => (
                      <Ionicons name="log-out" size={size} color={color} />
                    ),
                  }}
                />
              </View>
            </View>
          )}
        >
          <Drawer.Screen
            name="(tabs)"
            options={{
              drawerLabel: 'Home',
              drawerIcon: ({ color, size }) => (
                <HomeIcon size={size} color={color} />
              ),
              title: 'Home',
            }}
          />
          <Drawer.Screen
            name="activity"
            options={{
              drawerLabel: 'Activity',
              drawerIcon: ({ color, size }) => (
                <Activity size={size} color={color} />
              ),
              title: 'Activity',
            }}
          />
          <Drawer.Screen
            name="plan"
            options={{
              drawerLabel: 'Workout Plan',
              drawerIcon: ({ color, size }) => (
                <Dumbbell size={size} color={color} />
              ),
              title: 'Workout Plan',
            }}
          />
          <Drawer.Screen
            name="vitals"
            options={{
              drawerLabel: 'Vitals',
              drawerIcon: ({ color, size }) => (
                <HeartPulse size={size} color={color} />
              ),
              title: 'Vitals',
            }}
          />
          <Drawer.Screen
            name="prediction"
            options={{
              drawerLabel: 'Prediction',
              drawerIcon: ({ color, size }) => (
                <Stethoscope size={size} color={color} />
              ),
              title: 'AI Vitals Prediction',
            }}
          />
          <Drawer.Screen
            name="chat"
            options={{
              drawerLabel: 'AI Chat',
              drawerIcon: ({ color, size }) => (
                <MessageSquare size={size} color={color} />
              ),
              title: 'AI Chat',
            }}
          />
        </Drawer>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  pattern: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 0.5,
    backgroundImage:
      'linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor), linear-gradient(45deg, currentColor 25%, transparent 25%, transparent 75%, currentColor 75%, currentColor)',
    backgroundSize: '60px 60px',
    backgroundPosition: '0 0, 30px 30px',
  },
  drawerContainer: {
    flex: 1,
  },
  logoutContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0,0,0,0.1)',
  },
});
