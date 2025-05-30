import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import ThemeToggle from './ThemeToggle';
import NetworkStatus from './NetworkStatus';
import { useTheme } from '@/context/ThemeContext';

interface HeaderProps {
  title?: string;
  showThemeToggle?: boolean;
  showNetworkStatus?: boolean;
  rightComponent?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
}

export default function Header({
  title,
  showThemeToggle = true,
  showNetworkStatus = true,
  rightComponent,
  rightIcon,
  onRightPress,
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Platform.OS === 'ios' ? insets.top : insets.top + 8,
          backgroundColor: isDark ? '#111' : '#fff',
          borderBottomColor: isDark ? '#333' : '#eee',
        },
      ]}
    >
      <View style={styles.header}>
        {title && (
          <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
            {title}
          </Text>
        )}

        <View style={styles.rightContainer}>
          {showNetworkStatus && <NetworkStatus />}
          {rightComponent}
          {rightIcon && (
            <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
              {rightIcon}
            </TouchableOpacity>
          )}
          {showThemeToggle && (
            <View style={styles.themeToggle}>
              <ThemeToggle />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderBottomWidth: 1,
    zIndex: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  themeToggle: {
    marginLeft: 12,
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },
});
