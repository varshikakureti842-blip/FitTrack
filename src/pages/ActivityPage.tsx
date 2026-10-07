import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Footprints, Flame, Timer, Compass, RefreshCw, Plus, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { getTodayDateString } from '../utils/fitnessCalculations';

export const ActivityPage: React.FC = () => {
  const { profile, dailyActivities, logActivity } = useFitness();
  const today = getTodayDateString();

  const todayAct = dailyActivities.find(a => a.date === today) || {
    steps: 0,
    distanceKm: 0,
    activeMinutes: 0,
    caloriesBurned: 0
  };

  const [stepInput, setStepInput] = useState<number>(todayAct.steps || 5000);
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Weekly activity chart data
  const chartData = dailyActivities.slice(0, 7).reverse().map(act => ({
    day: new Date(act.date).toLocaleDateString('en-US', { weekday: 'short' }),
    steps: act.steps,
    calories: act.caloriesBurned
  }));

  const handleUpdateActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    const steps = Number(stepInput);
    const distanceKm = Math.round((steps * 0.00075) * 10) / 10;
    const activeMinutes = Math.round(steps / 120);
    const caloriesBurned = Math.round(steps * 0.04);

    await logActivity(steps, distanceKm, activeMinutes, caloriesBurned);
    setSyncMessage('Activity updated successfully!');
    setTimeout(() => setSyncMessage(''), 3000);
  };

  const handleSimulateDeviceSync = () => {
    setSyncing(true);
    setSyncMessage('Connecting to Google Fit / Apple Health wearable sensor...');
    setTimeout(() => {
      const simulatedNewSteps = todayAct.steps + 2450;
      const distanceKm = Math.round((simulatedNewSteps * 0.00075) * 10) / 10;
      const activeMinutes = Math.round(simulatedNewSteps / 120);
      const caloriesBurned = Math.round(simulatedNewSteps * 0.04);
      logActivity(simulatedNewSteps, distanceKm, activeMinutes, caloriesBurned);

      setSyncing(false);
      setSyncMessage('Synced +2,450 steps from Wearable Device!');
      setTimeout(() => setSyncMessage(''), 4000);
    }, 1200);
  };

  const stepPct = Math.min(100, Math.round((todayAct.steps / (profile.dailyStepGoal || 10000)) * 100));

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Footprints className="w-7 h-7 text-emerald-400" />
            <span>Steps & Daily Activity</span>
          </h1>
          <p className="text-xs text-slate-400">Track movement, distance walked, active minutes, and weekly step trends.</p>
        </div>

        <button
          onClick={handleSimulateDeviceSync}
          disabled={syncing}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-emerald-500/30 text-xs font-bold transition"
        >
          <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
          <span>{syncing ? 'Syncing Wearable...' : 'Sync Wearable API'}</span>
        </button>
      </div>

      {syncMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{syncMessage}</span>
        </div>
      )}

      {/* 4 Activity Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 mb-3">
            <Footprints className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white">{todayAct.steps.toLocaleString()}</span>
          <span className="text-xs text-slate-400 font-medium block mt-0.5">/ {profile.dailyStepGoal.toLocaleString()} steps</span>
          <p className="text-xs font-bold text-slate-400 mt-2">Daily Steps</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-3">
            <Compass className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white">{todayAct.distanceKm}</span>
          <span className="text-xs text-slate-400 font-medium block mt-0.5"> kilometers</span>
          <p className="text-xs font-bold text-slate-400 mt-2">Distance</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-3">
            <Timer className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white">{todayAct.activeMinutes}</span>
          <span className="text-xs text-slate-400 font-medium block mt-0.5"> minutes</span>
          <p className="text-xs font-bold text-slate-400 mt-2">Active Time</p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="w-9 h-9 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mb-3">
            <Flame className="w-5 h-5" />
          </div>
          <span className="text-2xl font-black text-white">{todayAct.caloriesBurned}</span>
          <span className="text-xs text-slate-400 font-medium block mt-0.5"> kcal burned</span>
          <p className="text-xs font-bold text-slate-400 mt-2">Activity Energy</p>
        </div>
      </div>

      {/* Weekly Activity Bar Chart */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Weekly Step Trends</h3>
            <p className="text-xs text-slate-400">Steps walked over the past 7 days</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400">
            Goal: {profile.dailyStepGoal} / day
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
              />
              <Bar dataKey="steps" radius={[8, 8, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.steps >= profile.dailyStepGoal ? '#10b981' : '#334155'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Manual Input Logger */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4">Manual Activity Input</h3>
        <form onSubmit={handleUpdateActivity} className="flex flex-col sm:flex-row items-end gap-4">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Today's Total Steps</label>
            <input
              type="number"
              min="0"
              step="100"
              value={stepInput}
              onChange={e => setStepInput(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
            />
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition shadow-lg shadow-emerald-500/20"
          >
            Update Steps
          </button>
        </form>
      </div>
    </div>
  );
};
