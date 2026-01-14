import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { Phase } from '../types';

interface PhaseIndicatorProps {
  phase: Phase;
  weekNumber: number;
  isDeload?: boolean;
}

const PhaseIndicator: React.FC<PhaseIndicatorProps> = ({ phase, weekNumber, isDeload }) => {
  const getPhaseColor = () => {
    if (isDeload) return [colors.warning, '#F5D845'];
    switch (phase) {
      case 'Strength Foundation':
        return colors.gradient.secondary;
      case 'Power Development':
        return colors.gradient.primary;
      case 'Power Endurance':
        return colors.gradient.purple;
      case 'Peaking & Performance':
        return ['#FF6B9D', '#C44569'];
      default:
        return colors.gradient.dark;
    }
  };

  const getPhaseWeeks = () => {
    switch (phase) {
      case 'Strength Foundation':
        return 'Weeks 1-4';
      case 'Power Development':
        return 'Weeks 5-8';
      case 'Power Endurance':
        return 'Weeks 9-12';
      case 'Peaking & Performance':
        return 'Weeks 13-16';
      default:
        return '';
    }
  };

  return (
    <LinearGradient
      colors={getPhaseColor()}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.weekNumber}>WEEK {weekNumber}</Text>
        <Text style={styles.phaseName}>{isDeload ? 'DELOAD WEEK' : phase}</Text>
        <Text style={styles.phaseWeeks}>{getPhaseWeeks()}</Text>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginVertical: spacing.md,
  },
  content: {
    alignItems: 'center',
  },
  weekNumber: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    letterSpacing: 2,
    marginBottom: spacing.xs,
  },
  phaseName: {
    color: colors.white,
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  phaseWeeks: {
    color: colors.white,
    fontSize: fontSize.sm,
    opacity: 0.9,
  },
});

export default PhaseIndicator;
