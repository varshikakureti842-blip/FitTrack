import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { MealType } from '../types/fitness';
import { Utensils, Plus, Trash2, PieChart as PieIcon, CheckCircle2 } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { calculateMacroTargets, getTodayDateString } from '../utils/fitnessCalculations';

export const NutritionTrackerPage: React.FC = () => {
  const { profile, meals, logMeal } = useFitness();
  const today = getTodayDateString();

  const [mealType, setMealType] = useState<MealType>('Breakfast');
  const [mealName, setMealName] = useState('');
  const [calories, setCalories] = useState<number>(350);
  const [protein, setProtein] = useState<number>(25);
  const [carbs, setCarbs] = useState<number>(35);
  const [fat, setFat] = useState<number>(10);
  const [fiber, setFiber] = useState<number>(5);

  const [formOpen, setFormOpen] = useState(false);

  const todayMeals = meals.filter(m => m.date === today);

  const totalCalories = todayMeals.reduce((acc, m) => acc + m.calories, 0);
  const totalProtein = todayMeals.reduce((acc, m) => acc + m.proteinG, 0);
  const totalCarbs = todayMeals.reduce((acc, m) => acc + m.carbsG, 0);
  const totalFat = todayMeals.reduce((acc, m) => acc + m.fatG, 0);
  const totalFiber = todayMeals.reduce((acc, m) => acc + m.fiberG, 0);

  const targetCal = profile.dailyCalorieGoal || 2050;
  const remainingCal = targetCal - totalCalories;

  const macroTargets = calculateMacroTargets(targetCal, profile.fitnessGoal);

  // Pie chart macro distribution data
  const pieData = [
    { name: 'Protein (g)', value: totalProtein, color: '#10b981' },
    { name: 'Carbs (g)', value: totalCarbs, color: '#38bdf8' },
    { name: 'Fat (g)', value: totalFat, color: '#f59e0b' },
  ];

  const handleAddMealSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mealName.trim()) return;

    await logMeal({
      mealType,
      name: mealName,
      calories: Number(calories),
      proteinG: Number(protein),
      carbsG: Number(carbs),
      fatG: Number(fat),
      fiberG: Number(fiber),
      date: today
    });

    setMealName('');
    setFormOpen(false);
  };

  const handleQuickPreset = (name: string, cal: number, p: number, c: number, f: number, fib: number) => {
    setMealName(name);
    setCalories(cal);
    setProtein(p);
    setCarbs(c);
    setFat(f);
    setFiber(fib);
    setFormOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Utensils className="w-7 h-7 text-orange-400" />
            <span>Nutrition & Meal Tracker</span>
          </h1>
          <p className="text-xs text-slate-400">Record daily meals, track macronutrients (Protein, Carbs, Fat, Fiber), and stay on budget.</p>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-sm shadow-lg shadow-orange-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Log Meal</span>
        </button>
      </div>

      {/* Main Calories & Macro Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calorie Progress Ring */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Calorie Budget</h3>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-orange-500/10 text-orange-400">
              {profile.fitnessGoal.replace('_', ' ')}
            </span>
          </div>

          <div className="text-center py-2 space-y-1">
            <span className="text-4xl font-black text-white">{totalCalories}</span>
            <span className="text-xs font-semibold text-slate-400 block">/ {targetCal} kcal</span>
            <p className="text-xs font-bold text-emerald-400 pt-2">
              {remainingCal >= 0 ? `${remainingCal} kcal remaining` : `${Math.abs(remainingCal)} kcal over target`}
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
            <div className="flex justify-between font-semibold">
              <span className="text-slate-400">Calorie Goal</span>
              <span className="text-white">{targetCal} kcal</span>
            </div>
            <div className="flex justify-between font-semibold">
              <span className="text-slate-400">Consumed Today</span>
              <span className="text-orange-400">{totalCalories} kcal</span>
            </div>
          </div>
        </div>

        {/* Macro Progress Bars */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Macronutrients Target</h3>

          <div className="space-y-3.5">
            {/* Protein */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-emerald-400">Protein</span>
                <span className="text-slate-300">{totalProtein}g / {macroTargets.proteinG}g</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full"
                  style={{ width: `${Math.min(100, (totalProtein / macroTargets.proteinG) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Carbs */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-sky-400">Carbohydrates</span>
                <span className="text-slate-300">{totalCarbs}g / {macroTargets.carbsG}g</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-sky-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (totalCarbs / macroTargets.carbsG) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Fats */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-amber-400">Fats</span>
                <span className="text-slate-300">{totalFat}g / {macroTargets.fatG}g</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-amber-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (totalFat / macroTargets.fatG) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Fiber */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1">
                <span className="text-purple-400">Dietary Fiber</span>
                <span className="text-slate-300">{totalFiber}g / {macroTargets.fiberG}g</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-400 h-full rounded-full"
                  style={{ width: `${Math.min(100, (totalFiber / macroTargets.fiberG) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Macro Pie Chart Distribution */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-2">Macro Distribution</h3>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={60} paddingAngle={4}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center space-x-1 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Protein</span>
            </span>
            <span className="flex items-center space-x-1 text-sky-400">
              <span className="w-2 h-2 rounded-full bg-sky-400"></span>
              <span>Carbs</span>
            </span>
            <span className="flex items-center space-x-1 text-amber-400">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Fat</span>
            </span>
          </div>
        </div>
      </div>

      {/* Log Meal Form Modal */}
      {formOpen && (
        <div className="bg-slate-900 border-2 border-orange-500/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Record New Meal</h3>

          {/* Quick presets */}
          <div>
            <p className="text-xs font-semibold text-slate-400 mb-2">Quick Picks:</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleQuickPreset('Oatmeal with Berries & Whey', 400, 30, 50, 8, 8)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-orange-300 font-semibold border border-slate-700"
              >
                🥣 Oatmeal & Protein (400 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Grilled Chicken Salad & Quinoa', 520, 45, 40, 14, 6)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-orange-300 font-semibold border border-slate-700"
              >
                🥗 Chicken Salad (520 kcal)
              </button>
              <button
                type="button"
                onClick={() => handleQuickPreset('Salmon, Sweet Potato & Vegetables', 600, 42, 48, 22, 7)}
                className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-orange-300 font-semibold border border-slate-700"
              >
                🐟 Salmon & Potato (600 kcal)
              </button>
            </div>
          </div>

          <form onSubmit={handleAddMealSubmit} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Meal Category</label>
                <select
                  value={mealType}
                  onChange={e => setMealType(e.target.value as MealType)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-sm"
                >
                  <option value="Breakfast">Breakfast</option>
                  <option value="Lunch">Lunch</option>
                  <option value="Dinner">Dinner</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Meal Name / Description</label>
                <input
                  type="text"
                  placeholder="e.g. Scrambled Eggs & Toast"
                  value={mealName}
                  onChange={e => setMealName(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Calories (kcal)</label>
                <input
                  type="number"
                  value={calories}
                  onChange={e => setCalories(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-emerald-400 mb-1">Protein (g)</label>
                <input
                  type="number"
                  value={protein}
                  onChange={e => setProtein(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-sky-400 mb-1">Carbs (g)</label>
                <input
                  type="number"
                  value={carbs}
                  onChange={e => setCarbs(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-amber-400 mb-1">Fat (g)</label>
                <input
                  type="number"
                  value={fat}
                  onChange={e => setFat(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-purple-400 mb-1">Fiber (g)</label>
                <input
                  type="number"
                  value={fiber}
                  onChange={e => setFiber(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setFormOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-bold text-xs transition"
              >
                Save Meal Log
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Meals Logged Today List */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Today's Meal Entries</h3>

        {todayMeals.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs">
            No meals recorded today. Click "Log Meal" above to record your nutrition.
          </div>
        ) : (
          <div className="space-y-3">
            {todayMeals.map(m => (
              <div key={m.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20">
                    {m.mealType}
                  </span>
                  <h4 className="text-sm font-bold text-white mt-1">{m.name}</h4>
                </div>

                <div className="flex items-center space-x-4 text-xs font-semibold">
                  <span className="text-orange-400">{m.calories} kcal</span>
                  <span className="text-emerald-400">{m.proteinG}g P</span>
                  <span className="text-sky-400">{m.carbsG}g C</span>
                  <span className="text-amber-400">{m.fatG}g F</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
