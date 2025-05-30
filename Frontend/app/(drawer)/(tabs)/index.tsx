// screens/HomeScreen.tsx

import React, { useEffect, useState, useRef } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableOpacity,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Pedometer } from 'expo-sensors';
import { AnimatedCircularProgress } from 'react-native-circular-progress';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Heart, Thermometer, X, ChevronRight } from 'lucide-react-native';

import Header from '@/components/ui/Header';
import MetricCard from '@/components/stats/MetricCard';
import { useTheme } from '@/context/ThemeContext';
import { useAppStore } from '@/store';
import { getHealthStats, getWorkoutPlan } from '@/services/health';

const STEP_GOAL = 10000;
const CALORIES_GOAL = 500;
const CAL_PER_STEP = 0.04;

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';
  const { width } = useWindowDimensions();

  // -- pedometer state --
  const [stepsToday, setStepsToday] = useState(0);
  const [caloriesToday, setCaloriesToday] = useState(0);
  const [pedoError, setPedoError] = useState<string | null>(null);
  const subscriptionRef = useRef<any>(null);

  // -- other app data --
  const { user, setWeeklyStats } = useAppStore();
  const [todayWorkout, setTodayWorkout] = useState<any[]>([]);
  const [showMoreWorkouts, setShowMoreWorkouts] = useState(false);
  const [heartRate, setHeartRate] = useState(72);
  const [temperature, setTemperature] = useState(36.6);

  // gauge size
  const gaugeSize = (width - 80) / 2;

  // percentages
  const stepPct = Math.min(Math.round((stepsToday / STEP_GOAL) * 100), 100);
  const calPct = Math.min(
    Math.round((caloriesToday / CALORIES_GOAL) * 100),
    100
  );

  // initialize pedometer on mount
  useEffect(() => {
    let cumulative = 0;

    const initPedometer = async () => {
      try {
        // iOS permission
        const { granted } = (Pedometer as any).requestPermissionsAsync
          ? await Pedometer.requestPermissionsAsync()
          : { granted: true };
        if (!granted) {
          setPedoError('Permission denied for motion data.');
          return;
        }

        // availability
        const available = await Pedometer.isAvailableAsync();
        if (!available) {
          setPedoError('Pedometer not available on this device.');
          return;
        }

        // get historical today’s steps
        const start = new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date();
        const { steps } = await Pedometer.getStepCountAsync(start, end);
        cumulative = steps;
        setStepsToday(cumulative);
        setCaloriesToday(Math.round(cumulative * CAL_PER_STEP));

        // subscribe to live updates
        subscriptionRef.current = Pedometer.watchStepCount(
          ({ steps: delta }) => {
            cumulative += delta;
            setStepsToday(cumulative);
            setCaloriesToday(Math.round(cumulative * CAL_PER_STEP));
          }
        );
      } catch (e) {
        console.error('Pedometer init error:', e);
        setPedoError('Failed to initialize pedometer.');
      }
    };

    initPedometer();
    return () => subscriptionRef.current?.remove();
  }, []);

  // fetch stats & plan
  useEffect(() => {
    if (!user?._id) return;
    Promise.all([
      getHealthStats(user._id, 7).catch(() => []),
      getWorkoutPlan(user._id).catch(() => ({ weekly_plan: {} })),
    ]).then(([stats, plan]) => {
      if (stats.length) setWeeklyStats(stats);
      const day = new Date().toLocaleDateString('en-US', {
        weekday: 'long',
      });
      setTodayWorkout(plan.weekly_plan?.[day] || []);
    });
  }, [user?._id]);

  const handleRetestHeart = () =>
    setHeartRate(Math.floor(Math.random() * 40) + 60);
  const handleRetestTemperature = () =>
    setTemperature(+(36 + Math.random() * 1).toFixed(1));

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: isDark ? '#111' : '#f5f5f5',
          paddingTop: insets.top,
        },
      ]}
    >
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + 32 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {pedoError && <Text style={styles.errorText}>{pedoError}</Text>}

        {/* gauges */}
        <View style={styles.gaugesContainer}>
          <GaugeCard
            title="Today's Steps"
            value={`${stepsToday} / ${STEP_GOAL}`}
            percent={stepPct}
            tint="#7C3AED"
            bg={isDark ? '#333' : '#DDD6FE'}
            size={gaugeSize}
            isDark={isDark}
          />
          <GaugeCard
            title="Today's Calories"
            value={`${caloriesToday} / ${CALORIES_GOAL}`}
            percent={calPct}
            tint="#EC4899"
            bg={isDark ? '#333' : '#FBCFE8'}
            size={gaugeSize}
            isDark={isDark}
          />
        </View>

        {/* vital signs */}
        <SectionCard isDark={isDark} title="Vital Signs">
          <View style={styles.vitalsGrid}>
            <MetricCard
              icon={<Heart size={24} color="#4C1D95" />}
              label="Heart Rate"
              value={`${heartRate} bpm`}
            />
            <MetricCard
              icon={<Thermometer size={24} color="#4C1D95" />}
              label="Temperature"
              value={`${temperature} °C`}
            />
          </View>
          <View style={styles.retestButtons}>
            <TouchableOpacity
              style={[
                styles.retestButton,
                { backgroundColor: isDark ? '#333' : '#E0E0E0' },
              ]}
              onPress={handleRetestHeart}
            >
              <Text
                style={[styles.retestText, { color: isDark ? '#fff' : '#000' }]}
              >
                Retest Heart Rate
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.retestButton,
                { backgroundColor: isDark ? '#333' : '#E0E0E0' },
              ]}
              onPress={handleRetestTemperature}
            >
              <Text
                style={[styles.retestText, { color: isDark ? '#fff' : '#000' }]}
              >
                Retest Temperature
              </Text>
            </TouchableOpacity>
          </View>
        </SectionCard>

        {/* today's workout */}
        <SectionCard isDark={isDark} title="Today's Workout">
          {todayWorkout.length ? (
            <>
              <View style={styles.workoutList}>
                {todayWorkout.slice(0, 3).map((ex, i) => (
                  <WorkoutItem key={i} isDark={isDark} {...ex} />
                ))}
              </View>
              {todayWorkout.length > 3 && (
                <TouchableOpacity
                  style={styles.moreButton}
                  onPress={() => setShowMoreWorkouts(true)}
                >
                  <Text style={styles.moreButtonText}>View More Exercises</Text>
                  <ChevronRight size={20} color="#4C1D95" />
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text
              style={[styles.noWorkout, { color: isDark ? '#bbb' : '#666' }]}
            >
              No workout scheduled
            </Text>
          )}
        </SectionCard>
      </ScrollView>

      {/* workout modal */}
      <Modal visible={showMoreWorkouts} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? '#1a1a1a' : '#fff' },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text
                style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}
              >
                Today's Workout Plan
              </Text>
              <TouchableOpacity onPress={() => setShowMoreWorkouts(false)}>
                <X size={24} color={isDark ? '#fff' : '#000'} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {todayWorkout.map((ex, i) => (
                <WorkoutItem key={i} isDark={isDark} modal {...ex} />
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function GaugeCard({ title, value, percent, tint, bg, size, isDark }: any) {
  return (
    <View
      style={[
        styles.gaugeWrapper,
        {
          width: size + 24,
          backgroundColor: `${isDark ? '#222' : '#fff'}CC`,
        },
      ]}
    >
      <Text style={[styles.gaugeTitle, { color: isDark ? '#fff' : '#000' }]}>
        {title}
      </Text>
      <AnimatedCircularProgress
        size={size}
        width={12}
        fill={percent}
        tintColor={tint}
        backgroundColor={bg}
        rotation={0}
        duration={700}
        lineCap="round"
      >
        {() => (
          <Text
            style={[styles.gaugeCenter, { color: isDark ? '#fff' : '#000' }]}
          >
            {percent}%
          </Text>
        )}
      </AnimatedCircularProgress>
      <Text style={[styles.gaugeValue, { color: isDark ? '#fff' : '#000' }]}>
        {value}
      </Text>
    </View>
  );
}

function SectionCard({ children, isDark, title }: any) {
  return (
    <View
      style={[
        styles.section,
        { backgroundColor: `${isDark ? '#222' : '#fff'}CC` },
      ]}
    >
      <Text style={[styles.sectionTitle, { color: isDark ? '#fff' : '#000' }]}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function WorkoutItem({ exercise, sets, reps, isDark, modal }: any) {
  return (
    <View
      style={[
        modal ? styles.modalExerciseItem : styles.exerciseItem,
        modal && { borderBottomColor: isDark ? '#333' : 'rgba(0,0,0,0.1)' },
      ]}
    >
      <Text style={[styles.exerciseName, { color: isDark ? '#fff' : '#000' }]}>
        {exercise}
      </Text>
      <Text
        style={[styles.exerciseDetails, { color: isDark ? '#bbb' : '#666' }]}
      >
        {sets} sets × {reps} reps
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  content: { padding: 16 },

  errorText: { color: 'red', textAlign: 'center', marginBottom: 12 },

  gaugesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  gaugeWrapper: {
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
  },
  gaugeTitle: { fontSize: 16, fontWeight: '600', marginBottom: 8 },
  gaugeCenter: { fontSize: 18, fontWeight: '700' },
  gaugeValue: { fontSize: 14, fontWeight: '500', marginTop: 8 },

  section: {
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 16 },

  vitalsGrid: { flexDirection: 'row', justifyContent: 'space-between' },

  retestButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 12,
  },
  retestButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  retestText: { fontSize: 14, fontWeight: '500' },

  workoutList: { marginTop: 8 },
  exerciseItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  exerciseName: { fontSize: 16, fontWeight: '600' },
  exerciseDetails: { fontSize: 14, marginTop: 4 },
  moreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    marginTop: 8,
  },
  moreButtonText: { color: '#4C1D95', fontSize: 14, fontWeight: '500' },
  noWorkout: { textAlign: 'center', fontSize: 16, marginVertical: 16 },

  /* modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: '600' },
  modalScroll: { maxHeight: '100%' },
  modalExerciseItem: { paddingVertical: 12, borderBottomWidth: 1 },
});
