import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { ProgressRing } from '../components/ProgressRing';
import {
  Flame,
  Utensils,
  Footprints,
  Droplet,
  Timer,
  Scale,
  Plus,
  Dumbbell,
  Sparkles,
  TrendingUp,
  Target,
  ArrowUpRight,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { calculateBMI, getBMICategory, getTodayDateString } from '../utils/fitnessCalculations';
import { NavTab } from '../components/Navigation';

interface DashboardPageProps {
  onNavigate: (tab: NavTab) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    profile,
    workouts,
    meals,
    waterLogs,
    dailyActivities,
    logWater,
    logActivity
  } = useFitness();

  const today = getTodayDateString();

  // Quick modals state
  const [waterModalOpen, setWaterModalOpen] = useState(false);
  const [waterAmountInput, setWaterAmountInput] = useState(250);

  const [stepsModalOpen, setStepsModalOpen] = useState(false);
  const [stepsInput, setStepsInput] = useState(1000);

  // Today's calculated stats
  const todayMeals = meals.filter(m => m.date === today);
  const caloriesConsumed = todayMeals.reduce((acc, m) => acc + m.calories, 0);

  const todayWorkouts = workouts.filter(w => w.date === today);
  const workoutCaloriesBurned = todayWorkouts.reduce((acc, w) => acc + w.caloriesBurned, 0);
  const workoutDurationMinutes = todayWorkouts.reduce((acc, w) => acc + w.durationMinutes, 0);

  const todayActivity = dailyActivities.find(a => a.date === today) || {
    steps: 0,
    distanceKm: 0,
    activeMinutes: 0,
    caloriesBurned: 0
  };

  const totalCaloriesBurned = workoutCaloriesBurned + todayActivity.caloriesBurned;

  const todayWaterMl = waterLogs
    .filter(w => w.date === today)
    .reduce((acc, w) => acc + w.amountMl, 0);

  const bmi = calculateBMI(profile.weightKg, profile.heightCm);
  const bmiCat = getBMICategory(bmi);

  // Goal completion %
  const caloriePct = Math.min(100, Math.round((caloriesConsumed / (profile.dailyCalorieGoal || 2000)) * 100));
  const waterPct = Math.min(100, Math.round((todayWaterMl / (profile.dailyWaterGoalMl || 2500)) * 100));
  const stepPct = Math.min(100, Math.round((todayActivity.steps / (profile.dailyStepGoal || 10000)) * 100));

  const overallGoalPct = Math.round((caloriePct + waterPct + stepPct) / 3);

  const handleQuickAddWater = async () => {
    await logWater(waterAmountInput);
    setWaterModalOpen(false);
  };

  const handleQuickAddSteps = async () => {
    const newSteps = todayActivity.steps + Number(stepsInput);
    const newDistance = Math.round((newSteps * 0.00075) * 10) / 10; // approx 0.75m per step
    const newActiveMin = Math.round(newSteps / 120);
    const newBurned = Math.round(newSteps * 0.04);
    await logActivity(newSteps, newDistance, newActiveMin, newBurned);
    setStepsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-emerald-900/40 via-teal-900/30 to-slate-900 border border-emerald-500/20 p-6 md:p-8">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Today's Overview
              </span>
              <span className="text-xs text-slate-400 font-medium">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Welcome back, <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{profile.name}</span>!
            </h1>
            <p className="text-sm text-slate-300 max-w-xl">
              You are on a <span className="text-orange-400 font-bold">{profile.streak}-day streak</span>! You've achieved <span className="text-emerald-400 font-bold">{overallGoalPct}%</span> of your daily target today. Keep pushing!
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('workouts')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition"
            >
              <Dumbbell className="w-4 h-4" />
              <span>Start Workout</span>
            </button>

            <button
              onClick={() => onNavigate('ai_assistant')}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-semibold text-sm border border-emerald-500/30 transition"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask AI</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Goal Completion & Stats Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ring Progress Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="flex items-center justify-between w-full">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Daily Completion</h3>
            <span className="text-xs font-semibold px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">Target</span>
          </div>

          <ProgressRing radius={85} stroke={14} progress={overallGoalPct} colorClass="text-emerald-400">
            <span className="text-3xl font-black text-white">{overallGoalPct}%</span>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed</span>
          </ProgressRing>

          <div className="grid grid-cols-3 w-full gap-2 pt-2 border-t border-slate-800/80 text-center">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Calories</p>
              <p className="text-sm font-bold text-slate-200">{caloriePct}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Water</p>
              <p className="text-sm font-bold text-slate-200">{waterPct}%</p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Steps</p>
              <p className="text-sm font-bold text-slate-200">{stepPct}%</p>
            </div>
          </div>
        </div>

        {/* 4 Core Quick Metric Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Calories Consumed */}
          <div
            onClick={() => onNavigate('nutrition')}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
                <Utensils className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">{caloriesConsumed}</span>
              <span className="text-xs font-medium text-slate-400"> / {profile.dailyCalorieGoal} kcal</span>
              <p className="text-xs font-semibold text-slate-400 mt-1">Calories Consumed</p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: `${caloriePct}%` }}></div>
            </div>
          </div>

          {/* Calories Burned */}
          <div
            onClick={() => onNavigate('workouts')}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
                <Flame className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">{totalCaloriesBurned}</span>
              <span className="text-xs font-medium text-slate-400"> kcal</span>
              <p className="text-xs font-semibold text-slate-400 mt-1">Calories Burned</p>
            </div>
            <div className="text-[11px] text-emerald-400 mt-3 font-semibold">
              {workoutDurationMinutes} min active workout
            </div>
          </div>

          {/* Steps */}
          <div
            onClick={() => onNavigate('activity')}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                <Footprints className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">{todayActivity.steps.toLocaleString()}</span>
              <span className="text-xs font-medium text-slate-400"> / {profile.dailyStepGoal.toLocaleString()}</span>
              <p className="text-xs font-semibold text-slate-400 mt-1">Steps Walked</p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${stepPct}%` }}></div>
            </div>
          </div>

          {/* Water Intake */}
          <div
            onClick={() => onNavigate('water')}
            className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col justify-between cursor-pointer transition group"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
                <Droplet className="w-5 h-5" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-slate-300 transition" />
            </div>
            <div className="mt-3">
              <span className="text-2xl font-black text-white">{(todayWaterMl / 1000).toFixed(1)}</span>
              <span className="text-xs font-medium text-slate-400"> / {(profile.dailyWaterGoalMl / 1000).toFixed(1)} L</span>
              <p className="text-xs font-semibold text-slate-400 mt-1">Water Hydration</p>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
              <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${waterPct}%` }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Metrics: Weight & BMI & Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weight & BMI Card */}
        <div
          onClick={() => onNavigate('weight')}
          className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 cursor-pointer transition flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Weight & BMI</h4>
                <p className="text-xs text-slate-400">Current Body Stats</p>
              </div>
            </div>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-800 ${bmiCat.color}`}>
              {bmiCat.label}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Weight</p>
              <p className="text-xl font-black text-white mt-0.5">{profile.weightKg} <span className="text-xs font-medium text-slate-400">kg</span></p>
            </div>
            <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-800">
              <p className="text-xs text-slate-400 font-medium">Body Mass Index</p>
              <p className="text-xl font-black text-white mt-0.5">{bmi}</p>
            </div>
          </div>
        </div>

        {/* Quick Log Actions Card */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
          <h4 className="text-sm font-bold text-white mb-4 flex items-center justify-between">
            <span>Quick Logger</span>
            <Plus className="w-4 h-4 text-emerald-400" />
          </h4>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setWaterModalOpen(true)}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition text-left text-xs font-bold"
            >
              <Droplet className="w-4 h-4" />
              <span>+ Water</span>
            </button>

            <button
              onClick={() => setStepsModalOpen(true)}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/20 transition text-left text-xs font-bold"
            >
              <Footprints className="w-4 h-4" />
              <span>+ Steps</span>
            </button>

            <button
              onClick={() => onNavigate('nutrition')}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-orange-500/10 hover:bg-orange-500/20 text-orange-300 border border-orange-500/20 transition text-left text-xs font-bold"
            >
              <Utensils className="w-4 h-4" />
              <span>+ Meal</span>
            </button>

            <button
              onClick={() => onNavigate('weight')}
              className="flex items-center space-x-2.5 p-3 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/20 transition text-left text-xs font-bold"
            >
              <Scale className="w-4 h-4" />
              <span>+ Weight</span>
            </button>
          </div>
        </div>

        {/* AI Insight Snippet Card */}
        <div
          onClick={() => onNavigate('ai_assistant')}
          className="bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/30 border border-emerald-500/30 hover:border-emerald-500/50 rounded-2xl p-6 cursor-pointer transition flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center space-x-1.5 text-xs font-bold uppercase tracking-wider text-emerald-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Fitness Assistant</span>
              </span>
              <ArrowUpRight className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              "Based on your 5-day streak and recent Upper Body session, today is a great day for lower body recovery or light cardio!"
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-800 text-xs font-semibold text-emerald-400 flex items-center space-x-1">
            <span>Ask for a custom workout plan</span>
            <span>&rarr;</span>
          </div>
        </div>
      </div>

      {/* Recent Workouts Log Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white">Recent Workouts</h3>
            <p className="text-xs text-slate-400">Your logged fitness sessions</p>
          </div>
          <button
            onClick={() => onNavigate('workouts')}
            className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
          >
            View All &rarr;
          </button>
        </div>

        {workouts.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-sm">
            No workouts recorded yet. Click "Start Workout" above to record your first session!
          </div>
        ) : (
          <div className="space-y-3">
            {workouts.slice(0, 4).map(w => (
              <div
                key={w.id}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/40 border border-slate-800 hover:border-slate-700 transition"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold">
                    <Dumbbell className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-bold text-white">{w.title}</h5>
                    <p className="text-xs text-slate-400">
                      {w.type} • {w.durationMinutes} mins • {w.caloriesBurned} kcal
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-xs font-medium text-slate-400 block">{w.date}</span>
                  <span className="text-[11px] font-semibold text-emerald-400">
                    {w.exercises.length} exercise{w.exercises.length !== 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Water Modal */}
      {waterModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Droplet className="w-5 h-5 text-cyan-400" />
              <span>Log Water Intake</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Amount in milliliters (ml)</label>
              <input
                type="number"
                min="50"
                step="50"
                value={waterAmountInput}
                onChange={e => setWaterAmountInput(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-lg focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div className="flex space-x-2">
              {[250, 500, 750].map(amt => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setWaterAmountInput(amt)}
                  className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-cyan-300 border border-slate-700"
                >
                  +{amt} ml
                </button>
              ))}
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setWaterModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickAddWater}
                className="flex-1 py-2 rounded-xl bg-cyan-500 text-slate-950 text-sm font-bold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Steps Modal */}
      {stepsModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-white flex items-center space-x-2">
              <Footprints className="w-5 h-5 text-emerald-400" />
              <span>Add Daily Steps</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Additional Steps</label>
              <input
                type="number"
                min="100"
                step="500"
                value={stepsInput}
                onChange={e => setStepsInput(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-lg focus:outline-none focus:border-emerald-400"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setStepsModalOpen(false)}
                className="flex-1 py-2 rounded-xl bg-slate-800 text-slate-300 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickAddSteps}
                className="flex-1 py-2 rounded-xl bg-emerald-500 text-slate-950 text-sm font-bold"
              >
                Add Steps
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
