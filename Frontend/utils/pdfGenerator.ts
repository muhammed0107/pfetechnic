import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { WorkoutPlan } from '@/types/workout';
import { PDFDocument, PDFPage, rgb } from 'pdf-lib';

export async function generateWorkoutPlanPDF(plan: any) {
  try {
    if (Platform.OS === 'web') {
      // For web platform, create a simple text file
      let content = 'Your Workout Plan\n\n';
      content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

      if (plan.weekly_plan) {
        Object.entries(plan.weekly_plan).forEach(
          ([day, exercises]: [string, any]) => {
            content += `${day}\n`;
            content += '='.repeat(day.length) + '\n\n';

            exercises.forEach((exercise: any) => {
              content += `${exercise.exercise}\n`;
              content += `Sets: ${exercise.sets}\n`;
              content += `Reps: ${exercise.reps}\n`;
              if (exercise.weight) content += `Weight: ${exercise.weight}\n`;
              if (exercise.duration)
                content += `Duration: ${exercise.duration}\n`;
              if (exercise.notes) content += `Notes: ${exercise.notes}\n`;
              content += '\n';
            });
            content += '\n';
          }
        );
      }

      // Create and download the file
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workout-plan-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } else {
      // For native platforms, use expo-file-system and expo-sharing
      const fileName = `workout-plan-${
        new Date().toISOString().split('T')[0]
      }.txt`;
      const filePath = `${FileSystem.cacheDirectory}${fileName}`;

      let content = 'Your Workout Plan\n\n';
      content += `Generated on: ${new Date().toLocaleDateString()}\n\n`;

      if (plan.weekly_plan) {
        Object.entries(plan.weekly_plan).forEach(
          ([day, exercises]: [string, any]) => {
            content += `${day}\n`;
            content += '='.repeat(day.length) + '\n\n';

            exercises.forEach((exercise: any) => {
              content += `${exercise.exercise}\n`;
              content += `Sets: ${exercise.sets}\n`;
              content += `Reps: ${exercise.reps}\n`;
              if (exercise.weight) content += `Weight: ${exercise.weight}\n`;
              if (exercise.duration)
                content += `Duration: ${exercise.duration}\n`;
              if (exercise.notes) content += `Notes: ${exercise.notes}\n`;
              content += '\n';
            });
            content += '\n';
          }
        );
      }

      // Write the content to a file
      await FileSystem.writeAsStringAsync(filePath, content);

      // Share the file
      if (Platform.OS === 'ios') {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/plain',
          dialogTitle: 'Download Workout Plan',
        });
      } else {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/plain',
          dialogTitle: 'Download Workout Plan',
          UTI: 'public.text',
        });
      }
      return true;
    }
  } catch (error) {
    console.error('Error generating workout plan:', error);
    throw new Error('Failed to generate workout plan');
  }
}
