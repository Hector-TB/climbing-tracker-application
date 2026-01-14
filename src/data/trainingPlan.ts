import { WorkoutDay, DayOfWeek, Phase } from '../types';

// Training Plan Data - 16 Week Climbing Progression (V4 → V7)
// Start Date: January 19, 2026

export const TOTAL_WEEKS = 16;
export const START_DATE = '2026-01-19';

export const getWorkoutForWeek = (weekNumber: number, day: DayOfWeek): WorkoutDay => {
  const phase = getPhaseForWeek(weekNumber);
  const isDeload = weekNumber === 4 || weekNumber === 8 || weekNumber === 12;

  const workouts = getWorkoutsByPhase(phase, isDeload, weekNumber);
  return workouts[day];
};

export const getPhaseForWeek = (weekNumber: number): Phase => {
  if (weekNumber <= 4) return 'Strength Foundation';
  if (weekNumber <= 8) return 'Power Development';
  if (weekNumber <= 12) return 'Power Endurance';
  return 'Peaking & Performance';
};

export const getPhaseInfo = (weekNumber: number) => {
  const phase = getPhaseForWeek(weekNumber);
  const isDeload = weekNumber === 4 || weekNumber === 8 || weekNumber === 12;

  let description = '';
  let weekRange = '';

  switch (phase) {
    case 'Strength Foundation':
      description = 'Building base strength, addressing weaknesses (crimps, overhangs, core tension)';
      weekRange = 'Weeks 1-4';
      break;
    case 'Power Development':
      description = 'Explosive power, limit bouldering, dynamic movements';
      weekRange = 'Weeks 5-8';
      break;
    case 'Power Endurance':
      description = 'Sustained hard sequences, 4×4 protocol, maintaining power';
      weekRange = 'Weeks 9-12';
      break;
    case 'Peaking & Performance':
      description = 'Peak for V7, reduce fatigue, performance sending sessions';
      weekRange = 'Weeks 13-16';
      break;
  }

  return { phase, description, weekRange, isDeload };
};

export const weeklySchedule: Record<DayOfWeek, string> = {
  Monday: 'REST DAY',
  Tuesday: 'Strength Training (5:15-6:45 PM)',
  Wednesday: 'Climbing (11 AM-1 PM)',
  Thursday: 'Climbing with Friend (1-3 PM)',
  Friday: 'Optional Climbing (11 AM-1 PM)',
  Saturday: 'Long Climbing Session (10 AM-12 PM)',
  Sunday: 'Home Training: Fingerboard + Antagonist',
};

const getWorkoutsByPhase = (phase: Phase, isDeload: boolean, weekNumber: number): Record<DayOfWeek, WorkoutDay> => {
  return {
    Monday: getMondayWorkout(phase, isDeload, weekNumber),
    Tuesday: getTuesdayWorkout(phase, isDeload, weekNumber),
    Wednesday: getWednesdayWorkout(phase, isDeload, weekNumber),
    Thursday: getThursdayWorkout(phase, isDeload, weekNumber),
    Friday: getFridayWorkout(phase, isDeload, weekNumber),
    Saturday: getSaturdayWorkout(phase, isDeload, weekNumber),
    Sunday: getSundayWorkout(phase, isDeload, weekNumber),
  };
};

// ============================================================================
// MONDAY - REST DAY (All Phases)
// ============================================================================
const getMondayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  return {
    day: 'Monday',
    title: 'REST DAY',
    duration: '10 min (optional)',
    focus: 'Full rest from hard training. Big Data class in evening.',
    sections: [
      {
        title: 'Optional Abrahangs (Only if feeling great)',
        duration: '10 min',
        exercises: [
          {
            id: 'mon1',
            name: 'Warm-up: Light Hangs',
            sets: 3,
            duration: 5,
            rest: 10,
            notes: 'Minimal load, feet on ground'
          },
          {
            id: 'mon2',
            name: 'Abrahangs: Half-Crimp',
            sets: 4,
            duration: 10,
            rest: 30,
            notes: '40% max intensity - light forearm strain only'
          },
          {
            id: 'mon3',
            name: 'Abrahangs: Open Hand',
            sets: 4,
            duration: 10,
            rest: 30,
            notes: '40% max intensity'
          },
          {
            id: 'mon4',
            name: 'Abrahangs: Three-Finger Drag',
            sets: 4,
            duration: 10,
            rest: 30,
            notes: '40% max intensity'
          },
          {
            id: 'mon5',
            name: 'Cool-down: Finger Stretches',
            duration: 60,
          },
        ],
      },
    ],
    importantNotes: [
      'SKIP Abrahangs if fingers are tired or sore',
      'This is a FULL REST DAY - only do Abrahangs if you feel 100%',
      'Big Data class 7:10-9:10 PM',
    ],
    lowEnergyVariant: 'Complete rest - no Abrahangs',
  };
};

// ============================================================================
// TUESDAY - STRENGTH TRAINING (Phase-specific)
// ============================================================================
const getTuesdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  if (phase === 'Strength Foundation') {
    return getTuesdayPhase1(isDeload);
  } else if (phase === 'Power Development') {
    return getTuesdayPhase2(isDeload);
  } else if (phase === 'Power Endurance') {
    return getTuesdayPhase3(isDeload);
  } else {
    return getTuesdayPhase4(isDeload, weekNumber);
  }
};

