import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing, fontSize, fontWeight, borderRadius } from '../theme/spacing';
import { Exercise } from '../types';

interface ExerciseItemProps {
  exercise: Exercise;
  onToggleComplete: (exerciseId: string) => void;
}

const ExerciseItem: React.FC<ExerciseItemProps> = ({ exercise, onToggleComplete }) => {
  const [expanded, setExpanded] = useState(false);

  const renderDetails = () => {
    const details: string[] = [];
    if (exercise.sets) details.push(`${exercise.sets} sets`);
    if (exercise.reps) details.push(`${exercise.reps} reps`);
    if (exercise.duration) details.push(`${exercise.duration}s`);
    if (exercise.weight) details.push(`${exercise.weight}kg`);
    return details.join(' • ');
  };

  const hasExpandableContent = !!(exercise.notes || exercise.rest);

  return (
    <View style={styles.container}>
      <View style={styles.mainContent}>
        <TouchableOpacity
          style={styles.checkbox}
          onPress={() => onToggleComplete(exercise.id)}
          activeOpacity={0.7}
        >
          {exercise.completed ? (
            <Ionicons name="checkmark-circle" size={28} color={colors.success} />
          ) : (
            <Ionicons name="ellipse-outline" size={28} color={colors.grayLight} />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.textContainer}
          onPress={() => hasExpandableContent && setExpanded(!expanded)}
          activeOpacity={hasExpandableContent ? 0.7 : 1}
        >
          <Text style={[styles.name, exercise.completed && styles.completedText]}>
            {exercise.name}
          </Text>
          {renderDetails() && (
            <Text style={styles.details}>{renderDetails()}</Text>
          )}
        </TouchableOpacity>

        {hasExpandableContent && (
          <TouchableOpacity onPress={() => setExpanded(!expanded)} activeOpacity={0.7}>
            <Ionicons
              name={expanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>

      {expanded && hasExpandableContent && (
        <View style={styles.expandedContent}>
          {exercise.notes && (
            <View style={styles.noteContainer}>
              <Ionicons name="information-circle" size={16} color={colors.info} />
              <Text style={styles.noteText}>{exercise.notes}</Text>
            </View>
          )}
          {exercise.rest && (
            <Text style={styles.restText}>Rest: {exercise.rest}s</Text>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.backgroundLight,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
    overflow: 'hidden',
  },
  mainContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
  },
  checkbox: {
    marginRight: spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  name: {
    color: colors.text,
    fontSize: fontSize.md,
    fontWeight: fontWeight.medium,
    marginBottom: spacing.xs,
  },
  completedText: {
    textDecorationLine: 'line-through',
    color: colors.textMuted,
  },
  details: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
  },
  expandedContent: {
    padding: spacing.md,
    paddingTop: 0,
    borderTopWidth: 1,
    borderTopColor: colors.background,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: spacing.sm,
  },
  noteText: {
    color: colors.textSecondary,
    fontSize: fontSize.sm,
    marginLeft: spacing.sm,
    flex: 1,
  },
  restText: {
    color: colors.textMuted,
    fontSize: fontSize.sm,
    fontStyle: 'italic',
  },
});

export default ExerciseItem;
