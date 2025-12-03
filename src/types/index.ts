// Core Types for Climbing Progression Tracker

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type Phase = 'Foundation' | 'Power Development' | 'Peak Performance';

export interface WeekInfo {
  weekNumber: number;
  phase: Phase;
  isDeload: boolean;
  startDate?: Date;
}

export interface Exercise {
  id: string;
  name: string;
  sets?: number;
  reps?: number | string;
  weight?: number;
  duration?: number; // in seconds
  rest?: number; // in seconds
  notes?: string;
  completed?: boolean;
}

export interface ExerciseSection {
  title: string;
  duration: string;
  exercises: Exercise[];
}

export interface WorkoutDay {
  day: DayOfWeek;
  title: string;
  duration: string;
  focus: string;
  sections: ExerciseSection[];
  importantNotes: string[];
  lowEnergyVariant?: string;
}

export interface DailyMetrics {
  date: string; // ISO date string
  elbowPainWarmup?: number; // 0-10
  elbowPainClimbing?: number; // 0-10
  elbowPainLockoffs?: number; // 0-10
  elbowPainPostSession?: number; // 0-10
  muscleSoreness?: number; // 1-5
  energyLevel?: number; // 1-5
  sleepQuality?: number; // 1-5
  motivation?: number; // 1-5
  notes?: string;
}

export interface WorkoutLog {
  id: string;
  date: string;
  day: DayOfWeek;
  weekNumber: number;
  completed: boolean;
  exercises: Exercise[];
  usedLowEnergy: boolean;
  metrics?: DailyMetrics;
}

export interface ClimbingMetrics {
  date: string;
  problemsAttempted?: number;
  hardestGrade?: string; // e.g., "V5"
  projectsSent?: string[];
  flashAttempts?: string;
  techniqueNotes?: string;
}

export interface MonthlyBenchmark {
  month: number; // 1-3
  date: string;
  hardestSent: string;
  hardestFlashed: string;
  maxPullUps: number;
  maxPushUps: number;
  hangboardMaxWeight: number;
  campusHighestRung: number;
  compressionHangTime: number;
  elbowPainAverage: number;
  bodyWeight: number;
}

export interface UserProgress {
  currentWeek: number;
  startDate: string;
  workoutLogs: WorkoutLog[];
  dailyMetrics: DailyMetrics[];
  climbingMetrics: ClimbingMetrics[];
  monthlyBenchmarks: MonthlyBenchmark[];
}