const getTuesdayPhase1 = (isDeload: boolean): WorkoutDay => {
  const deloadFactor = isDeload ? 0.7 : 1;

  return {
    day: 'Tuesday',
    title: 'Strength Training - Campus Gym',
    duration: '90 min (5:15-6:45 PM)',
    focus: 'Max strength upper pull, core tension for overhangs, antagonist work',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'tue1', name: 'Light Cardio', duration: 180 },
          { id: 'tue2', name: 'Joint Mobility', duration: 120, notes: 'Arm circles, scapular shrugs, wrist circles' },
          { id: 'tue3', name: 'Cat-Cow', sets: 1, reps: 10 },
          { id: 'tue4', name: 'Leg Swings', sets: 1, reps: '10 each direction' },
          { id: 'tue5', name: 'Bodyweight Squats', sets: 1, reps: 10 },
          { id: 'tue6', name: 'Push-ups', sets: 1, reps: 5 },
        ],
      },
      {
        title: 'Block A - Max Strength Upper Pull',
        duration: '30 min',
        exercises: [
          {
            id: 'tue7',
            name: 'Weighted Pull-ups',
            sets: Math.round(4 * deloadFactor),
            reps: '5-6',
            rest: 180,
            notes: 'Add weight if bodyweight easy. Use band if needed. Builds power for overhangs.'
          },
          {
            id: 'tue8',
            name: 'Inverted Rows (feet elevated)',
            sets: Math.round(3 * deloadFactor),
            reps: '8-10',
            rest: 120,
            notes: 'TRX/rings/barbell. Body rigid, squeeze shoulder blades.'
          },
          {
            id: 'tue9',
            name: 'Scapular Pull-ups',
            sets: Math.round(3 * deloadFactor),
            reps: '10-12',
            rest: 90,
            notes: 'Critical for shoulder stability.'
          },
        ],
      },
      {
        title: 'Block B - Core Tension (addresses overhang weakness)',
        duration: '25 min',
        exercises: [
          {
            id: 'tue10',
            name: 'Hollow Body Hold',
            sets: Math.round(4 * deloadFactor),
            duration: isDeload ? 30 : 45,
            rest: 60,
            notes: 'THE exercise for body tension. Lower back pressed to ground.'
          },
          {
            id: 'tue11',
            name: 'Hanging Leg Raises',
            sets: Math.round(3 * deloadFactor),
            reps: '8-12',
            rest: 90,
          },
          {
            id: 'tue12',
            name: 'Ab Wheel Rollouts',
            sets: Math.round(3 * deloadFactor),
            reps: '8-10',
            rest: 90,
          },
          {
            id: 'tue13',
            name: 'Dead Hangs (with tension)',
            sets: Math.round(3 * deloadFactor),
            duration: isDeload ? 20 : 30,
            rest: 60,
            notes: 'Full body tension. Squeeze glutes, point toes.'
          },
        ],
      },
      {
        title: 'Block C - Antagonist/Push',
        duration: '20 min',
        exercises: [
          { id: 'tue14', name: 'Wide-Grip Push-ups', sets: Math.round(3 * deloadFactor), reps: '15-20', rest: 90 },
          { id: 'tue15', name: 'DB Overhead Press', sets: Math.round(3 * deloadFactor), reps: '10-12', rest: 90 },
          { id: 'tue16', name: 'Dips', sets: Math.round(3 * deloadFactor), reps: '8-12', rest: 90 },
        ],
      },
      {
        title: 'Block D - Lower Body (OPTIONAL)',
        duration: '10 min',
        exercises: [
          { id: 'tue17', name: 'Goblet Squats', sets: 2, reps: 15, notes: 'Only if time/energy permits' },
          { id: 'tue18', name: 'Single-leg RDLs', sets: 2, reps: '10 each leg', notes: 'Only if time permits' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '5 min',
        exercises: [
          { id: 'tue19', name: 'Shoulder, Chest, Lat Stretch', duration: 300 },
        ],
      },
    ],
    importantNotes: [
      'Eat substantial snack 1-2 hours before (between classes)',
      'Protein + carbs within 30 min post-training',
      'Optional evening: Week 1 - Abrahangs if great, Week 2 - Abrahangs, Week 3 - Circuit, Week 4 - Rest',
    ],
    lowEnergyVariant: 'Skip Block D, reduce sets by 1 in all blocks',
  };
};

const getTuesdayPhase2 = (isDeload: boolean): WorkoutDay => {
  const deloadFactor = isDeload ? 0.7 : 1;

  return {
    day: 'Tuesday',
    title: 'Power Training - Campus Gym',
    duration: '90 min (5:15-6:45 PM)',
    focus: 'Explosive power, strength maintenance',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'tue1', name: 'Light Cardio', duration: 180 },
          { id: 'tue2', name: 'Dynamic Stretching & Mobility', duration: 420 },
        ],
      },
      {
        title: 'Block A - Power Circuit',
        duration: '35 min',
        exercises: [
          {
            id: 'tue4',
            name: 'Weighted Pull-ups (Heavy)',
            sets: Math.round(4 * deloadFactor),
            reps: '4-6',
            rest: 150,
            notes: 'Explosive concentric'
          },
          {
            id: 'tue5',
            name: 'Explosive Push-ups',
            sets: Math.round(4 * deloadFactor),
            reps: '8-10',
            rest: 150,
          },
          {
            id: 'tue6',
            name: 'Box Jumps',
            sets: Math.round(4 * deloadFactor),
            reps: 5,
            rest: 150,
          },
          {
            id: 'tue7',
            name: 'Medicine Ball Slams',
            sets: Math.round(4 * deloadFactor),
            reps: 8,
            rest: 150,
          },
        ],
      },
      {
        title: 'Block B - Strength Maintenance',
        duration: '25 min',
        exercises: [
          { id: 'tue8', name: 'Inverted Rows', sets: Math.round(3 * deloadFactor), reps: 8, rest: 90 },
          { id: 'tue9', name: 'Overhead Press', sets: Math.round(3 * deloadFactor), reps: 8, rest: 90 },
          { id: 'tue10', name: 'Hanging Leg Raises', sets: Math.round(3 * deloadFactor), reps: 10 },
          { id: 'tue11', name: 'Ab Wheel', sets: Math.round(3 * deloadFactor), reps: 10 },
          { id: 'tue12', name: 'Russian Twists', sets: Math.round(3 * deloadFactor), reps: 20 },
        ],
      },
      {
        title: 'Block C - Antagonist',
        duration: '15 min',
        exercises: [
          { id: 'tue13', name: 'Push-ups', sets: 3, reps: 20 },
          { id: 'tue14', name: 'Dips', sets: 3, reps: 12 },
          { id: 'tue15', name: 'Rotator Cuff Work', sets: 2, reps: 15 },
        ],
      },
      {
        title: 'Cool-down',
        duration: '5 min',
        exercises: [
          { id: 'tue16', name: 'Full Body Stretching', duration: 300 },
        ],
      },
    ],
    importantNotes: [
      'Focus on explosive movements',
      'Eat before training',
      'Post-training protein + carbs',
    ],
    lowEnergyVariant: 'Reduce power circuit to 3 sets, skip box jumps',
  };
};

const getTuesdayPhase3 = (isDeload: boolean): WorkoutDay => {
  const deloadFactor = isDeload ? 0.7 : 1;

  return {
    day: 'Tuesday',
    title: 'Power Endurance Training',
    duration: '90 min (5:15-6:45 PM)',
    focus: 'Power endurance circuit, core endurance',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'tue1', name: 'Light Cardio & Dynamic Stretching', duration: 600 },
        ],
      },
      {
        title: 'Block A - Power Endurance Circuit (shorter rest)',
        duration: '40 min',
        exercises: [
          {
            id: 'tue3',
            name: 'Pull-ups (moderate weight)',
            sets: Math.round(4 * deloadFactor),
            reps: '10-12',
            rest: isDeload ? 90 : 75,
          },
          {
            id: 'tue4',
            name: 'Push-ups',
            sets: Math.round(4 * deloadFactor),
            reps: 20,
            rest: isDeload ? 90 : 75,
          },
          {
            id: 'tue5',
            name: 'Inverted Rows',
            sets: Math.round(4 * deloadFactor),
            reps: 12,
            rest: isDeload ? 90 : 75,
          },
        ],
      },
      {
        title: 'Block B - Core Endurance',
        duration: '20 min',
        exercises: [
          { id: 'tue6', name: 'Plank', sets: Math.round(3 * deloadFactor), duration: 90, rest: 60 },
          { id: 'tue7', name: 'Side Plank', sets: Math.round(3 * deloadFactor), duration: 60, rest: 60, notes: 'Each side' },
          { id: 'tue8', name: 'Bicycle Crunches', sets: Math.round(3 * deloadFactor), reps: 30, rest: 60 },
          { id: 'tue9', name: 'Hollow Body Hold', sets: Math.round(3 * deloadFactor), duration: 45, rest: 60 },
        ],
      },
      {
        title: 'Block C - Extended Antagonist',
        duration: '20 min',
        exercises: [
          { id: 'tue10', name: 'Push-ups', sets: 4, reps: 20 },
          { id: 'tue11', name: 'Dips', sets: 3, reps: 12 },
          { id: 'tue12', name: 'Reverse Wrist Curls', sets: 3, reps: 20 },
          { id: 'tue13', name: 'Rotator Cuff Circuit', duration: 300 },
        ],
      },
    ],
    importantNotes: [
      'Shorter rest periods are key',
      'Antagonist work is injury prevention',
    ],
    lowEnergyVariant: 'Reduce to 3 sets, extend rest to 90 sec',
  };
};

