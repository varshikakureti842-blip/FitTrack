export type Gender = 'male' | 'female' | 'other';

export type PrimaryGoal = 'weight_loss' | 'muscle_gain' | 'maintain_weight' | 'improve_fitness';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';

export interface UserProfile {
  uid: string;
  name: string;
  age: number;
  gender: Gender;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  startingWeightKg?: number;
  fitnessGoal: PrimaryGoal;
  activityLevel: ActivityLevel;
  dailyWaterGoalMl: number;
  dailyCalorieGoal: number;
  dailyStepGoal: number;
  streak: number;
  longestStreak: number;
  createdAt: string;
  updatedAt: string;
}

export type WorkoutType = 
  | 'Strength Training'
  | 'Cardio'
  | 'Running'
  | 'Cycling'
  | 'Walking'
  | 'HIIT'
  | 'Yoga'
  | 'Other';

export interface ExerciseSet {
  setNumber: number;
  reps: number;
  weightKg: number;
  completed: boolean;
}

export interface WorkoutExercise {
  exerciseId?: string;
  exerciseName: string;
  muscleGroup: string;
  sets: ExerciseSet[];
  notes?: string;
}

export interface WorkoutRecord {
  id: string;
  userId: string;
  title: string;
  type: WorkoutType;
  durationMinutes: number;
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  exercises: WorkoutExercise[];
  createdAt: string;
}

export interface TemplateExercise {
  exerciseName: string;
  muscleGroup: string;
  targetSets: number;
  targetReps: number;
  defaultWeightKg: number;
}

export interface WorkoutTemplate {
  id: string;
  userId: string;
  title: string;
  type: WorkoutType;
  estimatedDurationMinutes: number;
  estimatedCaloriesBurned: number;
  notes?: string;
  exercises: TemplateExercise[];
  createdAt: string;
}

export type MuscleGroup = 
  | 'Chest'
  | 'Back'
  | 'Shoulders'
  | 'Arms'
  | 'Legs'
  | 'Core'
  | 'Full Body'
  | 'Cardio';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export interface ExerciseItem {
  id: string;
  name: string;
  category: MuscleGroup;
  targetMuscle: string;
  equipment: string;
  difficulty: DifficultyLevel;
  instructions: string[];
}

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks';

export interface MealRecord {
  id: string;
  userId: string;
  mealType: MealType;
  name: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  date: string; // YYYY-MM-DD
  createdAt: string;
}

export interface WaterRecord {
  id: string;
  userId: string;
  amountMl: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export interface WeightRecord {
  id: string;
  userId: string;
  weightKg: number;
  date: string; // YYYY-MM-DD
  notes?: string;
  timestamp: number;
}

export interface MeasurementRecord {
  id: string;
  userId: string;
  waistCm?: number;
  chestCm?: number;
  armsCm?: number;
  hipsCm?: number;
  thighsCm?: number;
  bodyFatPercentage?: number;
  date: string; // YYYY-MM-DD
  timestamp: number;
}

export type GoalCategory = 'weight' | 'running' | 'workouts' | 'steps' | 'water' | 'strength';

export type GoalStatus = 'active' | 'completed' | 'archived';

export interface GoalItem {
  id: string;
  userId: string;
  title: string;
  category: GoalCategory;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline?: string;
  status: GoalStatus;
  createdAt: string;
}

export interface DailyActivityRecord {
  id: string;
  userId: string;
  steps: number;
  distanceKm: number;
  activeMinutes: number;
  caloriesBurned: number;
  date: string; // YYYY-MM-DD
  updatedAt: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface WorkoutPlanRequest {
  fitnessGoal: PrimaryGoal;
  experienceLevel: DifficultyLevel;
  daysPerWeek: number;
  durationMinutes: number;
  availableEquipment: string;
  targetMuscleGroups: MuscleGroup[];
}

export interface GeneratedDayPlan {
  dayName: string;
  focus: string;
  exercises: {
    name: string;
    targetMuscle: string;
    sets: number;
    reps: string;
    restSeconds: number;
  }[];
}

export interface GeneratedPlan {
  planTitle: string;
  summary: string;
  weeklySchedule: GeneratedDayPlan[];
  generalTips: string[];
}
