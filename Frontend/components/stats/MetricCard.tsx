import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface MetricCardProps {
  icon: React.ReactNode | LucideIcon;
  label: string;
  value: string | number;
  backgroundColor?: string;
}

export default function MetricCard({
  icon,
  label,
  value,
  backgroundColor,
}: MetricCardProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  // Use provided backgroundColor or default based on theme
  const bgColor = backgroundColor || (isDark ? '#222' : '#F3F4F6');

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: bgColor,
          borderColor: isDark ? '#333' : '#E5E7EB',
        },
      ]}
    >
      <View style={styles.iconContainer}>
        {icon}
      </View>
      <View>
        <Text
          style={[
            styles.label,
            { color: isDark ? '#bbb' : '#6B7280' },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.value,
            { color: isDark ? '#fff' : '#111827' },
          ]}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    minWidth: '48%',
  },
  iconContainer: {
    marginRight: 12,
  },
  label: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  value: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    marginTop: 2,
  },
});