import {
  UserProfile,
  WorkoutRecord,
  WorkoutTemplate,
  MealRecord,
  WaterRecord,
  WeightRecord,
  MeasurementRecord,
  GoalItem,
  DailyActivityRecord,
  BadgeItem
} from '../types/fitness';
import { getTodayDateString } from '../utils/fitnessCalculations';

const today = getTodayDateString();

const getDateDaysAgo = (days: number): string => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const sampleUserProfile: UserProfile = {
  uid: 'guest-user-123',
  name: 'Alex Morgan',
  age: 28,
  gender: 'female',
  heightCm: 172,
  weightKg: 68.5,
  startingWeightKg: 73.5,
  targetWeightKg: 64.0,
  fitnessGoal: 'weight_loss',
  activityLevel: 'moderately_active',
  dailyWaterGoalMl: 2750,
  dailyCalorieGoal: 1950,
  dailyStepGoal: 10000,
  streak: 6,
  longestStreak: 14,
  createdAt: getDateDaysAgo(30),
  updatedAt: today,
};

export const sampleWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: 'tpl-push',
    userId: 'guest-user-123',
    title: 'Push Day (Chest, Shoulders & Triceps)',
    type: 'Strength Training',
    estimatedDurationMinutes: 50,
    estimatedCaloriesBurned: 400,
    notes: 'Focus on progressive overload on bench press and overhead press.',
    exercises: [
      { exerciseName: 'Barbell Bench Press', muscleGroup: 'Chest', targetSets: 3, targetReps: 8, defaultWeightKg: 55 },
      { exerciseName: 'Incline Dumbbell Press', muscleGroup: 'Chest', targetSets: 3, targetReps: 10, defaultWeightKg: 20 },
      { exerciseName: 'Standing Barbell Military Press', muscleGroup: 'Shoulders', targetSets: 3, targetReps: 8, defaultWeightKg: 35 },
      { exerciseName: 'Dumbbell Lateral Raise', muscleGroup: 'Shoulders', targetSets: 3, targetReps: 12, defaultWeightKg: 10 },
      { exerciseName: 'Cable Triceps Rope Pushdown', muscleGroup: 'Arms', targetSets: 3, targetReps: 12, defaultWeightKg: 22.5 }
    ],
    createdAt: getDateDaysAgo(20)
  },
  {
    id: 'tpl-pull',
    userId: 'guest-user-123',
    title: 'Pull Day (Back & Biceps)',
    type: 'Strength Training',
    estimatedDurationMinutes: 50,
    estimatedCaloriesBurned: 410,
    notes: 'Keep core tight during bent-over rows and deadlifts.',
    exercises: [
      { exerciseName: 'Conventional Barbell Deadlift', muscleGroup: 'Back', targetSets: 3, targetReps: 6, defaultWeightKg: 85 },
      { exerciseName: 'Bent-Over Barbell Row', muscleGroup: 'Back', targetSets: 3, targetReps: 10, defaultWeightKg: 50 },
      { exerciseName: 'Wide-Grip Lat Pulldown', muscleGroup: 'Back', targetSets: 3, targetReps: 10, defaultWeightKg: 50 },
      { exerciseName: 'Cable Face Pulls', muscleGroup: 'Shoulders', targetSets: 3, targetReps: 15, defaultWeightKg: 25 },
      { exerciseName: 'Standing Barbell Bicep Curl', muscleGroup: 'Arms', targetSets: 3, targetReps: 10, defaultWeightKg: 25 }
    ],
    createdAt: getDateDaysAgo(18)
  },
  {
    id: 'tpl-legs',
    userId: 'guest-user-123',
    title: 'Leg Day & Glute Sculpt',
    type: 'Strength Training',
    estimatedDurationMinutes: 55,
    estimatedCaloriesBurned: 460,
    notes: 'Deep back squats and controlled Romanian deadlifts.',
    exercises: [
      { exerciseName: 'Barbell Back Squat', muscleGroup: 'Legs', targetSets: 4, targetReps: 8, defaultWeightKg: 75 },
      { exerciseName: 'Romanian Deadlift (RDL)', muscleGroup: 'Legs', targetSets: 3, targetReps: 10, defaultWeightKg: 65 },
      { exerciseName: '45-Degree Leg Press', muscleGroup: 'Legs', targetSets: 3, targetReps: 12, defaultWeightKg: 110 },
      { exerciseName: 'Dumbbell Walking Lunges', muscleGroup: 'Legs', targetSets: 3, targetReps: 12, defaultWeightKg: 14 }
    ],
    createdAt: getDateDaysAgo(15)
  }
];

