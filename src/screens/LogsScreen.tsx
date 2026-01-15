import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Switch,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import Card from '../components/Card';
import Button from '../components/Button';
import {
  addWeeklyMetrics,
  getWeeklyMetrics,
  addMonthlyBenchmark,
  getMonthlyBenchmark,
  getUserProgress,
} from '../services/storage';
import { WeeklyMetrics, MonthlyBenchmark } from '../types';
import { format, startOfWeek, addWeeks } from 'date-fns';

const LogsScreen: React.FC = () => {
  const navigation = useNavigation();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [isDeloadWeek, setIsDeloadWeek] = useState(false);
  const [mondayDate, setMondayDate] = useState('');

  // Weekly Metrics State
  const [fingerboardSessions, setFingerboardSessions] = useState(0);
  const [mobilityStreak, setMobilityStreak] = useState(0);
  const [energyLevel, setEnergyLevel] = useState(5);
  const [fingerElbowSoreness, setFingerElbowSoreness] = useState(5);
  const [sleepQuality, setSleepQuality] = useState(5);
  const [motivationLevel, setMotivationLevel] = useState(5);
  const [hasSharpPain, setHasSharpPain] = useState(false);
  const [sharpPainLocation, setSharpPainLocation] = useState('');
  const [hasDullAche, setHasDullAche] = useState(false);
  const [dullAcheLocation, setDullAcheLocation] = useState('');
  const [weeklyNotes, setWeeklyNotes] = useState('');

  // Monthly Benchmark State (deload weeks only: 4, 8, 12, 16)
  const [hangboardSeconds, setHangboardSeconds] = useState(0);
  const [hangboardWeight, setHangboardWeight] = useState(0);
  const [highestSent, setHighestSent] = useState('');
  const [highestFlashed, setHighestFlashed] = useState('');
  const [maxPullUps, setMaxPullUps] = useState(0);
  const [pullUpWeight, setPullUpWeight] = useState(0);
  const [benchmarkNotes, setBenchmarkNotes] = useState('');

  useFocusEffect(
    useCallback(() => {
      loadWeekData();
    }, [])
  );

  const loadWeekData = async () => {
    const progress = await getUserProgress();
    const week = progress.currentWeek;
    setCurrentWeek(week);

    const isDeload = week === 4 || week === 8 || week === 12 || week === 16;
    setIsDeloadWeek(isDeload);

    // Calculate Monday date for this week
    const startDate = new Date(progress.startDate);
    const weekOffset = week - 1;
    const monday = addWeeks(startDate, weekOffset);
    setMondayDate(format(monday, 'yyyy-MM-dd'));

    // Load weekly metrics
    const weekly = await getWeeklyMetrics(week);
    if (weekly) {
      setFingerboardSessions(weekly.fingerboardSessionsCompleted);
      setMobilityStreak(weekly.dailyMobilityStreak);
      setEnergyLevel(weekly.energyLevel);
      setFingerElbowSoreness(weekly.fingerElbowSoreness);
      setSleepQuality(weekly.sleepQuality);
      setMotivationLevel(weekly.motivationLevel);
      setHasSharpPain(weekly.hasSharpPain);
      setSharpPainLocation(weekly.sharpPainLocation || '');
      setHasDullAche(weekly.hasDullAche);
      setDullAcheLocation(weekly.dullAcheLocation || '');
      setWeeklyNotes(weekly.notes || '');
    } else {
      resetWeeklyMetrics();
    }

    // Load monthly benchmark if deload week
    if (isDeload) {
      const benchmark = await getMonthlyBenchmark(week);
      if (benchmark) {
        setHangboardSeconds(benchmark.hangboardMaxHangSeconds);
        setHangboardWeight(benchmark.hangboardAddedWeight);
        setHighestSent(benchmark.highestGradeSent);
        setHighestFlashed(benchmark.highestGradeFlashed);
        setMaxPullUps(benchmark.maxPullUps);
        setPullUpWeight(benchmark.pullUpAddedWeight);
        setBenchmarkNotes(benchmark.notes || '');
      } else {
        resetBenchmarkMetrics();
      }
    }
  };

  const resetWeeklyMetrics = () => {
    setFingerboardSessions(0);
    setMobilityStreak(0);
    setEnergyLevel(5);
    setFingerElbowSoreness(5);
    setSleepQuality(5);
    setMotivationLevel(5);
    setHasSharpPain(false);
    setSharpPainLocation('');
    setHasDullAche(false);
    setDullAcheLocation('');
    setWeeklyNotes('');
  };

  const resetBenchmarkMetrics = () => {
    setHangboardSeconds(0);
    setHangboardWeight(0);
    setHighestSent('');
    setHighestFlashed('');
    setMaxPullUps(0);
    setPullUpWeight(0);
    setBenchmarkNotes('');
  };

  const handleSaveWeeklyMetrics = async () => {
    const metrics: WeeklyMetrics = {
      date: mondayDate,
      weekNumber: currentWeek,
      fingerboardSessionsCompleted: fingerboardSessions,
      dailyMobilityStreak: mobilityStreak,
      energyLevel,
      fingerElbowSoreness,
      sleepQuality,
      motivationLevel,
      hasSharpPain,
      sharpPainLocation: hasSharpPain ? sharpPainLocation : undefined,
      hasDullAche,
      dullAcheLocation: hasDullAche ? dullAcheLocation : undefined,
      notes: weeklyNotes,
    };

    await addWeeklyMetrics(metrics);
    Alert.alert('Saved!', 'Weekly metrics have been saved successfully.');
  };

  const handleSaveBenchmark = async () => {
    if (!highestSent || !highestFlashed) {
      Alert.alert('Missing Data', 'Please fill in all required benchmark fields.');
      return;
    }

    const benchmark: MonthlyBenchmark = {
      weekNumber: currentWeek,
      date: mondayDate,
      hangboardMaxHangSeconds: hangboardSeconds,
      hangboardAddedWeight: hangboardWeight,
      highestGradeSent: highestSent,
      highestGradeFlashed: highestFlashed,
      maxPullUps,
      pullUpAddedWeight: pullUpWeight,
      notes: benchmarkNotes,
    };

    await addMonthlyBenchmark(benchmark);
    Alert.alert('Saved!', 'Monthly benchmark has been saved successfully.');
  };

  const renderNumberInput = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    unit: string = ''
  ) => (
    <View style={styles.inputRow}>
      <Text style={styles.inputLabel}>{label}</Text>
      <View style={styles.numberInputContainer}>
        <TouchableOpacity
          style={styles.numberButton}
          onPress={() => setValue(Math.max(0, value - 1))}
        >
          <Ionicons name="remove" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.numberValue}>
          {value} {unit}
        </Text>
        <TouchableOpacity style={styles.numberButton} onPress={() => setValue(value + 1)}>
          <Ionicons name="add" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderSlider = (
    label: string,
    value: number,
    setValue: (val: number) => void,
    lowLabel: string = '1',
    highLabel: string = '10'
  ) => (
    <View style={styles.sliderContainer}>
      <View style={styles.sliderHeader}>
        <Text style={styles.sliderLabel}>{label}</Text>
        <Text style={[styles.sliderValue, value >= 8 && styles.sliderValueDanger]}>
          {value}/10
        </Text>
      </View>
      <View style={styles.sliderButtons}>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
          <TouchableOpacity
            key={num}
            style={[
              styles.sliderButton,
              value === num && styles.sliderButtonActive,
              num >= 8 && value === num && label.includes('soreness') && styles.sliderButtonDanger,
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
      <View style={styles.sliderLabels}>
        <Text style={styles.sliderLabelText}>{lowLabel}</Text>
        <Text style={styles.sliderLabelText}>{highLabel}</Text>
      </View>
      {label.includes('soreness') && value >= 8 && (
        <View style={styles.warningContainer}>
          <Ionicons name="warning" size={16} color={colors.error} />
          <Text style={styles.warningText}>
            High soreness - consider reducing volume by 50%
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.contentContainer}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Weekly Tracking</Text>
          <View style={styles.weekBadge}>
            <Text style={styles.weekBadgeText}>
              Week {currentWeek}
              {isDeloadWeek && ' - DELOAD'}
            </Text>
          </View>
        </View>

        <Text style={styles.instructionText}>
          📅 Fill this out every Monday at the start of your training week
        </Text>

        {/* Training Volume */}
        <Card>
          <Text style={styles.cardTitle}>Training Volume</Text>
          {renderNumberInput(
            'Fingerboard sessions completed',
            fingerboardSessions,
            setFingerboardSessions,
            'sessions'
          )}
          {renderNumberInput(
            'Daily mobility streak',
            mobilityStreak,
            setMobilityStreak,
            'days'
          )}
        </Card>

        {/* Subjective Ratings */}
        <Card>
          <Text style={styles.cardTitle}>Subjective Ratings (1-10)</Text>
          {renderSlider('Overall energy level', energyLevel, setEnergyLevel, 'Low', 'High')}
          {renderSlider(
            'Finger/elbow soreness',
            fingerElbowSoreness,
            setFingerElbowSoreness,
            'None',
            'Severe'
          )}
          {renderSlider('Sleep quality average', sleepQuality, setSleepQuality, 'Poor', 'Excellent')}
          {renderSlider('Motivation level', motivationLevel, setMotivationLevel, 'Low', 'High')}
        </Card>

        {/* Body Signals */}
        <Card>
          <Text style={styles.cardTitle}>Body Signals</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Sharp pain anywhere?</Text>
            <Switch
              value={hasSharpPain}
              onValueChange={setHasSharpPain}
              trackColor={{ false: colors.surface, true: colors.primary }}
              thumbColor={hasSharpPain ? colors.white : colors.textSecondary}
            />
          </View>
          {hasSharpPain && (
            <TextInput
              style={styles.textInput}
              placeholder="Location (e.g., middle of left ring finger)"
              placeholderTextColor={colors.textSecondary}
              value={sharpPainLocation}
              onChangeText={setSharpPainLocation}
            />
          )}

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Persistent dull ache?</Text>
            <Switch
              value={hasDullAche}
              onValueChange={setHasDullAche}
              trackColor={{ false: colors.surface, true: colors.primary }}
              thumbColor={hasDullAche ? colors.white : colors.textSecondary}
            />
          </View>
          {hasDullAche && (
            <TextInput
              style={styles.textInput}
              placeholder="Location (e.g., left elbow)"
              placeholderTextColor={colors.textSecondary}
              value={dullAcheLocation}
              onChangeText={setDullAcheLocation}
            />
          )}
        </Card>

        {/* Weekly Notes */}
        <Card>
          <Text style={styles.cardTitle}>Weekly Notes (Optional)</Text>
          <TextInput
            style={[styles.textInput, styles.notesInput]}
            placeholder="Any notable events, adjustments, or observations..."
            placeholderTextColor={colors.textSecondary}
            value={weeklyNotes}
            onChangeText={setWeeklyNotes}
            multiline
            numberOfLines={4}
          />
        </Card>

        <Button title="Save Weekly Metrics" onPress={handleSaveWeeklyMetrics} />

        {/* Monthly Benchmark Testing (Deload Weeks Only) */}
        {isDeloadWeek && (
          <>
            <View style={styles.sectionDivider}>
              <Text style={styles.sectionTitle}>Monthly Testing</Text>
              <Text style={styles.sectionSubtitle}>
                Test on this deload Monday (Week {currentWeek})
              </Text>
            </View>

            <Card>
              <Text style={styles.cardTitle}>Fingerboard Strength</Text>
              <Text style={styles.cardSubtitle}>
                Test: 20mm edge, half-crimp, max hang
              </Text>
              <View style={styles.benchmarkRow}>
                <View style={styles.benchmarkInput}>
                  <Text style={styles.inputLabel}>Seconds</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={hangboardSeconds.toString()}
                    onChangeText={(text) => setHangboardSeconds(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.benchmarkInput}>
                  <Text style={styles.inputLabel}>Added Weight (lbs)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={hangboardWeight.toString()}
                    onChangeText={(text) => setHangboardWeight(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Climbing Performance</Text>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Highest grade sent this month</Text>
                <TextInput
                  style={[styles.textInput, styles.gradeInput]}
                  placeholder="V4"
                  placeholderTextColor={colors.textSecondary}
                  value={highestSent}
                  onChangeText={setHighestSent}
                />
              </View>
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Highest grade flashed this month</Text>
                <TextInput
                  style={[styles.textInput, styles.gradeInput]}
                  placeholder="V3"
                  placeholderTextColor={colors.textSecondary}
                  value={highestFlashed}
                  onChangeText={setHighestFlashed}
                />
              </View>
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Pull-up Max</Text>
              <View style={styles.benchmarkRow}>
                <View style={styles.benchmarkInput}>
                  <Text style={styles.inputLabel}>Reps</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={maxPullUps.toString()}
                    onChangeText={(text) => setMaxPullUps(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.benchmarkInput}>
                  <Text style={styles.inputLabel}>Added Weight (lbs)</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="0"
                    placeholderTextColor={colors.textSecondary}
                    value={pullUpWeight.toString()}
                    onChangeText={(text) => setPullUpWeight(parseInt(text) || 0)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            </Card>

            <Card>
              <Text style={styles.cardTitle}>Benchmark Notes (Optional)</Text>
              <TextInput
                style={[styles.textInput, styles.notesInput]}
                placeholder="Any observations about your testing..."
                placeholderTextColor={colors.textSecondary}
                value={benchmarkNotes}
                onChangeText={setBenchmarkNotes}
                multiline
                numberOfLines={4}
              />
            </Card>

            <Button
              title="Save Monthly Benchmark"
              onPress={handleSaveBenchmark}
              style={{ marginTop: spacing.md }}
            />
          </>
        )}

        {/* Red Flags Warning */}
        <Card gradient gradientColors={['#FF6B6B', '#C44569']}>
          <View style={styles.redFlagsContainer}>
            <Text style={styles.redFlagsTitle}>⚠️ RED FLAGS</Text>
            <Text style={styles.redFlagsSubtitle}>Stop training immediately if:</Text>
            <Text style={styles.redFlagItem}>• Sharp finger pain (especially middle of finger)</Text>
            <Text style={styles.redFlagItem}>• Elbow pain that doesn't warm up</Text>
            <Text style={styles.redFlagItem}>• Shoulder pain during movement</Text>
            <Text style={styles.redFlagItem}>• Exhausted despite 8+ hours sleep for 1+ week</Text>
            <Text style={styles.redFlagItem}>• Complete loss of motivation for 1+ week</Text>

            <Text style={[styles.redFlagsSubtitle, { marginTop: spacing.md }]}>
              Reduce volume by 50% if:
            </Text>
            <Text style={styles.redFlagItem}>• Soreness rating ≥8 for 2 weeks straight</Text>
            <Text style={styles.redFlagItem}>• Energy rating ≤3 for 2 weeks straight</Text>
            <Text style={styles.redFlagItem}>• Not recovering between sessions</Text>
            <Text style={styles.redFlagItem}>• Performance declining for 2+ weeks</Text>
          </View>
        </Card>
      </ScrollView>
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
    paddingBottom: spacing.xxxl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  weekBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  weekBadgeText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  instructionText: {
    fontSize: fontSize.md,
    color: colors.textSecondary,
    marginBottom: spacing.lg,
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    marginBottom: spacing.md,
  },
  inputRow: {
    marginBottom: spacing.md,
  },
  inputLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
    fontWeight: fontWeight.medium,
  },
  numberInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
  },
  numberButton: {
    width: 40,
    height: 40,
    borderRadius: borderRadius.md,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  numberValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.semibold,
    color: colors.text,
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
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  sliderValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primary,
  },
  sliderValueDanger: {
    color: colors.error,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  sliderButton: {
    width: 30,
    height: 30,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderButtonActive: {
    backgroundColor: colors.primary,
  },
  sliderButtonDanger: {
    backgroundColor: colors.error,
  },
  sliderButtonText: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  sliderButtonTextActive: {
    color: colors.white,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sliderLabelText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
  },
  warningText: {
    fontSize: fontSize.xs,
    color: colors.error,
    marginLeft: spacing.xs,
    flex: 1,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  switchLabel: {
    fontSize: fontSize.md,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  textInput: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.md,
    padding: spacing.sm,
    fontSize: fontSize.md,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  notesInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sectionDivider: {
    marginTop: spacing.xl,
    marginBottom: spacing.md,
    borderTopWidth: 2,
    borderTopColor: colors.primary,
    paddingTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  benchmarkRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  benchmarkInput: {
    flex: 1,
  },
  gradeInput: {
    maxWidth: 100,
  },
  redFlagsContainer: {
    padding: spacing.sm,
  },
  redFlagsTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  redFlagsSubtitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.white,
    marginBottom: spacing.xs,
  },
  redFlagItem: {
    fontSize: fontSize.sm,
    color: colors.white,
    marginBottom: spacing.xxs,
    paddingLeft: spacing.xs,
  },
});

export default LogsScreen;
