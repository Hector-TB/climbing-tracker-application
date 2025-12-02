import { WorkoutDay, DayOfWeek } from '../types';

// Training Plan Data - 12 Week Climbing Progression

export const getWorkoutForWeek = (weekNumber: number, day: DayOfWeek): WorkoutDay => {
  const phase = weekNumber <= 4 ? 'Foundation' : weekNumber <= 8 ? 'Power' : 'Peak';
  const isDeload = weekNumber === 6;

  // Return workout based on day and phase
  const workouts = getWorkoutsByPhase(phase, isDeload, weekNumber);
  return workouts[day];
};

const getWorkoutsByPhase = (phase: string, isDeload: boolean, weekNumber: number): Record<DayOfWeek, WorkoutDay> => {
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

// MONDAY - Power Climbing Session
const getMondayWorkout = (phase: string, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const gradeRange = phase === 'Foundation' ? 'V4-V5' : phase === 'Power' ? 'V5-V6' : 'V6-V7';

  return {
    day: 'Monday',
    title: 'Power Climbing Session',
    duration: isDeload ? '1 hour' : '1.5-2 hours',
    focus: 'Limit bouldering, powerful movements, lockoff strength',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'm1', name: 'Ankle Mobility - Circles', sets: 1, reps: '10 each direction' },
          { id: 'm2', name: 'Ankle Mobility - Dorsiflexion stretches', duration: 90 },
          { id: 'm3', name: 'Easy Traversing on Jugs', duration: 300 },
          { id: 'm4', name: 'Progressive Pull-ups', sets: 3, reps: '3-4-5' },
          { id: 'm5', name: 'Large Hold Hangs (open grip)', sets: 3, duration: 10 },
          { id: 'm6', name: 'Easy Climbing V0-V1', duration: 300 },
        ],
      },
      {
        title: 'Main Session - Limit Bouldering',
        duration: isDeload ? '30 min' : '60 min',
        exercises: [
          {
            id: 'm7',
            name: `Limit Problems ${gradeRange}`,
            reps: isDeload ? '3-4 problems' : '5-7 problems',
            notes: '4-5 attempts max per problem, 5min rest between attempts'
          },
          {
            id: 'm8',
            name: 'Overhang problems (weakness focus)',
            reps: '2-3 problems',
          },
          {
            id: 'm9',
            name: 'Powerful/dynamic problems',
            reps: '2 problems',
          },
          {
            id: 'm10',
            name: 'Technical problems (strength focus)',
            reps: '1-2 problems',
          },
        ],
      },
      {
        title: 'Movement Drills',
        duration: '15 min',
        exercises: [
          {
            id: 'm11',
            name: 'Lockoff Practice',
            sets: 3,
            reps: '3-4 each arm',
            notes: 'Hold at 90° for 3sec, then 120° for 3sec'
          },
          ...(phase !== 'Foundation' && !isDeload ? [{
            id: 'm12',
            name: phase === 'Peak' ? 'Campus Ladders (1-3-5, 1-4-7)' : 'Campus Board - Assisted Touches',
            sets: phase === 'Peak' ? 4 : 3,
            reps: phase === 'Peak' ? '4-6 touches' : '6-8 touches',
            notes: 'STOP if elbows hurt'
          }] : []),
        ],
      },
      {
        title: 'Post-Climbing Antagonist',
        duration: '10 min',
        exercises: [
          { id: 'm13', name: 'Push-ups', sets: 2, reps: 'Near failure' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'm14', name: 'Forearm flexor stretch', duration: 30, notes: 'Each arm' },
          { id: 'm15', name: 'Forearm extensor stretch', duration: 30, notes: 'Each arm' },
          { id: 'm16', name: 'Shoulder stretches', duration: 60 },
          { id: 'm17', name: 'Forearm massage/rolling', duration: 240 },
        ],
      },
    ],
    importantNotes: [
      'NEVER train through elbow pain above 5/10',
      'Rest 5 minutes between limit attempts',
      'Quality over quantity - 4 perfect attempts beat 10 sloppy ones',
      'Stop immediately if elbow pain reaches 6+/10',
    ],
    lowEnergyVariant: '3-4 problems, drop one grade, 40min total, skip campus/lockoff work',
  };
};

