import { WorkoutDay, DayOfWeek, Phase } from '../types';

// 16-Week Climbing Training Program: V4 → V7 Bouldering
// Start Date: Monday, January 19th, 2026

export const PROGRAM_START_DATE = '2026-01-19';
export const TOTAL_WEEKS = 16;

export const getWorkoutForWeek = (weekNumber: number, day: DayOfWeek): WorkoutDay => {
  const phase = getPhaseInfo(weekNumber).phase;
  const isDeload = getPhaseInfo(weekNumber).isDeload;

  const workouts = getWorkoutsByPhase(phase, isDeload, weekNumber);
  return workouts[day];
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

// MONDAY - REST DAY with optional activities
const getMondayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const weekInPhase = weekNumber % 4 === 0 ? 4 : weekNumber % 4;

  let eveningWorkout = 'Rest or 15 min mobility';
  if (weekInPhase === 2) {
    eveningWorkout = '10 min Abrahangs + 10 min mobility';
  } else if (weekInPhase === 3) {
    eveningWorkout = 'Bodyweight circuit - 5 rounds';
  }

  return {
    day: 'Monday',
    title: 'REST DAY',
    duration: 'Optional activities only',
    focus: 'Recovery and mobility',
    sections: [
      {
        title: 'Work Schedule',
        duration: '9-11 AM',
        exercises: [
          { id: 'mon1', name: 'Work', completed: false },
        ],
      },
      {
        title: 'Optional Morning Abrahangs (after 11 AM)',
        duration: '10 min',
        exercises: [
          { id: 'mon2', name: 'Warm-up: 3 × 5 sec hangs at minimal load', sets: 3, duration: 5, notes: 'Only if feeling great' },
          { id: 'mon3', name: 'Half-crimp abrahangs', sets: 4, duration: 10, rest: 30, notes: '40% max intensity' },
          { id: 'mon4', name: 'Open hand abrahangs', sets: 4, duration: 10, rest: 30 },
          { id: 'mon5', name: 'Three-finger drag abrahangs', sets: 4, duration: 10, rest: 30 },
          { id: 'mon6', name: 'Finger stretches', duration: 60 },
        ],
      },
      {
        title: 'Big Data Class',
        duration: '7:10-9:10 PM',
        exercises: [
          { id: 'mon7', name: 'Big Data class', completed: false },
        ],
      },
      {
        title: `Optional Evening Home Workout (after 9:30 PM) - Week ${weekInPhase}`,
        duration: '20-30 min',
        exercises: weekInPhase === 3 ? [
          { id: 'mon8', name: 'Circuit: Push-ups', sets: 5, reps: 10 },
          { id: 'mon9', name: 'Circuit: Squats', sets: 5, reps: 15 },
          { id: 'mon10', name: 'Circuit: Plank', sets: 5, duration: 30 },
          { id: 'mon11', name: 'Circuit: Glute bridges', sets: 5, reps: 15 },
        ] : weekInPhase === 2 ? [
          { id: 'mon8', name: 'Abrahangs (if not done in morning)', duration: 600 },
          { id: 'mon9', name: 'Mobility routine', duration: 600 },
        ] : [
          { id: 'mon8', name: 'Mobility routine', duration: 900 },
        ],
      },
      {
        title: 'Nightly Mobility Routine (before bed)',
        duration: '15 min',
        exercises: [
          { id: 'mon12', name: '90/90 Hip Stretch', duration: 90, notes: 'Each side' },
          { id: 'mon13', name: 'Pigeon Pose', duration: 90, notes: 'Each side' },
          { id: 'mon14', name: 'Deep Squat Hold', duration: 120 },
          { id: 'mon15', name: 'Hip Circles', reps: '20 each direction' },
          { id: 'mon16', name: 'Wall Angels', reps: 15 },
          { id: 'mon17', name: 'Band Dislocations', reps: 15 },
          { id: 'mon18', name: 'Thread the Needle', duration: 45, notes: 'Each side' },
          { id: 'mon19', name: 'Calf Stretch', duration: 45, notes: 'Each side' },
          { id: 'mon20', name: 'Ankle Circles', reps: '20 each direction, each foot' },
          { id: 'mon21', name: 'Wrist Flexion/Extension Stretch', duration: 30, notes: 'Each position' },
          { id: 'mon22', name: 'Forearm Prayer Stretch', duration: 45 },
          { id: 'mon23', name: 'Wrist Circles', reps: '10 each direction' },
        ],
      },
    ],
    importantNotes: [
      'This is a REST day - recovery is part of training',
      'Optional activities are truly optional',
      'Only do Abrahangs if fingers feel 100% fresh',
      'NEVER skip the nightly mobility routine',
      'Stop Abrahangs immediately if fingers feel tweaky or sore',
    ],
    lowEnergyVariant: 'Skip all optional activities, do only nightly mobility',
  };
};

