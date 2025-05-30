import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { Exercise as WorkoutExercise } from '@/types/workout';

export type Exercise = WorkoutExercise;

interface WorkoutCardProps {
  day: string;
  exercises: Exercise[];
  onEdit?: () => void;
}

export default function WorkoutCard({
  day,
  exercises,
  onEdit,
}: WorkoutCardProps) {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  return (
    <View
      style={[styles.container, { backgroundColor: isDark ? '#222' : '#fff' }]}
    >
      <View style={styles.header}>
        <Text style={[styles.day, { color: isDark ? '#fff' : '#333' }]}>
          {day}
        </Text>
        {onEdit && (
          <TouchableOpacity onPress={onEdit}>
            <Text
              style={[styles.edit, { color: isDark ? '#6D28D9' : '#4C1D95' }]}
            >
              Edit
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.exercises}>
        {exercises.map((exercise, index) => (
          <View
            key={index}
            style={[
              styles.exercise,
              { backgroundColor: isDark ? '#333' : '#f5f5f5' },
            ]}
          >
            <Text
              style={[styles.exerciseName, { color: isDark ? '#fff' : '#333' }]}
            >
              {exercise.name}
            </Text>
            <View style={styles.details}>
              <Text
                style={[styles.detail, { color: isDark ? '#bbb' : '#666' }]}
              >
                {exercise.sets} sets × {exercise.reps} reps
              </Text>
              {exercise.weight != null && (
                <Text
                  style={[styles.detail, { color: isDark ? '#bbb' : '#666' }]}
                >
                  Weight: {exercise.weight} kg
                </Text>
              )}
              {exercise.duration != null && (
                <Text
                  style={[styles.detail, { color: isDark ? '#bbb' : '#666' }]}
                >
                  Duration: {exercise.duration}
                </Text>
              )}
              {exercise.notes && (
                <Text
                  style={[styles.notes, { color: isDark ? '#bbb' : '#666' }]}
                >
                  {exercise.notes}
                </Text>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  day: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
  },
  edit: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  exercises: {
    gap: 8,
  },
  exercise: {
    padding: 12,
    borderRadius: 8,
  },
  exerciseName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    marginBottom: 4,
  },
  details: {
    gap: 4,
  },
  detail: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
  },
  notes: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    fontStyle: 'italic',
    marginTop: 4,
  },
});