// TUESDAY - Technique & Volume
const getTuesdayWorkout = (phase: string, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const gradeRange = phase === 'Foundation' ? 'V1-V3' : phase === 'Power' ? 'V3-V4' : 'V3-V5';
  const problemCount = phase === 'Foundation' ? '15-20' : phase === 'Power' ? '12-15' : '10-12';

  return {
    day: 'Tuesday',
    title: 'Technique & Volume Climbing',
    duration: isDeload ? '30 min' : '1.5 hours',
    focus: 'Movement quality, endurance, skill development',
    sections: [
      {
        title: 'Warm-up',
        duration: '15 min',
        exercises: [
          { id: 't1', name: 'Ankle Mobility', duration: 300 },
          { id: 't2', name: 'Easy Traversing', duration: 180 },
          { id: 't3', name: 'Progressive Pull-ups (optional)', sets: 3, reps: '3-4-5' },
          { id: 't4', name: 'Large Hold Hangs', sets: 2, duration: 10 },
          { id: 't5', name: 'Easy Climbing V0-V1', duration: 300 },
        ],
      },
      {
        title: 'Main Session - Volume Climbing',
        duration: '60 min',
        exercises: [
          {
            id: 't6',
            name: `Volume Problems ${gradeRange}`,
            reps: isDeload ? '6-8 problems' : `${problemCount} problems`,
            notes: '2-3min rest between, should feel EASY'
          },
          { id: 't7', name: 'Hip positioning focus', reps: 'Multiple problems' },
          { id: 't8', name: 'Precise footwork practice', reps: 'Multiple problems' },
          { id: 't9', name: 'Body tension through core', reps: 'Multiple problems' },
        ],
      },
      ...(phase !== 'Foundation' && !isDeload ? [{
        title: '4x4s Circuit',
        duration: '15 min',
        exercises: [
          {
            id: 't10',
            name: '4x4 Power-Endurance Circuit',
            sets: phase === 'Peak' ? 3 : 4,
            reps: '4 problems per circuit',
            notes: '1min rest between problems, 2-3min rest between circuits'
          },
        ],
      }] : []),
      {
        title: 'Technique Drills',
        duration: '15 min',
        exercises: [
          { id: 't11', name: 'Straight-Arm Hangs', sets: 5, duration: 10 },
          { id: 't12', name: 'Foot Matching Practice', reps: '3 times' },
          { id: 't13', name: 'Twist-Through Practice', reps: '3-4 problems' },
        ],
      },
      {
        title: 'Post-Climbing Antagonist',
        duration: '10 min',
        exercises: [
          { id: 't14', name: 'Light Push-ups', sets: phase === 'Power' ? 3 : 2, reps: '70% effort' },
        ],
      },
    ],
    importantNotes: [
      'This is RECOVERY climbing - stay well below limit',
      'Should produce 0-2/10 elbow pain maximum',
      'Focus on technique, not sending hard',
      'If pain reaches 5+/10, end session immediately',
    ],
    lowEnergyVariant: '8-10 problems V1-V2 only, technique drills only, 45min total',
  };
};