export const sampleWorkouts: WorkoutRecord[] = [
  {
    id: 'w-1',
    userId: 'guest-user-123',
    title: 'Upper Body Hypertrophy & Arms',
    type: 'Strength Training',
    durationMinutes: 55,
    caloriesBurned: 420,
    date: today,
    notes: 'Hit a personal best on Barbell Bench Press! Felt super energetic.',
    exercises: [
      {
        exerciseName: 'Barbell Bench Press',
        muscleGroup: 'Chest',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 50, completed: true },
          { setNumber: 2, reps: 8, weightKg: 55, completed: true },
          { setNumber: 3, reps: 6, weightKg: 60, completed: true }
        ]
      },
      {
        exerciseName: 'Wide-Grip Lat Pulldown',
        muscleGroup: 'Back',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 45, completed: true },
          { setNumber: 2, reps: 10, weightKg: 50, completed: true },
          { setNumber: 3, reps: 8, weightKg: 55, completed: true }
        ]
      },
      {
        exerciseName: 'Standing Barbell Military Press',
        muscleGroup: 'Shoulders',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 30, completed: true },
          { setNumber: 2, reps: 8, weightKg: 35, completed: true },
          { setNumber: 3, reps: 8, weightKg: 35, completed: true }
        ]
      },
      {
        exerciseName: 'Cable Triceps Rope Pushdown',
        muscleGroup: 'Arms',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 20, completed: true },
          { setNumber: 2, reps: 12, weightKg: 22.5, completed: true }
        ]
      }
    ],
    createdAt: today
  },
  {
    id: 'w-2',
    userId: 'guest-user-123',
    title: 'Leg Day & Glute Sculpt',
    type: 'Strength Training',
    durationMinutes: 50,
    caloriesBurned: 440,
    date: getDateDaysAgo(2),
    notes: 'Focused on depth in squats and hip drive on RDLs.',
    exercises: [
      {
        exerciseName: 'Barbell Back Squat',
        muscleGroup: 'Legs',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 65, completed: true },
          { setNumber: 2, reps: 8, weightKg: 75, completed: true },
          { setNumber: 3, reps: 8, weightKg: 80, completed: true }
        ]
      },
      {
        exerciseName: 'Romanian Deadlift (RDL)',
        muscleGroup: 'Legs',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 55, completed: true },
          { setNumber: 2, reps: 10, weightKg: 65, completed: true },
          { setNumber: 3, reps: 10, weightKg: 65, completed: true }
        ]
      },
      {
        exerciseName: '45-Degree Leg Press',
        muscleGroup: 'Legs',
        sets: [
          { setNumber: 1, reps: 12, weightKg: 100, completed: true },
          { setNumber: 2, reps: 10, weightKg: 120, completed: true }
        ]
      }
    ],
    createdAt: getDateDaysAgo(2)
  },
  {
    id: 'w-3',
    userId: 'guest-user-123',
    title: 'High-Intensity Treadmill Intervals',
    type: 'Running',
    durationMinutes: 38,
    caloriesBurned: 360,
    date: getDateDaysAgo(3),
    notes: '5.5 km run with 1-min sprint intervals at 14 km/h.',
    exercises: [],
    createdAt: getDateDaysAgo(3)
  },
  {
    id: 'w-4',
    userId: 'guest-user-123',
    title: 'Back & Core Stability',
    type: 'Strength Training',
    durationMinutes: 45,
    caloriesBurned: 380,
    date: getDateDaysAgo(5),
    notes: 'Deadlifts felt smooth and strong.',
    exercises: [
      {
        exerciseName: 'Conventional Barbell Deadlift',
        muscleGroup: 'Back',
        sets: [
          { setNumber: 1, reps: 8, weightKg: 70, completed: true },
          { setNumber: 2, reps: 6, weightKg: 85, completed: true },
          { setNumber: 3, reps: 5, weightKg: 95, completed: true }
        ]
      },
      {
        exerciseName: 'Bent-Over Barbell Row',
        muscleGroup: 'Back',
        sets: [
          { setNumber: 1, reps: 10, weightKg: 45, completed: true },
          { setNumber: 2, reps: 10, weightKg: 50, completed: true }
        ]
      }
    ],
    createdAt: getDateDaysAgo(5)
  },
  {
    id: 'w-5',
    userId: 'guest-user-123',
    title: 'HIIT Full Body Burner',
    type: 'HIIT',
    durationMinutes: 32,
    caloriesBurned: 310,
    date: getDateDaysAgo(7),
    notes: 'Kettlebell swings and burpee supersets.',
    exercises: [],
    createdAt: getDateDaysAgo(7)
  },
  {
    id: 'w-6',
    userId: 'guest-user-123',
    title: 'Stationary Bike Endurance',
    type: 'Cycling',
    durationMinutes: 45,
    caloriesBurned: 350,
    date: getDateDaysAgo(9),
    notes: 'Maintained 85 RPM average cadence.',
    exercises: [],
    createdAt: getDateDaysAgo(9)
  }
];

