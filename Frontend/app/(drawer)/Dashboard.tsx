import { StyleSheet } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export default function Dashboard() {
  const { actualTheme } = useTheme();
  const isDark = actualTheme === 'dark';

  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      ...StyleSheet.absoluteFillObject,
      opacity: 0.5,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    content: {
      padding: 16,
      paddingBottom: 32,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 20,
    },
    welcomeText: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: isDark ? '#fff' : '#333',
    },
    dateText: {
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: isDark ? '#bbb' : '#666',
    },
    statsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginBottom: 20,
    },
    statCard: {
      flex: 1,
      minWidth: '45%',
      padding: 16,
      borderRadius: 12,
      backgroundColor: isDark
        ? 'rgba(34,34,34,0.95)'
        : 'rgba(255,255,255,0.95)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    statTitle: {
      fontSize: 14,
      fontFamily: 'Inter-Medium',
      color: isDark ? '#bbb' : '#666',
      marginBottom: 8,
    },
    statValue: {
      fontSize: 24,
      fontFamily: 'Inter-Bold',
      color: isDark ? '#fff' : '#333',
    },
    chartCard: {
      padding: 16,
      borderRadius: 12,
      marginBottom: 20,
      backgroundColor: isDark
        ? 'rgba(34,34,34,0.95)'
        : 'rgba(255,255,255,0.95)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    chartTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: isDark ? '#fff' : '#333',
      marginBottom: 16,
    },
    chartContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
      width: '100%',
    },
    chartWrapper: {
      width: '100%',
      aspectRatio: 1,
      maxWidth: 300,
      alignSelf: 'center',
    },
    recentActivity: {
      padding: 16,
      borderRadius: 12,
      backgroundColor: isDark
        ? 'rgba(34,34,34,0.95)'
        : 'rgba(255,255,255,0.95)',
      borderWidth: 1,
      borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    activityTitle: {
      fontSize: 18,
      fontFamily: 'Inter-SemiBold',
      color: isDark ? '#fff' : '#333',
      marginBottom: 16,
    },
    activityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      borderBottomWidth: 1,
      borderBottomColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
    },
    activityIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    activityText: {
      flex: 1,
      fontSize: 14,
      fontFamily: 'Inter-Regular',
      color: isDark ? '#bbb' : '#666',
    },
    activityTime: {
      fontSize: 12,
      fontFamily: 'Inter-Regular',
      color: isDark ? '#888' : '#999',
    },
  });

  // ... rest of the component code
}
