import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy
} from 'firebase/firestore';
import { db, auth } from './config';
import {
  UserProfile,
  WorkoutRecord,
  WorkoutTemplate,
  MealRecord,
  WaterRecord,
  WeightRecord,
  MeasurementRecord,
  GoalItem,
  DailyActivityRecord
} from '../types/fitness';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.warn('Firestore Error Handled: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// User Profile
export async function saveUserProfile(profile: UserProfile): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== profile.uid) {
    return;
  }
  const path = `users/${profile.uid}`;
  try {
    await setDoc(doc(db, 'users', profile.uid), profile, { merge: true });
  } catch (err) {
    try {
      handleFirestoreError(err, OperationType.WRITE, path);
    } catch (e) {
      console.warn('Handled saveUserProfile error:', e);
    }
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    return null;
  }
  const path = `users/${uid}`;
  try {
    const snap = await getDoc(doc(db, 'users', uid));
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (err) {
    console.warn('Handled getUserProfile error:', err);
    return null;
  }
}

// Workouts
export async function addWorkout(userId: string, workout: Omit<WorkoutRecord, 'id'>): Promise<string | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/workouts`;
  try {
    const colRef = collection(db, 'users', userId, 'workouts');
    const docRef = await addDoc(colRef, workout);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (err) {
    console.warn('Handled addWorkout error:', err);
    return null;
  }
}

export async function getWorkouts(userId: string): Promise<WorkoutRecord[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/workouts`;
  try {
    const colRef = collection(db, 'users', userId, 'workouts');
    const q = query(colRef, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutRecord));
  } catch (err) {
    console.warn('Handled getWorkouts error:', err);
    return [];
  }
}

// Meals
export async function addMeal(userId: string, meal: Omit<MealRecord, 'id'>): Promise<string | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/meals`;
  try {
    const colRef = collection(db, 'users', userId, 'meals');
    const docRef = await addDoc(colRef, meal);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (err) {
    console.warn('Handled addMeal error:', err);
    return null;
  }
}

export async function getMeals(userId: string): Promise<MealRecord[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/meals`;
  try {
    const colRef = collection(db, 'users', userId, 'meals');
    const q = query(colRef, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MealRecord));
  } catch (err) {
    console.warn('Handled getMeals error:', err);
    return [];
  }
}

// Water Logs
export async function addWaterLog(userId: string, log: Omit<WaterRecord, 'id'>): Promise<string | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/water`;
  try {
    const colRef = collection(db, 'users', userId, 'water');
    const docRef = await addDoc(colRef, log);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (err) {
    console.warn('Handled addWaterLog error:', err);
    return null;
  }
}

export async function getWaterLogs(userId: string): Promise<WaterRecord[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/water`;
  try {
    const colRef = collection(db, 'users', userId, 'water');
    const q = query(colRef, orderBy('timestamp', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as WaterRecord));
  } catch (err) {
    console.warn('Handled getWaterLogs error:', err);
    return [];
  }
}

// Weight Logs
export async function addWeightLog(userId: string, log: Omit<WeightRecord, 'id'>): Promise<string | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/weight`;
  try {
    const colRef = collection(db, 'users', userId, 'weight');
    const docRef = await addDoc(colRef, log);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (err) {
    console.warn('Handled addWeightLog error:', err);
    return null;
  }
}

export async function getWeightLogs(userId: string): Promise<WeightRecord[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/weight`;
  try {
    const colRef = collection(db, 'users', userId, 'weight');
    const q = query(colRef, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as WeightRecord));
  } catch (err) {
    console.warn('Handled getWeightLogs error:', err);
    return [];
  }
}

// Body Measurements
export async function addMeasurementLog(userId: string, log: Omit<MeasurementRecord, 'id'>): Promise<string | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/measurements`;
  try {
    const colRef = collection(db, 'users', userId, 'measurements');
    const docRef = await addDoc(colRef, log);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (err) {
    console.warn('Handled addMeasurementLog error:', err);
    return null;
  }
}

export async function getMeasurementLogs(userId: string): Promise<MeasurementRecord[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/measurements`;
  try {
    const colRef = collection(db, 'users', userId, 'measurements');
    const q = query(colRef, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as MeasurementRecord));
  } catch (err) {
    console.warn('Handled getMeasurementLogs error:', err);
    return [];
  }
}

// Goals
export async function addGoal(userId: string, goal: Omit<GoalItem, 'id'>): Promise<string | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/goals`;
  try {
    const colRef = collection(db, 'users', userId, 'goals');
    const docRef = await addDoc(colRef, goal);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (err) {
    console.warn('Handled addGoal error:', err);
    return null;
  }
}

export async function updateGoal(userId: string, goalId: string, updates: Partial<GoalItem>): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/goals/${goalId}`;
  try {
    await updateDoc(doc(db, 'users', userId, 'goals', goalId), updates);
  } catch (err) {
    console.warn('Handled updateGoal error:', err);
  }
}

export async function getGoals(userId: string): Promise<GoalItem[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/goals`;
  try {
    const colRef = collection(db, 'users', userId, 'goals');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as GoalItem));
  } catch (err) {
    console.warn('Handled getGoals error:', err);
    return [];
  }
}

// Daily Activities
export async function saveDailyActivity(userId: string, activity: DailyActivityRecord): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/activity/${activity.date}`;
  try {
    await setDoc(doc(db, 'users', userId, 'activity', activity.date), activity, { merge: true });
  } catch (err) {
    console.warn('Handled saveDailyActivity error:', err);
  }
}

export async function getDailyActivities(userId: string): Promise<DailyActivityRecord[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/activity`;
  try {
    const colRef = collection(db, 'users', userId, 'activity');
    const q = query(colRef, orderBy('date', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as DailyActivityRecord));
  } catch (err) {
    console.warn('Handled getDailyActivities error:', err);
    return [];
  }
}

// Workout Templates
export async function addWorkoutTemplate(userId: string, template: Omit<WorkoutTemplate, 'id'>): Promise<string | null> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return null;
  const path = `users/${userId}/workoutTemplates`;
  try {
    const colRef = collection(db, 'users', userId, 'workoutTemplates');
    const docRef = await addDoc(colRef, template);
    await updateDoc(docRef, { id: docRef.id });
    return docRef.id;
  } catch (err) {
    console.warn('Handled addWorkoutTemplate error:', err);
    return null;
  }
}

export async function getWorkoutTemplates(userId: string): Promise<WorkoutTemplate[]> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return [];
  const path = `users/${userId}/workoutTemplates`;
  try {
    const colRef = collection(db, 'users', userId, 'workoutTemplates');
    const snap = await getDocs(colRef);
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as WorkoutTemplate));
  } catch (err) {
    console.warn('Handled getWorkoutTemplates error:', err);
    return [];
  }
}

export async function deleteWorkoutTemplate(userId: string, templateId: string): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== userId) return;
  const path = `users/${userId}/workoutTemplates/${templateId}`;
  try {
    await deleteDoc(doc(db, 'users', userId, 'workoutTemplates', templateId));
  } catch (err) {
    console.warn('Handled deleteWorkoutTemplate error:', err);
  }
}