export const sampleMeals: MealRecord[] = [
  {
    id: 'm-1',
    userId: 'guest-user-123',
    mealType: 'Breakfast',
    name: 'Oatmeal with Whey Protein, Blueberries & Chia',
    calories: 410,
    proteinG: 34,
    carbsG: 52,
    fatG: 8,
    fiberG: 9,
    date: today,
    createdAt: today
  },
  {
    id: 'm-2',
    userId: 'guest-user-123',
    mealType: 'Lunch',
    name: 'Grilled Chicken Breast Bowl with Quinoa & Avocado',
    calories: 550,
    proteinG: 48,
    carbsG: 44,
    fatG: 18,
    fiberG: 8,
    date: today,
    createdAt: today
  },
  {
    id: 'm-3',
    userId: 'guest-user-123',
    mealType: 'Snacks',
    name: 'Greek Yogurt with Sliced Almonds & Honey',
    calories: 220,
    proteinG: 18,
    carbsG: 16,
    fatG: 8,
    fiberG: 2,
    date: today,
    createdAt: today
  },
  {
    id: 'm-4',
    userId: 'guest-user-123',
    mealType: 'Dinner',
    name: 'Pan-Seared Salmon Fillet with Roasted Sweet Potato & Asparagus',
    calories: 590,
    proteinG: 44,
    carbsG: 46,
    fatG: 22,
    fiberG: 7,
    date: today,
    createdAt: today
  },
  {
    id: 'm-5',
    userId: 'guest-user-123',
    mealType: 'Breakfast',
    name: '3 Egg Scramble with Spinach, Feta & Whole Grain Toast',
    calories: 430,
    proteinG: 30,
    carbsG: 32,
    fatG: 18,
    fiberG: 5,
    date: getDateDaysAgo(1),
    createdAt: getDateDaysAgo(1)
  },
  {
    id: 'm-6',
    userId: 'guest-user-123',
    mealType: 'Lunch',
    name: 'Lean Ground Turkey Breast Bowl with Brown Rice & Broccoli',
    calories: 520,
    proteinG: 46,
    carbsG: 48,
    fatG: 12,
    fiberG: 6,
    date: getDateDaysAgo(1),
    createdAt: getDateDaysAgo(1)
  }
];

