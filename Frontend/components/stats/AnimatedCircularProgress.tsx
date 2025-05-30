import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

interface Props {
  size: number; // outer diameter
  strokeWidth?: number; // ring thickness
  progress: number; // 0-100
  progressColor: string;
  trackColor?: string;
  textColor?: string;
  duration?: number; // ms
  showPercent?: boolean;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const AnimatedCircularProgress: React.FC<Props> = ({
  size,
  strokeWidth = 10,
  progress,
  progressColor,
  trackColor = '#e5e7eb',
  textColor = '#000',
  duration = 900,
  showPercent = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const animated = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // clamp to 100 so it never “over-fills”
    const toValue = Math.min(progress, 100);
    Animated.timing(animated, {
      toValue,
      duration,
      useNativeDriver: false,
    }).start();
  }, [progress, duration, animated]);

  const strokeDashoffset = animated.interpolate({
    inputRange: [0, 100],
    outputRange: [circumference, 0],
  });

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        {/* track */}
        <Circle
          stroke={trackColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
        />
        {/* animated progress */}
        <AnimatedCircle
          stroke={progressColor}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={`${circumference} ${circumference}`}
          strokeDashoffset={strokeDashoffset}
        />
      </Svg>
      {showPercent && (
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <View style={styles.center}>
            <Text style={[styles.percentText, { color: textColor }]}>
              {Math.round(Math.min(progress, 100))}%
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

export default AnimatedCircularProgress;

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  percentText: { fontSize: 16, fontWeight: '600' },
});
