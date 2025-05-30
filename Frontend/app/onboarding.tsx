import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAppStore } from '@/store';
import Button from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';

const { width } = Dimensions.get('window');

const onboardingData = [
  {
    title: 'Track Your Health',
    description:
      'Monitor your steps, calories, and other vital health metrics in real-time.',
    image: 'https://images.pexels.com/photos/3756678/pexels-photo-3756678.jpeg',
  },
  {
    title: 'Personalized Workouts',
    description:
      'Get customized workout plans based on your fitness level and goals.',
    image: 'https://images.pexels.com/photos/4498151/pexels-photo-4498151.jpeg',
  },
  {
    title: 'AI Health Assistant',
    description:
      'Chat with our AI to get answers about symptoms, nutrition, and general health questions.',
    image: 'https://images.pexels.com/photos/7579831/pexels-photo-7579831.jpeg',
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const { completeOnboarding } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<any>(null);

  const viewConfig = { viewAreaCoveragePercentThreshold: 50 };

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    setCurrentIndex(viewableItems[0].index);
  }).current;

  const scrollTo = (index: number) => {
    if (slidesRef.current) {
      slidesRef.current.scrollToIndex({ index });
    }
  };

  const handleGetStarted = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  const handleSkip = () => {
    completeOnboarding();
    router.replace('/(auth)/login');
  };

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      scrollTo(currentIndex + 1);
    } else {
      handleGetStarted();
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? '#111' : '#fff' }]}
    >
      <View style={styles.skipContainer}>
        <TouchableOpacity onPress={handleSkip}>
          <Text style={[styles.skipText, { color: isDark ? '#bbb' : '#666' }]}>
            Skip
          </Text>
        </TouchableOpacity>
      </View>

      <Animated.FlatList
        data={onboardingData}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
              resizeMode="cover"
            />
            <View
              style={[
                styles.textContainer,
                {
                  backgroundColor: isDark
                    ? 'rgba(0, 0, 0, 0.7)'
                    : 'rgba(255, 255, 255, 0.8)',
                },
              ]}
            >
              <Text style={[styles.title, { color: isDark ? '#fff' : '#333' }]}>
                {item.title}
              </Text>
              <Text
                style={[
                  styles.description,
                  { color: isDark ? '#ddd' : '#666' },
                ]}
              >
                {item.description}
              </Text>
            </View>
          </View>
        )}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={(_, index) => index.toString()}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={viewConfig}
        ref={slidesRef}
      />

      <View style={styles.bottomContainer}>
        <View style={styles.dotsContainer}>
          {onboardingData.map((_, index) => {
            const inputRange = [
              (index - 1) * width,
              index * width,
              (index + 1) * width,
            ];

            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 16, 8],
              extrapolate: 'clamp',
            });

            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={index}
                style={[
                  styles.dot,
                  {
                    width: dotWidth,
                    opacity,
                    backgroundColor: isDark ? '#fff' : '#4C1D95',
                  },
                ]}
              />
            );
          })}
        </View>

        <Button
          title={
            currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Next'
          }
          onPress={handleNext}
          fullWidth
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  skipContainer: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
  },
  slide: {
    width,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  textContainer: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    right: 20,
    padding: 20,
    borderRadius: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Inter-Bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 50,
    left: 20,
    right: 20,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