// WEDNESDAY - Antagonist & Mobility
const getWednesdayWorkout = (phase: string, isDeload: boolean, weekNumber: number): WorkoutDay => {
  return {
    day: 'Wednesday',
    title: 'Antagonist Strength & Mobility',
    duration: '45-60 min',
    focus: 'Elbow rehab, push muscles, injury prevention',
    sections: [
      {
        title: 'Elbow Prehab Circuit',
        duration: '20 min',
        exercises: [
          {
            id: 'w1',
            name: 'Reverse Wrist Curls',
            sets: isDeload ? 3 : phase === 'Power' || phase === 'Peak' ? 4 : 3,
            reps: '20-25',
            weight: 2.5,
            notes: 'Palms DOWN, 2sec up/2sec down'
          },
          {
            id: 'w2',
            name: 'Eccentric Wrist Curls',
            sets: isDeload ? 3 : phase === 'Power' || phase === 'Peak' ? 4 : 3,
            reps: '10 each arm',
            weight: 2.5,
            notes: 'Lift with both, lower with one (5sec)'
          },
          {
            id: 'w3',
            name: 'Pronation/Supination',
            sets: isDeload ? 3 : phase === 'Power' || phase === 'Peak' ? 4 : 3,
            reps: '15 each direction',
            notes: 'Hammer rotations'
          },
          {
            id: 'w4',
            name: 'Finger Extension Bands',
            sets: 3,
            reps: '15',
          },
        ],
      },
      {
        title: 'Push Exercises - Primary Work',
        duration: '25 min',
        exercises: [
          {
            id: 'w5',
            name: 'Push-ups',
            sets: phase === 'Peak' ? 5 : 4,
            reps: 'Near failure (leave 1-2 reps)',
            notes: phase !== 'Foundation' ? 'Progress to decline or weighted' : 'Standard form'
          },
          {
            id: 'w6',
            name: 'Pike Push-ups',
            sets: 3,
            reps: phase === 'Foundation' ? '6-10' : '10-15',
          },
          {
            id: 'w7',
            name: 'Tricep Dips',
            sets: 3,
            reps: '8-12',
            notes: phase !== 'Foundation' ? 'Remove assistance, add weight if needed' : 'Use assistance if needed'
          },
        ],
      },
      {
        title: 'Shoulder Stability',
        duration: '10 min',
        exercises: [
          { id: 'w8', name: 'Band Pull-Aparts', sets: 3, reps: '15-20' },
          { id: 'w9', name: "I's, Y's, T's (Prone)", sets: 2, reps: '10 each position' },
          ...(phase !== 'Foundation' ? [
            { id: 'w10', name: 'Face Pulls with Band', sets: 3, reps: '12-15' },
            { id: 'w11', name: 'Scapular Push-ups', sets: 3, reps: '10' },
          ] : []),
        ],
      },
    ],
    importantNotes: [
      'THIS IS YOUR MOST IMPORTANT SESSION - Never skip!',
      'Keep at full volume even during deload week',
      'This protects your elbows and prevents injuries',
      'Minimum effort variant: 2 rounds prehab + 2 sets push-ups',
    ],
    lowEnergyVariant: '2 rounds prehab, 2 sets push-ups only, 25min total - BUT NEVER SKIP',
  };
};

