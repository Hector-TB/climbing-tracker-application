import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import Card from '../components/Card';
import Button from '../components/Button';
import PhaseIndicator from '../components/PhaseIndicator';
import { getUserProgress, getWorkoutStats } from '../services/storage';
import { getWorkoutForWeek, getPhaseInfo, weeklySchedule } from '../data/trainingPlan';
import { format, startOfWeek, addDays } from 'date-fns';

const HomeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [stats, setStats] = useState({ totalWorkouts: 0, completedWorkouts: 0, completionRate: 0 });
  const [refreshing, setRefreshing] = useState(false);
  const [todayWorkout, setTodayWorkout] = useState<any>(null);

  const loadData = async () => {
    const progress = await getUserProgress();
    const workoutStats = await getWorkoutStats();
    setCurrentWeek(progress.currentWeek);
    setStats(workoutStats);

    // Get today's workout
    const today = new Date();
    const dayName = format(today, 'EEEE') as any;
    const workout = getWorkoutForWeek(progress.currentWeek, dayName);
    setTodayWorkout({ ...workout, date: format(today, 'yyyy-MM-dd') });
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const { phase, isDeload } = getPhaseInfo(currentWeek);

  const navigateToWorkout = (day: string, offset: number = 0) => {
    const today = new Date();
    const targetDate = addDays(today, offset);
    navigation.navigate('Workout', {
      date: format(targetDate, 'yyyy-MM-dd'),
      day,
      weekNumber: currentWeek,
    });
  };

  const renderWeeklySchedule = () => {
    const today = format(new Date(), 'EEEE');
    const startDate = startOfWeek(new Date(), { weekStartsOn: 1 }); // Monday

    return (
      <View style={styles.scheduleContainer}>
        {weeklySchedule.map((day, index) => {
          const isToday = day === today;
          const workout = getWorkoutForWeek(currentWeek, day);
          const dayDate = addDays(startDate, index);

          return (
            <TouchableOpacity
              key={day}
              style={[
                styles.scheduleDay,
                isToday && styles.scheduleDayToday,
              ]}
              onPress={() => navigateToWorkout(day, index - weeklySchedule.indexOf(today))}
              activeOpacity={0.7}
            >
              <Text
                style={[styles.scheduleDayName, isToday && styles.scheduleDayNameToday]}
                numberOfLines={1}
              >
                {day.substring(0, 3)}
              </Text>
              <View style={[styles.scheduleDayCircle, isToday && styles.scheduleDayCircleToday]}>
                <Text style={[styles.scheduleDayDate, isToday && styles.scheduleDayDateToday]}>
                  {format(dayDate, 'd')}
                </Text>
              </View>
              <Text style={styles.scheduleWorkoutTitle} numberOfLines={1}>
                {workout.title.split(' ')[0]}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />
      }
    >
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back, Hector!</Text>
        <Text style={styles.subtitle}>V5 → V7 Progression Plan</Text>
      </View>

      <PhaseIndicator phase={phase} weekNumber={currentWeek} isDeload={isDeload} />

      {isDeload && (
        <Card gradient gradientColors={[colors.warning, '#F5D845']}>
          <View style={styles.deloadAlert}>
            <Ionicons name="alert-circle" size={24} color={colors.white} />
            <View style={styles.deloadTextContainer}>
              <Text style={styles.deloadTitle}>Deload Week</Text>
              <Text style={styles.deloadText}>
                Reduce volume to 50-60%. Focus on recovery and technique.
              </Text>
            </View>
          </View>
        </Card>
      )}

      <Card>
        <View style={styles.statsHeader}>
          <Text style={styles.cardTitle}>Your Progress</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Progress')}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{stats.completedWorkouts}</Text>
            <Text style={styles.statLabel}>Workouts</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{Math.round(stats.completionRate)}%</Text>
            <Text style={styles.statLabel}>Completion</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{currentWeek}/12</Text>
            <Text style={styles.statLabel}>Weeks</Text>
          </View>
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>This Week's Schedule</Text>
        {renderWeeklySchedule()}
      </Card>

      {todayWorkout && (
        <Card gradient gradientColors={colors.gradient.primary}>
          <Text style={styles.todayTitle}>Today's Workout</Text>
          <Text style={styles.todayWorkoutName}>{todayWorkout.title}</Text>
          <Text style={styles.todayFocus}>{todayWorkout.focus}</Text>
          <View style={styles.todayInfo}>
            <View style={styles.todayInfoItem}>
              <Ionicons name="time-outline" size={20} color={colors.white} />
              <Text style={styles.todayInfoText}>{todayWorkout.duration}</Text>
            </View>
            <View style={styles.todayInfoItem}>
              <Ionicons name="flame-outline" size={20} color={colors.white} />
              <Text style={styles.todayInfoText}>
                {todayWorkout.sections.length} sections
              </Text>
            </View>
          </View>
          <Button
            title="Start Workout"
            onPress={() =>
              navigateToWorkout(todayWorkout.day, 0)
            }
            variant="secondary"
            style={styles.startButton}
          />
        </Card>
      )}

      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Logs')}
        >
          <Ionicons name="create" size={24} color={colors.primary} />
          <Text style={styles.actionButtonText}>Log Metrics</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('Plan')}
        >
          <Ionicons name="calendar" size={24} color={colors.secondary} />
          <Text style={styles.actionButtonText}>View Plan</Text>
        </TouchableOpacity>
      </View>
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    marginVertical: spacing.lg,
  },
  greeting: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
  },
  deloadAlert: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deloadTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  deloadTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  deloadText: {
    fontSize: fontSize.sm,
    color: colors.white,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  seeAllText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    fontWeight: fontWeight.semibold,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.backgroundLight,
  },
  statValue: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  scheduleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  scheduleDay: {
    alignItems: 'center',
    padding: spacing.xs,
    borderRadius: borderRadius.md,
    flex: 1,
    marginHorizontal: 1,
  },
  scheduleDayToday: {
    backgroundColor: colors.backgroundLight,
  },
  scheduleDayName: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
  },
  scheduleDayNameToday: {
    color: colors.primary,
    fontWeight: fontWeight.bold,
  },
  scheduleDayCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  scheduleDayCircleToday: {
    backgroundColor: colors.primary,
  },
  scheduleDayDate: {
    fontSize: fontSize.sm,
    color: colors.text,
    fontWeight: fontWeight.semibold,
  },
  scheduleDayDateToday: {
    color: colors.white,
  },
  scheduleWorkoutTitle: {
    fontSize: 10,
    color: colors.textMuted,
    textAlign: 'center',
  },
  todayTitle: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  todayWorkoutName: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  todayFocus: {
    fontSize: fontSize.md,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  todayInfo: {
    flexDirection: 'row',
    marginBottom: spacing.lg,
  },
  todayInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  todayInfoText: {
    fontSize: fontSize.sm,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  startButton: {
    marginTop: spacing.sm,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
    backgroundColor: colors.backgroundCard,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    marginHorizontal: spacing.xs,
  },
  actionButtonText: {
    fontSize: fontSize.sm,
    color: colors.text,
    marginTop: spacing.sm,
    fontWeight: fontWeight.medium,
  },
});

export default HomeScreen;
