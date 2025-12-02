import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import Card from '../components/Card';
import Button from '../components/Button';
import ExerciseItem from '../components/ExerciseItem';
import { getWorkoutForWeek, getPhaseInfo } from '../data/trainingPlan';
import { addWorkoutLog, getWorkoutLog } from '../services/storage';
import { Exercise, WorkoutLog } from '../types';
import { format } from 'date-fns';

interface WorkoutScreenProps {
  route: any;
  navigation: any;
}

const WorkoutScreen: React.FC<WorkoutScreenProps> = ({ route, navigation }) => {
  const { date, day, weekNumber } = route.params || {
    date: format(new Date(), 'yyyy-MM-dd'),
    day: format(new Date(), 'EEEE'),
    weekNumber: 1,
  };

  const [workout, setWorkout] = useState(getWorkoutForWeek(weekNumber, day));
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [useLowEnergy, setUseLowEnergy] = useState(false);
  const [workoutCompleted, setWorkoutCompleted] = useState(false);

  const { phase, isDeload } = getPhaseInfo(weekNumber);

  useEffect(() => {
    loadWorkoutData();
  }, [date, day, weekNumber]);

  const loadWorkoutData = async () => {
    const workoutData = getWorkoutForWeek(weekNumber, day);
    setWorkout(workoutData);

    // Load saved workout log if exists
    const savedLog = await getWorkoutLog(date, day);
    if (savedLog) {
      setExercises(savedLog.exercises);
      setUseLowEnergy(savedLog.usedLowEnergy);
      setWorkoutCompleted(savedLog.completed);
    } else {
      // Initialize exercises from workout plan
      const allExercises = workoutData.sections.flatMap(section => section.exercises);
      setExercises(allExercises.map(ex => ({ ...ex, completed: false })));
    }
  };

  const handleToggleExercise = (exerciseId: string) => {
    setExercises(prev =>
      prev.map(ex =>
        ex.id === exerciseId ? { ...ex, completed: !ex.completed } : ex
      )
    );
  };

  const handleSaveWorkout = async () => {
    const completedCount = exercises.filter(ex => ex.completed).length;
    const totalCount = exercises.length;
    const isComplete = completedCount === totalCount;

    const workoutLog: WorkoutLog = {
      id: `${date}-${day}`,
      date,
      day: day as any,
      weekNumber,
      completed: isComplete,
      exercises,
      usedLowEnergy,
    };

    await addWorkoutLog(workoutLog);
    setWorkoutCompleted(isComplete);

    Alert.alert(
      'Workout Saved!',
      `Progress: ${completedCount}/${totalCount} exercises completed`,
      [{ text: 'OK' }]
    );
  };

  const handleCompleteWorkout = async () => {
    const completedCount = exercises.filter(ex => ex.completed).length;
    const totalCount = exercises.length;

    if (completedCount < totalCount) {
      Alert.alert(
        'Incomplete Workout',
        `You've completed ${completedCount}/${totalCount} exercises. Mark as complete anyway?`,
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Complete', onPress: completeWorkout },
        ]
      );
    } else {
      completeWorkout();
    }
  };

  const completeWorkout = async () => {
    const workoutLog: WorkoutLog = {
      id: `${date}-${day}`,
      date,
      day: day as any,
      weekNumber,
      completed: true,
      exercises: exercises.map(ex => ({ ...ex, completed: true })),
      usedLowEnergy,
    };

    await addWorkoutLog(workoutLog);
    setWorkoutCompleted(true);
    setExercises(prev => prev.map(ex => ({ ...ex, completed: true })));

    Alert.alert(
      'Workout Complete! 🎉',
      'Great job! Your progress has been saved.',
      [
        { text: 'Go Home', onPress: () => navigation.navigate('Home') },
        { text: 'OK' },
      ]
    );
  };

  const completionPercentage = Math.round(
    (exercises.filter(ex => ex.completed).length / exercises.length) * 100
  );

  const renderSection = (section: any, sectionIndex: number) => {
    const sectionExercises = exercises.filter(ex =>
      section.exercises.some((sectionEx: Exercise) => sectionEx.id === ex.id)
    );

    return (
      <Card key={sectionIndex} style={styles.sectionCard}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <View style={styles.durationBadge}>
            <Ionicons name="time-outline" size={14} color={colors.textSecondary} />
            <Text style={styles.durationText}>{section.duration}</Text>
          </View>
        </View>
        {sectionExercises.map(exercise => (
          <ExerciseItem
            key={exercise.id}
            exercise={exercise}
            onToggleComplete={handleToggleExercise}
          />
        ))}
      </Card>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <Card gradient gradientColors={colors.gradient.primary}>
          <Text style={styles.dayName}>{day}</Text>
          <Text style={styles.workoutTitle}>{workout.title}</Text>
          <Text style={styles.workoutFocus}>{workout.focus}</Text>
          <View style={styles.workoutInfo}>
            <View style={styles.infoItem}>
              <Ionicons name="time-outline" size={20} color={colors.white} />
              <Text style={styles.infoText}>{workout.duration}</Text>
            </View>
            <View style={styles.infoItem}>
              <Ionicons name="flame-outline" size={20} color={colors.white} />
              <Text style={styles.infoText}>{workout.sections.length} sections</Text>
            </View>
          </View>
          {workoutCompleted && (
            <View style={styles.completedBadge}>
              <Ionicons name="checkmark-circle" size={20} color={colors.success} />
              <Text style={styles.completedText}>Completed</Text>
            </View>
          )}
        </Card>

        <Card>
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Progress</Text>
              <Text style={styles.progressPercentage}>{completionPercentage}%</Text>
            </View>
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${completionPercentage}%` },
                ]}
              />
            </View>
            <Text style={styles.progressText}>
              {exercises.filter(ex => ex.completed).length} of {exercises.length} exercises
            </Text>
          </View>

          <View style={styles.lowEnergyContainer}>
            <View style={styles.lowEnergyLeft}>
              <Ionicons name="battery-half-outline" size={24} color={colors.warning} />
              <View style={styles.lowEnergyTextContainer}>
                <Text style={styles.lowEnergyTitle}>Low Energy Variant</Text>
                <Text style={styles.lowEnergySubtitle}>Reduce volume by 40%</Text>
              </View>
            </View>
            <Switch
              value={useLowEnergy}
              onValueChange={setUseLowEnergy}
              trackColor={{ false: colors.grayDark, true: colors.primary }}
              thumbColor={useLowEnergy ? colors.white : colors.grayLight}
            />
          </View>

          {useLowEnergy && workout.lowEnergyVariant && (
            <View style={styles.variantInfo}>
              <Ionicons name="information-circle" size={16} color={colors.info} />
              <Text style={styles.variantText}>{workout.lowEnergyVariant}</Text>
            </View>
          )}
        </Card>

        {workout.importantNotes && workout.importantNotes.length > 0 && (
          <Card style={styles.notesCard}>
            <View style={styles.notesHeader}>
              <Ionicons name="alert-circle" size={20} color={colors.warning} />
              <Text style={styles.notesTitle}>Important Notes</Text>
            </View>
            {workout.importantNotes.map((note, index) => (
              <View key={index} style={styles.noteItem}>
                <Text style={styles.noteBullet}>•</Text>
                <Text style={styles.noteText}>{note}</Text>
              </View>
            ))}
          </Card>
        )}

        {workout.sections.map((section, index) => renderSection(section, index))}
      </ScrollView>

      <View style={styles.bottomActions}>
        <Button
          title="Save Progress"
          onPress={handleSaveWorkout}
          variant="outline"
          style={styles.saveButton}
        />
        <Button
          title={workoutCompleted ? 'Completed ✓' : 'Complete Workout'}
          onPress={handleCompleteWorkout}
          variant="primary"
          disabled={workoutCompleted}
          style={styles.completeButton}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: 100,
  },
  dayName: {
    fontSize: fontSize.sm,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  workoutTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  workoutFocus: {
    fontSize: fontSize.md,
    color: colors.white,
    opacity: 0.9,
    marginBottom: spacing.md,
  },
  workoutInfo: {
    flexDirection: 'row',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.lg,
  },
  infoText: {
    fontSize: fontSize.sm,
    color: colors.white,
    marginLeft: spacing.xs,
  },
  completedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(6, 255, 165, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    marginTop: spacing.md,
    alignSelf: 'flex-start',
  },
  completedText: {
    color: colors.success,
    fontWeight: fontWeight.semibold,
    marginLeft: spacing.sm,
  },
  progressContainer: {
    marginBottom: spacing.lg,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  progressTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  progressPercentage: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.sm,
    overflow: 'hidden',
    marginBottom: spacing.sm,
  },
  progressBar: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: borderRadius.sm,
  },
  progressText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  lowEnergyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
  },
  lowEnergyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  lowEnergyTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  lowEnergyTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    color: colors.text,
  },
  lowEnergySubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  variantInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
  },
  variantText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  notesCard: {
    backgroundColor: colors.backgroundLight,
  },
  notesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  notesTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  noteItem: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  noteBullet: {
    fontSize: fontSize.md,
    color: colors.warning,
    marginRight: spacing.sm,
  },
  noteText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  sectionCard: {
    marginVertical: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  durationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
  },
  durationText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.xs,
  },
  bottomActions: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: spacing.md,
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderTopColor: colors.backgroundLight,
    gap: spacing.sm,
  },
  saveButton: {
    flex: 1,
  },
  completeButton: {
    flex: 2,
  },
});

export default WorkoutScreen;
