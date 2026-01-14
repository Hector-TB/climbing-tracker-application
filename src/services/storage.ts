import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  UserProgress,
  WorkoutLog,
  DailyMetrics,
  ClimbingMetrics,
  MonthlyBenchmark,
} from '../types';

const STORAGE_KEYS = {
  USER_PROGRESS: '@climbing_tracker:user_progress',
  CURRENT_WEEK: '@climbing_tracker:current_week',
  START_DATE: '@climbing_tracker:start_date',
  CLIMBING_PROGRESS: '@climbing_tracker:climbing_progress',
};

export interface ClimbingProgress {
  highestFlash: string;
  highestAchieved: string;
  highestAttempted: string;
}

// Initialize default user progress
const getDefaultProgress = (): UserProgress => ({
  currentWeek: 1,
  startDate: '2026-01-19T00:00:00.000Z',
  workoutLogs: [],
  dailyMetrics: [],
  climbingMetrics: [],
  monthlyBenchmarks: [],
});

// Get user progress
export const getUserProgress = async (): Promise<UserProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.USER_PROGRESS);
    if (data) {
      return JSON.parse(data);
    }
    const defaultProgress = getDefaultProgress();
    await saveUserProgress(defaultProgress);
    return defaultProgress;
  } catch (error) {
    console.error('Error loading user progress:', error);
    return getDefaultProgress();
  }
};

// Save user progress
export const saveUserProgress = async (progress: UserProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving user progress:', error);
  }
};

// Update current week
export const updateCurrentWeek = async (weekNumber: number): Promise<void> => {
  try {
    const progress = await getUserProgress();
    progress.currentWeek = weekNumber;
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error updating current week:', error);
  }
};

// Add workout log
export const addWorkoutLog = async (log: WorkoutLog): Promise<void> => {
  try {
    const progress = await getUserProgress();
    const existingIndex = progress.workoutLogs.findIndex(
      (l) => l.date === log.date && l.day === log.day
    );
    if (existingIndex >= 0) {
      progress.workoutLogs[existingIndex] = log;
    } else {
      progress.workoutLogs.push(log);
    }
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error adding workout log:', error);
  }
};

// Get workout log for specific date and day
export const getWorkoutLog = async (date: string, day: string): Promise<WorkoutLog | null> => {
  try {
    const progress = await getUserProgress();
    return progress.workoutLogs.find((log) => log.date === date && log.day === day) || null;
  } catch (error) {
    console.error('Error getting workout log:', error);
    return null;
  }
};

// Add daily metrics
export const addDailyMetrics = async (metrics: DailyMetrics): Promise<void> => {
  try {
    const progress = await getUserProgress();
    const existingIndex = progress.dailyMetrics.findIndex((m) => m.date === metrics.date);
    if (existingIndex >= 0) {
      progress.dailyMetrics[existingIndex] = metrics;
    } else {
      progress.dailyMetrics.push(metrics);
    }
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error adding daily metrics:', error);
  }
};

// Get daily metrics for date
export const getDailyMetrics = async (date: string): Promise<DailyMetrics | null> => {
  try {
    const progress = await getUserProgress();
    return progress.dailyMetrics.find((m) => m.date === date) || null;
  } catch (error) {
    console.error('Error getting daily metrics:', error);
    return null;
  }
};

// Add climbing metrics
export const addClimbingMetrics = async (metrics: ClimbingMetrics): Promise<void> => {
  try {
    const progress = await getUserProgress();
    const existingIndex = progress.climbingMetrics.findIndex((m) => m.date === metrics.date);
    if (existingIndex >= 0) {
      progress.climbingMetrics[existingIndex] = metrics;
    } else {
      progress.climbingMetrics.push(metrics);
    }
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error adding climbing metrics:', error);
  }
};

// Add monthly benchmark
export const addMonthlyBenchmark = async (benchmark: MonthlyBenchmark): Promise<void> => {
  try {
    const progress = await getUserProgress();
    const existingIndex = progress.monthlyBenchmarks.findIndex((b) => b.month === benchmark.month);
    if (existingIndex >= 0) {
      progress.monthlyBenchmarks[existingIndex] = benchmark;
    } else {
      progress.monthlyBenchmarks.push(benchmark);
    }
    await saveUserProgress(progress);
  } catch (error) {
    console.error('Error adding monthly benchmark:', error);
  }
};

// Get metrics for date range
export const getMetricsInRange = async (
  startDate: string,
  endDate: string
): Promise<DailyMetrics[]> => {
  try {
    const progress = await getUserProgress();
    return progress.dailyMetrics.filter((m) => m.date >= startDate && m.date <= endDate);
  } catch (error) {
    console.error('Error getting metrics in range:', error);
    return [];
  }
};

// Clear all data (useful for testing)
export const clearAllData = async (): Promise<void> => {
  try {
    await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  } catch (error) {
    console.error('Error clearing data:', error);
  }
};

// Get workout completion stats
export const getWorkoutStats = async (): Promise<{
  totalWorkouts: number;
  completedWorkouts: number;
  completionRate: number;
}> => {
  try {
    const progress = await getUserProgress();
    const total = progress.workoutLogs.length;
    const completed = progress.workoutLogs.filter((log) => log.completed).length;
    return {
      totalWorkouts: total,
      completedWorkouts: completed,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
    };
  } catch (error) {
    console.error('Error getting workout stats:', error);
    return { totalWorkouts: 0, completedWorkouts: 0, completionRate: 0 };
  }
};

// Save climbing progress (highest grades)
export const saveClimbingProgress = async (progress: ClimbingProgress): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.CLIMBING_PROGRESS, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving climbing progress:', error);
  }
};

// Get climbing progress
export const getClimbingProgress = async (): Promise<ClimbingProgress> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEYS.CLIMBING_PROGRESS);
    if (data) {
      return JSON.parse(data);
    }
    return { highestFlash: 'V0', highestAchieved: 'V0', highestAttempted: 'V0' };
  } catch (error) {
    console.error('Error getting climbing progress:', error);
    return { highestFlash: 'V0', highestAchieved: 'V0', highestAttempted: 'V0' };
  }
};
