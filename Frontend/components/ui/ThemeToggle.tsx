import React from 'react';
import { StyleSheet, View, TouchableOpacity, Animated } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import { useTheme } from '@/context/ThemeContext';

interface ThemeToggleProps {
  size?: number;
}

export default function ThemeToggle({ size = 24 }: ThemeToggleProps) {
  const { actualTheme, toggleTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  // Animation value for the switch
  const [animation] = React.useState(new Animated.Value(isDark ? 1 : 0));
  
  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: isDark ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [isDark]);
  
  // Interpolated values for animations
  const switchTranslate = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [4, size + 2]
  });
  
  const bgColor = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['#F2F2F2', '#333']
  });

  return (
    <TouchableOpacity
      onPress={toggleTheme}
      activeOpacity={0.8}
    >
      <Animated.View 
        style={[
          styles.toggleContainer,
          { 
            backgroundColor: bgColor,
            width: size * 2 + 12,
            height: size + 8,
            borderRadius: (size + 8) / 2,
          }
        ]}
      >
        <View style={styles.iconContainer}>
          <Sun size={size - 4} color={isDark ? '#666' : '#FFB400'} />
          <Moon size={size - 4} color={isDark ? '#CCCCFF' : '#666'} />
        </View>
        <Animated.View 
          style={[
            styles.toggleSwitch,
            { 
              width: size,
              height: size,
              borderRadius: size / 2,
              transform: [{ translateX: switchTranslate }]
            }
          ]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  toggleContainer: {
    position: 'relative',
    justifyContent: 'center',
    padding: 4,
  },
  toggleSwitch: {
    position: 'absolute',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 4,
  }
});