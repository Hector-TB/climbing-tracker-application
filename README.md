# Climbing Progression Tracker

A beautiful mobile application for tracking Hector's 12-week climbing progression plan (V5 → V7 Bouldering). Built with React Native and Expo.

## Features

### 📊 Comprehensive Tracking
- **Daily Workout Tracking**: Complete workout sessions with exercise-by-exercise tracking
- **Metrics Logging**: Track elbow pain, grip strength, recovery scores, and climbing metrics
- **Progress Visualization**: Beautiful charts showing trends over time
- **12-Week Plan**: Full structured program with phases and deload weeks

### 💪 Training Plan Structure
- **Phase 1 (Weeks 1-4)**: Foundation + Elbow Rehab
- **Phase 2 (Weeks 5-8)**: Power Development
- **Phase 3 (Weeks 9-12)**: Peak Performance
- **Week 6**: Built-in deload week for recovery

### 📱 Screens

#### Home Dashboard
- Current week and phase indicator
- Today's workout preview
- Weekly schedule overview
- Quick stats and progress metrics

#### Workout Tracking
- Exercise-by-exercise completion tracking
- Low-energy variant toggle
- Progress indicators
- Important safety notes
- Save and complete functionality

#### Daily Logs
- Comprehensive health metrics (elbow pain, grip strength)
- Recovery status tracking (sleep, energy, soreness, motivation)
- Climbing metrics (problems attempted, grades, sends)
- Visual sliders for easy input
- Alerts for high pain or low recovery

#### Progress Visualization
- Line charts for trends (elbow pain, grip strength, recovery)
- Weekly summary statistics
- Training insights based on metrics
- Tracking tips and guidelines

#### Plan Overview
- Full 12-week plan breakdown
- Phase indicators and color coding
- Expandable week details
- Expected outcomes
- Week selector for easy navigation

## Design Features

### 🎨 Beautiful UI/UX
- **Modern Dark Theme**: Easy on the eyes during gym sessions
- **Gradient Cards**: Vibrant, energetic design
- **Color-Coded Phases**: Visual distinction between training phases
- **Smooth Animations**: Polished interactions throughout
- **Intuitive Navigation**: Bottom tab bar for easy access

### 🎯 User-Centric Design
- **Low-Energy Variants**: Built-in support for reduced-volume workouts
- **Safety Alerts**: Warnings for high pain levels
- **Progress Tracking**: Visual feedback on completion
- **Offline First**: All data stored locally with AsyncStorage

## Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI (`npm install -g expo-cli`)
- iOS Simulator (Mac) or Android Emulator, or Expo Go app on your phone

### Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Run on your device:
   - **iOS**: Press `i` in the terminal or scan QR code with Camera app
   - **Android**: Press `a` in the terminal or scan QR code with Expo Go app
   - **Web**: Press `w` in the terminal

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and tooling
- **TypeScript**: Type-safe code
- **React Navigation**: Navigation system
- **React Native Chart Kit**: Data visualization
- **AsyncStorage**: Local data persistence
- **Expo Linear Gradient**: Beautiful gradients
- **date-fns**: Date manipulation

## Project Structure

```
climbing-tracker-application/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── ExerciseItem.tsx
│   │   └── PhaseIndicator.tsx
│   ├── data/              # Training plan data
│   │   └── trainingPlan.ts
│   ├── navigation/        # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── screens/          # Main app screens
│   │   ├── HomeScreen.tsx
│   │   ├── WorkoutScreen.tsx
│   │   ├── LogsScreen.tsx
│   │   ├── ProgressScreen.tsx
│   │   └── PlanScreen.tsx
│   ├── services/         # Data management
│   │   └── storage.ts
│   ├── theme/           # Design system
│   │   ├── colors.ts
│   │   └── spacing.ts
│   └── types/          # TypeScript types
│       └── index.ts
├── App.tsx            # App entry point
├── app.json          # Expo configuration
├── package.json      # Dependencies
└── tsconfig.json    # TypeScript configuration
```

## Key Features Explained

### Workout Tracking
Each workout includes:
- Warm-up exercises
- Main session exercises
- Movement drills
- Post-climbing antagonist work
- Cool-down stretches

Track completion with checkboxes and save progress at any time.

### Metrics Logging
Track critical health indicators:
- **Elbow Pain (0-10)**: During warm-up, climbing, lockoffs, and post-session
- **Grip Strength**: Baseline tracking for fatigue monitoring
- **Recovery (1-5)**: Muscle soreness, energy, sleep quality, motivation
- **Climbing Stats**: Problems attempted, grades, sends, technique notes

### Progress Visualization
View trends over the last 7 days:
- Elbow pain trends (with danger thresholds)
- Grip strength tracking
- Recovery score monitoring
- Automated insights based on your data

### The 12-Week Plan
Complete structured plan with:
- Weekly progression through phases
- Exercise-specific details (sets, reps, weights)
- Important safety notes
- Low-energy variants for recovery days
- Built-in deload week

## Usage Tips

1. **Start Your Week**: Review the plan on Sunday, set your current week
2. **Daily Tracking**: Log metrics every day for accurate trends
3. **Workout Sessions**: Complete exercises as you go, save progress
4. **Monitor Recovery**: Check the Progress screen weekly
5. **Adjust as Needed**: Use low-energy variants when grip is down 15%+

## Color Scheme

- **Primary (Orange)**: Energy, power, action (`#FF6B35`)
- **Secondary (Teal)**: Calm, focus, technique (`#4ECDC4`)
- **Accent (Yellow)**: Achievements, highlights (`#FFE66D`)
- **Background (Deep Navy)**: Modern, focused (`#1A1A2E`)
- **Success (Green)**: Completed items (`#06FFA5`)
- **Warning (Yellow)**: Alerts, deload week (`#FFE66D`)
- **Error (Red)**: High pain, critical alerts (`#FF6B6B`)

## Development

### Adding New Features
1. Define types in `src/types/index.ts`
2. Create components in `src/components/`
3. Add screens to `src/screens/`
4. Update navigation in `src/navigation/AppNavigator.tsx`

### Modifying the Training Plan
Edit `src/data/trainingPlan.ts` to adjust:
- Exercise details
- Sets and reps
- Phase progressions
- Important notes

### Customizing Theme
Modify `src/theme/colors.ts` and `src/theme/spacing.ts` to adjust the design system.

## Data Storage

All data is stored locally on your device using AsyncStorage:
- Workout logs
- Daily metrics
- Climbing metrics
- Monthly benchmarks
- Current week progress

Data persists across app restarts and is private to your device.

## Safety Features

Built-in safety monitoring:
- **3-Strike Rule**: Progressive warnings for elbow pain
- **High Pain Alerts**: Automatic warnings at 6+/10 pain
- **Recovery Monitoring**: Alerts for low recovery scores
- **Grip Strength Tracking**: Use low-energy variants when down 15%+

## Future Enhancements

Potential additions:
- Cloud backup and sync
- Monthly benchmark tracking interface
- Social sharing of progress
- Video exercise demonstrations
- Custom exercise creation
- Nutrition tracking
- Sleep integration

## Support

For issues or questions:
1. Check the in-app Plan screen for training details
2. Review the Progress screen for health monitoring
3. Ensure consistent daily logging for accurate insights

## License

Private project for personal use.

---

**Stay strong, climb safe, and track your progress to V7! 🧗‍♂️📈**