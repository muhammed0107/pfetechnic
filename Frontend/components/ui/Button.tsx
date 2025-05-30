import React from 'react';
import { StyleSheet, Text, TouchableOpacity, ActivityIndicator, View } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

interface ButtonProps {
  title: string;
  onPress: () => void;
  type?: 'primary' | 'secondary' | 'outline' | 'danger';
  loading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  style?: any;
  textStyle?: any;
}

export default function Button({
  title,
  onPress,
  type = 'primary',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon,
  style,
  textStyle,
}: ButtonProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const getBackgroundColor = () => {
    if (disabled) return isDark ? '#444' : '#ccc';
    
    switch (type) {
      case 'primary':
        return '#4C1D95';
      case 'secondary':
        return '#0D9488';
      case 'outline':
        return 'transparent';
      case 'danger':
        return '#DC2626';
      default:
        return '#4C1D95';
    }
  };

  const getTextColor = () => {
    if (disabled) return isDark ? '#999' : '#666';
    
    switch (type) {
      case 'outline':
        return isDark ? '#fff' : '#4C1D95';
      default:
        return '#fff';
    }
  };

  const getBorderColor = () => {
    if (disabled) return isDark ? '#444' : '#ccc';
    
    switch (type) {
      case 'outline':
        return isDark ? '#fff' : '#4C1D95';
      default:
        return 'transparent';
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: type === 'outline' ? 1 : 0,
          width: fullWidth ? '100%' : undefined,
        },
        style,
      ]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} size="small" />
      ) : (
        <View style={styles.contentContainer}>
          {icon && <View style={styles.iconContainer}>{icon}</View>}
          <Text
            style={[
              styles.text,
              { color: getTextColor() },
              textStyle,
            ]}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    marginRight: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    textAlign: 'center',
  },
});