// THURSDAY - Regular Gym
const getThursdayWorkout = (phase: string, isDeload: boolean, weekNumber: number): WorkoutDay => {
  return {
    day: 'Thursday',
    title: 'Regular Gym Session',
    duration: isDeload ? '1 hour' : '1.5 hours',
    focus: 'Lower body strength, upper push work, core conditioning',
    sections: [
      {
        title: 'General Warm-up',
        duration: '10 min',
        exercises: [
          { id: 'th1', name: 'Light Cardio', duration: 300 },
          { id: 'th2', name: 'Leg Swings', reps: '10 each direction' },
          { id: 'th3', name: 'Walking Lunges', reps: '10 each leg' },
          { id: 'th4', name: 'Bodyweight Squats', reps: '15' },
        ],
      },
      {
        title: 'Lower Body Strength',
        duration: '35 min',
        exercises: [
          {
            id: 'th5',
            name: phase === 'Power' ? 'Goblet Squats or Barbell Squats' : 'Goblet Squats',
            sets: 4,
            reps: '10-12',
            weight: phase === 'Foundation' ? 17.5 : phase === 'Power' ? 22.5 : 20,
            notes: isDeload ? '60% weight' : undefined
          },
          {
            id: 'th6',
            name: 'Bulgarian Split Squats',
            sets: 3,
            reps: '8-10 each leg',
            weight: phase === 'Foundation' ? 0 : 10,
          },
          {
            id: 'th7',
            name: 'Glute Bridges',
            sets: 3,
            reps: '15',
            weight: phase === 'Foundation' ? 10 : 20,
            notes: phase !== 'Foundation' ? 'Single-leg variation optional' : undefined
          },
          {
            id: 'th8',
            name: 'Calf Raises',
            sets: 3,
            reps: '20',
            notes: phase !== 'Foundation' ? 'Single-leg progression' : 'Bodyweight'
          },
        ],
      },
      {
        title: 'Upper Body Push Work',
        duration: '20 min',
        exercises: [
          {
            id: 'th9',
            name: 'Dumbbell Bench Press',
            sets: phase === 'Power' ? 5 : 4,
            reps: '10-12',
            weight: 12,
          },
          {
            id: 'th10',
            name: 'Overhead Tricep Extension',
            sets: 3,
            reps: '12-15',
            weight: 7.5,
          },
        ],
      },
      {
        title: 'Core + Compression Work',
        duration: '20 min',
        exercises: [
          {
            id: 'th11',
            name: 'Hanging Knee Raises',
            sets: 4,
            reps: phase === 'Power' || phase === 'Peak' ? '8-12 (straight leg)' : '8-12',
            notes: 'Lying leg raises if elbows hurt'
          },
          { id: 'th12', name: 'Front Plank', sets: 3, duration: phase === 'Foundation' ? 50 : 60 },
          { id: 'th13', name: 'Side Plank', sets: 2, duration: 35, notes: 'Each side' },
          { id: 'th14', name: 'Dead Bug', sets: 3, reps: '10 each side' },
          { id: 'th15', name: 'Hollow-Body Rocks', sets: 3, reps: '20' },
          {
            id: 'th16',
            name: 'Compression Hangs',
            sets: 3,
            duration: phase === 'Foundation' ? 10 : 15,
            notes: 'Hang from jugs, feet at hip height'
          },
        ],
      },
      {
        title: 'Flexibility/Mobility',
        duration: '15 min',
        exercises: [
          { id: 'th17', name: 'Hip Flexor Stretches', duration: 45, sets: 2, notes: 'Each side' },
          { id: 'th18', name: 'Hamstring Stretches', duration: 45, sets: 2 },
          { id: 'th19', name: 'Pigeon Pose', duration: 60, notes: 'Each side' },
          { id: 'th20', name: 'Butterfly Stretch', duration: 60 },
        ],
      },
    ],
    importantNotes: [
      'Your legs are LONG - use that advantage with strength',
      'High steps require flexibility AND strength',
      'Core and compression work directly improves overhang climbing',
    ],
    lowEnergyVariant: 'Core + compression only, skip legs and upper push, 45min total',
  };
};

