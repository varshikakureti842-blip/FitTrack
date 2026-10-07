import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { GoalCategory, GoalItem } from '../types/fitness';
import { Target, Plus, CheckCircle, Clock, Award } from 'lucide-react';
import { getTodayDateString } from '../utils/fitnessCalculations';

export const GoalsPage: React.FC = () => {
  const { goals, addCustomGoal, updateGoalProgress } = useFitness();
  const today = getTodayDateString();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<GoalCategory>('workouts');
  const [targetValue, setTargetValue] = useState<number>(10);
  const [currentValue, setCurrentValue] = useState<number>(0);
  const [unit, setUnit] = useState('workouts');
  const [deadline, setDeadline] = useState('');

  const [formOpen, setFormOpen] = useState(false);

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addCustomGoal({
      title,
      category,
      targetValue: Number(targetValue),
      currentValue: Number(currentValue),
      unit,
      deadline: deadline || undefined
    });

    setTitle('');
    setFormOpen(false);
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Target className="w-7 h-7 text-emerald-400" />
            <span>Fitness Goals</span>
          </h1>
          <p className="text-xs text-slate-400">Set targets for weight, running distance, workout frequency, steps, water, or strength lifts.</p>
        </div>

        <button
          onClick={() => setFormOpen(!formOpen)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Goal</span>
        </button>
      </div>

      {/* Goal Creation Form */}
      {formOpen && (
        <div className="bg-slate-900 border-2 border-emerald-500/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Create Target Goal</h3>

          <form onSubmit={handleCreateGoal} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Goal Title</label>
                <input
                  type="text"
                  placeholder="e.g. Bench Press 80 kg"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={e => {
                    const cat = e.target.value as GoalCategory;
                    setCategory(cat);
                    if (cat === 'weight') setUnit('kg');
                    if (cat === 'running') setUnit('km');
                    if (cat === 'workouts') setUnit('workouts');
                    if (cat === 'steps') setUnit('steps');
                    if (cat === 'water') setUnit('ml');
                    if (cat === 'strength') setUnit('kg');
                  }}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-sm"
                >
                  <option value="workouts">Workouts Frequency</option>
                  <option value="weight">Body Weight</option>
                  <option value="steps">Daily Steps</option>
                  <option value="water">Daily Water Intake</option>
                  <option value="strength">Strength Target</option>
                  <option value="running">Running Distance</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Target Value</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetValue}
                  onChange={e => setTargetValue(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Current Progress</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentValue}
                  onChange={e => setCurrentValue(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Measurement Unit</label>
                <input
                  type="text"
                  value={unit}
                  onChange={e => setUnit(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Deadline (Optional)</label>
              <input
                type="date"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
              />
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
                className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
              >
                Create Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Goals Grid */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <Clock className="w-5 h-5 text-emerald-400" />
          <span>Active Goals ({activeGoals.length})</span>
        </h3>

        {activeGoals.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs bg-slate-900/40 rounded-xl border border-slate-800">
            No active goals. Click "New Goal" above to define your targets!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeGoals.map(g => {
              const pct = Math.min(100, Math.round((g.currentValue / g.targetValue) * 100));

              return (
                <div key={g.id} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {g.category}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1">{g.title}</h4>
                    </div>

                    <span className="text-xs font-black text-emerald-400">{pct}%</span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                      <span>Progress</span>
                      <span className="text-white">
                        {g.currentValue} / {g.targetValue} {g.unit}
                      </span>
                    </div>

                    <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                      <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
                    <span className="text-slate-500 font-medium">
                      {g.deadline ? `Deadline: ${g.deadline}` : 'Continuous Goal'}
                    </span>

                    <button
                      onClick={() => {
                        const newVal = prompt(`Update current progress value (${g.unit}):`, String(g.currentValue));
                        if (newVal !== null) {
                          updateGoalProgress(g.id, Number(newVal));
                        }
                      }}
                      className="text-xs font-bold text-emerald-400 hover:text-emerald-300"
                    >
                      Update Progress &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completedGoals.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-white flex items-center space-x-2">
            <Award className="w-5 h-5 text-amber-400" />
            <span>Completed Achievements ({completedGoals.length})</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {completedGoals.map(g => (
              <div key={g.id} className="p-4 bg-slate-950 border border-emerald-500/30 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-emerald-400" />
                  <div>
                    <h5 className="text-sm font-bold text-white">{g.title}</h5>
                    <p className="text-xs text-slate-400">
                      Reached target of {g.targetValue} {g.unit}!
                    </p>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-emerald-500/10 text-emerald-400">Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