// TUESDAY - STRENGTH TRAINING (5:15-6:45 PM)
const getTuesdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isPowerDevelopment = phase === 'Power Development';
  const isPowerEndurance = phase === 'Power Endurance';
  const isPeaking = phase === 'Peaking & Performance';

  if (isPowerDevelopment) {
    return {
      day: 'Tuesday',
      title: 'Strength Training - Power Circuit',
      duration: '5:15-6:45 PM (1.5 hours)',
      focus: 'Power development, explosive movements',
      sections: [
        {
          title: 'Pre-Training',
          duration: 'Between classes',
          exercises: [
            { id: 'tue0', name: 'Eat substantial snack 1-2 hours before', completed: false },
            { id: 'tue0b', name: 'Hydrate throughout day', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '10 min',
          exercises: [
            { id: 'tue1', name: 'Light cardio', duration: 180 },
            { id: 'tue2', name: 'Arm circles, scapular shrugs, wrist circles', reps: '10-15 each' },
            { id: 'tue3', name: 'Cat-cow, leg swings', reps: '10 each' },
            { id: 'tue4', name: 'Bodyweight squats', reps: 10 },
            { id: 'tue5', name: 'Push-ups', reps: 5 },
          ],
        },
        {
          title: 'Block A - Power Circuit',
          duration: '35 min',
          exercises: [
            { id: 'tue6', name: 'Weighted Pull-ups (heavy)', sets: 4, reps: '4-6', rest: 150, notes: 'Add weight' },
            { id: 'tue7', name: 'Explosive Push-ups', sets: 4, reps: '8-10', rest: 150 },
            { id: 'tue8', name: 'Box Jumps', sets: 4, reps: 5, rest: 150 },
            { id: 'tue9', name: 'Medicine Ball Slams', sets: 4, reps: 8, rest: 150 },
          ],
        },
        {
          title: 'Block B - Strength Maintenance',
          duration: '25 min',
          exercises: [
            { id: 'tue10', name: 'Rows', sets: 3, reps: 8, rest: 120 },
            { id: 'tue11', name: 'Overhead Press', sets: 3, reps: 8, rest: 120 },
            { id: 'tue12', name: 'Core Circuit - Hanging leg raises', sets: 3, reps: 10 },
            { id: 'tue13', name: 'Core Circuit - Ab wheel', sets: 3, reps: 10 },
            { id: 'tue14', name: 'Core Circuit - Russian twists', sets: 3, reps: 20 },
          ],
        },
        {
          title: 'Block C - Antagonist',
          duration: '15 min',
          exercises: [
            { id: 'tue15', name: 'Wide-Grip Push-ups', sets: 3, reps: '15-20', rest: 90 },
            { id: 'tue16', name: 'DB Overhead Press', sets: 3, reps: '10-12', rest: 90 },
            { id: 'tue17', name: 'Dips', sets: 3, reps: '8-12', rest: 90 },
          ],
        },
        {
          title: 'Cool-down',
          duration: '5 min',
          exercises: [
            { id: 'tue18', name: 'Stretch shoulders, chest, lats', duration: 300 },
          ],
        },
        {
          title: 'Post-Training',
          duration: 'Within 30 min',
          exercises: [
            { id: 'tue19', name: 'Protein + carbs within 30 min', completed: false },
          ],
        },
      ],
      importantNotes: [
        'Eat substantial snack 1-2 hours before (between classes)',
        'Focus on explosive movements',
        'Rest fully between power sets',
        'Post-training nutrition is critical',
      ],
      lowEnergyVariant: 'Reduce to 3 sets each, skip Block D',
    };
  } else if (isPowerEndurance) {
    return {
      day: 'Tuesday',
      title: 'Strength Training - Power Endurance',
      duration: '5:15-6:45 PM (1.5 hours)',
      focus: 'Power endurance, core conditioning',
      sections: [
        {
          title: 'Pre-Training',
          duration: 'Between classes',
          exercises: [
            { id: 'tue0', name: 'Eat substantial snack 1-2 hours before', completed: false },
            { id: 'tue0b', name: 'Hydrate throughout day', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '10 min',
          exercises: [
            { id: 'tue1', name: 'Light cardio', duration: 180 },
            { id: 'tue2', name: 'Arm circles, scapular shrugs, wrist circles', reps: '10-15 each' },
            { id: 'tue3', name: 'Cat-cow, leg swings', reps: '10 each' },
            { id: 'tue4', name: 'Bodyweight squats', reps: 10 },
            { id: 'tue5', name: 'Push-ups', reps: 5 },
          ],
        },
        {
          title: 'Block A - Power Endurance Circuit',
          duration: '40 min',
          exercises: [
            { id: 'tue6', name: 'Pull-ups (moderate weight)', sets: 4, reps: '10-12', rest: 75 },
            { id: 'tue7', name: 'Push-ups', sets: 4, reps: 20, rest: 75 },
            { id: 'tue8', name: 'Rows', sets: 4, reps: 12, rest: 75 },
          ],
        },
        {
          title: 'Block B - Core Endurance',
          duration: '20 min',
          exercises: [
            { id: 'tue9', name: 'Plank', sets: 3, duration: 90, rest: 60 },
            { id: 'tue10', name: 'Side Plank', sets: 3, duration: 60, rest: 60, notes: 'Each side' },
            { id: 'tue11', name: 'Bicycle Crunches', sets: 3, reps: 30 },
            { id: 'tue12', name: 'Hollow Body Hold', sets: 3, duration: 45 },
          ],
        },
        {
          title: 'Block C - Extended Antagonist',
          duration: '20 min',
          exercises: [
            { id: 'tue13', name: 'Push-ups', sets: 4, reps: 20, rest: 90 },
            { id: 'tue14', name: 'Dips', sets: 3, reps: 12, rest: 90 },
            { id: 'tue15', name: 'Reverse Wrist Curls', sets: 3, reps: 20, rest: 90 },
            { id: 'tue16', name: 'Rotator Cuff Circuit', duration: 600 },
          ],
        },
        {
          title: 'Cool-down',
          duration: '5 min',
          exercises: [
            { id: 'tue17', name: 'Stretch shoulders, chest, lats', duration: 300 },
          ],
        },
      ],
      importantNotes: [
        'Shorter rest periods for endurance adaptation',
        'Maintain good form despite fatigue',
        'Focus on breathing and pacing',
      ],
      lowEnergyVariant: 'Reduce to 3 sets each, 60 sec rest',
    };
  } else if (isPeaking && weekNumber >= 13) {
    return {
      day: 'Tuesday',
      title: weekNumber >= 15 ? 'REST or Very Light Climbing' : 'Strength Training - Maintenance',
      duration: weekNumber >= 15 ? '30 min max' : '5:15-6:45 PM',
      focus: weekNumber >= 15 ? 'Taper and recovery' : 'Maintain strength, avoid fatigue',
      sections: weekNumber >= 15 ? [
        {
          title: 'Optional Light Activity',
          duration: '30 min max',
          exercises: [
            { id: 'tue1', name: 'Very light climbing V2-V3 only', duration: 1800, notes: 'Stay fresh!' },
            { id: 'tue2', name: 'OR complete rest', completed: false },
          ],
        },
      ] : [
        {
          title: 'Warm-up',
          duration: '10 min',
          exercises: [
            { id: 'tue1', name: 'Light cardio', duration: 180 },
            { id: 'tue2', name: 'Dynamic stretching', duration: 420 },
          ],
        },
        {
          title: 'Maintenance Circuit',
          duration: '35 min',
          exercises: [
            { id: 'tue3', name: 'Pull-ups', sets: 3, reps: 8, rest: 120 },
            { id: 'tue4', name: 'Push-ups', sets: 3, reps: 15, rest: 120 },
            { id: 'tue5', name: 'Core work', sets: 3, notes: 'Light intensity' },
          ],
        },
        {
          title: 'Antagonist',
          duration: '20 min',
          exercises: [
            { id: 'tue6', name: 'Full antagonist routine', notes: 'Injury prevention priority' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '5 min',
          exercises: [
            { id: 'tue7', name: 'Stretching', duration: 300 },
          ],
        },
      ],
      importantNotes: weekNumber >= 15 ? [
        'TAPER WEEK - Reduce volume by 40-50%',
        'Stay fresh for Saturday send session',
        'Light activity only',
      ] : [
        'Maintenance only - don\'t push hard',
        'Save energy for climbing days',
        'Never skip antagonist work',
      ],
      lowEnergyVariant: 'Complete rest',
    };
  }

  // Phase 1: Strength Foundation
  return {
    day: 'Tuesday',
    title: 'Strength Training',
    duration: '5:15-6:45 PM (1.5 hours)',
    focus: 'Maximum strength, core tension, antagonist work',
    sections: [
      {
        title: 'Pre-Training',
        duration: 'Between classes',
        exercises: [
          { id: 'tue0', name: 'Eat substantial snack 1-2 hours before', completed: false },
          { id: 'tue0b', name: 'Hydrate throughout day', completed: false },
        ],
      },
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'tue1', name: 'Light cardio', duration: 180 },
          { id: 'tue2', name: 'Arm circles, scapular shrugs, wrist circles', reps: '10-15 each' },
          { id: 'tue3', name: 'Cat-cow, leg swings', reps: '10 each' },
          { id: 'tue4', name: 'Bodyweight squats', reps: 10 },
          { id: 'tue5', name: 'Push-ups', reps: 5 },
        ],
      },
      {
        title: 'Block A - Maximum Strength Upper Pull',
        duration: '30 min',
        exercises: [
          { id: 'tue6', name: 'Weighted Pull-ups', sets: 4, reps: '5-6', rest: 180 },
          { id: 'tue7', name: 'Inverted Rows (feet elevated)', sets: 3, reps: '8-10', rest: 120 },
          { id: 'tue8', name: 'Scapular Pull-ups', sets: 3, reps: '10-12', rest: 90 },
        ],
      },
      {
        title: 'Block B - Core Tension',
        duration: '25 min',
        exercises: [
          { id: 'tue9', name: 'Hollow Body Hold', sets: 4, duration: 40, rest: 60 },
          { id: 'tue10', name: 'Hanging Leg Raises', sets: 3, reps: '8-12', rest: 90 },
          { id: 'tue11', name: 'Ab Wheel Rollouts', sets: 3, reps: '8-10', rest: 90 },
          { id: 'tue12', name: 'Dead Hangs (with tension)', sets: 3, duration: 25, rest: 60 },
        ],
      },
      {
        title: 'Block C - Antagonist/Push',
        duration: '20 min',
        exercises: [
          { id: 'tue13', name: 'Wide-Grip Push-ups', sets: 3, reps: '15-20', rest: 90 },
          { id: 'tue14', name: 'DB Overhead Press', sets: 3, reps: '10-12', rest: 90 },
          { id: 'tue15', name: 'Dips', sets: 3, reps: '8-12', rest: 90 },
        ],
      },
      {
        title: 'Block D - Lower Body (Optional)',
        duration: '10 min',
        exercises: [
          { id: 'tue16', name: 'Goblet Squats', sets: 2, reps: 15 },
          { id: 'tue17', name: 'Single-leg RDLs', sets: 2, reps: '10/leg' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '5 min',
        exercises: [
          { id: 'tue18', name: 'Stretch shoulders, chest, lats', duration: 300 },
        ],
      },
      {
        title: 'Post-Training',
        duration: 'Within 30 min',
        exercises: [
          { id: 'tue19', name: 'Protein + carbs within 30 min', completed: false },
        ],
      },
    ],
    importantNotes: [
      'Eat substantial snack 1-2 hours before (between classes)',
      'Rest fully between heavy sets',
      'Focus on quality over quantity',
      'Post-training nutrition is critical',
    ],
    lowEnergyVariant: 'Reduce to 3 sets each, skip Block D',
  };
};

// WEDNESDAY - CLIMBING (11 AM-1 PM)
const getWednesdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isPowerDevelopment = phase === 'Power Development';
  const isPowerEndurance = phase === 'Power Endurance';
  const isPeaking = phase === 'Peaking & Performance';

  if (isPowerDevelopment) {
    return {
      day: 'Wednesday',
      title: 'Climbing Session - Power Work',
      duration: '11 AM-1 PM (2 hours)',
      focus: 'Power development, dynamic movement',
      sections: [
        {
          title: 'Optional Pre-Climbing',
          duration: '10 min (before 10:20 AM)',
          exercises: [
            { id: 'wed0', name: 'Abrahangs at home', duration: 600, notes: 'Only if fingers 100% fresh' },
          ],
        },
        {
          title: 'Pre-Session',
          duration: '1.5-2 hours before',
          exercises: [
            { id: 'wed0b', name: 'Good breakfast', completed: false },
            { id: 'wed0c', name: 'Leave home by 10:20 AM', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '20 min',
          exercises: [
            { id: 'wed1', name: 'Cardio', duration: 300 },
            { id: 'wed2', name: 'Dynamic stretching', duration: 300 },
            { id: 'wed3', name: 'Wrist/finger mobility', duration: 120 },
            { id: 'wed4', name: 'Climbing progression: VB-V1', reps: '3-4 problems' },
            { id: 'wed5', name: 'Climbing progression: V2', reps: '3-4 problems' },
            { id: 'wed6', name: 'Climbing progression: V3', reps: '2 problems' },
            { id: 'wed7', name: 'Joint prep: Easy hangs', sets: 3, duration: 10 },
          ],
        },
        {
          title: 'Block A - Power Work',
          duration: '40 min',
          exercises: [
            { id: 'wed8', name: 'Limit problems V4-V5', reps: '6-8 problems', notes: 'Short, powerful (3-6 moves)' },
            { id: 'wed9', name: '2-3 attempts per problem, rest 5-6 min between', completed: false },
          ],
        },
        {
          title: 'Block B - Dynamic Movement',
          duration: '30 min',
          exercises: [
            { id: 'wed10', name: 'Campus board: Basic laddering OR Dynamic problems', sets: 4, reps: '4 movements', rest: 240 },
            { id: 'wed11', name: 'Dynamic/slappy problems', reps: '5-6 problems' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'wed12', name: 'Easy climbing VB-V1', reps: '2-3 problems' },
            { id: 'wed13', name: 'Forearms, shoulders, hips stretches', duration: 300 },
            { id: 'wed14', name: 'Light hangs', sets: 2, duration: 20 },
          ],
        },
        {
          title: 'Post-Session',
          duration: 'Within 30 min',
          exercises: [
            { id: 'wed15', name: 'Protein + carbs within 30 min', completed: false },
          ],
        },
      ],
      importantNotes: [
        'Focus on explosive movements',
        'Rest fully between power attempts',
        'Stop if elbow pain appears',
        'Film yourself for review',
      ],
      lowEnergyVariant: 'Reduce to 4-5 limit problems, skip campus/dynamic work',
    };
  } else if (isPowerEndurance) {
    return {
      day: 'Wednesday',
      title: 'Climbing Session - 4×4 Protocol',
      duration: '11 AM-1 PM (2 hours)',
      focus: 'Power endurance, continuous climbing',
      sections: [
        {
          title: 'Optional Pre-Climbing',
          duration: '10 min (before 10:20 AM)',
          exercises: [
            { id: 'wed0', name: 'Abrahangs at home', duration: 600, notes: 'Only if fingers 100% fresh' },
          ],
        },
        {
          title: 'Pre-Session',
          duration: '1.5-2 hours before',
          exercises: [
            { id: 'wed0b', name: 'Good breakfast', completed: false },
            { id: 'wed0c', name: 'Leave home by 10:20 AM', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '20 min',
          exercises: [
            { id: 'wed1', name: 'Cardio', duration: 300 },
            { id: 'wed2', name: 'Dynamic stretching', duration: 300 },
            { id: 'wed3', name: 'Wrist/finger mobility', duration: 120 },
            { id: 'wed4', name: 'Climbing progression: VB-V1', reps: '3-4 problems' },
            { id: 'wed5', name: 'Climbing progression: V2', reps: '3-4 problems' },
            { id: 'wed6', name: 'Climbing progression: V3', reps: '2 problems' },
            { id: 'wed7', name: 'Joint prep: Easy hangs', sets: 3, duration: 10 },
          ],
        },
        {
          title: 'Block A - 4×4 Protocol',
          duration: '45 min',
          exercises: [
            { id: 'wed8', name: 'Select 4 problems at V3-V4 (~70% max)', completed: false },
            { id: 'wed9', name: 'Climb each 4 times with minimal rest (~30 sec)', completed: false },
            { id: 'wed10', name: 'After completing all 4 once, rest 5 min', completed: false },
            { id: 'wed11', name: 'Repeat circuit - Goal: 2 complete rounds (32 total problems)', completed: false },
          ],
        },
        {
          title: 'Block B - Recovery/Technique',
          duration: '25 min',
          exercises: [
            { id: 'wed12', name: 'Easy V1-V2 climbing', reps: '6-8 problems' },
            { id: 'wed13', name: 'Focus on recovery positions', completed: false },
            { id: 'wed14', name: 'Practice shaking out', completed: false },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'wed15', name: 'Easy climbing VB-V1', reps: '2-3 problems' },
            { id: 'wed16', name: 'Stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        '4×4 protocol is challenging - pace yourself',
        'Minimal rest between problems in circuit',
        'Full 5 min rest between rounds',
        'This builds power endurance',
      ],
      lowEnergyVariant: 'Do only 1 round of 4×4, add more recovery climbing',
    };
  } else if (isPeaking && weekNumber >= 13) {
    if (weekNumber >= 15) {
      return {
        day: 'Wednesday',
        title: 'Light Strength Training',
        duration: '45 min',
        focus: 'Taper - maintain without fatiguing',
        sections: [
          {
            title: 'Warm-up',
            duration: '10 min',
            exercises: [
              { id: 'wed1', name: 'Light cardio and mobility', duration: 600 },
            ],
          },
          {
            title: 'Light Strength Work',
            duration: '30 min',
            exercises: [
              { id: 'wed2', name: 'Pull-ups', sets: 2, reps: 8, notes: 'Lower intensity' },
              { id: 'wed3', name: 'Push-ups', sets: 2, reps: 15 },
              { id: 'wed4', name: 'Core work', sets: 2, notes: 'Light' },
            ],
          },
          {
            title: 'Cool-down',
            duration: '5 min',
            exercises: [
              { id: 'wed5', name: 'Stretching', duration: 300 },
            ],
          },
        ],
        importantNotes: [
          'TAPER WEEK - 2 sets each, lower intensity',
          'Stay fresh for Saturday',
          'This is maintenance only',
        ],
        lowEnergyVariant: 'Complete rest',
      };
    }

    return {
      day: 'Wednesday',
      title: 'Climbing Session - Project V6-V7',
      duration: '11 AM-1 PM (2 hours)',
      focus: 'Projecting, performance',
      sections: [
        {
          title: 'Optional Pre-Climbing',
          duration: '10 min (before 10:20 AM)',
          exercises: [
            { id: 'wed0', name: 'Abrahangs at home', duration: 600, notes: 'Only if fingers 100% fresh' },
          ],
        },
        {
          title: 'Pre-Session',
          duration: '1.5-2 hours before',
          exercises: [
            { id: 'wed0b', name: 'Good breakfast', completed: false },
            { id: 'wed0c', name: 'Leave home by 10:20 AM', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '20 min',
          exercises: [
            { id: 'wed1', name: 'Cardio', duration: 300 },
            { id: 'wed2', name: 'Dynamic stretching', duration: 300 },
            { id: 'wed3', name: 'Wrist/finger mobility', duration: 120 },
            { id: 'wed4', name: 'Climbing progression: VB-V1', reps: '3-4 problems' },
            { id: 'wed5', name: 'Climbing progression: V2', reps: '3-4 problems' },
            { id: 'wed6', name: 'Climbing progression: V3', reps: '2 problems' },
            { id: 'wed7', name: 'Joint prep: Easy hangs', sets: 3, duration: 10 },
          ],
        },
        {
          title: 'Block A - Project V6-V7',
          duration: '60 min',
          exercises: [
            { id: 'wed8', name: 'Choose 2 main V6-V7 projects', completed: false },
            { id: 'wed9', name: 'Work extensively - learn every detail', completed: false },
            { id: 'wed10', name: '8-12 attempts per problem', notes: 'Rest 8 min between' },
            { id: 'wed11', name: 'Film and review', completed: false },
          ],
        },
        {
          title: 'Block B - Flash Attempts',
          duration: '20 min',
          exercises: [
            { id: 'wed12', name: 'Flash V4-V5 problems', reps: '3-4 problems', notes: 'Build confidence' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'wed13', name: 'Easy climbing VB-V1', reps: '2-3 problems' },
            { id: 'wed14', name: 'Stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'Focus on your V6-V7 projects',
        'Learn every move, every detail',
        'Rest fully between attempts',
        'Film for analysis',
      ],
      lowEnergyVariant: '1 project only, fewer attempts',
    };
  }

  // Phase 1: Strength Foundation
  return {
    day: 'Wednesday',
    title: 'Climbing Session',
    duration: '11 AM-1 PM (2 hours)',
    focus: 'Crimp technique, overhang strength, endurance',
    sections: [
      {
        title: 'Optional Pre-Climbing',
        duration: '10 min (before 10:20 AM)',
        exercises: [
          { id: 'wed0', name: 'Abrahangs at home', duration: 600, notes: 'Only if fingers 100% fresh' },
        ],
      },
      {
        title: 'Pre-Session',
        duration: '1.5-2 hours before',
        exercises: [
          { id: 'wed0b', name: 'Good breakfast', completed: false },
          { id: 'wed0c', name: 'Leave home by 10:20 AM', completed: false },
        ],
      },
      {
        title: 'Warm-up',
        duration: '25 min',
        exercises: [
          { id: 'wed1', name: 'Cardio', duration: 300 },
          { id: 'wed2', name: 'Dynamic stretching', duration: 300 },
          { id: 'wed3', name: 'Wrist/finger mobility', duration: 120 },
          { id: 'wed4', name: 'Climbing progression: VB-V1', reps: '3-4 problems' },
          { id: 'wed5', name: 'Climbing progression: V2', reps: '3-4 problems' },
          { id: 'wed6', name: 'Climbing progression: V3', reps: '2 problems' },
          { id: 'wed7', name: 'Joint prep: Easy hangs', sets: 3, duration: 10 },
          { id: 'wed8', name: 'Shoulder circles', reps: 10 },
        ],
      },
      {
        title: 'Block A - Crimp-Focused Technique',
        duration: '30 min',
        exercises: [
          { id: 'wed9', name: 'V2-V3 problems with crimp holds', reps: '4-5 problems', notes: '3-4 attempts per problem' },
          { id: 'wed10', name: 'Focus: Half-crimp positioning', completed: false },
          { id: 'wed11', name: 'Focus: Lock-off strength', completed: false },
          { id: 'wed12', name: 'Focus: Straight arms', completed: false },
          { id: 'wed13', name: 'Focus: Silent feet', completed: false },
          { id: 'wed14', name: 'Film 1-2 problems for review', completed: false },
          { id: 'wed15', name: 'Rest 3-4 min between problems', completed: false },
        ],
      },
      {
        title: 'Block B - Overhang Strength',
        duration: '35 min',
        exercises: [
          { id: 'wed16', name: 'V4 problems on 30-45° overhangs', reps: '3 problems', notes: '5-6 attempts per problem' },
          { id: 'wed17', name: 'Focus: Core tension', completed: false },
          { id: 'wed18', name: 'Focus: Feet staying on', completed: false },
          { id: 'wed19', name: 'Focus: Opposition', completed: false },
          { id: 'wed20', name: 'Focus: Breathing', completed: false },
          { id: 'wed21', name: 'Rest 5 min between problems', completed: false },
        ],
      },
      {
        title: 'Block C - Volume/Endurance',
        duration: '20 min',
        exercises: [
          { id: 'wed22', name: 'V1-V3 problems - continuous movement', reps: '5-6 problems', rest: 120 },
          { id: 'wed23', name: 'Practice recovery positions', completed: false },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'wed24', name: 'Easy VB-V1 problems', reps: '2-3' },
          { id: 'wed25', name: 'Static stretching: forearms, shoulders, hips', duration: 300 },
          { id: 'wed26', name: 'Light hangs', sets: 2, duration: 20 },
        ],
      },
      {
        title: 'Post-Session',
        duration: 'Within 30 min',
        exercises: [
          { id: 'wed27', name: 'Protein + carbs within 30 min', completed: false },
        ],
      },
    ],
    importantNotes: [
      'Focus on crimp positioning - half-crimp only',
      'Overhang work builds core strength',
      'Film yourself for technique review',
      'Rest fully between hard problems',
    ],
    lowEnergyVariant: 'Reduce to 2-3 crimpy problems, 2 overhang problems, skip volume work',
  };
};

// THURSDAY - CLIMBING WITH FRIEND (1-3 PM)
const getThursdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isPowerDevelopment = phase === 'Power Development';
  const isPowerEndurance = phase === 'Power Endurance';
  const isPeaking = phase === 'Peaking & Performance';

  if (isPowerDevelopment) {
    return {
      day: 'Thursday',
      title: 'Climbing with Friend',
      duration: '1-3 PM (2 hours)',
      focus: 'Flash practice, beta reading',
      sections: [
        {
          title: 'Warm-up',
          duration: '20 min',
          exercises: [
            { id: 'thu1', name: 'Standard climbing warm-up', duration: 1200 },
          ],
        },
        {
          title: 'Main Session',
          duration: '70 min',
          exercises: [
            { id: 'thu2', name: 'V3-V4 problems', reps: '12-15 problems' },
            { id: 'thu3', name: 'Flash/2nd go attempts', notes: 'Work on reading beta quickly' },
            { id: 'thu4', name: 'Rest 3 min between problems', completed: false },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'thu5', name: 'Easy climbing and stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'Social climbing - have fun!',
        'Practice reading beta quickly',
        'Give each other feedback',
        'Flash attempts build confidence',
      ],
      lowEnergyVariant: 'Reduce to 8-10 problems, lower grades',
    };
  } else if (isPowerEndurance) {
    return {
      day: 'Thursday',
      title: 'Climbing with Friend - Linked Problems',
      duration: '1-3 PM (2 hours)',
      focus: 'Power endurance, linked sequences',
      sections: [
        {
          title: 'Warm-up',
          duration: '20 min',
          exercises: [
            { id: 'thu1', name: 'Standard climbing warm-up', duration: 1200 },
          ],
        },
        {
          title: 'Block A - Linked Problems',
          duration: '60 min',
          exercises: [
            { id: 'thu2', name: 'Climb 2-3 V2-V3 problems back-to-back', notes: 'No rest between problems' },
            { id: 'thu3', name: 'Rest 4 min between sets', completed: false },
            { id: 'thu4', name: 'Complete 6-8 sets', completed: false },
          ],
        },
        {
          title: 'Block B - Fun Climbing',
          duration: '20 min',
          exercises: [
            { id: 'thu5', name: 'Whatever you want', notes: 'Social climbing' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'thu6', name: 'Easy climbing and stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'Linked problems = continuous climbing',
        'No rest between problems in a set',
        'This builds endurance',
        'Have fun with your friend!',
      ],
      lowEnergyVariant: 'Reduce to 4-5 sets, more rest',
    };
  } else if (isPeaking && weekNumber >= 13) {
    if (weekNumber >= 15) {
      return {
        day: 'Thursday',
        title: 'Short Session with Friend',
        duration: '1 hour',
        focus: 'Stay fresh, light climbing',
        sections: [
          {
            title: 'Warm-up',
            duration: '15 min',
            exercises: [
              { id: 'thu1', name: 'Light warm-up', duration: 900 },
            ],
          },
          {
            title: 'Light Climbing',
            duration: '35 min',
            exercises: [
              { id: 'thu2', name: 'V3-V4 problems only', reps: '6-8 problems', notes: 'Stay fresh!' },
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
          'TAPER WEEK - 60 min max, V3-V4 only',
          'Stay fresh for Saturday',
          'Keep it light and fun',
        ],
        lowEnergyVariant: 'Complete rest',
      };
    }

    return {
      day: 'Thursday',
      title: 'Climbing with Friend - Moderate Volume',
      duration: '1-3 PM (2 hours)',
      focus: 'Weakness work, moderate intensity',
      sections: [
        {
          title: 'Warm-up',
          duration: '20 min',
          exercises: [
            { id: 'thu1', name: 'Standard climbing warm-up', duration: 1200 },
          ],
        },
        {
          title: 'Moderate Volume',
          duration: '70 min',
          exercises: [
            { id: 'thu2', name: 'V3-V5 problems', reps: '10-12 problems' },
            { id: 'thu3', name: 'Work on weaknesses', completed: false },
            { id: 'thu4', name: 'Rest 4 min between problems', completed: false },
            { id: 'thu5', name: 'Give each other beta', completed: false },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'thu6', name: 'Easy climbing and stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'Moderate intensity',
        'Work on weak areas',
        'Social and supportive',
        'Save energy for Saturday',
      ],
      lowEnergyVariant: 'Reduce to 6-8 problems',
    };
  }

  // Phase 1: Strength Foundation
  return {
    day: 'Thursday',
    title: 'Climbing with Friend',
    duration: '1-3 PM (2 hours)',
    focus: 'Variety climbing, weaknesses, social',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'thu1', name: 'Standard climbing warm-up protocol', duration: 1200 },
        ],
      },
      {
        title: 'Block A - Variety Climbing',
        duration: '40 min',
        exercises: [
          { id: 'thu2', name: 'V2-V4 problems - different styles', reps: '10-12 problems', notes: 'Slabs, vertical, overhangs, technical' },
          { id: 'thu3', name: '2-3 attempts each', completed: false },
          { id: 'thu4', name: 'Rest 3 min between problems', completed: false },
        ],
      },
      {
        title: 'Block B - Work Weaknesses',
        duration: '30 min',
        exercises: [
          { id: 'thu5', name: 'Problems exposing weaknesses', reps: '2-3 problems', notes: 'Crimpy, overhangs' },
          { id: 'thu6', name: '4-5 attempts each', completed: false },
          { id: 'thu7', name: 'Rest 4-5 min between problems', completed: false },
          { id: 'thu8', name: 'Give each other beta, film each other', completed: false },
        ],
      },
      {
        title: 'Block C - Fun Climbing',
        duration: '15 min',
        exercises: [
          { id: 'thu9', name: 'Whatever you want', notes: 'Build confidence' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'thu10', name: 'Easy climbing and stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'Social climbing is important',
      'Try different styles',
      'Work on weaknesses together',
      'Have fun!',
    ],
    lowEnergyVariant: 'Skip weakness work, just fun climbing for 45 min',
  };
};

// FRIDAY - OPTIONAL CLIMBING (11 AM-1 PM)
const getFridayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isPowerDevelopment = phase === 'Power Development';
  const isPowerEndurance = phase === 'Power Endurance';
  const isPeaking = phase === 'Peaking & Performance';

  if (isPeaking && weekNumber >= 15) {
    return {
      day: 'Friday',
      title: 'REST',
      duration: 'Complete rest or light mobility',
      focus: 'Taper for Saturday send session',
      sections: [
        {
          title: 'Rest Day',
          duration: 'All day',
          exercises: [
            { id: 'fri1', name: 'Complete rest', completed: false },
            { id: 'fri2', name: 'OR light mobility only (15 min)', duration: 900 },
          ],
        },
      ],
      importantNotes: [
        'TAPER WEEK - Complete rest',
        'Stay fresh for Saturday send session',
        'Hydrate, eat well, sleep',
      ],
      lowEnergyVariant: 'Complete rest',
    };
  }

  // For all other phases, Friday is optional climbing
  return {
    day: 'Friday',
    title: 'OPTIONAL Climbing Session',
    duration: '11 AM-1 PM (2 hours)',
    focus: 'Optional - do only if fresh',
    sections: [
      {
        title: 'Decision Point',
        duration: 'Before session',
        exercises: [
          { id: 'fri0', name: 'DO if: Fresh, energized, fingers feel good', completed: false },
          { id: 'fri0b', name: 'SKIP if: Tired, sore, lots of homework', completed: false },
        ],
      },
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'fri1', name: 'Standard climbing warm-up', duration: 1200 },
        ],
      },
      {
        title: 'Main Session - Choose One',
        duration: '60 min',
        exercises: [
          {
            id: 'fri2',
            name: 'Option A - Endurance: Pyramid V0(1), V1(2), V2(3), V3(2), V2(1)',
            notes: 'Rest 90 sec between, then 3-4 dynamic V3-V4 problems'
          },
          {
            id: 'fri3',
            name: isPowerDevelopment
              ? 'Option B - System Board: 6-8 sequences of 4-6 moves, repeat 3×, rest 4 min'
              : 'Option B - Power: 6-8 problems at V4-V5, 3 tries each, rest 5 min'
          },
          {
            id: 'fri4',
            name: isPowerEndurance
              ? 'Option C - Intervals: Climb V2-V3 for 2 min continuous, rest 2 min, repeat 8-10×'
              : 'Option C - Technique: 15-20 problems at V0-V3, perfect movement only'
          },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'fri5', name: 'Easy climbing and stretching', duration: 600 },
        ],
      },
    ],
    importantNotes: [
      'This session is OPTIONAL',
      'Skip if tired or sore',
      'Listen to your body',
      'Fresh > fatigued',
    ],
    lowEnergyVariant: 'Skip completely',
  };
};

// SATURDAY - LONG SESSION (10 AM-12 PM)
const getSaturdayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isPowerDevelopment = phase === 'Power Development';
  const isPowerEndurance = phase === 'Power Endurance';
  const isPeaking = phase === 'Peaking & Performance';

  let projectGrade = 'V4-V5';
  if (isPowerDevelopment) projectGrade = 'V5-V6';
  else if (isPowerEndurance) projectGrade = 'V5-V6';
  else if (isPeaking) projectGrade = 'V6-V7';

  if (isPeaking && weekNumber >= 15) {
    return {
      day: 'Saturday',
      title: 'SEND SESSION - V7 Projects',
      duration: '10 AM-12 PM+',
      focus: 'Maximum performance - send your projects',
      sections: [
        {
          title: 'Extended Warm-up',
          duration: '30+ min',
          exercises: [
            { id: 'sat1', name: 'Extended, thorough warm-up', duration: 1800 },
            { id: 'sat2', name: 'Progressive VB → V3', reps: '8-10 problems' },
          ],
        },
        {
          title: 'Sending Session',
          duration: 'As long as needed',
          exercises: [
            { id: 'sat3', name: 'Try V7 projects', notes: 'Maximum 4-6 hard attempts' },
            { id: 'sat4', name: 'Rest 10+ min between attempts', completed: false },
            { id: 'sat5', name: 'Stop when you send or feel tired', completed: false },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'sat6', name: 'Stretching and reflection', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'THIS IS YOUR SEND SESSION',
        'Extended warm-up is critical',
        'Maximum 4-6 hard attempts',
        'Rest 10+ min between attempts',
        'Stop when you send or feel tired',
      ],
      lowEnergyVariant: 'Not applicable - this is performance week',
    };
  } else if (isPeaking && weekNumber >= 13) {
    return {
      day: 'Saturday',
      title: 'Performance Session',
      duration: '10 AM-12 PM (2.5-3 hours)',
      focus: 'Send V6-V7 projects',
      sections: [
        {
          title: 'Extended Warm-up',
          duration: '30 min',
          exercises: [
            { id: 'sat1', name: 'Extended, thorough warm-up', duration: 1800 },
          ],
        },
        {
          title: 'Sending Session',
          duration: '130-150 min',
          exercises: [
            { id: 'sat2', name: 'Try to send V6-V7 projects', notes: 'As many attempts as needed' },
            { id: 'sat3', name: 'Rest fully between attempts (8-10 min)', completed: false },
            { id: 'sat4', name: 'Don\'t worry about volume', completed: false },
            { id: 'sat5', name: 'Focus: Quality attempts, learning, sending', completed: false },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'sat6', name: 'Stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'Focus on sending your projects',
        'Rest fully between attempts',
        'Quality over quantity',
        'Learn from each attempt',
      ],
      lowEnergyVariant: 'Fewer projects, but still send-focused',
    };
  } else if (isPowerEndurance) {
    return {
      day: 'Saturday',
      title: 'Long Climbing Session',
      duration: '10 AM-12 PM (2.5-3 hours)',
      focus: 'Power maintenance + endurance circuits',
      sections: [
        {
          title: 'Warm-up',
          duration: '25 min',
          exercises: [
            { id: 'sat1', name: 'Extended warm-up', duration: 1500 },
          ],
        },
        {
          title: 'Block A - Power Maintenance',
          duration: '40 min',
          exercises: [
            { id: 'sat2', name: 'Limit problems at V5-V6', reps: '4-5 problems', notes: '3-4 attempts each' },
            { id: 'sat3', name: 'Rest 6 min between problems', completed: false },
          ],
        },
        {
          title: 'Block B - Endurance Circuits',
          duration: '50 min',
          exercises: [
            { id: 'sat4', name: 'Linked problems', notes: 'Multiple problems back-to-back' },
            { id: 'sat5', name: 'Traversing', duration: 900 },
            { id: 'sat6', name: 'Long V2-V3 sequences', reps: '6-8 sequences' },
          ],
        },
        {
          title: 'Block C - Open Climbing',
          duration: '30 min',
          exercises: [
            { id: 'sat7', name: 'Social, fun climbing', duration: 1800 },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'sat8', name: 'Stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'Balance power work with endurance',
        'Rest fully for limit problems',
        'Push endurance on circuits',
        'Have fun at the end',
      ],
      lowEnergyVariant: 'Reduce to 2-3 limit problems, 30 min endurance work',
    };
  } else if (isPowerDevelopment) {
    return {
      day: 'Saturday',
      title: 'Long Climbing Session',
      duration: '10 AM-12 PM (2.5-3 hours)',
      focus: 'Limit bouldering, volume work',
      sections: [
        {
          title: 'Warm-up',
          duration: '25 min',
          exercises: [
            { id: 'sat1', name: 'Extended warm-up', duration: 1500 },
          ],
        },
        {
          title: 'Block A - Limit Bouldering',
          duration: '70 min',
          exercises: [
            { id: 'sat2', name: 'V5-V6 projects', reps: '3-4 problems', notes: '8-10 attempts each' },
            { id: 'sat3', name: 'Rest 7-8 min between problems', completed: false },
            { id: 'sat4', name: 'Film, review, adjust', completed: false },
          ],
        },
        {
          title: 'Block B - Volume',
          duration: '40 min',
          exercises: [
            { id: 'sat5', name: 'V2-V3 problems', reps: '10-15 problems', notes: 'Different styles' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '10 min',
          exercises: [
            { id: 'sat6', name: 'Stretching', duration: 600 },
          ],
        },
      ],
      importantNotes: [
        'This is your main projecting day',
        'Rest fully between limit attempts',
        'Volume work after power work',
        'Big meal after session',
      ],
      lowEnergyVariant: 'Reduce to 2 projects, less volume work',
    };
  }

  // Phase 1: Strength Foundation
  return {
    day: 'Saturday',
    title: 'Long Climbing Session',
    duration: '10 AM-12 PM (2.5-3 hours)',
    focus: 'Project time, volume work, performance',
    sections: [
      {
        title: 'Warm-up',
        duration: '30 min',
        exercises: [
          { id: 'sat1', name: 'Extended, thorough warm-up', duration: 1800 },
          { id: 'sat2', name: 'VB → V3 progression', reps: '6-8 problems' },
        ],
      },
      {
        title: 'Block A - Project Time',
        duration: '70 min',
        exercises: [
          { id: 'sat3', name: 'V4-V5 projects (Week 1-2) or V5 projects (Week 3-4)', reps: '2-3 problems' },
          { id: 'sat4', name: 'Prioritize crimpy and overhang problems', completed: false },
          { id: 'sat5', name: '6-10 attempts per problem', notes: 'Rest 7-8 min between' },
          { id: 'sat6', name: 'Film, review, adjust', completed: false },
        ],
      },
      {
        title: 'Block B - Volume',
        duration: '30 min',
        exercises: [
          { id: 'sat7', name: 'V1-V3 problems - different styles', reps: '8-12 problems', rest: 150 },
        ],
      },
      {
        title: 'Block C - Fun Climbing',
        duration: '15-20 min',
        exercises: [
          { id: 'sat8', name: 'Whatever you want', duration: 1000 },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'sat9', name: 'Stretching, foam rolling', duration: 600 },
        ],
      },
      {
        title: 'Post-Session',
        duration: 'Within 1 hour',
        exercises: [
          { id: 'sat10', name: 'Big meal with protein + carbs', completed: false },
        ],
      },
    ],
    importantNotes: [
      'This is your main performance day',
      'Rest fully between project attempts',
      'Film yourself for review',
      'Big meal after session is critical',
    ],
    lowEnergyVariant: 'Reduce to 1-2 projects, less volume work',
  };
};

// SUNDAY - HOME TRAINING (~1 hour)
const getSundayWorkout = (phase: Phase, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const isPowerDevelopment = phase === 'Power Development';
  const isPowerEndurance = phase === 'Power Endurance';
  const isPeaking = phase === 'Peaking & Performance';

  if (isPeaking && weekNumber >= 15) {
    return {
      day: 'Sunday',
      title: 'REST or Light Mobility',
      duration: 'Minimal activity',
      focus: 'Taper - complete rest',
      sections: [
        {
          title: 'Rest Day',
          duration: 'All day',
          exercises: [
            { id: 'sun1', name: 'Complete rest', completed: false },
            { id: 'sun2', name: 'OR light mobility (15 min)', duration: 900 },
          ],
        },
      ],
      importantNotes: [
        'TAPER WEEK - Rest or light mobility only',
        'Prepare for next week',
        'Hydrate, eat well, sleep',
      ],
      lowEnergyVariant: 'Complete rest',
    };
  } else if (isPeaking && weekNumber >= 13) {
    return {
      day: 'Sunday',
      title: 'Home Training - Light Maintenance',
      duration: '~45 min',
      focus: 'Light fingerboard and antagonist work',
      sections: [
        {
          title: 'Pre-Session',
          duration: '30-60 min before',
          exercises: [
            { id: 'sun0', name: 'Light snack', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '10 min',
          exercises: [
            { id: 'sun1', name: 'Wrist circles', reps: '20 each direction' },
            { id: 'sun2', name: 'Finger flexion/extension', reps: 20 },
            { id: 'sun3', name: 'Fist pumps', reps: 20 },
            { id: 'sun4', name: 'Easy hangs on big holds', sets: 3, duration: 10, notes: '50% intensity' },
          ],
        },
        {
          title: 'Light Fingerboard Maintenance',
          duration: '15 min',
          exercises: [
            { id: 'sun5', name: 'Half-crimp hangs', sets: 3, notes: 'Half intensity' },
            { id: 'sun6', name: 'Open hand hangs', sets: 3, notes: 'Half intensity' },
          ],
        },
        {
          title: 'Antagonist Work',
          duration: '20 min',
          exercises: [
            { id: 'sun7', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
            { id: 'sun8', name: 'Rice Bucket or Band Finger Extensions', sets: 2, duration: 60 },
            { id: 'sun9', name: 'Push-ups', sets: 2, reps: 15 },
            { id: 'sun10', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
            { id: 'sun11', name: 'Rotator Cuff with Band', sets: 2, reps: '12 each', notes: 'External + internal rotation' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '5 min',
          exercises: [
            { id: 'sun12', name: 'Finger stretches, wrist mobility, shoulder rolls', duration: 300 },
          ],
        },
      ],
      importantNotes: [
        'Light maintenance only',
        'Half intensity on fingerboard',
        'Full antagonist work still important',
        'Don\'t fatigue yourself',
      ],
      lowEnergyVariant: 'Antagonist work only, skip fingerboard',
    };
  } else if (isPowerEndurance) {
    return {
      day: 'Sunday',
      title: 'Home Training - Repeaters 7/3',
      duration: '~1 hour',
      focus: 'Fingerboard repeaters, antagonist work',
      sections: [
        {
          title: 'Pre-Session',
          duration: '30-60 min before',
          exercises: [
            { id: 'sun0', name: 'Light snack', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '10 min',
          exercises: [
            { id: 'sun1', name: 'Wrist circles', reps: '20 each direction' },
            { id: 'sun2', name: 'Finger flexion/extension', reps: 20 },
            { id: 'sun3', name: 'Fist pumps', reps: 20 },
            { id: 'sun4', name: 'Easy hangs on big holds', sets: 3, duration: 10, notes: '50% intensity' },
          ],
        },
        {
          title: 'Fingerboard - Repeaters 7/3',
          duration: '35 min',
          exercises: [
            { id: 'sun5', name: 'Protocol: 7 sec hang / 3 sec rest × 6 reps = 1 set (60 sec total)', completed: false },
            { id: 'sun6', name: 'Rest 3 min between sets', completed: false },
            { id: 'sun7', name: '60-70% max intensity', completed: false },
            { id: 'sun8', name: 'Half-crimp repeaters', sets: 3 },
            { id: 'sun9', name: 'Open hand repeaters', sets: 3 },
            { id: 'sun10', name: 'Three-finger drag repeaters', sets: 3 },
          ],
        },
        {
          title: 'Antagonist Work',
          duration: '15 min',
          exercises: [
            { id: 'sun11', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
            { id: 'sun12', name: 'Rice Bucket or Band Finger Extensions', sets: 2, duration: 60 },
            { id: 'sun13', name: 'Push-ups', sets: 2, reps: 15 },
            { id: 'sun14', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
            { id: 'sun15', name: 'Rotator Cuff with Band', sets: 2, reps: '12 each', notes: 'External + internal rotation' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '5 min',
          exercises: [
            { id: 'sun16', name: 'Finger stretches, wrist mobility, shoulder rolls', duration: 300 },
          ],
        },
        {
          title: 'Post-Training',
          duration: 'Within 1 hour',
          exercises: [
            { id: 'sun17', name: 'Protein + carbs', completed: false },
          ],
        },
      ],
      importantNotes: [
        'Repeaters 7/3 protocol: 7 sec hang, 3 sec rest, 6 reps',
        'Use 60-70% max intensity',
        '3 min rest between sets',
        'Stop if sharp pain occurs',
      ],
      lowEnergyVariant: 'Antagonist work only, skip fingerboard',
    };
  } else if (isPowerDevelopment) {
    return {
      day: 'Sunday',
      title: 'Home Training - Weighted Max Hangs',
      duration: '~1 hour',
      focus: 'Fingerboard weighted hangs, antagonist work',
      sections: [
        {
          title: 'Pre-Session',
          duration: '30-60 min before',
          exercises: [
            { id: 'sun0', name: 'Light snack', completed: false },
          ],
        },
        {
          title: 'Warm-up',
          duration: '10 min',
          exercises: [
            { id: 'sun1', name: 'Wrist circles', reps: '20 each direction' },
            { id: 'sun2', name: 'Finger flexion/extension', reps: 20 },
            { id: 'sun3', name: 'Fist pumps', reps: 20 },
            { id: 'sun4', name: 'Easy hangs on big holds', sets: 3, duration: 10, notes: '50% intensity' },
          ],
        },
        {
          title: 'Fingerboard - Weighted Max Hangs',
          duration: '35 min',
          exercises: [
            { id: 'sun5', name: '7-second hangs at 90-95% max', completed: false },
            { id: 'sun6', name: 'Add weight via harness/belt', completed: false },
            { id: 'sun7', name: 'Rest 3 min between hangs', completed: false },
            { id: 'sun8', name: 'Use 18mm edge if added weight successfully', completed: false },
            { id: 'sun9', name: 'Aim to add 2-5 lbs per week', completed: false },
            { id: 'sun10', name: 'Half-crimp with weight', sets: 6, duration: 7, rest: 180 },
            { id: 'sun11', name: 'Open hand with weight', sets: 6, duration: 7, rest: 180 },
          ],
        },
        {
          title: 'Antagonist Work',
          duration: '15 min',
          exercises: [
            { id: 'sun12', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
            { id: 'sun13', name: 'Rice Bucket or Band Finger Extensions', sets: 2, duration: 60 },
            { id: 'sun14', name: 'Push-ups', sets: 2, reps: 15 },
            { id: 'sun15', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
            { id: 'sun16', name: 'Rotator Cuff with Band', sets: 2, reps: '12 each', notes: 'External + internal rotation' },
          ],
        },
        {
          title: 'Cool-down',
          duration: '5 min',
          exercises: [
            { id: 'sun17', name: 'Finger stretches, wrist mobility, shoulder rolls', duration: 300 },
          ],
        },
      ],
      importantNotes: [
        'Add weight conservatively - 2-5 lbs per week',
        'Use 18mm edge if strong enough',
        '7-second hangs at 90-95% max',
        'Stop 2-3 sec before failure',
      ],
      lowEnergyVariant: 'Antagonist work only, skip fingerboard',
    };
  }

  // Phase 1: Strength Foundation
  const weekInPhase = weekNumber % 4 === 0 ? 4 : weekNumber % 4;
  const isDeloadWeek = weekNumber === 4 || weekNumber === 8 || weekNumber === 12;

  let hangboardIntensity = '85-90% max';
  let edgeSize = '20mm edge';
  let weightProgression = 'Bodyweight or add 2-5 lbs if can hang 15+ seconds';

  if (weekInPhase === 1) {
    hangboardIntensity = '85-90% max - Find baseline';
  } else if (weekInPhase === 2) {
    hangboardIntensity = '85-90% max - Same as Week 1';
  } else if (weekInPhase === 3) {
    hangboardIntensity = '85-90% max - Add 2-5 lbs or go down 1-2mm edge';
    weightProgression = 'Add 2-5 lbs or use smaller edge (18mm)';
  } else if (weekInPhase === 4 || isDeloadWeek) {
    hangboardIntensity = '70% max - DELOAD';
    weightProgression = 'Reduce weight/use bigger edge';
  }

  return {
    day: 'Sunday',
    title: 'Home Training - Fingerboard & Antagonist',
    duration: '~1 hour',
    focus: 'Maximum finger strength, injury prevention',
    sections: [
      {
        title: 'Pre-Session',
        duration: '30-60 min before',
        exercises: [
          { id: 'sun0', name: 'Light snack', completed: false },
        ],
      },
      {
        title: 'Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'sun1', name: 'Wrist circles', reps: '20 each direction' },
          { id: 'sun2', name: 'Finger flexion/extension', reps: 20 },
          { id: 'sun3', name: 'Fist pumps', reps: 20 },
          { id: 'sun4', name: 'Easy hangs on big holds', sets: 3, duration: 10, notes: '50% intensity' },
        ],
      },
      {
        title: `Fingerboard - Max Hangs (Week ${weekInPhase})`,
        duration: '35 min',
        exercises: [
          { id: 'sun5', name: `Intensity: ${hangboardIntensity}`, completed: false },
          { id: 'sun6', name: '12-second hangs, rest 3 min between', completed: false },
          { id: 'sun7', name: `Edge: ${edgeSize} - ${weightProgression}`, completed: false },
          { id: 'sun8', name: 'Use feet on ground if can\'t hang 12 seconds', completed: false },
          { id: 'sun9', name: 'Stop 2-3 sec before failure', completed: false },
          { id: 'sun10', name: 'Half-Crimp hangs', sets: 5, duration: 12, rest: 180 },
          { id: 'sun11', name: 'Open Hand hangs', sets: 5, duration: 12, rest: 180 },
          { id: 'sun12', name: 'Three-Finger Drag hangs', sets: 5, duration: 12, rest: 180 },
        ],
      },
      {
        title: 'Antagonist Work',
        duration: '15 min',
        exercises: [
          { id: 'sun13', name: 'Reverse Wrist Curls', sets: 3, reps: 15 },
          { id: 'sun14', name: 'Rice Bucket or Band Finger Extensions', sets: 2, duration: 60 },
          { id: 'sun15', name: 'Push-ups', sets: 2, reps: 15 },
          { id: 'sun16', name: 'Band Pull-Aparts', sets: 2, reps: 20 },
          { id: 'sun17', name: 'Rotator Cuff with Band', sets: 2, reps: '12 each', notes: 'External + internal rotation' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '5 min',
        exercises: [
          { id: 'sun18', name: 'Finger stretches, wrist mobility, shoulder rolls', duration: 300 },
        ],
      },
      {
        title: 'Post-Training',
        duration: 'Within 1 hour',
        exercises: [
          { id: 'sun19', name: 'Protein + carbs', completed: false },
        ],
      },
    ],
    importantNotes: [
      'CRITICAL: Stop if sharp pain occurs',
      'Stop 2-3 sec before failure on every hang',
      'Add weight conservatively (2-5 lbs/week)',
      `Week ${weekInPhase} progression: ${hangboardIntensity}`,
      'NEVER use full crimp - half crimp or open hand only',
    ],
    lowEnergyVariant: 'Antagonist work only (15 min) - BUT NEVER SKIP',
  };
};

export const getPhaseInfo = (weekNumber: number): { phase: Phase; isDeload: boolean } => {
  let phase: Phase;

  if (weekNumber <= 4) {
    phase = 'Strength Foundation';
  } else if (weekNumber <= 8) {
    phase = 'Power Development';
  } else if (weekNumber <= 12) {
    phase = 'Power Endurance';
  } else {
    phase = 'Peaking & Performance';
  }

  const isDeload = weekNumber === 4 || weekNumber === 8 || weekNumber === 12;

  return { phase, isDeload };
};

export const weeklySchedule: DayOfWeek[] = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