const getTuesdayPhase4 = (isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isTaper = weekNumber >= 15;

  if (isTaper) {
    return {
      day: 'Tuesday',
      title: 'Light Strength Maintenance (TAPER)',
      duration: '45 min',
      focus: 'Maintain strength, reduce volume 50%',
      sections: [
        {
          title: 'Warm-up',
          duration: '10 min',
          exercises: [
            { id: 'tue1', name: 'Light Cardio & Mobility', duration: 600 },
          ],
        },
        {
          title: 'Maintenance Circuit (2 sets only)',
          duration: '25 min',
          exercises: [
            { id: 'tue2', name: 'Pull-ups', sets: 2, reps: 8, rest: 120 },
            { id: 'tue3', name: 'Push-ups', sets: 2, reps: 15, rest: 120 },
            { id: 'tue4', name: 'Plank', sets: 2, duration: 45, rest: 90 },
            { id: 'tue5', name: 'Hollow Body', sets: 2, duration: 30, rest: 90 },
          ],
        },
        {
          title: 'Antagonist',
          duration: '10 min',
          exercises: [
            { id: 'tue6', name: 'Push-ups', sets: 2, reps: 15 },
            { id: 'tue7', name: 'Rotator Cuff Work', sets: 2, reps: 12 },
          ],
        },
      ],
      importantNotes: [
        'TAPER WEEK - Keep intensity but reduce volume',
        'Stay fresh for Saturday sending session',
      ],
      lowEnergyVariant: 'Complete rest or light mobility only',
    };
  }

  return {
    day: 'Tuesday',
    title: 'Strength Maintenance',
    duration: '90 min (5:15-6:45 PM)',
    focus: 'Maintain all qualities, stay fresh for climbing',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'tue1', name: 'Light Cardio & Joint Mobility', duration: 600 },
        ],
      },
      {
        title: 'Maintenance Circuit',
        duration: '35 min',
        exercises: [
          { id: 'tue3', name: 'Pull-ups', sets: 3, reps: 8, rest: 120 },
          { id: 'tue4', name: 'Push-ups', sets: 3, reps: 15, rest: 120 },
          { id: 'tue5', name: 'Hollow Body', sets: 3, duration: 45, rest: 90 },
          { id: 'tue6', name: 'Plank', sets: 3, duration: 60, rest: 90 },
        ],
      },
      {
        title: 'Antagonist (Full Routine)',
        duration: '20 min',
        exercises: [
          { id: 'tue7', name: 'Wide Push-ups', sets: 3, reps: 15 },
          { id: 'tue8', name: 'Dips', sets: 3, reps: 10 },
          { id: 'tue9', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
          { id: 'tue10', name: 'Rotator Cuff Work', sets: 2, reps: 12, notes: 'External & internal' },
        ],
      },
    ],
    importantNotes: [
      'Antagonist work NON-NEGOTIABLE',
      'Stay fresh for climbing sessions',
    ],
    lowEnergyVariant: 'Reduce to 2 sets per exercise',
  };
};

// ============================================================================
// WEDNESDAY - CLIMBING (Phase-specific)
// ============================================================================
const getWednesdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  if (phase === 'Strength Foundation') {
    return getWednesdayPhase1(isDeload);
  } else if (phase === 'Power Development') {
    return getWednesdayPhase2(isDeload);
  } else if (phase === 'Power Endurance') {
    return getWednesdayPhase3(isDeload);
  } else {
    return getWednesdayPhase4(isDeload, weekNumber);
  }
};

const getWednesdayPhase1 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Wednesday',
    title: 'Climbing Session',
    duration: '2 hours (11 AM-1 PM)',
    focus: 'Crimp-focused technique, overhang strength, volume',
    sections: [
      {
        title: 'Warm-up',
        duration: '25 min',
        exercises: [
          { id: 'wed1', name: 'Light Cardio', duration: 300 },
          { id: 'wed2', name: 'Dynamic Stretching', duration: 300 },
          { id: 'wed3', name: 'Wrist/Finger Mobility', duration: 120 },
          { id: 'wed4', name: 'Easy Climbing: VB-V3', reps: '6-8 problems' },
          { id: 'wed5', name: 'Dead Hangs', sets: 3, duration: 10 },
        ],
      },
      {
        title: 'Block A - Crimp-Focused Technique',
        duration: '30 min',
        exercises: [
          {
            id: 'wed6',
            name: 'V2-V3 Crimp Problems',
            reps: isDeload ? '3-4 problems' : '4-5 problems',
            notes: 'Focus: Half-crimp positioning, lock-off strength, straight arms between moves, silent feet. 3-4 attempts per problem. Rest 3-4 min.'
          },
        ],
      },
      {
        title: 'Block B - Overhang Strength',
        duration: '35 min',
        exercises: [
          {
            id: 'wed7',
            name: 'V4 Overhang Problems (30-45°)',
            reps: isDeload ? '2 problems' : '3 problems',
            notes: 'Focus: Core tension, feet staying on, breathing. 5-6 attempts. Rest 5 min. Should feel HARD.'
          },
        ],
      },
      {
        title: 'Block C - Volume/Endurance',
        duration: '20 min',
        exercises: [
          {
            id: 'wed8',
            name: 'Easy Problems V1-V3',
            reps: isDeload ? '4-5 problems' : '5-6 problems',
            notes: 'Continuous movement. Shorter rests (2 min). Practice recovery positions.'
          },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'wed9', name: 'Easy Climbing & Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Good breakfast 1.5-2 hours before. Bring snacks.',
      'Post-climbing: Protein + carbs within 30 min',
      'Film your crimp and overhang problems',
    ],
    lowEnergyVariant: 'Reduce Block A and B by 1 problem each, skip Block C',
  };
};