// FRIDAY - Finger Strength & Power
const getFridayWorkout = (phase: string, isDeload: boolean, weekNumber: number): WorkoutDay => {
  return {
    day: 'Friday',
    title: 'Finger Strength & Power Training',
    duration: isDeload ? '45 min' : '1.5 hours',
    focus: 'Maximum finger strength, explosive power, lockoff development',
    sections: [
      {
        title: 'Warm-up',
        duration: '20 min',
        exercises: [
          { id: 'f1', name: 'Light Cardio', duration: 300 },
          { id: 'f2', name: 'Upper Body Activation', duration: 300 },
          { id: 'f3', name: 'Progressive Finger Loading - Jugs', sets: 3, duration: 10 },
          { id: 'f4', name: 'Progressive Finger Loading - Medium Holds', sets: 3, duration: 10 },
          { id: 'f5', name: 'Progressive Finger Loading - Training Edge', sets: 2, duration: 8 },
        ],
      },
      {
        title: phase === 'Peak' ? 'Hangboard - 7/53 Protocol' : 'Hangboard - MaxHangs',
        duration: '25 min',
        exercises: [
          {
            id: 'f6',
            name: phase === 'Peak' ? '7/53 Protocol' : 'MaxHangs Protocol',
            sets: phase === 'Peak' ? 5 : isDeload ? 1 : phase === 'Power' ? 2 : 1,
            duration: phase === 'Peak' ? 7 : 12,
            notes: phase === 'Peak'
              ? '7sec hang, 53sec rest, 3 reps = 1 set, near-maximal weight'
              : '12sec hangs, 3min rest, half-crimp ONLY, add weight if completing easily'
          },
        ],
      },
      ...(weekNumber >= 3 && !isDeload ? [{
        title: 'Campus Board / Power Movements',
        duration: '20 min',
        exercises: [
          {
            id: 'f7',
            name: phase === 'Peak'
              ? 'Campus Ladders (1-5-9 Pattern)'
              : phase === 'Power'
                ? 'Campus Laddering (1-3-5)'
                : 'Assisted Campus Touches',
            sets: phase === 'Peak' ? 5 : 3,
            reps: phase === 'Peak' ? '4-6 sets' : '6-8 touches',
            notes: 'STOP if elbows hurt. Alternative: Explosive pull-ups'
          },
        ],
      }] : weekNumber < 3 ? [{
        title: 'Box Step-Downs',
        duration: '15 min',
        exercises: [
          {
            id: 'f7b',
            name: 'Box Step-Downs',
            sets: 3,
            reps: '6 each leg',
            notes: 'Land softly and controlled'
          },
        ],
      }] : []),
      {
        title: 'Lock-off Strength',
        duration: '15 min',
        exercises: [
          {
            id: 'f8',
            name: phase === 'Peak' ? 'One-Arm Hangs with Assistance' : 'Offset Pull-ups',
            sets: phase === 'Peak' ? 4 : 3,
            reps: phase === 'Peak' ? '2-3 each arm' : '4-6 each arm',
            notes: phase === 'Peak' ? 'Hold 5-8 seconds' : 'Band assistance on lower hand'
          },
          {
            id: 'f9',
            name: 'Toes-to-Bar',
            sets: 3,
            reps: '6-8',
            notes: 'Lying leg raises if elbows hurt'
          },
        ],
      },
      {
        title: 'Post-Session Antagonist',
        duration: '10 min',
        exercises: [
          { id: 'f10', name: 'Push-ups', sets: 2, reps: '70-80% effort' },
        ],
      },
      {
        title: 'Cool-down',
        duration: '10 min',
        exercises: [
          { id: 'f11', name: 'Forearm Massage', duration: 240 },
          { id: 'f12', name: 'Forearm Stretches', duration: 180 },
          { id: 'f13', name: 'Finger Extension Stretches', duration: 60 },
        ],
      },
    ],
    importantNotes: [
      'NEVER train fingers when cold - warm-up is critical',
      'NEVER use full crimp grip - half crimp or open hand only',
      'If elbows hurt, modify or skip finger training',
      'Quality over quantity - precision matters',
    ],
    lowEnergyVariant: '1 set hangboard only, skip campus and lockoffs, 45min total',
  };
};

