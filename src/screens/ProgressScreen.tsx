import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import Card from '../components/Card';
import { getUserProgress } from '../services/storage';
import { format, subDays, parseISO } from 'date-fns';

const screenWidth = Dimensions.get('window').width - spacing.md * 2;

const ProgressScreen: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<'elbow' | 'grip' | 'recovery'>('elbow');
  const [elbowPainData, setElbowPainData] = useState<number[]>([]);
  const [gripStrengthData, setGripStrengthData] = useState<number[]>([]);
  const [recoveryScoreData, setRecoveryScoreData] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [weeklyStats, setWeeklyStats] = useState({
    workoutsCompleted: 0,
    totalWorkouts: 0,
    avgElbowPain: 0,
    avgRecovery: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadProgressData();
    }, [])
  );

  const loadProgressData = async () => {
    const progress = await getUserProgress();

    // Get last 7 days of data
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = subDays(new Date(), 6 - i);
      return format(date, 'yyyy-MM-dd');
    });

    const dateLabels = last7Days.map(date => format(parseISO(date), 'MMM d'));
    setLabels(dateLabels);

    // Process elbow pain data
    const elbowData = last7Days.map(date => {
      const metrics = progress.dailyMetrics.find(m => m.date === date);
      if (metrics) {
        const avg =
          ((metrics.elbowPainWarmup || 0) +
            (metrics.elbowPainClimbing || 0) +
            (metrics.elbowPainLockoffs || 0) +
            (metrics.elbowPainPostSession || 0)) /
          4;
        return Math.round(avg);
      }
      return 0;
    });
    setElbowPainData(elbowData);

    // Process grip strength data
    const gripData = last7Days.map(date => {
      const metrics = progress.dailyMetrics.find(m => m.date === date);
      return metrics?.gripStrength || 0;
    });
    setGripStrengthData(gripData);

    // Process recovery score data
    const recoveryData = last7Days.map(date => {
      const metrics = progress.dailyMetrics.find(m => m.date === date);
      if (metrics) {
        return (
          (metrics.muscleSoreness || 0) +
          (metrics.energyLevel || 0) +
          (metrics.sleepQuality || 0) +
          (metrics.motivation || 0)
        );
      }
      return 0;
    });
    setRecoveryScoreData(recoveryData);

    // Calculate weekly stats
    const thisWeekWorkouts = progress.workoutLogs.filter(log => {
      const logDate = parseISO(log.date);
      const weekStart = subDays(new Date(), 7);
      return logDate >= weekStart;
    });

    const completedWorkouts = thisWeekWorkouts.filter(log => log.completed).length;
    const avgElbow = elbowData.filter(d => d > 0).reduce((a, b) => a + b, 0) / (elbowData.filter(d => d > 0).length || 1);
    const avgRecov = recoveryData.filter(d => d > 0).reduce((a, b) => a + b, 0) / (recoveryData.filter(d => d > 0).length || 1);

    setWeeklyStats({
      workoutsCompleted: completedWorkouts,
      totalWorkouts: thisWeekWorkouts.length,
      avgElbowPain: Math.round(avgElbow),
      avgRecovery: Math.round(avgRecov),
    });
  };

  const chartConfig = {
    backgroundColor: colors.backgroundCard,
    backgroundGradientFrom: colors.backgroundCard,
    backgroundGradientTo: colors.backgroundLight,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 107, 53, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(184, 184, 208, ${opacity})`,
    style: {
      borderRadius: borderRadius.lg,
    },
    propsForDots: {
      r: '6',
      strokeWidth: '2',
      stroke: colors.primary,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: colors.background,
      strokeWidth: 1,
    },
  };

  const renderChart = () => {
    let data: number[] = [];
    let title = '';
    let yAxisSuffix = '';
    let chartColor = colors.primary;

    switch (selectedMetric) {
      case 'elbow':
        data = elbowPainData;
        title = 'Elbow Pain Trend';
        yAxisSuffix = '/10';
        chartColor = colors.warning;
        break;
      case 'grip':
        data = gripStrengthData;
        title = 'Grip Strength Trend';
        yAxisSuffix = '';
        chartColor = colors.secondary;
        break;
      case 'recovery':
        data = recoveryScoreData;
        title = 'Recovery Score Trend';
        yAxisSuffix = '/20';
        chartColor = colors.primary;
        break;
    }

    const hasData = data.some(value => value > 0);

    if (!hasData) {
      return (
        <View style={styles.noDataContainer}>
          <Ionicons name="analytics-outline" size={48} color={colors.textMuted} />
          <Text style={styles.noDataText}>No data recorded yet</Text>
          <Text style={styles.noDataSubtext}>Start logging your daily metrics to see trends</Text>
        </View>
      );
    }

    return (
      <LineChart
        data={{
          labels: labels.length > 0 ? labels : [''],
          datasets: [
            {
              data: data.length > 0 ? data : [0],
            },
          ],
        }}
        width={screenWidth - spacing.lg * 2}
        height={220}
        yAxisSuffix={yAxisSuffix}
        chartConfig={{
          ...chartConfig,
          color: (opacity = 1) => `rgba(${chartColor === colors.warning ? '255, 230, 109' : chartColor === colors.secondary ? '78, 205, 196' : '255, 107, 53'}, ${opacity})`,
        }}
        bezier
        style={styles.chart}
      />
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Progress Tracking</Text>
        <Text style={styles.headerSubtitle}>Last 7 Days</Text>
      </View>

      <Card>
        <Text style={styles.cardTitle}>Weekly Summary</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Ionicons name="checkmark-circle" size={32} color={colors.success} />
            <Text style={styles.statValue}>
              {weeklyStats.workoutsCompleted}/{weeklyStats.totalWorkouts}
            </Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons
              name="pulse"
              size={32}
              color={weeklyStats.avgElbowPain >= 6 ? colors.error : colors.warning}
            />
            <Text
              style={[
                styles.statValue,
                weeklyStats.avgElbowPain >= 6 && styles.statValueDanger,
              ]}
            >
              {weeklyStats.avgElbowPain}/10
            </Text>
            <Text style={styles.statLabel}>Avg Elbow Pain</Text>
          </View>
          <View style={styles.statBox}>
            <Ionicons name="fitness" size={32} color={colors.primary} />
            <Text style={styles.statValue}>{weeklyStats.avgRecovery}/20</Text>
            <Text style={styles.statLabel}>Avg Recovery</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Metric Trends</Text>
        <View style={styles.metricSelector}>
          <TouchableOpacity
            style={[
              styles.metricButton,
              selectedMetric === 'elbow' && styles.metricButtonActive,
            ]}
            onPress={() => setSelectedMetric('elbow')}
          >
            <Ionicons
              name="pulse"
              size={20}
              color={selectedMetric === 'elbow' ? colors.white : colors.textMuted}
            />
            <Text
              style={[
                styles.metricButtonText,
                selectedMetric === 'elbow' && styles.metricButtonTextActive,
              ]}
            >
              Elbow Pain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricButton,
              selectedMetric === 'grip' && styles.metricButtonActive,
            ]}
            onPress={() => setSelectedMetric('grip')}
          >
            <Ionicons
              name="hand-left"
              size={20}
              color={selectedMetric === 'grip' ? colors.white : colors.textMuted}
            />
            <Text
              style={[
                styles.metricButtonText,
                selectedMetric === 'grip' && styles.metricButtonTextActive,
              ]}
            >
              Grip Strength
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.metricButton,
              selectedMetric === 'recovery' && styles.metricButtonActive,
            ]}
            onPress={() => setSelectedMetric('recovery')}
          >
            <Ionicons
              name="fitness"
              size={20}
              color={selectedMetric === 'recovery' ? colors.white : colors.textMuted}
            />
            <Text
              style={[
                styles.metricButtonText,
                selectedMetric === 'recovery' && styles.metricButtonTextActive,
              ]}
            >
              Recovery
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.chartContainer}>{renderChart()}</View>
      </Card>

      <Card gradient gradientColors={colors.gradient.purple}>
        <View style={styles.insightContainer}>
          <Ionicons name="bulb" size={32} color={colors.white} />
          <View style={styles.insightTextContainer}>
            <Text style={styles.insightTitle}>Training Insights</Text>
            <Text style={styles.insightText}>
              {weeklyStats.avgElbowPain >= 6
                ? '⚠️ High average elbow pain this week. Consider extra rest and antagonist work.'
                : weeklyStats.avgElbowPain >= 4
                ? '⚡ Moderate elbow strain. Focus on form and ensure full antagonist sessions.'
                : '✓ Elbow health is good! Keep up the antagonist training.'}
            </Text>
            <Text style={styles.insightText}>
              {weeklyStats.avgRecovery < 12
                ? '⚠️ Low recovery scores. Prioritize sleep and nutrition.'
                : weeklyStats.avgRecovery < 15
                ? '⚡ Moderate recovery. Monitor workload and stress levels.'
                : '✓ Excellent recovery! Your body is adapting well.'}
            </Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.tipsHeader}>
          <Ionicons name="information-circle" size={24} color={colors.info} />
          <Text style={styles.tipsTitle}>Tracking Tips</Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Log metrics consistently every day for accurate trend analysis
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            If grip strength drops 15%+ from baseline, use low-energy variants
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Average elbow pain above 4/10 requires immediate attention
          </Text>
        </View>
        <View style={styles.tipItem}>
          <Text style={styles.tipBullet}>•</Text>
          <Text style={styles.tipText}>
            Recovery score below 15/20 for 2+ weeks suggests need for deload
          </Text>
        </View>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    marginHorizontal: spacing.xs,
  },
  statValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  statValueDanger: {
    color: colors.error,
  },
  statLabel: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  metricSelector: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  metricButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  metricButtonActive: {
    backgroundColor: colors.primary,
  },
  metricButtonText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
  metricButtonTextActive: {
    color: colors.white,
    fontWeight: fontWeight.semibold,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chart: {
    marginVertical: spacing.sm,
    borderRadius: borderRadius.lg,
  },
  noDataContainer: {
    alignItems: 'center',
    paddingVertical: spacing.xxl,
  },
  noDataText: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  noDataSubtext: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
    textAlign: 'center',
  },
  insightContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  insightTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  insightTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  insightText: {
    fontSize: fontSize.sm,
    color: colors.white,
    lineHeight: 20,
    marginBottom: spacing.sm,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  tipsTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  tipItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  tipBullet: {
    fontSize: fontSize.md,
    color: colors.info,
    marginRight: spacing.sm,
  },
  tipText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },
});

export default ProgressScreen;