const getWednesdayPhase2 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Wednesday',
    title: 'Power Climbing Session',
    duration: '2 hours (11 AM-1 PM)',
    focus: 'Limit bouldering, power work, dynamic movement',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'wed1', name: 'Cardio & Dynamic Stretching', duration: 600 },
          { id: 'wed2', name: 'Easy Climbing: VB-V2', reps: '6-8 problems' },
          { id: 'wed3', name: 'Dead Hangs', sets: 3, duration: 10 },
        ],
      },
      {
        title: 'Block A - Power Work',
        duration: '40 min',
        exercises: [
          {
            id: 'wed4',
            name: 'Limit Bouldering V4-V5 (short, 3-6 moves)',
            reps: isDeload ? '4-6 problems' : '6-8 problems',
            notes: '2-3 attempts. FULL rest: 5-6 min between.'
          },
        ],
      },
      {
        title: 'Block B - Dynamic Movement',
        duration: '30 min',
        exercises: [
          {
            id: 'wed5',
            name: 'Campus Board OR Dynamic Problems',
            notes: 'Campus: Basic laddering, 4 sets × 4 movements. No campus: 5-6 dynos/slappy problems. Rest 4 min.'
          },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'wed6', name: 'Easy Climbing & Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Full rest between limit problems is critical',
      'STOP if elbows hurt during campus work',
    ],
    lowEnergyVariant: 'Skip Block B, reduce Block A to 4 problems',
  };
};

const getWednesdayPhase3 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Wednesday',
    title: '4×4 Protocol Climbing',
    duration: '2 hours (11 AM-1 PM)',
    focus: 'Power endurance, 4×4 protocol',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'wed1', name: 'Cardio, Stretching & Easy Climbing', duration: 1200 },
        ],
      },
      {
        title: 'Block A - 4×4 Protocol',
        duration: '45 min',
        exercises: [
          {
            id: 'wed2',
            name: '4×4 Circuit',
            notes: isDeload
              ? 'Select 3 problems at V3. Climb each 3 times minimal rest. Rest 5 min. Repeat. Goal: 2 rounds (18 problems).'
              : 'Select 4 problems at V3-V4. Climb each 4 times minimal rest (~30 sec). Rest 5 min. Repeat. Goal: 2 rounds (32 problems).'
          },
        ],
      },
      {
        title: 'Block B - Recovery/Technique',
        duration: '25 min',
        exercises: [
          {
            id: 'wed3',
            name: 'Easy V1-V2 Climbing',
            notes: 'Practice recovery positions. Practice shaking out.'
          },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'wed4', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      '4×4 protocol is intense - pace yourself',
      'Minimal rest is part of the training',
      'Practice staying calm when pumped',
    ],
    lowEnergyVariant: '3×3 protocol instead',
  };
};

const getWednesdayPhase4 = (isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isTaper = weekNumber >= 15;

  if (isTaper) {
    return {
      day: 'Wednesday',
      title: 'Light Technical Climbing (TAPER)',
      duration: '30 min',
      focus: 'Stay warm, movement quality',
      sections: [
        {
          title: 'Warm-up & Light Volume',
          duration: '30 min',
          exercises: [
            { id: 'wed1', name: 'Easy Climbing: VB-V2', reps: '6-8 problems' },
            { id: 'wed2', name: 'V2-V3 Problems', reps: '4-5 problems', notes: 'Movement focus. Stay fresh.' },
          ],
        },
      ],
      importantNotes: [
        'TAPER - Keep it short',
        'Save energy for Saturday sending session',
      ],
      lowEnergyVariant: 'Complete rest day',
    };
  }

  return {
    day: 'Wednesday',
    title: 'Project Session - V6-V7',
    duration: '2 hours (11 AM-1 PM)',
    focus: 'Project V6-V7 problems extensively',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'wed1', name: 'Extended Warm-up', duration: 1200 },
        ],
      },
      {
        title: 'Block A - Project V6-V7',
        duration: '60 min',
        exercises: [
          {
            id: 'wed2',
            name: 'Main Projects (2 problems)',
            notes: isDeload
              ? 'Work 1-2 V6 projects. 6-8 attempts. Rest 8 min.'
              : 'Work 2 V6-V7 projects. 8-12 attempts each. Rest 8 min. Film and review.'
          },
        ],
      },
      {
        title: 'Block B - Flash Attempts',
        duration: '20 min',
        exercises: [
          { id: 'wed3', name: 'Flash V4-V5', reps: '3-4 problems', notes: 'Build confidence.' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'wed4', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Performance phase - focus on V7 goal',
      'Break down projects into sections',
      'Film attempts and review',
    ],
    lowEnergyVariant: 'Work 1 project with 6-8 attempts',
  };
};

// ============================================================================
// THURSDAY - CLIMBING WITH FRIEND (Phase-specific)
// ============================================================================
const getThursdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  if (phase === 'Strength Foundation') {
    return getThursdayPhase1(isDeload);
  } else if (phase === 'Power Development') {
    return getThursdayPhase2(isDeload);
  } else if (phase === 'Power Endurance') {
    return getThursdayPhase3(isDeload);
  } else {
    return getThursdayPhase4(isDeload, weekNumber);
  }
};

const getThursdayPhase1 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Thursday',
    title: 'Climbing with Friend',
    duration: '2 hours (1-3 PM)',
    focus: 'Social climbing, work weaknesses, moderate intensity',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'thu1', name: 'Warm-up Together', duration: 1200 },
        ],
      },
      {
        title: 'Block A - Variety Climbing',
        duration: '40 min',
        exercises: [
          {
            id: 'thu2',
            name: 'Mixed V2-V4 Problems',
            reps: isDeload ? '8-10 problems' : '10-12 problems',
            notes: 'Different styles: slabs, vertical, overhangs, technical. 2-3 attempts. Rest 3 min. Have fun but push.'
          },
        ],
      },
      {
        title: 'Block B - Work Weaknesses',
        duration: '30 min',
        exercises: [
          {
            id: 'thu3',
            name: 'Crimpy & Overhang Problems',
            reps: isDeload ? '2 problems' : '2-3 problems',
            notes: 'Project together. Give beta. Film each other. 4-5 attempts. Rest 4-5 min.'
          },
        ],
      },
      {
        title: 'Block C - Fun Climbing',
        duration: '15 min',
        exercises: [
          { id: 'thu4', name: 'Whatever You Both Want', notes: 'Flash V3s for confidence.' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'thu5', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Most fun session - keep it social',
      'Be intentional about weaknesses',
      'Don\'t skip for homework - friend time AND training',
    ],
    lowEnergyVariant: 'Skip Block B, focus on social fun climbing',
  };
};

const getThursdayPhase2 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Thursday',
    title: 'Climbing with Friend',
    duration: '2 hours (1-3 PM)',
    focus: 'Moderate intensity, flash attempts',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'thu1', name: 'Warm-up Together', duration: 1200 },
        ],
      },
      {
        title: 'Main Session',
        duration: '70 min',
        exercises: [
          {
            id: 'thu2',
            name: 'V3-V4 Flash Attempts',
            reps: isDeload ? '10-12 problems' : '12-15 problems',
            notes: 'Flash or 2nd go. Read beta quickly. Rest 3 min.'
          },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'thu3', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Focus on reading problems quickly',
      'Practice efficient beta',
    ],
    lowEnergyVariant: 'Reduce to V2-V3, fewer problems',
  };
};

