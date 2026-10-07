import React, { createContext, useContext, useState, useEffect } from 'react';
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
import {
  sampleUserProfile,
  sampleWorkouts,
  sampleWorkoutTemplates,
  sampleMeals,
  sampleWaterLogs,
  sampleWeightLogs,
  sampleMeasurementLogs,
  sampleGoals,
  sampleDailyActivities,
  initialBadges
} from '../data/sampleData';
import { getTodayDateString } from '../utils/fitnessCalculations';
import { auth, db } from '../firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import {
  saveUserProfile,
  getUserProfile,
  addWorkout,
  getWorkouts,
  addMeal,
  getMeals,
  addWaterLog,
  getWaterLogs,
  addWeightLog,
  getWeightLogs,
  addMeasurementLog,
  getMeasurementLogs,
  addGoal,
  getGoals,
  saveDailyActivity,
  getDailyActivities,
  updateGoal,
  addWorkoutTemplate,
  getWorkoutTemplates,
  deleteWorkoutTemplate
} from '../firebase/service';

interface FitnessContextType {
  profile: UserProfile;
  workouts: WorkoutRecord[];
  workoutTemplates: WorkoutTemplate[];
  meals: MealRecord[];
  waterLogs: WaterRecord[];
  weightLogs: WeightRecord[];
  measurementLogs: MeasurementRecord[];
  goals: GoalItem[];
  dailyActivities: DailyActivityRecord[];
  badges: BadgeItem[];
  theme: 'dark' | 'light';
  currentUser: FirebaseUser | null;
  authLoading: boolean;
  toggleTheme: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  logWorkout: (workout: Omit<WorkoutRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  createWorkoutTemplate: (template: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  removeWorkoutTemplate: (templateId: string) => Promise<void>;
  logMeal: (meal: Omit<MealRecord, 'id' | 'userId' | 'createdAt'>) => Promise<void>;
  logWater: (amountMl: number) => Promise<void>;
  logWeight: (weightKg: number, notes?: string) => Promise<void>;
  logMeasurement: (measurement: Omit<MeasurementRecord, 'id' | 'userId' | 'timestamp'>) => Promise<void>;
  addCustomGoal: (goal: Omit<GoalItem, 'id' | 'userId' | 'createdAt' | 'status'>) => Promise<void>;
  updateGoalProgress: (goalId: string, currentValue: number) => Promise<void>;
  logActivity: (steps: number, distanceKm: number, activeMinutes: number, caloriesBurned: number) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const FitnessContext = createContext<FitnessContextType | undefined>(undefined);

export const FitnessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const today = getTodayDateString();

  // Load initial state from LocalStorage if available
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('fit_theme') as 'dark' | 'light') || 'dark';
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('fit_profile');
    return saved ? JSON.parse(saved) : sampleUserProfile;
  });

  const [workouts, setWorkouts] = useState<WorkoutRecord[]>(() => {
    const saved = localStorage.getItem('fit_workouts');
    return saved ? JSON.parse(saved) : sampleWorkouts;
  });

  const [workoutTemplates, setWorkoutTemplates] = useState<WorkoutTemplate[]>(() => {
    const saved = localStorage.getItem('fit_workout_templates');
    return saved ? JSON.parse(saved) : sampleWorkoutTemplates;
  });

  const [meals, setMeals] = useState<MealRecord[]>(() => {
    const saved = localStorage.getItem('fit_meals');
    return saved ? JSON.parse(saved) : sampleMeals;
  });

  const [waterLogs, setWaterLogs] = useState<WaterRecord[]>(() => {
    const saved = localStorage.getItem('fit_water');
    return saved ? JSON.parse(saved) : sampleWaterLogs;
  });

  const [weightLogs, setWeightLogs] = useState<WeightRecord[]>(() => {
    const saved = localStorage.getItem('fit_weight');
    return saved ? JSON.parse(saved) : sampleWeightLogs;
  });

  const [measurementLogs, setMeasurementLogs] = useState<MeasurementRecord[]>(() => {
    const saved = localStorage.getItem('fit_measurements');
    return saved ? JSON.parse(saved) : sampleMeasurementLogs;
  });

  const [goals, setGoals] = useState<GoalItem[]>(() => {
    const saved = localStorage.getItem('fit_goals');
    return saved ? JSON.parse(saved) : sampleGoals;
  });

  const [dailyActivities, setDailyActivities] = useState<DailyActivityRecord[]>(() => {
    const saved = localStorage.getItem('fit_activities');
    return saved ? JSON.parse(saved) : sampleDailyActivities;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem('fit_badges');
    return saved ? JSON.parse(saved) : initialBadges;
  });

  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [authLoading, setAuthLoading] = useState<boolean>(true);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('fit_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('fit_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('fit_workout_templates', JSON.stringify(workoutTemplates));
  }, [workoutTemplates]);

  useEffect(() => {
    localStorage.setItem('fit_meals', JSON.stringify(meals));
  }, [meals]);

  useEffect(() => {
    localStorage.setItem('fit_water', JSON.stringify(waterLogs));
  }, [waterLogs]);

  useEffect(() => {
    localStorage.setItem('fit_weight', JSON.stringify(weightLogs));
  }, [weightLogs]);

  useEffect(() => {
    localStorage.setItem('fit_measurements', JSON.stringify(measurementLogs));
  }, [measurementLogs]);

  useEffect(() => {
    localStorage.setItem('fit_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('fit_activities', JSON.stringify(dailyActivities));
  }, [dailyActivities]);

  useEffect(() => {
    localStorage.setItem('fit_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('fit_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Handle Firebase Auth changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setAuthLoading(false);
      if (user) {
        // Fetch or create user data from Firebase
        try {
          const remoteProfile = await getUserProfile(user.uid);
          if (remoteProfile) {
            setProfile(remoteProfile);
          } else {
            const newProf = {
              ...profile,
              uid: user.uid,
              name: user.displayName || user.email?.split('@')[0] || 'Fitness User',
            };
            setProfile(newProf);
            await saveUserProfile(newProf);
          }

          // Fetch user subcollections
          const [remoteW, remoteM, remoteWater, remoteWeight, remoteMeasures, remoteG, remoteAct] = await Promise.all([
            getWorkouts(user.uid),
            getMeals(user.uid),
            getWaterLogs(user.uid),
            getWeightLogs(user.uid),
            getMeasurementLogs(user.uid),
            getGoals(user.uid),
            getDailyActivities(user.uid)
          ]);

          if (remoteW.length) setWorkouts(remoteW);
          if (remoteM.length) setMeals(remoteM);
          if (remoteWater.length) setWaterLogs(remoteWater);
          if (remoteWeight.length) setWeightLogs(remoteWeight);
          if (remoteMeasures.length) setMeasurementLogs(remoteMeasures);
          if (remoteG.length) setGoals(remoteG);
          if (remoteAct.length) setDailyActivities(remoteAct);
        } catch (e) {
          console.warn('Error loading remote user data:', e);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    const userId = currentUser ? currentUser.uid : profile.uid;
    const updated: UserProfile = {
      ...profile,
      ...updates,
      uid: userId,
      updatedAt: getTodayDateString()
    };
    setProfile(updated);
    localStorage.setItem('fit_profile', JSON.stringify(updated));

    if (currentUser) {
      try {
        await saveUserProfile(updated);
      } catch (err) {
        console.warn('Error saving profile to Firestore:', err);
      }
    }
  };

  const logWorkout = async (workoutData: Omit<WorkoutRecord, 'id' | 'userId' | 'createdAt'>) => {
    const newId = 'w-' + Date.now();
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newWorkout: WorkoutRecord = {
      ...workoutData,
      id: newId,
      userId,
      createdAt: today
    };

    setWorkouts(prev => [newWorkout, ...prev]);

    if (currentUser) {
      await addWorkout(currentUser.uid, newWorkout);
    }

    // Check badges & goals
    checkBadgesAndGoalsAfterWorkout(newWorkout);
  };

  const createWorkoutTemplate = async (templateData: Omit<WorkoutTemplate, 'id' | 'userId' | 'createdAt'>) => {
    const newId = 'tpl-' + Date.now();
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newTpl: WorkoutTemplate = {
      ...templateData,
      id: newId,
      userId,
      createdAt: today
    };

    setWorkoutTemplates(prev => [newTpl, ...prev]);

    if (currentUser) {
      await addWorkoutTemplate(currentUser.uid, newTpl);
    }
  };

  const removeWorkoutTemplate = async (templateId: string) => {
    setWorkoutTemplates(prev => prev.filter(t => t.id !== templateId));

    if (currentUser) {
      await deleteWorkoutTemplate(currentUser.uid, templateId);
    }
  };

  const logMeal = async (mealData: Omit<MealRecord, 'id' | 'userId' | 'createdAt'>) => {
    const newId = 'm-' + Date.now();
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newMeal: MealRecord = {
      ...mealData,
      id: newId,
      userId,
      createdAt: today
    };

    setMeals(prev => [newMeal, ...prev]);

    if (currentUser) {
      await addMeal(currentUser.uid, newMeal);
    }
  };

  const logWater = async (amountMl: number) => {
    const newId = 'wt-' + Date.now();
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newWater: WaterRecord = {
      id: newId,
      userId,
      amountMl,
      date: today,
      timestamp: Date.now()
    };

    setWaterLogs(prev => [newWater, ...prev]);

    if (currentUser) {
      await addWaterLog(currentUser.uid, newWater);
    }

    // Update water goal if present
    const totalTodayWater = waterLogs
      .filter(w => w.date === today)
      .reduce((acc, curr) => acc + curr.amountMl, 0) + amountMl;

    setGoals(prev => prev.map(g => {
      if (g.category === 'water' && g.status === 'active') {
        const updatedVal = totalTodayWater;
        const isDone = updatedVal >= g.targetValue;
        return {
          ...g,
          currentValue: updatedVal,
          status: isDone ? 'completed' : 'active'
        };
      }
      return g;
    }));
  };

  const logWeight = async (weightKg: number, notes?: string) => {
    const newId = 'wl-' + Date.now();
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newWeight: WeightRecord = {
      id: newId,
      userId,
      weightKg,
      date: today,
      notes,
      timestamp: Date.now()
    };

    setWeightLogs(prev => [newWeight, ...prev]);
    updateProfile({ weightKg });

    if (currentUser) {
      await addWeightLog(currentUser.uid, newWeight);
    }

    // Check weight goals
    setGoals(prev => prev.map(g => {
      if (g.category === 'weight' && g.status === 'active') {
        const isDone = g.targetValue <= weightKg && profile.fitnessGoal === 'muscle_gain'
          ? true
          : g.targetValue >= weightKg && profile.fitnessGoal === 'weight_loss';
        return {
          ...g,
          currentValue: weightKg,
          status: isDone ? 'completed' : 'active'
        };
      }
      return g;
    }));
  };

  const logMeasurement = async (measurementData: Omit<MeasurementRecord, 'id' | 'userId' | 'timestamp'>) => {
    const newId = 'bm-' + Date.now();
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newRecord: MeasurementRecord = {
      ...measurementData,
      id: newId,
      userId,
      timestamp: Date.now()
    };

    setMeasurementLogs(prev => [newRecord, ...prev]);

    if (currentUser) {
      await addMeasurementLog(currentUser.uid, newRecord);
    }
  };

  const addCustomGoal = async (goalData: Omit<GoalItem, 'id' | 'userId' | 'createdAt' | 'status'>) => {
    const newId = 'g-' + Date.now();
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newGoal: GoalItem = {
      ...goalData,
      id: newId,
      userId,
      status: goalData.currentValue >= goalData.targetValue ? 'completed' : 'active',
      createdAt: today
    };

    setGoals(prev => [newGoal, ...prev]);

    if (currentUser) {
      await addGoal(currentUser.uid, newGoal);
    }
  };

  const updateGoalProgress = async (goalId: string, currentValue: number) => {
    setGoals(prev => prev.map(g => {
      if (g.id === goalId) {
        const isDone = currentValue >= g.targetValue;
        const updated = {
          ...g,
          currentValue,
          status: (isDone ? 'completed' : 'active') as 'completed' | 'active'
        };
        if (currentUser) {
          updateGoal(currentUser.uid, goalId, { currentValue, status: updated.status });
        }
        return updated;
      }
      return g;
    }));
  };

  const logActivity = async (steps: number, distanceKm: number, activeMinutes: number, caloriesBurned: number) => {
    const userId = currentUser ? currentUser.uid : profile.uid;
    const newAct: DailyActivityRecord = {
      id: 'da-' + today,
      userId,
      steps,
      distanceKm,
      activeMinutes,
      caloriesBurned,
      date: today,
      updatedAt: today
    };

    setDailyActivities(prev => {
      const idx = prev.findIndex(a => a.date === today);
      if (idx >= 0) {
        const updatedList = [...prev];
        updatedList[idx] = newAct;
        return updatedList;
      }
      return [newAct, ...prev];
    });

    if (currentUser) {
      await saveDailyActivity(currentUser.uid, newAct);
    }

    // Check 10,000 steps badge
    if (steps >= 10000) {
      unlockBadge('b-3');
    }
  };

  const unlockBadge = (badgeId: string) => {
    setBadges(prev => prev.map(b => {
      if (b.id === badgeId && !b.unlocked) {
        return { ...b, unlocked: true, unlockedAt: today };
      }
      return b;
    }));
  };

  const checkBadgesAndGoalsAfterWorkout = (newWorkout: WorkoutRecord) => {
    unlockBadge('b-1'); // First Workout badge
    if (workouts.length + 1 >= 5) {
      unlockBadge('b-2'); // 5-Day streak / workouts
    }

    // Check strength goals
    setGoals(prev => prev.map(g => {
      if (g.category === 'workouts' && g.status === 'active') {
        const count = workouts.length + 1;
        return {
          ...g,
          currentValue: count,
          status: count >= g.targetValue ? 'completed' : 'active'
        };
      }
      return g;
    }));
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (e) {
      console.error('Google Sign-In Error:', e);
      alert('Could not complete Google Sign-In. Check popups or network access.');
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch (e) {
      console.error('Sign-Out Error:', e);
    }
  };

  return (
    <FitnessContext.Provider
      value={{
        profile,
        workouts,
        workoutTemplates,
        meals,
        waterLogs,
        weightLogs,
        measurementLogs,
        goals,
        dailyActivities,
        badges,
        theme,
        currentUser,
        authLoading,
        toggleTheme,
        updateProfile,
        logWorkout,
        createWorkoutTemplate,
        removeWorkoutTemplate,
        logMeal,
        logWater,
        logWeight,
        logMeasurement,
        addCustomGoal,
        updateGoalProgress,
        logActivity,
        signInWithGoogle,
        signOutUser
      }}
    >
      {children}
    </FitnessContext.Provider>
  );
};

export const useFitness = () => {
  const context = useContext(FitnessContext);
  if (!context) {
    throw new Error('useFitness must be used within a FitnessProvider');
  }
  return context;
};
