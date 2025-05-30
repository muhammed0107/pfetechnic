import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { DailyStats } from '@/services/stats';
import { colors } from '@/theme/colors';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ActivityHistoryProps {
  stats: DailyStats[];
}

export const ActivityHistory = ({ stats }: ActivityHistoryProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
    });
  };

  const chartData = {
    labels: stats.map((stat) => formatDate(stat.date)),
    datasets: [
      {
        data: stats.map((stat) => stat.steps),
        color: (opacity = 1) => colors.primary,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: colors.white,
    backgroundGradientFrom: colors.white,
    backgroundGradientTo: colors.white,
    decimalPlaces: 0,
    color: (opacity = 1) => colors.gray,
    labelColor: (opacity = 1) => colors.black,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <MaterialCommunityIcons
          name="chart-line"
          size={24}
          color={colors.primary}
        />
        <Text style={styles.title}>Activity History</Text>
      </View>

      <View style={styles.chartContainer}>
        <LineChart
          data={chartData}
          width={Dimensions.get('window').width - 32}
          height={220}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.date}>{formatDate(stat.date)}</Text>
            <Text style={styles.steps}>{stat.steps.toLocaleString()}</Text>
            <Text style={styles.calories}>
              {stat.caloriesBurned.toLocaleString()} cal
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.black,
    marginLeft: 8,
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
  statsContainer: {
    marginTop: 16,
  },
  statItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  date: {
    fontSize: 14,
    color: colors.gray,
    width: 60,
  },
  steps: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  calories: {
    fontSize: 14,
    color: colors.gray,
  },
});