const getThursdayPhase3 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Thursday',
    title: 'Linked Problems with Friend',
    duration: '2 hours (1-3 PM)',
    focus: 'Power endurance - linked problems',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'thu1', name: 'Warm-up Together', duration: 1200 },
        ],
      },
      {
        title: 'Block A - Linked Problems',
        duration: '60 min',
        exercises: [
          {
            id: 'thu2',
            name: 'V2-V3 Back-to-Back',
            reps: isDeload ? '4-6 sets' : '6-8 sets',
            notes: 'Climb 2-3 problems back-to-back NO rest. Rest 4 min between sets.'
          },
        ],
      },
      {
        title: 'Block B - Fun Climbing',
        duration: '20 min',
        exercises: [
          { id: 'thu3', name: 'Social Climbing', notes: 'Whatever you want' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'thu4', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Linked problems are intense - pace yourselves',
      'Work together, encourage each other',
    ],
    lowEnergyVariant: 'Single problems instead of linked',
  };
};

const getThursdayPhase4 = (isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isTaper = weekNumber >= 15;

  return {
    day: 'Thursday',
    title: 'Short Session with Friend',
    duration: isTaper ? '60 min' : '2 hours (1-3 PM)',
    focus: isTaper ? 'Stay fresh, V3-V4 only' : 'Moderate volume V3-V5',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'thu1', name: 'Warm-up', duration: 1200 },
        ],
      },
      {
        title: 'Main Session',
        duration: isTaper ? '30 min' : '70 min',
        exercises: [
          {
            id: 'thu2',
            name: isTaper ? 'V3-V4 Problems' : 'V3-V5 Problems',
            reps: isTaper ? '6-8 problems' : (isDeload ? '8-10 problems' : '10-12 problems'),
            notes: isTaper ? 'Stay fresh for Saturday.' : 'Work on crimps and overhangs. Rest 4 min.'
          },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'thu3', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: isTaper
      ? ['TAPER - Keep it short (60 min total)', 'Stay fresh for Saturday']
      : ['Focus on crimp and overhang weaknesses', 'Have fun with friend'],
    lowEnergyVariant: 'Very light climbing, 30-45 min',
  };
};

// ============================================================================
// FRIDAY - OPTIONAL CLIMBING (Phase-specific)
// ============================================================================
const getFridayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  if (phase === 'Strength Foundation') {
    return getFridayPhase1(isDeload);
  } else if (phase === 'Power Development') {
    return getFridayPhase2(isDeload);
  } else if (phase === 'Power Endurance') {
    return getFridayPhase3(isDeload);
  } else {
    return getFridayPhase4(weekNumber);
  }
};

const getFridayPhase1 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Friday',
    title: 'OPTIONAL Climbing',
    duration: '2 hours (11 AM-1 PM)',
    focus: 'Choose: endurance, power, or technique',
    sections: [
      {
        title: 'DO THIS IF: Fresh, fingers good, excited, no soreness',
        duration: '',
        exercises: [
          { id: 'fri0', name: 'Checklist', notes: 'Feel fresh ✓ Fingers good ✓ Excited ✓ No soreness ✓' },
        ],
      },
      {
        title: 'SKIP IF: Fingers sore, tired, homework, climbed hard Thursday',
        duration: '',
        exercises: [
          { id: 'fri0b', name: 'Warning Signs', notes: 'Fingers sore ✗ Tired ✗ Homework ✗ Hard Thursday ✗' },
        ],
      },
      {
        title: 'Warm-up (if you go)',
        duration: '20 min',
        exercises: [
          { id: 'fri1', name: 'Standard Warm-up', duration: 1200 },
        ],
      },
      {
        title: 'Option A - Endurance',
        duration: '60 min',
        exercises: [
          { id: 'fri2a', name: 'Pyramid: V0(1), V1(2), V2(3), V3(2), V2(1)', notes: 'Rest 90 sec' },
          { id: 'fri3a', name: 'Dynamic V3-V4 Problems', reps: '3-4 problems', notes: '20 min' },
        ],
      },
      {
        title: 'Option B - Power',
        duration: '60 min',
        exercises: [
          { id: 'fri2b', name: 'Limit Bouldering V4-V5', reps: '6-8 problems', notes: '3 tries each. Full rest (5 min).' },
        ],
      },
      {
        title: 'Option C - Technique',
        duration: '60 min',
        exercises: [
          { id: 'fri2c', name: 'Perfect Movement V0-V3', reps: '15-20 problems', notes: 'Silent feet, smooth.' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'fri4', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'COMPLETELY OPTIONAL',
      'Listen to your body',
      'Don\'t burn out',
    ],
    lowEnergyVariant: 'Complete rest day',
  };
};

const getFridayPhase2 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Friday',
    title: 'OPTIONAL Climbing',
    duration: '2 hours (11 AM-1 PM)',
    focus: 'System board or power endurance',
    sections: [
      {
        title: 'DO THIS IF: Fresh ✓ Fingers good ✓',
        duration: '',
        exercises: [
          { id: 'fri0', name: 'Checklist', notes: 'Feel fresh ✓ Fingers good ✓' },
        ],
      },
      {
        title: 'SKIP IF: Tired or sore ✗',
        duration: '',
        exercises: [
          { id: 'fri0b', name: 'Warning Signs', notes: 'Tired ✗ Sore ✗' },
        ],
      },
      {
        title: 'Warm-up (if you go)',
        duration: '20 min',
        exercises: [
          { id: 'fri1', name: 'Standard Warm-up', duration: 1200 },
        ],
      },
      {
        title: 'Option A - System Board',
        duration: '70 min',
        exercises: [
          { id: 'fri2a', name: 'System Board Sequences', reps: '6-8 sequences of 4-6 moves', notes: 'Repeat each 3 times. Rest 4 min.' },
        ],
      },
      {
        title: 'Option B - Power Endurance Pyramid',
        duration: '70 min',
        exercises: [
          { id: 'fri2b', name: 'V2 Problems', reps: '4', notes: '90 sec rest' },
          { id: 'fri3b', name: 'V3 Problems', reps: '3', notes: '90 sec rest' },
          { id: 'fri4b', name: 'V4 Problems', reps: '2', notes: '2 min rest' },
          { id: 'fri5b', name: 'V3 Problems', reps: '3', notes: '90 sec rest' },
          { id: 'fri6b', name: 'V2 Problems', reps: '2', notes: '90 sec rest' },
        ],
      },
    ],
    importantNotes: [
      'OPTIONAL - skip if tired',
      'Choose based on how you feel',
    ],
    lowEnergyVariant: 'Complete rest day',
  };
};

