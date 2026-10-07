import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Droplet, Plus, History, Check, Settings } from 'lucide-react';
import { getTodayDateString } from '../utils/fitnessCalculations';

export const WaterTrackerPage: React.FC = () => {
  const { profile, waterLogs, logWater, updateProfile } = useFitness();
  const today = getTodayDateString();

  const [customAmount, setCustomAmount] = useState(250);
  const [goalInput, setGoalInput] = useState(profile.dailyWaterGoalMl || 2500);
  const [editingGoal, setEditingGoal] = useState(false);

  const todayWaterLogs = waterLogs.filter(w => w.date === today);
  const totalWaterToday = todayWaterLogs.reduce((acc, w) => acc + w.amountMl, 0);

  const waterGoal = profile.dailyWaterGoalMl || 2500;
  const remainingMl = Math.max(0, waterGoal - totalWaterToday);
  const pct = Math.min(100, Math.round((totalWaterToday / waterGoal) * 100));

  const handleQuickAdd = async (amount: number) => {
    await logWater(amount);
  };

  const handleSaveGoal = async () => {
    await updateProfile({ dailyWaterGoalMl: Number(goalInput) });
    setEditingGoal(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Droplet className="w-7 h-7 text-cyan-400" />
            <span>Water Hydration Tracker</span>
          </h1>
          <p className="text-xs text-slate-400">Log water intake, stay hydrated throughout your workouts, and monitor history.</p>
        </div>

        <button
          onClick={() => setEditingGoal(!editingGoal)}
          className="flex items-center space-x-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition"
        >
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>Edit Goal</span>
        </button>
      </div>

      {/* Goal Edit Box */}
      {editingGoal && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-end gap-3">
          <div className="flex-1 w-full">
            <label className="block text-xs font-semibold text-slate-400 mb-1">Daily Hydration Goal (ml)</label>
            <input
              type="number"
              step="100"
              value={goalInput}
              onChange={e => setGoalInput(Number(e.target.value))}
              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm"
            />
          </div>
          <button
            onClick={handleSaveGoal}
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl transition"
          >
            Save Target
          </button>
        </div>
      )}

      {/* Main Visual Filling Water Glass & Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Animated Water Vessel */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col items-center justify-center space-y-4 text-center">
          <div className="relative w-40 h-56 bg-slate-950 border-4 border-slate-700 rounded-b-3xl rounded-t-lg overflow-hidden flex flex-col justify-end shadow-2xl">
            {/* Water liquid animation */}
            <div
              className="w-full bg-gradient-to-t from-cyan-600 via-cyan-400 to-sky-300 transition-all duration-700 ease-out flex items-center justify-center relative"
              style={{ height: `${pct}%` }}
            >
              <div className="absolute top-1 left-0 right-0 h-2 bg-cyan-200/40 rounded-full animate-pulse"></div>
            </div>

            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none">
              <span className="text-3xl font-black text-white drop-shadow-md">{pct}%</span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-200 drop-shadow">Hydrated</span>
            </div>
          </div>

          <div className="text-center space-y-1">
            <p className="text-xl font-black text-white">
              {(totalWaterToday / 1000).toFixed(2)} / {(waterGoal / 1000).toFixed(2)} Liters
            </p>
            <p className="text-xs text-slate-400">
              {remainingMl > 0 ? `${(remainingMl / 1000).toFixed(2)} L remaining for today` : '🎉 Daily hydration target reached!'}
            </p>
          </div>
        </div>

        {/* Quick Add Buttons & Custom Logger */}
        <div className="lg:col-span-2 bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-base font-bold text-white mb-2">Quick Add Glass</h3>
            <p className="text-xs text-slate-400 mb-4">Tap a container button to instantly add to your daily water total.</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: '+250 ml', amount: 250, desc: 'Small Glass' },
                { label: '+500 ml', amount: 500, desc: 'Water Bottle' },
                { label: '+750 ml', amount: 750, desc: 'Large Flask' },
                { label: '+1000 ml', amount: 1000, desc: '1 Liter' }
              ].map(item => (
                <button
                  key={item.amount}
                  onClick={() => handleQuickAdd(item.amount)}
                  className="p-4 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/20 transition flex flex-col items-center justify-center text-center group"
                >
                  <Droplet className="w-6 h-6 mb-1 text-cyan-400 group-hover:scale-110 transition" />
                  <span className="text-sm font-black">{item.label}</span>
                  <span className="text-[10px] text-slate-400">{item.desc}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Custom Water Amount</h4>
            <div className="flex items-center space-x-3">
              <input
                type="number"
                min="50"
                step="50"
                value={customAmount}
                onChange={e => setCustomAmount(Number(e.target.value))}
                className="bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm w-36"
              />
              <button
                onClick={() => handleQuickAdd(customAmount)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition flex items-center space-x-1"
              >
                <Plus className="w-4 h-4" />
                <span>Log Intake</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Water Intake Today's History */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6">
        <h3 className="text-base font-bold text-white mb-4 flex items-center space-x-2">
          <History className="w-5 h-5 text-cyan-400" />
          <span>Today's Intake History ({todayWaterLogs.length})</span>
        </h3>

        {todayWaterLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No water logged today yet. Use the quick add buttons above!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {todayWaterLogs.map(w => (
              <div key={w.id} className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                    <Droplet className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-bold text-white">{w.amountMl} ml</span>
                    <span className="block text-[10px] text-slate-400">
                      {new Date(w.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
                <Check className="w-4 h-4 text-emerald-400" />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
