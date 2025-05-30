import { useState, useEffect, useRef } from 'react';
import { Pedometer } from 'expo-sensors';
import { updateStats } from '@/services/stats';
import { useAppStore } from '@/store';

export const useStepTracker = () => {
  const { user } = useAppStore();

  const [isPedometerAvailable, setIsPedometerAvailable] = useState(false);
  const [stepCount, setStepCount] = useState(0);
  const [calories, setCalories] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subscriptionRef = useRef<any>(null);

  const calculateCalories = (steps: number) => {
    return Math.round(steps * 0.04); // Rough estimate
  };

  const startTracking = async () => {
    try {
      const isAvailable = await Pedometer.isAvailableAsync();
      setIsPedometerAvailable(isAvailable);

      if (!isAvailable) {
        setError('Pedometer is not available on this device');
        return;
      }

      setIsTracking(true);

      subscriptionRef.current = Pedometer.watchStepCount((result) => {
        setStepCount(result.steps);
        const newCalories = calculateCalories(result.steps);
        setCalories(newCalories);

        // Optional: update backend
        if (user?._id) {
          updateStats(
            user._id,
            new Date().toISOString(),
            result.steps,
            newCalories
          ).catch((err) => {
            console.error('Error updating stats:', err);
          });
        }
      });
    } catch (err) {
      setError('Failed to access pedometer');
      console.error('Pedometer error:', err);
    }
  };

  const stopTracking = () => {
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
      setIsTracking(false);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    stepCount,
    calories,
    isTracking,
    error,
    isPedometerAvailable,
    startTracking,
    stopTracking,
  };
};
