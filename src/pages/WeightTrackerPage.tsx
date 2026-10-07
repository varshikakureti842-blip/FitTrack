import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Scale, Plus, TrendingDown, TrendingUp, Target, History } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { getTodayDateString } from '../utils/fitnessCalculations';

export const WeightTrackerPage: React.FC = () => {
  const { profile, weightLogs, logWeight } = useFitness();
  const today = getTodayDateString();

  const [weightInput, setWeightInput] = useState<number>(profile.weightKg || 70);
  const [noteInput, setNoteInput] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const starting = profile.startingWeightKg || (weightLogs.length ? weightLogs[weightLogs.length - 1].weightKg : 70);
  const current = profile.weightKg || (weightLogs.length ? weightLogs[0].weightKg : 70);
  const target = profile.targetWeightKg || 65;

  const totalChange = Math.round((current - starting) * 10) / 10;
  const goalDifference = Math.abs(starting - target);
  const currentProgress = Math.abs(starting - current);
  const progressPct = goalDifference > 0 ? Math.min(100, Math.round((currentProgress / goalDifference) * 100)) : 100;

  // Chart data sorted chronologically
  const chartData = [...weightLogs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map(w => ({
      date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: w.weightKg
    }));

  const handleSaveWeight = async (e: React.FormEvent) => {
    e.preventDefault();
    await logWeight(Number(weightInput), noteInput);
    setNoteInput('');
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Scale className="w-7 h-7 text-indigo-400" />
            <span>Weight Progress Tracker</span>
          </h1>
          <p className="text-xs text-slate-400">Record weigh-ins, track overall weight trends, and view distance to target weight.</p>
        </div>

        <button
          onClick={() => setModalOpen(!modalOpen)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Record Weigh-In</span>
        </button>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Current Weight</p>
          <p className="text-2xl font-black text-white mt-1">{current} <span className="text-xs font-semibold text-slate-400">kg</span></p>
          <span className="text-[10px] text-indigo-400 font-semibold block mt-1">Latest Entry</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Starting Weight</p>
          <p className="text-2xl font-black text-slate-300 mt-1">{starting} <span className="text-xs font-semibold text-slate-400">kg</span></p>
          <span className="text-[10px] text-slate-500 font-semibold block mt-1">Baseline</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Target Weight</p>
          <p className="text-2xl font-black text-emerald-400 mt-1">{target} <span className="text-xs font-semibold text-slate-400">kg</span></p>
          <span className="text-[10px] text-emerald-400 font-semibold block mt-1">Goal</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <p className="text-xs font-bold text-slate-400 uppercase">Weight Change</p>
          <p className={`text-2xl font-black mt-1 ${totalChange <= 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
            {totalChange > 0 ? `+${totalChange}` : totalChange} <span className="text-xs font-semibold text-slate-400">kg</span>
          </p>
          <span className="text-[10px] text-slate-400 font-semibold block mt-1">{progressPct}% of goal achieved</span>
        </div>
      </div>

      {/* Weight Progression Line Chart */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white">Weight Progression Line</h3>
            <p className="text-xs text-slate-400">Visual trend of body weight recorded over time</p>
          </div>
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400">
            Target: {target} kg
          </span>
        </div>

        <div className="h-64 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
              <YAxis domain={['dataMin - 2', 'dataMax + 2']} stroke="#64748b" fontSize={12} tickLine={false} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }}
                itemStyle={{ color: '#818cf8', fontWeight: 'bold' }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke="#818cf8"
                strokeWidth={3}
                dot={{ fill: '#818cf8', r: 5 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Record Weight Modal */}
      {modalOpen && (
        <div className="bg-slate-900 border-2 border-indigo-500/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Record Body Weigh-In</h3>
          <form onSubmit={handleSaveWeight} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Weight in Kilograms (kg)</label>
              <input
                type="number"
                step="0.1"
                min="30"
                max="300"
                value={weightInput}
                onChange={e => setWeightInput(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-base focus:outline-none focus:border-indigo-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Weigh-In Notes (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Morning weigh-in before breakfast"
                value={noteInput}
                onChange={e => setNoteInput(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs transition"
              >
                Save Weigh-In
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weight Log History */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <History className="w-5 h-5 text-indigo-400" />
          <span>Weigh-In History ({weightLogs.length})</span>
        </h3>

        {weightLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No weight entries recorded yet. Click "Record Weigh-In" above.
          </div>
        ) : (
          <div className="space-y-2">
            {weightLogs.map(w => (
              <div key={w.id} className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-white text-sm">{w.weightKg} kg</span>
                  {w.notes && <p className="text-[11px] text-slate-400 mt-0.5">"{w.notes}"</p>}
                </div>
                <span className="text-slate-400 font-semibold">{w.date}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
