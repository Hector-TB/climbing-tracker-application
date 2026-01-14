import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import Card from '../components/Card';
import PhaseIndicator from '../components/PhaseIndicator';
import { getUserProgress, updateCurrentWeek } from '../services/storage';
import { getPhaseInfo, weeklySchedule } from '../data/trainingPlan';
import { startOfMonth, endOfMonth, eachDayOfInterval, format, getDay, addMonths } from 'date-fns';
import { WorkoutLog } from '../types';

const PlanScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);

  useFocusEffect(
    useCallback(() => {
      loadCurrentWeek();
    }, [])
  );

  const loadCurrentWeek = async () => {
    const progress = await getUserProgress();
    setCurrentWeek(progress.currentWeek);
    setWorkoutLogs(progress.workoutLogs);
  };

  const handleChangeWeek = async (week: number) => {
    await updateCurrentWeek(week);
    setCurrentWeek(week);
    setModalVisible(false);
  };

  const renderMonthCalendar = (monthIndex: number) => {
    // monthIndex: 0 = Month 1, 1 = Month 2, 2 = Month 3
    const startDate = new Date();
    const monthStart = addMonths(startDate, monthIndex);
    const monthStartDate = startOfMonth(monthStart);
    const monthEndDate = endOfMonth(monthStart);
    const daysInMonth = eachDayOfInterval({ start: monthStartDate, end: monthEndDate });

    // Calculate weeks for this month
    const weekNumbers = monthIndex === 0 ? [1, 2, 3, 4] : monthIndex === 1 ? [5, 6, 7, 8] : monthIndex === 2 ? [9, 10, 11, 12] : [13, 14, 15, 16];
    const phase = monthIndex === 0 ? 'Strength Foundation' : monthIndex === 1 ? 'Power Development' : monthIndex === 2 ? 'Power Endurance' : 'Peaking & Performance';

    // Add empty cells for days before month starts
    const startDay = getDay(monthStartDate); // 0 = Sunday
    const emptyCells = startDay === 0 ? 6 : startDay - 1; // Adjust for Monday start

    return (
      <View style={styles.monthBlock}>
        <View style={styles.monthHeader}>
          <Ionicons name="calendar-outline" size={20} color={colors.primary} />
          <Text style={styles.monthTitle}>Month {monthIndex + 1}</Text>
        </View>
        <Text style={styles.monthPhaseTitle}>{phase} Phase</Text>

        {/* Day headers */}
        <View style={styles.calendarHeader}>
          {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, i) => (
            <Text key={i} style={styles.calendarDayHeader}>{day}</Text>
          ))}
        </View>

        {/* Calendar grid */}
        <View style={styles.calendarGrid}>
          {/* Empty cells before month starts */}
          {Array.from({ length: emptyCells }).map((_, i) => (
            <View key={`empty-${i}`} style={styles.calendarDay} />
          ))}

          {/* Actual days */}
          {daysInMonth.map((day, index) => {
            const dayOfWeek = format(day, 'EEEE');
            const dayNumber = format(day, 'd');
            const dateString = format(day, 'yyyy-MM-dd');
            const dayIndex = Math.floor((emptyCells + index) / 7);
            const weekNumber = weekNumbers[dayIndex] || weekNumbers[weekNumbers.length - 1];
            const isWorkoutDay = Object.keys(weeklySchedule).includes(dayOfWeek);
            const isCurrentWeek = weekNumber === currentWeek;
            const isDeloadWeek = weekNumber === 4 || weekNumber === 8 || weekNumber === 12;

            // Check if workout is completed
            const workoutLog = workoutLogs.find(log => log.date === dateString && log.day === dayOfWeek);
            const isCompleted = workoutLog?.completed || false;

            return (
              <TouchableOpacity
                key={day.toISOString()}
                style={[
                  styles.calendarDay,
                  styles.calendarDayActive,
                  isCurrentWeek && styles.calendarDayCurrentWeek,
                  isDeloadWeek && styles.calendarDayDeload,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  navigation.navigate('Workout', {
                    date: dateString,
                    day: dayOfWeek,
                    weekNumber: weekNumber,
                  });
                }}
              >
                <Text style={[
                  styles.calendarDayText,
                  isCurrentWeek && styles.calendarDayTextCurrent,
                ]}>
                  {dayNumber}
                </Text>
                {isCompleted ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={14}
                    color={colors.success}
                    style={styles.completedIcon}
                  />
                ) : isWorkoutDay ? (
                  <View style={[
                    styles.workoutDot,
                    isCurrentWeek && styles.workoutDotCurrent,
                  ]} />
                ) : null}
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  };

  const renderWeekCard = (weekNumber: number) => {
    const { phase, isDeload } = getPhaseInfo(weekNumber);
    const isExpanded = expandedWeek === weekNumber;
    const isCurrent = weekNumber === currentWeek;

    return (
      <TouchableOpacity
        key={weekNumber}
        onPress={() => setExpandedWeek(isExpanded ? null : weekNumber)}
        activeOpacity={0.7}
      >
        <Card
          style={[styles.weekCard, isCurrent && styles.currentWeekCard]}
          gradient={isCurrent}
          gradientColors={
            isDeload
              ? [colors.warning, '#F5D845']
              : phase === 'Strength Foundation'
              ? colors.gradient.secondary
              : phase === 'Power Development'
              ? colors.gradient.primary
              : phase === 'Power Endurance'
              ? colors.gradient.purple
              : colors.gradient.dark
          }
        >
          <View style={styles.weekHeader}>
            <View style={styles.weekTitleContainer}>
              <Text style={[styles.weekNumber, isCurrent && styles.currentWeekText]}>
                Week {weekNumber}
              </Text>
              {isCurrent && (
                <View style={styles.currentBadge}>
                  <Text style={styles.currentBadgeText}>CURRENT</Text>
                </View>
              )}
              {isDeload && (
                <View style={styles.deloadBadge}>
                  <Text style={styles.deloadBadgeText}>DELOAD</Text>
                </View>
              )}
            </View>
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={24}
              color={isCurrent ? colors.white : colors.textMuted}
            />
          </View>

          <Text style={[styles.phaseText, isCurrent && styles.currentWeekText]}>
            {phase}
          </Text>

          {isExpanded && (
            <View style={styles.weekDetails}>
              <Text style={[styles.detailsTitle, isCurrent && styles.currentWeekText]}>
                Daily Schedule:
              </Text>
              {Object.entries(weeklySchedule).map(([day, workout]) => (
                <View key={day} style={styles.dayRow}>
                  <Text style={[styles.dayName, isCurrent && styles.currentWeekText]}>
                    {day}:
                  </Text>
                  <Text
                    style={[styles.dayWorkout, isCurrent && styles.currentWeekText]}
                    numberOfLines={1}
                  >
                    {workout}
                  </Text>
                </View>
              ))}

              {isDeload && (
                <View style={styles.deloadNote}>
                  <Ionicons
                    name="information-circle"
                    size={16}
                    color={isCurrent ? colors.white : colors.warning}
                  />
                  <Text style={[styles.deloadNoteText, isCurrent && styles.currentWeekText]}>
                    Reduce volume to 50-60%. Maintain intensity, focus on recovery.
                  </Text>
                </View>
              )}

              {weekNumber >= 5 && weekNumber <= 8 && (
                <View style={styles.phaseNote}>
                  <Text style={[styles.phaseNoteText, isCurrent && styles.currentWeekText]}>
                    💪 Power Development: Explosive power, limit bouldering, dynamic movements
                  </Text>
                </View>
              )}

              {weekNumber >= 9 && weekNumber <= 12 && (
                <View style={styles.phaseNote}>
                  <Text style={[styles.phaseNoteText, isCurrent && styles.currentWeekText]}>
                    ⚡ Power Endurance: 4×4 protocol, repeaters, sustained hard sequences
                  </Text>
                </View>
              )}

              {weekNumber >= 13 && (
                <View style={styles.phaseNote}>
                  <Text style={[styles.phaseNoteText, isCurrent && styles.currentWeekText]}>
                    🎯 Peaking & Performance: V6-V7 projects, taper weeks 15-16, SENDING!
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>16-Week Plan</Text>
          <TouchableOpacity
            style={styles.changeWeekButton}
            onPress={() => setModalVisible(true)}
          >
            <Ionicons name="calendar" size={20} color={colors.primary} />
            <Text style={styles.changeWeekText}>Change Week</Text>
          </TouchableOpacity>
        </View>

        <PhaseIndicator
          phase={getPhaseInfo(currentWeek).phase}
          weekNumber={currentWeek}
          isDeload={getPhaseInfo(currentWeek).isDeload}
        />

        <Card>
          <Text style={styles.cardTitle}>Plan Overview</Text>
          <View style={styles.overviewSection}>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: colors.phase.foundation }} />
              <Text style={styles.overviewText}>Weeks 1-4: Strength Foundation</Text>
            </View>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: colors.phase.power }} />
              <Text style={styles.overviewText}>Weeks 5-8: Power Development</Text>
            </View>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: colors.phase.peak }} />
              <Text style={styles.overviewText}>Weeks 9-12: Power Endurance</Text>
            </View>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: '#1a1a2e' }} />
              <Text style={styles.overviewText}>Weeks 13-16: Peaking & Performance</Text>
            </View>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: colors.warning }} />
              <Text style={styles.overviewText}>Deload Weeks: 4, 8, 12</Text>
            </View>
          </View>
        </Card>

        <Card>
          <Text style={styles.cardTitle}>Monthly Schedule</Text>
          <Text style={styles.cardSubtitle}>Tap days to view week details below</Text>
          <View style={styles.monthlySection}>
            {renderMonthCalendar(0)}
            {renderMonthCalendar(1)}
            {renderMonthCalendar(2)}
            {renderMonthCalendar(3)}
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Weeks</Text>
          <Text style={styles.sectionSubtitle}>Tap to expand details</Text>
        </View>

        {Array.from({ length: 16 }, (_, i) => i + 1).map(week => renderWeekCard(week))}

        <Card gradient gradientColors={colors.gradient.dark}>
          <View style={styles.goalsContainer}>
            <Text style={styles.goalsTitle}>Expected Outcomes (V4 → V7)</Text>
            <View style={styles.goalItem}>
              <Ionicons name="trophy" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Consistently sending V7</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="trending-up" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Sending multiple V6s per session</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="flash" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Flashing V5 regularly</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="hand-left" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Strong crimps & overhang technique</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="fitness" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Excellent core tension & power</Text>
            </View>
          </View>
        </Card>
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Week</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={28} color={colors.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalScroll}>
              {Array.from({ length: 16 }, (_, i) => i + 1).map(week => {
                const { phase, isDeload } = getPhaseInfo(week);
                return (
                  <TouchableOpacity
                    key={week}
                    style={[
                      styles.modalWeekItem,
                      week === currentWeek && styles.modalWeekItemActive,
                    ]}
                    onPress={() => handleChangeWeek(week)}
                  >
                    <Text style={styles.modalWeekNumber}>Week {week}</Text>
                    <Text style={styles.modalWeekPhase}>
                      {isDeload ? 'DELOAD' : phase}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
    marginBottom: spacing.lg,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  changeWeekButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  changeWeekText: {
    fontSize: fontSize.sm,
    color: colors.primary,
    marginLeft: spacing.xs,
    fontWeight: fontWeight.semibold,
  },
  cardTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  cardSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginBottom: spacing.md,
  },
  overviewSection: {
    gap: spacing.sm,
  },
  overviewItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  phaseColorBox: {
    width: 20,
    height: 20,
    borderRadius: borderRadius.sm,
    marginRight: spacing.sm,
  },
  overviewText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  sectionHeader: {
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  sectionSubtitle: {
    fontSize: fontSize.sm,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  weekCard: {
    marginVertical: spacing.sm,
  },
  currentWeekCard: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  weekTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  weekNumber: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  currentWeekText: {
    color: colors.white,
  },
  currentBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  currentBadgeText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  deloadBadge: {
    backgroundColor: colors.warning,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  deloadBadgeText: {
    fontSize: fontSize.xs,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  phaseText: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
  },
  weekDetails: {
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailsTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.text,
    marginBottom: spacing.sm,
  },
  dayRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  dayName: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontWeight: fontWeight.medium,
    width: 100,
  },
  dayWorkout: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    flex: 1,
  },
  deloadNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 230, 109, 0.2)',
    borderRadius: borderRadius.sm,
  },
  deloadNoteText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
    marginLeft: spacing.sm,
    flex: 1,
  },
  phaseNote: {
    marginTop: spacing.sm,
    padding: spacing.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: borderRadius.sm,
  },
  phaseNoteText: {
    fontSize: fontSize.xs,
    color: colors.textSecondary,
  },
  goalsContainer: {
    gap: spacing.md,
  },
  goalsTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
    marginBottom: spacing.sm,
  },
  goalItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  goalText: {
    fontSize: fontSize.sm,
    color: colors.white,
    marginLeft: spacing.sm,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.backgroundCard,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.backgroundLight,
  },
  modalTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  modalScroll: {
    padding: spacing.md,
  },
  modalWeekItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.md,
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
  },
  modalWeekItemActive: {
    backgroundColor: colors.primary,
  },
  modalWeekNumber: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.text,
  },
  modalWeekPhase: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
  },
  monthlySection: {
  },
  monthBlock: {
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.xs,
    gap: spacing.sm,
  },
  monthTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.text,
  },
  monthPhaseTitle: {
    fontSize: fontSize.sm,
    color: colors.textSecondary,
    fontStyle: 'italic',
    marginBottom: spacing.md,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: spacing.sm,
  },
  calendarDayHeader: {
    flex: 1,
    textAlign: 'center',
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.textMuted,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.285714%', // Exactly 1/7 = 14.285714%
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  calendarDayActive: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.sm,
  },
  calendarDayCurrentWeek: {
    backgroundColor: colors.primary,
  },
  calendarDayDeload: {
    borderWidth: 2,
    borderColor: colors.warning,
  },
  calendarDayText: {
    fontSize: fontSize.xs,
    color: colors.text,
    fontWeight: fontWeight.medium,
  },
  calendarDayTextCurrent: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  workoutDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primary,
    marginTop: 2,
  },
  workoutDotCurrent: {
    backgroundColor: colors.white,
  },
  completedIcon: {
    marginTop: 2,
  },
});

export default PlanScreen;