export const sampleWaterLogs: WaterRecord[] = [
  { id: 'wt-1', userId: 'guest-user-123', amountMl: 500, date: today, timestamp: Date.now() - 3600000 * 6 },
  { id: 'wt-2', userId: 'guest-user-123', amountMl: 500, date: today, timestamp: Date.now() - 3600000 * 4 },
  { id: 'wt-3', userId: 'guest-user-123', amountMl: 750, date: today, timestamp: Date.now() - 3600000 * 2 },
  { id: 'wt-4', userId: 'guest-user-123', amountMl: 500, date: today, timestamp: Date.now() - 3600000 * 1 },
];

export const sampleWeightLogs: WeightRecord[] = [
  { id: 'wl-1', userId: 'guest-user-123', weightKg: 73.5, date: getDateDaysAgo(30), notes: 'Initial baseline weigh-in', timestamp: 1 },
  { id: 'wl-2', userId: 'guest-user-123', weightKg: 72.2, date: getDateDaysAgo(23), notes: 'Week 1 - Caloric deficit working', timestamp: 2 },
  { id: 'wl-3', userId: 'guest-user-123', weightKg: 71.0, date: getDateDaysAgo(16), notes: 'Week 2 - Added running intervals', timestamp: 3 },
  { id: 'wl-4', userId: 'guest-user-123', weightKg: 70.1, date: getDateDaysAgo(9), notes: 'Week 3 - Feeling leaner and energetic', timestamp: 4 },
  { id: 'wl-5', userId: 'guest-user-123', weightKg: 69.2, date: getDateDaysAgo(4), notes: 'Week 4 - Down 4.3 kg!', timestamp: 5 },
  { id: 'wl-6', userId: 'guest-user-123', weightKg: 68.5, date: today, notes: 'Current measurement', timestamp: 6 },
];

export const sampleMeasurementLogs: MeasurementRecord[] = [
  {
    id: 'bm-1',
    userId: 'guest-user-123',
    waistCm: 78.0,
    chestCm: 92.5,
    armsCm: 29.0,
    hipsCm: 99.0,
    thighsCm: 57.0,
    bodyFatPercentage: 24.5,
    date: getDateDaysAgo(30),
    timestamp: 1
  },
  {
    id: 'bm-2',
    userId: 'guest-user-123',
    waistCm: 76.0,
    chestCm: 93.0,
    armsCm: 29.5,
    hipsCm: 97.5,
    thighsCm: 55.5,
    bodyFatPercentage: 23.2,
    date: getDateDaysAgo(15),
    timestamp: 2
  },
  {
    id: 'bm-3',
    userId: 'guest-user-123',
    waistCm: 73.0,
    chestCm: 93.5,
    armsCm: 30.0,
    hipsCm: 96.0,
    thighsCm: 54.5,
    bodyFatPercentage: 21.8,
    date: today,
    timestamp: 3
  }
];

export const sampleGoals: GoalItem[] = [
  {
    id: 'g-1',
    userId: 'guest-user-123',
    title: 'Reach Target Weight of 64.0 kg',
    category: 'weight',
    targetValue: 64.0,
    currentValue: 68.5,
    unit: 'kg',
    deadline: getDateDaysAgo(-30),
    status: 'active',
    createdAt: getDateDaysAgo(30)
  },
  {
    id: 'g-2',
    userId: 'guest-user-123',
    title: '10,000 Daily Step Goal',
    category: 'steps',
    targetValue: 10000,
    currentValue: 10850,
    unit: 'steps',
    status: 'active',
    createdAt: getDateDaysAgo(15)
  },
  {
    id: 'g-3',
    userId: 'guest-user-123',
    title: 'Drink 2,750 ml Water Daily',
    category: 'water',
    targetValue: 2750,
    currentValue: 2250,
    unit: 'ml',
    status: 'active',
    createdAt: getDateDaysAgo(10)
  },
  {
    id: 'g-4',
    userId: 'guest-user-123',
    title: 'Bench Press 60 kg for 6 Reps',
    category: 'strength',
    targetValue: 60,
    currentValue: 60,
    unit: 'kg',
    status: 'completed',
    createdAt: getDateDaysAgo(25)
  },
  {
    id: 'g-5',
    userId: 'guest-user-123',
    title: 'Complete 20 Workouts this Month',
    category: 'workouts',
    targetValue: 20,
    currentValue: 14,
    unit: 'workouts',
    status: 'active',
    createdAt: getDateDaysAgo(20)
  }
];

