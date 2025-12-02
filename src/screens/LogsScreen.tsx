import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import Card from '../components/Card';
import Button from '../components/Button';
import { addDailyMetrics, getDailyMetrics, addClimbingMetrics } from '../services/storage';
import { DailyMetrics, ClimbingMetrics } from '../types';
import { format } from 'date-fns';

const LogsScreen: React.FC = () => {
  const today = format(new Date(), 'yyyy-MM-dd');

  // Daily Metrics State
  const [gripStrength, setGripStrength] = useState('');
  const [elbowPainWarmup, setElbowPainWarmup] = useState(0);
  const [elbowPainClimbing, setElbowPainClimbing] = useState(0);
  const [elbowPainLockoffs, setElbowPainLockoffs] = useState(0);
  const [elbowPainPost, setElbowPainPost] = useState(0);
  const [muscleSoreness, setMuscleSoreness] = useState(3);
  const [energyLevel, setEnergyLevel] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(3);
  const [motivation, setMotivation] = useState(3);
  const [notes, setNotes] = useState('');

  // Climbing Metrics State
  const [problemsAttempted, setProblemsAttempted] = useState('');
  const [hardestGrade, setHardestGrade] = useState('');
  const [projectsSent, setProjectsSent] = useState('');
  const [flashAttempts, setFlashAttempts] = useState('');
  const [techniqueNotes, setTechniqueNotes] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadTodayMetrics();
    }, [])
  );

  const loadTodayMetrics = async () => {
    const metrics = await getDailyMetrics(today);
    if (metrics) {
      setGripStrength(metrics.gripStrength?.toString() || '');
      setElbowPainWarmup(metrics.elbowPainWarmup || 0);
      setElbowPainClimbing(metrics.elbowPainClimbing || 0);
      setElbowPainLockoffs(metrics.elbowPainLockoffs || 0);
      setElbowPainPost(metrics.elbowPainPostSession || 0);
      setMuscleSoreness(metrics.muscleSoreness || 3);
      setEnergyLevel(metrics.energyLevel || 3);
      setSleepQuality(metrics.sleepQuality || 3);
      setMotivation(metrics.motivation || 3);
      setNotes(metrics.notes || '');
    }
  };

  const handleSaveDailyMetrics = async () => {
    const metrics: DailyMetrics = {
      date: today,
      gripStrength: gripStrength ? parseFloat(gripStrength) : undefined,
      elbowPainWarmup,
      elbowPainClimbing,
      elbowPainLockoffs,
      elbowPainPostSession: elbowPainPost,
      muscleSoreness,
      energyLevel,
      sleepQuality,
      motivation,
      notes,
    };

    await addDailyMetrics(metrics);
    Alert.alert('Saved!', 'Daily metrics have been saved successfully.');
  };

  const handleSaveClimbingMetrics = async () => {
    const metrics: ClimbingMetrics = {
      date: today,
      problemsAttempted: problemsAttempted ? parseInt(problemsAttempted) : undefined,
      hardestGrade,
      projectsSent: projectsSent ? projectsSent.split(',').map(p => p.trim()) : [],
      flashAttempts,
      techniqueNotes,
    };

    await addClimbingMetrics(metrics);
    Alert.alert('Saved!', 'Climbing metrics have been saved successfully.');
  };

  const renderPainSlider = (
    label: string,
    value: number,
    setValue: (val: number) => void
  ) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={[styles.sliderValue, value >= 6 && styles.sliderValueDanger]}>
          {value}/10
        </Text>
      </View>
      <View style={styles.sliderButtons}>
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.sliderButton,
              value === num && styles.sliderButtonActive,
              num >= 6 && value === num && styles.sliderButtonDanger,
            ]}
            onPress={() => setValue(num)}
          >
            <Text
              style={[
                styles.sliderButtonText,
                value === num && styles.sliderButtonTextActive,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      {value >= 6 && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color={colors.error} />
          <Text style={styles.warningText}>High pain level - consider reducing intensity</Text>
        </View>
      )}
    </View>
  );

  const renderRatingSlider = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    lowLabel: string,
    highLabel: string
  ) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={styles.sliderValue}>{value}/5</Text>
      </View>
      <View style={styles.sliderButtons}>
        {[1, 2, 3, 4, 5].map(num => (
          <TouchableOpacity
            key={num}
            style={[
              styles.sliderButton,
              styles.sliderButtonWide,
              value === num && styles.sliderButtonActive,
            ]}
            onPress={() => setValue(num)}
          >
            <Text
              style={[
                styles.sliderButtonText,
                value === num && styles.sliderButtonTextActive,
              ]}
            >
              {num}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.ratingLabels}>
        <Text style={styles.ratingLabelText}>{lowLabel}</Text>
        <Text style={styles.ratingLabelText}>{highLabel}</Text>
      </View>
    </View>
  );

  const averageElbowPain = Math.round(
    (elbowPainWarmup + elbowPainClimbing + elbowPainLockoffs + elbowPainPost) / 4
  );

  const recoveryScore = muscleSoreness + energyLevel + sleepQuality + motivation;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Daily Logs</Text>
        <Text style={styles.headerDate}>{format(new Date(), 'MMMM d, yyyy')}</Text>
      </View>

      <Card>
        <View style={styles.summaryContainer}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Avg Elbow Pain</Text>
            <Text
              style={[
                styles.summaryValue,
                averageElbowPain >= 6 && styles.summaryValueDanger,
              ]}
            >
              {averageElbowPain}/10
            </Text>
          </View>
          <View style={styles.summaryDivider} />
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Recovery Score</Text>
            <Text style={styles.summaryValue}>{recoveryScore}/20</Text>
          </View>
        </View>
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <Ionicons name="pulse" size={24} color={colors.primary} />
          <Text style={styles.sectionTitle}>Daily Health Metrics</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Grip Strength (baseline tracking)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter grip strength reading"
            placeholderTextColor={colors.textMuted}
            value={gripStrength}
            onChangeText={setGripStrength}
            keyboardType="numeric"
          />
        </View>

        <Text style={styles.subsectionTitle}>Elbow Pain (0-10 scale)</Text>
        {renderPainSlider('During Warm-up', elbowPainWarmup, setElbowPainWarmup)}
        {renderPainSlider('During Climbing', elbowPainClimbing, setElbowPainClimbing)}
        {renderPainSlider('During Lockoffs', elbowPainLockoffs, setElbowPainLockoffs)}
        {renderPainSlider('Post-Session (2hrs)', elbowPainPost, setElbowPainPost)}

        <Text style={styles.subsectionTitle}>Recovery Status (1-5 scale)</Text>
        {renderRatingSlider('Muscle Soreness', muscleSoreness, setMuscleSoreness, 'Very Sore', 'Fresh')}
        {renderRatingSlider('Energy Level', energyLevel, setEnergyLevel, 'Exhausted', 'Energized')}
        {renderRatingSlider('Sleep Quality', sleepQuality, setSleepQuality, 'Poor', 'Excellent')}
        {renderRatingSlider('Motivation', motivation, setMotivation, 'Low', 'High')}

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Additional Notes</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="Any observations or concerns..."
            placeholderTextColor={colors.textMuted}
            value={notes}
            onChangeText={setNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <Button
          title="Save Daily Metrics"
          onPress={handleSaveDailyMetrics}
          variant="primary"
        />
      </Card>

      <Card>
        <View style={styles.sectionHeader}>
          <Ionicons name="trending-up" size={24} color={colors.secondary} />
          <Text style={styles.sectionTitle}>Climbing Metrics</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Problems Attempted</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Total number of problems"
            placeholderTextColor={colors.textMuted}
            value={problemsAttempted}
            onChangeText={setProblemsAttempted}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Hardest Grade Attempted</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., V5"
            placeholderTextColor={colors.textMuted}
            value={hardestGrade}
            onChangeText={setHardestGrade}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Projects Sent (comma separated)</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., V5 Overhang, V4 Technical"
            placeholderTextColor={colors.textMuted}
            value={projectsSent}
            onChangeText={setProjectsSent}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Flash Attempts</Text>
          <TextInput
            style={styles.textInput}
            placeholder="e.g., 3/5 V4s flashed"
            placeholderTextColor={colors.textMuted}
            value={flashAttempts}
            onChangeText={setFlashAttempts}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Technique Notes</Text>
          <TextInput
            style={[styles.textInput, styles.textArea]}
            placeholder="What worked well? What to improve?"
            placeholderTextColor={colors.textMuted}
            value={techniqueNotes}
            onChangeText={setTechniqueNotes}
            multiline
            numberOfLines={4}
          />
        </View>

        <Button
          title="Save Climbing Metrics"
          onPress={handleSaveClimbingMetrics}
          variant="secondary"
        />
      </Card>

      {(averageElbowPain >= 6 || recoveryScore < 15) && (
        <Card gradient gradientColors={[colors.warning, '#F5D845']}>
          <View style={styles.alertContainer}>
            <Ionicons name="alert-circle" size={28} color={colors.white} />
            <View style={styles.alertTextContainer}>
              <Text style={styles.alertTitle}>Recovery Alert</Text>
              <Text style={styles.alertText}>
                {averageElbowPain >= 6 &&
                  'High elbow pain detected. Consider using low-energy variants or taking an extra rest day.'}
                {averageElbowPain < 6 && recoveryScore < 15 &&
                  'Low recovery score. Prioritize rest and consider reducing training intensity.'}
              </Text>
            </View>
          </View>
        </Card>
      )}
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
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  headerDate: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryDivider: {
    width: 1,
    backgroundColor: colors.backgroundLight,
  },
  summaryLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  summaryValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  summaryValueDanger: {
    color: colors.error,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginLeft: spacing.sm,
  },
  subsectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.textSecondary,
    marginBottom: spacing.sm,
  },
  textInput: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    fontSize: fontSize.md,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.background,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  sliderContainer: {
    marginBottom: spacing.lg,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  sliderLabel: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  sliderValue: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  sliderValueDanger: {
    color: colors.error,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.backgroundLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonWide: {
    width: 50,
    height: 40,
    borderRadius: 20,
  },
  sliderButtonActive: {
    backgroundColor: colors.primary,
  },
  sliderButtonDanger: {
    backgroundColor: colors.error,
  },
  sliderButtonText: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    fontWeight: fontWeight.medium,
  },
  sliderButtonTextActive: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 107, 107, 0.1)',
    borderRadius: borderRadius.sm,
  },
  warningText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginLeft: spacing.sm,
  },
  ratingLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ratingLabelText: {
    fontSize: fontSize.xs,
    color: colors.textMuted,
  },
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertTextContainer: {
    marginLeft: spacing.md,
    flex: 1,
  },
  alertTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  alertText: {
    fontSize: fontSize.sm,
    color: colors.white,
  },
});

export default LogsScreen;
