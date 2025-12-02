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

const PlanScreen: React.FC = () => {
  const [currentWeek, setCurrentWeek] = useState(1);
  const [expandedWeek, setExpandedWeek] = useState<number | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadCurrentWeek();
    }, [])
  );

  const loadCurrentWeek = async () => {
    const progress = await getUserProgress();
    setCurrentWeek(progress.currentWeek);
  };

  const handleChangeWeek = async (week: number) => {
    await updateCurrentWeek(week);
    setCurrentWeek(week);
    setModalVisible(false);
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
              : phase === 'Foundation'
              ? colors.gradient.secondary
              : phase === 'Power Development'
              ? colors.gradient.primary
              : colors.gradient.purple
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
              {weeklySchedule.map(day => (
                <View key={day} style={styles.dayRow}>
                  <Text style={[styles.dayName, isCurrent && styles.currentWeekText]}>
                    {day}:
                  </Text>
                  <Text
                    style={[styles.dayWorkout, isCurrent && styles.currentWeekText]}
                    numberOfLines={1}
                  >
                    {day === 'Monday'
                      ? 'Power Climbing'
                      : day === 'Tuesday'
                      ? 'Technique & Volume'
                      : day === 'Wednesday'
                      ? 'Antagonist & Mobility'
                      : day === 'Thursday'
                      ? 'Regular Gym'
                      : day === 'Friday'
                      ? 'Finger Strength & Power'
                      : day === 'Saturday'
                      ? 'Project & Performance'
                      : 'Active Recovery'}
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
                    📈 Power Development: Campus board work, 2 sets hangboard
                  </Text>
                </View>
              )}

              {weekNumber >= 9 && (
                <View style={styles.phaseNote}>
                  <Text style={[styles.phaseNoteText, isCurrent && styles.currentWeekText]}>
                    🎯 Peak Phase: 7/53 hangboard protocol, max campus efforts
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
          <Text style={styles.headerTitle}>12-Week Plan</Text>
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
              <Text style={styles.overviewText}>Weeks 1-4: Foundation + Elbow Rehab</Text>
            </View>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: colors.phase.power }} />
              <Text style={styles.overviewText}>Weeks 5-8: Power Development</Text>
            </View>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: colors.phase.peak }} />
              <Text style={styles.overviewText}>Weeks 9-12: Peak Performance</Text>
            </View>
            <View style={styles.overviewItem}>
              <View style={styles.phaseColorBox} style={{ backgroundColor: colors.warning }} />
              <Text style={styles.overviewText}>Week 6: Deload Week (Critical!)</Text>
            </View>
          </View>
        </Card>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>All Weeks</Text>
          <Text style={styles.sectionSubtitle}>Tap to expand details</Text>
        </View>

        {Array.from({ length: 12 }, (_, i) => i + 1).map(week => renderWeekCard(week))}

        <Card gradient gradientColors={colors.gradient.dark}>
          <View style={styles.goalsContainer}>
            <Text style={styles.goalsTitle}>Expected Outcomes</Text>
            <View style={styles.goalItem}>
              <Ionicons name="trophy" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Sending V6 consistently</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="trending-up" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Projecting V7</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="flash" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Flashing V5</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="heart" size={20} color={colors.accent} />
              <Text style={styles.goalText}>Elbow pain reduced to 0-2/10</Text>
            </View>
            <View style={styles.goalItem}>
              <Ionicons name="fitness" size={20} color={colors.accent} />
              <Text style={styles.goalText}>10-12 pull-ups, 25-30 push-ups</Text>
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
              {Array.from({ length: 12 }, (_, i) => i + 1).map(week => {
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
    paddingBottom: spacing.xxl,
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
});

export default PlanScreen;
