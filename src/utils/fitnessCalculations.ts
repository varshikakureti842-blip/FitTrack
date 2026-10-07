import { UserProfile, PrimaryGoal, ActivityLevel, WorkoutRecord, ExerciseSet } from '../types/fitness';

export function calculateBMI(weightKg: number, heightCm: number): number {
  if (!heightCm || heightCm <= 0 || !weightKg || weightKg <= 0) return 0;
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

export function getBMICategory(bmi: number): { label: string; color: string } {
  if (bmi <= 0) return { label: 'Unknown', color: 'text-slate-400' };
  if (bmi < 18.5) return { label: 'Underweight', color: 'text-blue-400' };
  if (bmi < 25) return { label: 'Normal Weight', color: 'text-emerald-400' };
  if (bmi < 30) return { label: 'Overweight', color: 'text-amber-400' };
  return { label: 'Obese', color: 'text-rose-400' };
}

export function calculateBMR(weightKg: number, heightCm: number, age: number, gender: string): number {
  if (!weightKg || !heightCm || !age) return 2000;
  let bmr = 10 * weightKg + 6.25 * heightCm - 5 * age;
  if (gender === 'male') {
    bmr += 5;
  } else {
    bmr -= 161;
  }
  return Math.round(bmr);
}

const activityMultipliers: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  lightly_active: 1.375,
  moderately_active: 1.55,
  very_active: 1.725,
  extra_active: 1.9,
};

export function calculateTDEE(
  weightKg: number,
  heightCm: number,
  age: number,
  gender: string,
  activityLevel: ActivityLevel
): number {
  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const multiplier = activityMultipliers[activityLevel] || 1.375;
  return Math.round(bmr * multiplier);
}

export function calculateCalorieGoal(
  tdee: number,
  goal: PrimaryGoal
): number {
  switch (goal) {
    case 'weight_loss':
      return Math.max(1200, Math.round(tdee - 500));
    case 'muscle_gain':
      return Math.round(tdee + 300);
    case 'maintain_weight':
    case 'improve_fitness':
    default:
      return tdee;
  }
}

export function calculateMacroTargets(calories: number, goal: PrimaryGoal) {
  let proteinPct = 0.3;
  let carbsPct = 0.45;
  let fatPct = 0.25;

  if (goal === 'muscle_gain') {
    proteinPct = 0.35;
    carbsPct = 0.45;
    fatPct = 0.20;
  } else if (goal === 'weight_loss') {
    proteinPct = 0.35;
    carbsPct = 0.35;
    fatPct = 0.30;
  }

  const proteinG = Math.round((calories * proteinPct) / 4);
  const carbsG = Math.round((calories * carbsPct) / 4);
  const fatG = Math.round((calories * fatPct) / 9);
  const fiberG = Math.round((calories / 1000) * 14); // Standard RDA guideline

  return { proteinG, carbsG, fatG, fiberG };
}

export function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length !== 3) return dateStr;
  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Progressive overload tracker: search previous workouts for maximum weight lifted for an exercise
export function findPreviousBestForExercise(
  workouts: WorkoutRecord[],
  exerciseName: string
): { maxWeight: number; maxReps: number; date: string } | null {
  let maxWeight = 0;
  let maxReps = 0;
  let bestDate = '';

  for (const w of workouts) {
    for (const ex of w.exercises) {
      if (ex.exerciseName.toLowerCase() === exerciseName.toLowerCase()) {
        for (const s of ex.sets) {
          if (s.completed && s.weightKg >= maxWeight) {
            if (s.weightKg > maxWeight || s.reps > maxReps) {
              maxWeight = s.weightKg;
              maxReps = s.reps;
              bestDate = w.date;
            }
          }
        }
      }
    }
  }

  if (maxWeight === 0 && maxReps === 0) return null;
  return { maxWeight, maxReps, date: bestDate };
}

export function generateFitnessInsights(
  workouts: WorkoutRecord[],
  weightLogs: { date: string; weightKg: number }[],
  profile: UserProfile
): string[] {
  const insights: string[] = [];
  const now = new Date();
  
  // Weekly workout count
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(now.getDate() - 7);
  const recentWorkouts = workouts.filter(w => new Date(w.date) >= sevenDaysAgo);
  
  if (recentWorkouts.length > 0) {
    insights.push(`You completed ${recentWorkouts.length} workout${recentWorkouts.length > 1 ? 's' : ''} in the past 7 days.`);
  } else {
    insights.push(`Ready for a workout? Try completing 3 sessions this week to build momentum.`);
  }

  // Consistency message
  if (profile.streak > 0) {
    insights.push(`Active streak: ${profile.streak} day${profile.streak > 1 ? 's' : ''}! Consistency is key to reaching your ${profile.fitnessGoal.replace('_', ' ')} goal.`);
  }

  // Weight change insight
  if (weightLogs.length >= 2) {
    const sorted = [...weightLogs].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    const first = sorted[0].weightKg;
    const latest = sorted[sorted.length - 1].weightKg;
    const diff = Math.round((latest - first) * 10) / 10;
    if (diff < 0) {
      insights.push(`Your weight decreased by ${Math.abs(diff)} kg since starting tracking.`);
    } else if (diff > 0) {
      insights.push(`Your weight gained by ${diff} kg since starting tracking.`);
    } else {
      insights.push(`Your weight has remained stable at ${latest} kg.`);
    }
  }

  // Calorie requirement guidance
  const tdee = calculateTDEE(profile.weightKg, profile.heightCm, profile.age, profile.gender, profile.activityLevel);
  const targetCal = calculateCalorieGoal(tdee, profile.fitnessGoal);
  insights.push(`Estimated daily caloric intake for your goal: ~${targetCal} kcal/day.`);

  return insights;
}