const getFridayPhase3 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Friday',
    title: 'OPTIONAL Climbing',
    duration: '2 hours (11 AM-1 PM)',
    focus: 'Intervals or flash practice',
    sections: [
      {
        title: 'DO THIS IF: Fresh ✓',
        duration: '',
        exercises: [
          { id: 'fri0', name: 'Checklist', notes: 'Feel fresh ✓' },
        ],
      },
      {
        title: 'SKIP IF: Tired ✗',
        duration: '',
        exercises: [
          { id: 'fri0b', name: 'Warning Signs', notes: 'Tired ✗' },
        ],
      },
      {
        title: 'Warm-up (if you go)',
        duration: '20 min',
        exercises: [
          { id: 'fri1', name: 'Standard Warm-up', duration: 1200 },
        ],
      },
      {
        title: 'Option A - Intervals',
        duration: '50 min',
        exercises: [
          { id: 'fri2a', name: 'V2-V3 Intervals', reps: '8-10 rounds', notes: 'Climb 2 min continuously. Rest 2 min. Repeat.' },
        ],
      },
      {
        title: 'Option B - Flash Practice',
        duration: '30 min',
        exercises: [
          { id: 'fri2b', name: 'Flash V3-V4', reps: '5-6 problems', notes: 'One attempt each. Work on beta reading.' },
        ],
      },
    ],
    importantNotes: [
      'OPTIONAL - listen to your body',
      'Intervals are tough - only if feeling strong',
    ],
    lowEnergyVariant: 'Complete rest day',
  };
};

const getFridayPhase4 = (weekNumber: number): WorkoutDay => {
  const isTaper = weekNumber >= 15;

  return {
    day: 'Friday',
    title: isTaper ? 'REST DAY (TAPER)' : 'OPTIONAL Light Climbing',
    duration: isTaper ? 'Complete rest' : '60-90 min (if going)',
    focus: isTaper ? 'Complete rest or light mobility' : 'Light climbing if great, otherwise REST',
    sections: isTaper ? [
      {
        title: 'TAPER WEEK - Complete Rest',
        duration: '',
        exercises: [
          { id: 'fri1', name: 'REST', notes: 'Take completely off. Light stretching only. Focus on recovery for Saturday.' },
        ],
      },
    ] : [
      {
        title: 'SKIP IF: Default is REST',
        duration: '',
        exercises: [
          { id: 'fri0', name: 'Default REST', notes: 'Only go if 100% and excited' },
        ],
      },
      {
        title: 'If You Go (Very Light)',
        duration: '60 min',
        exercises: [
          { id: 'fri1', name: 'Warm-up', duration: 900 },
          { id: 'fri2', name: 'Easy V2-V3 Climbing', reps: '8-10 problems', notes: 'Movement quality only. Stay fresh.' },
        ],
      },
    ],
    importantNotes: isTaper
      ? ['TAPER - Complete rest', 'Save all energy for Saturday']
      : ['Default is REST during performance phase', 'Only climb if feeling perfect'],
    lowEnergyVariant: 'Complete rest',
  };
};

// ============================================================================
// SATURDAY - LONG SESSION (Phase-specific)
// ============================================================================
const getSaturdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  if (phase === 'Strength Foundation') {
    return getSaturdayPhase1(isDeload);
  } else if (phase === 'Power Development') {
    return getSaturdayPhase2(isDeload);
  } else if (phase === 'Power Endurance') {
    return getSaturdayPhase3(isDeload);
  } else {
    return getSaturdayPhase4(isDeload, weekNumber);
  }
};

