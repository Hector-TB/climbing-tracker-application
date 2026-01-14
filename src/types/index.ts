// Core Types for Climbing Progression Tracker

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export type Phase = 'Strength Foundation' | 'Power Development' | 'Power Endurance' | 'Peaking & Performance';

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

export interface WeeklyMetrics {
  date: string; // ISO date string (Monday of the week)
  weekNumber: number;
  fingerboardSessionsCompleted: number;
  dailyMobilityStreak: number; // days
  energyLevel: number; // 1-10
  fingerElbowSoreness: number; // 1-10 (1=none, 10=severe)
  sleepQuality: number; // 1-10
  motivationLevel: number; // 1-10
  hasSharpPain: boolean;
  sharpPainLocation?: string;
  hasDullAche: boolean;
  dullAcheLocation?: string;
  notes?: string;
}

export interface DailyMetrics {
  date: string; // ISO date string
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
  weekNumber: number; // 4, 8, 12, or 16
  date: string; // ISO date string (deload Monday)
  // Fingerboard Strength Test: 20mm edge, half-crimp, max hang
  hangboardMaxHangSeconds: number;
  hangboardAddedWeight: number; // lbs
  // Climbing Performance
  highestGradeSent: string; // e.g., "V5"
  highestGradeFlashed: string; // e.g., "V4"
  // Pull-up Max
  maxPullUps: number;
  pullUpAddedWeight: number; // lbs
  notes?: string;
}

export interface UserProgress {
  currentWeek: number;
  startDate: string;
  workoutLogs: WorkoutLog[];
  weeklyMetrics: WeeklyMetrics[];
  dailyMetrics: DailyMetrics[];
  climbingMetrics: ClimbingMetrics[];
  monthlyBenchmarks: MonthlyBenchmark[];
}
