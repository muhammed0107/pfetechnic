import React from 'react';
import { Tabs } from 'expo-router';
import { Home as HomeIcon, User } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';
import { DrawerToggleButton } from '@react-navigation/drawer';
import { View, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function TabLayout() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={
          isDark
            ? ['#1a1a1a', '#2a2a2a', '#1a1a1a']
            : ['#f8f9fa', '#ffffff', '#f8f9fa']
        }
        style={styles.gradient}
      />
      <View
        style={[
          styles.pattern,
          {
            backgroundColor: isDark
              ? 'rgba(255,255,255,0.03)'
              : 'rgba(0,0,0,0.03)',
          },
        ]}
      />
      <Tabs
        screenOptions={{
          headerShown: false,
          headerStyle: {
            backgroundColor: isDark
              ? 'rgba(26, 26, 26, 0.8)'
              : 'rgba(248, 249, 250, 0.8)',
            borderBottomWidth: 0,
          },
          headerTitleStyle: {
            color: isDark ? '#fff' : '#000',
          },
          tabBarStyle: {
            backgroundColor: isDark
              ? 'rgba(26, 26, 26, 0.9)'
              : 'rgba(248, 249, 250, 0.9)',
            borderTopColor: isDark
              ? 'rgba(51, 51, 51, 0.5)'
              : 'rgba(238, 238, 238, 0.5)',
            height: 60,
            paddingBottom: 8,
            borderTopWidth: 0,
          },
          tabBarActiveTintColor: '#4C1D95',
          tabBarInactiveTintColor: isDark ? '#888' : '#999',
          tabBarLabelStyle: {
            fontFamily: 'Inter-Medium',
            fontSize: 12,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <HomeIcon size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Profile',
            tabBarIcon: ({ color, size }) => <User size={size} color={color} />,
          }}
        />
      </Tabs>
    </View>
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
});