// SATURDAY - Project & Performance
const getSaturdayWorkout = (phase: string, isDeload: boolean, weekNumber: number): WorkoutDay => {
  const projectGrade = phase === 'Foundation' ? 'V5' : phase === 'Power' ? 'V6' : 'V7';
  const flashGrade = phase === 'Foundation' ? 'V4' : phase === 'Power' ? 'V5' : 'V6';

  return {
    day: 'Saturday',
    title: 'Project & Performance Day',
    duration: isDeload ? '90 min' : '2 hours',
    focus: 'Maximum performance, projecting, sending',
    sections: [
      {
        title: 'Extended Warm-up',
        duration: weekNumber === 12 ? '35 min' : '25 min',
        exercises: [
          { id: 's1', name: 'General Movement', duration: 300 },
          { id: 's2', name: 'Easy Climbing V0-V1', reps: '4-6 problems' },
          { id: 's3', name: 'Progressive Loading V1-V3', reps: '5 problems' },
        ],
      },
      {
        title: 'Main Session - Project Work',
        duration: '90 min',
        exercises: [
          {
            id: 's4',
            name: isDeload ? 'Flash Attempts Only' : `Project 1: Overhang ${projectGrade}`,
            reps: isDeload ? 'Multiple V4-V5' : weekNumber === 12 ? '4 attempts max' : '4-6 attempts',
            notes: isDeload ? 'No projecting - fun climbing' : '8-10min rest between attempts'
          },
          ...(isDeload ? [] : [
            {
              id: 's5',
              name: `Project 2: Technical ${projectGrade}`,
              reps: weekNumber >= 11 ? '3-4 attempts' : '4-6 attempts',
              notes: '8-10min rest between attempts'
            },
            ...(weekNumber < 11 ? [{
              id: 's6',
              name: `Project 3: Style Variety ${projectGrade}`,
              reps: '4-6 attempts',
              notes: '8-10min rest between attempts'
            }] : []),
          ]),
        ],
      },
      ...(isDeload ? [] : [{
        title: 'Supporting Climbs',
        duration: '30 min',
        exercises: [
          {
            id: 's7',
            name: `Flash Attempts on ${flashGrade}`,
            reps: weekNumber >= 11 ? '4-6 problems' : '3-4 problems',
            notes: 'First attempt should be best attempt'
          },
        ],
      }]),
      {
        title: 'Post-Session',
        duration: '15 min',
        exercises: [
          { id: 's8', name: 'Light Push-ups', sets: 2, reps: '10-15' },
          { id: 's9', name: 'Cool-down Stretching', duration: 600 },
          { id: 's10', name: 'Reflection & Planning', duration: 300 },
        ],
      },
    ],
    importantNotes: [
      weekNumber === 12 ? 'THIS IS YOUR PERFORMANCE WEEK - Pick YOUR problem!' : 'This is where you apply all your training',
      'Everything this week prepared you for today',
      'Maximum effort on projects',
      isDeload ? 'Deload week - No projecting, flash work only' : 'Track your sends and attempts',
    ],
    lowEnergyVariant: '1 project, 4 attempts max, more flash work, 90min total',
  };
};

// SUNDAY - Active Recovery
const getSundayWorkout = (phase: string, isDeload: boolean, weekNumber: number): WorkoutDay => {
  return {
    day: 'Sunday',
    title: 'Active Recovery & Maintenance',
    duration: '45 min',
    focus: 'Recovery, antagonist balance, preparation for next week',
    sections: [
      {
        title: 'Choose ONE Activity',
        duration: '30 min',
        exercises: [
          { id: 'su1', name: 'Light Walking/Hiking', duration: 1800, notes: 'Conversational pace' },
          { id: 'su2', name: 'Swimming', duration: 1500, notes: 'Relaxed pace' },
          { id: 'su3', name: 'Cycling', duration: 2100, notes: 'Easy spin' },
          { id: 'su4', name: 'Yoga', duration: 2100, notes: 'Gentle flow' },
          { id: 'su5', name: 'Easy Climbing V0-V1', duration: 1800, notes: 'Pure technique' },
        ],
      },
      {
        title: 'Mandatory Prehab Work',
        duration: '15 min',
        exercises: [
          { id: 'su6', name: 'Reverse Wrist Curls', sets: 2, reps: '15-20', weight: 2 },
          { id: 'su7', name: 'Eccentric Wrist Curls', sets: 2, reps: '8 each arm', weight: 2 },
          { id: 'su8', name: 'Pronation/Supination', sets: 2, reps: '12 each direction' },
          { id: 'su9', name: 'Finger Extension Bands', sets: 2, reps: '12' },
          { id: 'su10', name: 'Band Pull-Aparts', sets: 2, reps: '15' },
        ],
      },
    ],
    importantNotes: [
      'This is ACTIVE recovery, not complete rest',
      'Light movement accelerates recovery',
      'NEVER skip prehab work',
      'Test grip strength this evening',
      'Complete weekly self-assessment',
    ],
    lowEnergyVariant: 'Prehab only, rest otherwise, 20min total - but NEVER skip prehab',
  };
};

export const getPhaseInfo = (weekNumber: number): { phase: Phase; isDeload: boolean } => {
  return {
    phase: weekNumber <= 4 ? 'Foundation' : weekNumber <= 8 ? 'Power Development' : 'Peak Performance',
    isDeload: weekNumber === 6,
  };
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
