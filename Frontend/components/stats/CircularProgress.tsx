import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '@/context/ThemeContext';

interface CircularProgressProps {
  percentage: number;
  size: number;
  strokeWidth: number;
  text?: string;
  subText?: string;
  color?: string;
  backgroundColor?: string;
}

export default function CircularProgress({
  percentage,
  size,
  strokeWidth,
  text,
  subText,
  color = '#4C1D95',
  backgroundColor = '#E9D5FF',
}: CircularProgressProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  
  // Animations
  const animatedValue = React.useRef(new Animated.Value(0)).current;
  const circleRef = React.useRef<Circle>(null);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  const animation = (toValue: number) => {
    return Animated.timing(animatedValue, {
      toValue,
      duration: 1000,
      easing: Easing.out(Easing.ease),
      useNativeDriver: false,
    });
  };
  
  useEffect(() => {
    animation(percentage).start();
    
    animatedValue.addListener((v) => {
      if (circleRef?.current) {
        const strokeDashoffset = circumference - (circumference * v.value) / 100;
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });
    
    return () => {
      animatedValue.removeAllListeners();
    };
  }, [percentage]);

  return (
    <View style={styles.container}>
      <Svg height={size} width={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Background Circle */}
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={isDark ? '#444' : backgroundColor}
          fill="none"
        />
        
        {/* Progress Circle */}
        <Circle
          ref={circleRef}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke={color}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          transform={`rotate(-90, ${size / 2}, ${size / 2})`}
          fill="none"
        />
      </Svg>
      
      {text && (
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.progressText,
              { color: isDark ? '#fff' : '#000' },
            ]}
          >
            {text}
          </Text>
          {subText && (
            <Text
              style={[
                styles.subText,
                { color: isDark ? '#bbb' : '#666' },
              ]}
            >
              {subText}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
  },
  subText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
  },
});