export const sampleDailyActivities: DailyActivityRecord[] = [
  { id: 'da-1', userId: 'guest-user-123', steps: 10850, distanceKm: 8.1, activeMinutes: 65, caloriesBurned: 510, date: today, updatedAt: today },
  { id: 'da-2', userId: 'guest-user-123', steps: 11400, distanceKm: 8.6, activeMinutes: 70, caloriesBurned: 540, date: getDateDaysAgo(1), updatedAt: getDateDaysAgo(1) },
  { id: 'da-3', userId: 'guest-user-123', steps: 9600, distanceKm: 7.2, activeMinutes: 58, caloriesBurned: 460, date: getDateDaysAgo(2), updatedAt: getDateDaysAgo(2) },
  { id: 'da-4', userId: 'guest-user-123', steps: 12800, distanceKm: 9.6, activeMinutes: 78, caloriesBurned: 610, date: getDateDaysAgo(3), updatedAt: getDateDaysAgo(3) },
  { id: 'da-5', userId: 'guest-user-123', steps: 8400, distanceKm: 6.3, activeMinutes: 48, caloriesBurned: 390, date: getDateDaysAgo(4), updatedAt: getDateDaysAgo(4) },
  { id: 'da-6', userId: 'guest-user-123', steps: 13200, distanceKm: 9.9, activeMinutes: 82, caloriesBurned: 640, date: getDateDaysAgo(5), updatedAt: getDateDaysAgo(5) },
  { id: 'da-7', userId: 'guest-user-123', steps: 10100, distanceKm: 7.5, activeMinutes: 60, caloriesBurned: 480, date: getDateDaysAgo(6), updatedAt: getDateDaysAgo(6) },
  { id: 'da-8', userId: 'guest-user-123', steps: 9200, distanceKm: 6.9, activeMinutes: 52, caloriesBurned: 430, date: getDateDaysAgo(7), updatedAt: getDateDaysAgo(7) },
  { id: 'da-9', userId: 'guest-user-123', steps: 11800, distanceKm: 8.8, activeMinutes: 72, caloriesBurned: 560, date: getDateDaysAgo(8), updatedAt: getDateDaysAgo(8) },
  { id: 'da-10', userId: 'guest-user-123', steps: 10500, distanceKm: 7.8, activeMinutes: 64, caloriesBurned: 500, date: getDateDaysAgo(9), updatedAt: getDateDaysAgo(9) },
];

export const initialBadges: BadgeItem[] = [
  { id: 'b-1', title: 'First Workout', description: 'Completed your first recorded workout session.', iconName: 'Dumbbell', unlocked: true, unlockedAt: getDateDaysAgo(28) },
  { id: 'b-2', title: '6-Day Streak', description: 'Log fitness activity 6 consecutive days in a row.', iconName: 'Flame', unlocked: true, unlockedAt: today },
  { id: 'b-3', title: '10,000 Step Hero', description: 'Hit over 10,000 steps in a single day.', iconName: 'Footprints', unlocked: true, unlockedAt: getDateDaysAgo(1) },
  { id: 'b-4', title: 'Hydration Master', description: 'Met your daily water target 5 times.', iconName: 'Droplet', unlocked: true, unlockedAt: getDateDaysAgo(2) },
  { id: 'b-5', title: 'Iron Lifter', description: 'Bench press 60 kg with proper form.', iconName: 'Trophy', unlocked: true, unlockedAt: getDateDaysAgo(5) },
  { id: 'b-6', title: 'Goal Crusher', description: 'Successfully completed a custom target goal.', iconName: 'Target', unlocked: true, unlockedAt: getDateDaysAgo(8) },
  { id: 'b-7', title: 'Consistency King', description: 'Reach a 14-day consecutive active streak.', iconName: 'Calendar', unlocked: false },
  { id: 'b-8', title: 'Centurion 100k', description: 'Accumulate 100,000 total steps tracked.', iconName: 'Zap', unlocked: false }
];
