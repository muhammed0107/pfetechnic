import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useStepTracker } from '@/hooks/useStepTracker';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/theme/colors';
import { LinearGradient } from 'expo-linear-gradient';

export const StepTracker = () => {
  const { steps, calories, isTracking, error, startTracking } =
    useStepTracker();

  useEffect(() => {
    startTracking();
  }, []);

  return (
    <LinearGradient
      colors={[colors.primary, colors.secondary]}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <MaterialCommunityIcons name="walk" size={24} color={colors.white} />
          <Text style={styles.title}>Today's Activity</Text>
        </View>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {typeof steps === 'number' ? steps.toLocaleString() : '0'}
              </Text>
              <Text style={styles.statLabel}>Steps</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {typeof calories === 'number' ? calories.toLocaleString() : '0'}
              </Text>
              <Text style={styles.statLabel}>Calories</Text>
            </View>
          </View>
        )}

        {!error && !isTracking && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator color={colors.white} />
            <Text style={styles.loadingText}>Starting step tracking...</Text>
          </View>
        )}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    margin: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.white,
    marginLeft: 8,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 8,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.white,
  },
  statLabel: {
    fontSize: 14,
    color: colors.white,
    opacity: 0.8,
    marginTop: 4,
  },
  errorContainer: {
    padding: 16,
    backgroundColor: colors.error,
    borderRadius: 8,
    marginTop: 8,
  },
  errorText: {
    color: colors.white,
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  loadingText: {
    color: colors.white,
    marginLeft: 8,
  },
});