const getSaturdayPhase1 = (isDeload: boolean): WorkoutDay => {
  const gradeRange = isDeload ? 'V3-V4' : 'V4-V5';

  return {
    day: 'Saturday',
    title: 'Long Climbing Session - PROJECT DAY',
    duration: '2.5-3 hours (10 AM-12:30 PM)',
    focus: 'Project at limit, volume work - KEY climbing day',
    sections: [
      {
        title: 'Warm-up (Extended)',
        duration: '30 min',
        exercises: [
          { id: 'sat1', name: 'Cardio, Stretching, Easy Climbing VB→V3', duration: 1800, notes: 'No rush, get really warm' },
        ],
      },
      {
        title: 'Block A - Project Time',
        duration: '70 min',
        exercises: [
          {
            id: 'sat2',
            name: `Limit Projects ${gradeRange}`,
            reps: isDeload ? '1-2 problems' : '2-3 problems',
            notes: isDeload
              ? '4-6 attempts. Rest 6-7 min. CRIMPY and OVERHANG problems.'
              : '6-10 attempts per problem. LONG rests (7-8 min). Learn beta. Film, review, adjust. Try HARD. CRIMPY and OVERHANG problems.'
          },
        ],
      },
      {
        title: 'Block B - Volume',
        duration: '30 min',
        exercises: [
          {
            id: 'sat3',
            name: 'Easier Problems V1-V3',
            reps: isDeload ? '6-8 problems' : '8-12 problems',
            notes: 'Movement quality. Different styles. Rest 2-3 min.'
          },
        ],
      },
      {
        title: 'Block C - Fun Climbing',
        duration: '15-20 min',
        exercises: [
          { id: 'sat4', name: 'Whatever You Want', notes: 'Flash problems for confidence. Keep the love alive.' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'sat5', name: 'Easy Climbing, Stretching, Foam Roll', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'KEY climbing day - make it count',
      'Film projects and review',
      'Focus on crimps and overhangs',
      'Big meal post-session: protein + carbs',
    ],
    lowEnergyVariant: 'Reduce Block A to 1 problem with 4-6 attempts',
  };
};

const getSaturdayPhase2 = (isDeload: boolean): WorkoutDay => {
  const gradeRange = isDeload ? 'V4-V5' : 'V5-V6';

  return {
    day: 'Saturday',
    title: 'Long Session - LIMIT BOULDERING',
    duration: '2.5-3 hours (10 AM-12:30 PM)',
    focus: 'Limit bouldering V5-V6, volume',
    sections: [
      {
        title: 'Warm-up (Extended)',
        duration: '25 min',
        exercises: [
          { id: 'sat1', name: 'Extended Warm-up', duration: 1500 },
        ],
      },
      {
        title: 'Block A - Limit Bouldering',
        duration: '70 min',
        exercises: [
          {
            id: 'sat2',
            name: `${gradeRange} Problems`,
            reps: isDeload ? '2-3 problems' : '3-4 problems',
            notes: isDeload
              ? '6-8 attempts. Rest 7 min.'
              : '8-10 attempts. Try hard. Rest 7-8 min. Film and review.'
          },
        ],
      },
      {
        title: 'Block B - Volume',
        duration: '40 min',
        exercises: [
          { id: 'sat3', name: 'V2-V3 for Fun', reps: '10-15 problems', notes: 'Movement quality. Variety.' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'sat4', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Limit bouldering day - push hard',
      'Full rest between attempts',
      'Big meal afterward',
    ],
    lowEnergyVariant: 'Reduce Block A to 2 problems with 6 attempts',
  };
};

const getSaturdayPhase3 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Saturday',
    title: 'Long Session - POWER + ENDURANCE',
    duration: '2.5-3 hours (10 AM-12:30 PM)',
    focus: 'Power maintenance, endurance circuits',
    sections: [
      {
        title: 'Warm-up',
        duration: '25 min',
        exercises: [
          { id: 'sat1', name: 'Extended Warm-up', duration: 1500 },
        ],
      },
      {
        title: 'Block A - Power Maintenance',
        duration: '40 min',
        exercises: [
          {
            id: 'sat2',
            name: 'Limit Problems V5-V6',
            reps: isDeload ? '3-4 problems' : '4-5 problems',
            notes: isDeload ? '2-3 attempts. Rest 6 min.' : '3-4 attempts. Rest 6 min. Maintain power.'
          },
        ],
      },
      {
        title: 'Block B - Endurance Circuits',
        duration: '50 min',
        exercises: [
          {
            id: 'sat3',
            name: 'Linked Problems, Traversing, Long V2-V3 Sequences',
            notes: isDeload ? 'Moderate volume.' : 'High volume endurance. Stay calm when pumped.'
          },
        ],
      },
      {
        title: 'Block C - Open Climbing',
        duration: '30 min',
        exercises: [
          { id: 'sat4', name: 'Social, Fun Climbing', notes: 'Whatever you want. Enjoy.' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'sat5', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Balance power maintenance with endurance',
      'Big meal afterward',
    ],
    lowEnergyVariant: 'Skip Block C, reduce Block B',
  };
};

const getSaturdayPhase4 = (isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isTaper = weekNumber >= 15;

  if (isTaper) {
    return {
      day: 'Saturday',
      title: 'SEND SESSION - V7 PERFORMANCE DAY',
      duration: '2-3 hours',
      focus: 'TRY TO SEND V7 - This is THE day',
      sections: [
        {
          title: 'Warm-up (Extended - Take Your Time)',
          duration: '30-40 min',
          exercises: [
            { id: 'sat1', name: 'Extended Warm-up', duration: 2400, notes: 'Get fully warm. No rush.' },
          ],
        },
        {
          title: 'SEND SESSION',
          duration: '130-150 min',
          exercises: [
            {
              id: 'sat2',
              name: 'TRY V7 PROJECTS',
              notes: 'As many attempts as needed. Rest FULLY (8-10 min). Don\'t worry about volume. FOCUS: Quality attempts, learning, SENDING. Max 4-6 hard attempts per project. Stop when you send or feel tired.'
            },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'sat3', name: 'Stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        '🎯 THIS IS THE DAY - Go for your V7 goal',
        'Max 4-6 hard attempts, then rest or try different project',
        'Rest 10+ min between attempts',
        'You\'ve trained 15 weeks for this - trust your training',
      ],
      lowEnergyVariant: 'Light warm-up and 2-3 attempts only',
    };
  }

  return {
    day: 'Saturday',
    title: 'PERFORMANCE SESSION - Project V6-V7',
    duration: '2.5-3 hours (10 AM-12:30 PM)',
    focus: 'Sending session - work V6-V7 projects',
    sections: [
      {
        title: 'Warm-up (Extended)',
        duration: '30 min',
        exercises: [
          { id: 'sat1', name: 'Extended Warm-up', duration: 1800, notes: 'Take your time. Get fully prepared.' },
        ],
      },
      {
        title: 'SENDING SESSION',
        duration: '130-150 min',
        exercises: [
          {
            id: 'sat2',
            name: 'Work V6-V7 Projects',
            notes: isDeload
              ? 'Work 1-2 projects. 6-8 attempts. Rest 8-10 min. Focus on sending.'
              : 'Try to SEND. As many attempts as needed. Rest fully (8-10 min). FOCUS: Quality attempts, learning, sending. Stop when you send or feel tired.'
          },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'sat3', name: 'Stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Performance phase - focus on SENDING',
      'Quality over quantity',
      'Film your attempts',
      'Big meal afterward',
    ],
    lowEnergyVariant: 'Work 1 project only with 4-6 attempts',
  };
};

// ============================================================================
// SUNDAY - HOME TRAINING: FINGERBOARD + ANTAGONIST (Phase-specific)
// ============================================================================
const getSundayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  if (phase === 'Strength Foundation') {
    return getSundayPhase1(isDeload);
  } else if (phase === 'Power Development') {
    return getSundayPhase2(isDeload);
  } else if (phase === 'Power Endurance') {
    return getSundayPhase3(isDeload);
  } else {
    return getSundayPhase4(isDeload, weekNumber);
  }
};

const getSundayPhase1 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Sunday',
    title: 'Home Training: Fingerboard + Antagonist',
    duration: '~1 hour (flexible timing)',
    focus: 'Eva López Max Hangs protocol - addresses crimp weakness',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'sun1', name: 'Wrist Circles', reps: '20 each direction' },
          { id: 'sun2', name: 'Finger Flexion/Extension', reps: 20 },
          { id: 'sun3', name: 'Fist Pumps', reps: 20 },
          { id: 'sun4', name: 'Easy Hangs on Big Holds', sets: 3, duration: 10, notes: '50% intensity' },
        ],
      },
      {
        title: 'Fingerboard - Max Hangs (Eva López Protocol)',
        duration: '35 min',
        exercises: [
          {
            id: 'sun5',
            name: 'Half-Crimp (PRIORITY)',
            sets: isDeload ? 3 : 5,
            duration: 12,
            rest: 180,
            notes: '85-90% max (edge you can barely hang ~15 sec). Thumb over index. Stop 2-3 sec BEFORE failure. Start 20mm edge.'
          },
          {
            id: 'sun6',
            name: 'Open Hand',
            sets: isDeload ? 3 : 5,
            duration: 12,
            rest: 180,
            notes: 'Fingers extended, contact on pads.'
          },
          {
            id: 'sun7',
            name: 'Three-Finger Drag',
            sets: isDeload ? 3 : 5,
            duration: 12,
            rest: 180,
            notes: 'Index, middle, ring only.'
          },
        ],
      },
      {
        title: 'Antagonist Work (DON\'T SKIP)',
        duration: '15 min',
        exercises: [
          { id: 'sun8', name: 'Reverse Wrist Curls', sets: 3, reps: 15, notes: 'Light weight' },
          { id: 'sun9', name: 'Rice Bucket', sets: 2, duration: 60, notes: 'Or band finger extensions' },
          { id: 'sun10', name: 'Push-ups', sets: 2, reps: 15 },
          { id: 'sun11', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
          { id: 'sun12', name: 'Rotator Cuff External Rotation', sets: 2, reps: 12, notes: 'Each arm' },
          { id: 'sun13', name: 'Rotator Cuff Internal Rotation', sets: 2, reps: 12, notes: 'Each arm' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '5 min',
        exercises: [
          { id: 'sun14', name: 'Finger, Wrist, Shoulder Stretches', duration: 300 },
        ],
      },
    ],
    importantNotes: [
      'CRITICAL: Never hang to complete failure. Stop 2-3 sec BEFORE.',
      'Sharp pain = STOP immediately. Dull ache normal, sharp pain not.',
      'Add weight conservatively (2-5 lbs/week) if you can hang 15+ sec easily.',
      'Week progression: Week 1-2 find baseline, Week 3 add 2-5 lbs, Week 4 deload to 70%.',
    ],
    lowEnergyVariant: 'Reduce to 3 hangs per grip, 80% intensity',
  };
};

const getSundayPhase2 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Sunday',
    title: 'Home Training: Weighted Max Hangs',
    duration: '~1 hour',
    focus: 'Weighted Max Hangs - 7 second hangs at 90-95%',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'sun1', name: 'Wrist Circles', reps: '20 each direction' },
          { id: 'sun2', name: 'Finger Flexion/Extension', reps: 20 },
          { id: 'sun3', name: 'Fist Pumps', reps: 20 },
          { id: 'sun4', name: 'Easy Hangs', sets: 3, duration: 10, notes: '50% intensity' },
        ],
      },
      {
        title: 'Fingerboard - Weighted Max Hangs',
        duration: '35 min',
        exercises: [
          {
            id: 'sun5',
            name: 'Half-Crimp with Weight',
            sets: isDeload ? 4 : 6,
            duration: 7,
            rest: 180,
            notes: '90-95% max. Add weight via harness/belt. Use 18mm edge if added weight successfully. Aim to add 2-5 lbs/week.'
          },
          {
            id: 'sun6',
            name: 'Open Hand with Weight',
            sets: isDeload ? 4 : 6,
            duration: 7,
            rest: 180,
            notes: 'Same intensity.'
          },
        ],
      },
      {
        title: 'Antagonist + Mobility',
        duration: '15 min',
        exercises: [
          { id: 'sun7', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
          { id: 'sun8', name: 'Rice Bucket', sets: 2, duration: 60 },
          { id: 'sun9', name: 'Push-ups', sets: 2, reps: 15 },
          { id: 'sun10', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
          { id: 'sun11', name: 'Rotator Cuff Work', sets: 2, reps: 12 },
        ],
      },
    ],
    importantNotes: [
      'Add weight progressively - 2-5 lbs/week',
      'Never hang to failure',
      'Sharp pain = stop immediately',
    ],
    lowEnergyVariant: 'Reduce to 4 hangs per grip, same intensity',
  };
};

const getSundayPhase3 = (isDeload: boolean): WorkoutDay => {
  return {
    day: 'Sunday',
    title: 'Home Training: Fingerboard Repeaters',
    duration: '~1 hour',
    focus: 'Repeaters 7/3 protocol - power endurance',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'sun1', name: 'Wrist Circles', reps: '20 each direction' },
          { id: 'sun2', name: 'Finger Flexion/Extension', reps: 20 },
          { id: 'sun3', name: 'Fist Pumps', reps: 20 },
          { id: 'sun4', name: 'Easy Hangs', sets: 3, duration: 10 },
        ],
      },
      {
        title: 'Fingerboard - Repeaters 7/3',
        duration: '35 min',
        exercises: [
          {
            id: 'sun5',
            name: 'Half-Crimp Repeaters',
            sets: isDeload ? 2 : 3,
            reps: '6 reps of 7sec hang / 3sec rest',
            rest: 180,
            notes: '60-70% max intensity. 1 set = 7 sec hang / 3 sec rest × 6 reps.'
          },
          {
            id: 'sun6',
            name: 'Open Hand Repeaters',
            sets: isDeload ? 2 : 3,
            reps: '6 reps of 7sec hang / 3sec rest',
            rest: 180,
            notes: 'Same protocol.'
          },
          {
            id: 'sun7',
            name: 'Three-Finger Repeaters',
            sets: isDeload ? 2 : 3,
            reps: '6 reps of 7sec hang / 3sec rest',
            rest: 180,
            notes: 'Same protocol.'
          },
        ],
      },
      {
        title: 'Antagonist',
        duration: '15 min',
        exercises: [
          { id: 'sun8', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
          { id: 'sun9', name: 'Rice Bucket', sets: 2, duration: 60 },
          { id: 'sun10', name: 'Push-ups', sets: 2, reps: 15 },
          { id: 'sun11', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
          { id: 'sun12', name: 'Rotator Cuff Work', sets: 2, reps: 12 },
        ],
      },
    ],
    importantNotes: [
      'Repeaters build power endurance',
      '60-70% intensity - not maximal',
      'Should feel challenging by end of each set',
    ],
    lowEnergyVariant: 'Reduce to 2 sets per grip',
  };
};

const getSundayPhase4 = (isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isTaper = weekNumber >= 15;

  return {
    day: 'Sunday',
    title: 'Light Fingerboard Maintenance',
    duration: '45 min',
    focus: 'Maintain finger strength at reduced volume',
    sections: [
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'sun1', name: 'Finger Warm-up', duration: 600 },
        ],
      },
      {
        title: 'Light Maintenance Hangs',
        duration: '25 min',
        exercises: [
          {
            id: 'sun2',
            name: 'Half-Crimp Max Hangs',
            sets: 3,
            duration: 12,
            rest: 180,
            notes: isTaper ? '50-60% intensity. Maintain, not build.' : '70% intensity. Maintain finger strength.'
          },
          {
            id: 'sun3',
            name: 'Open Hand Max Hangs',
            sets: 3,
            duration: 12,
            rest: 180,
            notes: 'Same reduced intensity.'
          },
        ],
      },
      {
        title: 'Antagonist (Full Routine)',
        duration: '20 min',
        exercises: [
          { id: 'sun4', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
          { id: 'sun5', name: 'Rice Bucket', sets: 2, duration: 60 },
          { id: 'sun6', name: 'Push-ups', sets: 2, reps: 15 },
          { id: 'sun7', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
          { id: 'sun8', name: 'Rotator Cuff Work', sets: 2, reps: 12 },
        ],
      },
    ],
    importantNotes: isTaper
      ? ['TAPER - Half intensity', 'Only 3 sets per grip', 'Maintain, not build', 'Full antagonist work for injury prevention']
      : ['PERFORMANCE PHASE - Reduce volume', 'Antagonist work is critical', 'Stay fresh for climbing'],
    lowEnergyVariant: 'Reduce to 2 sets per grip',
  };
};

// Daily Mobility Routine (reminder)
export const DAILY_MOBILITY_ROUTINE = `
**DO THIS EVERY SINGLE NIGHT BEFORE BED (15 minutes) - NON-NEGOTIABLE**

Hip Sequence (7 min):
• 90/90 Hip Stretch: 90 sec each side
• Pigeon Pose: 90 sec each side
• Deep Squat Hold: 2 min
• Hip Circles: 20 reps each direction

Shoulder Sequence (4 min):
• Wall Angels: 15 reps
• Band Dislocations: 15 reps
• Thread the Needle: 45 sec each side

Lower Body/Ankle (2 min):
• Calf Stretch: 45 sec each side
• Ankle Circles: 20 each direction, each foot

Wrist/Forearm (2 min):
• Wrist Flexion/Extension: 30 sec each
• Forearm Prayer Stretch: 45 sec
• Wrist Circles: 10 each direction

Miss a day? Do 2× duration next day.
`;
