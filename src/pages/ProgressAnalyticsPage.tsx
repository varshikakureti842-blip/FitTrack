import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { TrendingUp, Award, Calendar, Lightbulb, Dumbbell, Flame, Footprints, Droplet, Clock } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { generateFitnessInsights } from '../utils/fitnessCalculations';

export const ProgressAnalyticsPage: React.FC = () => {
  const { profile, workouts, weightLogs, dailyActivities, waterLogs, goals } = useFitness();

  const [viewMode, setViewMode] = useState<'weekly' | 'monthly'>('weekly');

  const insights = generateFitnessInsights(workouts, weightLogs, profile);

  // Filter range
  const daysLimit = viewMode === 'weekly' ? 7 : 30;

  // Activity & Step chart data
  const activityData = dailyActivities.slice(0, daysLimit).reverse().map(act => ({
    date: new Date(act.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    steps: act.steps,
    calories: act.caloriesBurned
  }));

  // Workout duration chart data
  const workoutData = workouts.slice(0, daysLimit).reverse().map(w => ({
    date: new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    duration: w.durationMinutes,
    calories: w.caloriesBurned
  }));

  // Goal completion stats
  const completedGoalsCount = goals.filter(g => g.status === 'completed').length;
  const activeGoalsCount = goals.filter(g => g.status === 'active').length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <TrendingUp className="w-7 h-7 text-emerald-400" />
            <span>Progress & Analytics</span>
          </h1>
          <p className="text-xs text-slate-400">Deep dive into your fitness trends, workout consistency, and non-medical health insights.</p>
        </div>

        {/* Weekly / Monthly Toggle */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setViewMode('weekly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'weekly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            7-Day Weekly
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition ${
              viewMode === 'monthly' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            30-Day Monthly
          </button>
        </div>
      </div>

      {/* Automated AI Insights Banner */}
      <div className="bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-6 space-y-3">
        <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-emerald-400" />
          <span>Calculated Progress Insights</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-200">
          {insights.map((ins, idx) => (
            <div key={idx} className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-start space-x-2">
              <span className="text-emerald-400 font-bold">•</span>
              <p className="leading-relaxed">{ins}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center space-x-2 text-emerald-400 mb-2">
            <Dumbbell className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Workouts</span>
          </div>
          <p className="text-2xl font-black text-white">{workouts.length}</p>
          <span className="text-[10px] text-slate-400">Total Recorded</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center space-x-2 text-rose-400 mb-2">
            <Flame className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Energy Burned</span>
          </div>
          <p className="text-2xl font-black text-white">
            {workouts.reduce((a, b) => a + b.caloriesBurned, 0).toLocaleString()} <span className="text-xs font-normal text-slate-400">kcal</span>
          </p>
          <span className="text-[10px] text-slate-400">Workout Calories</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center space-x-2 text-sky-400 mb-2">
            <Clock className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Active Duration</span>
          </div>
          <p className="text-2xl font-black text-white">
            {workouts.reduce((a, b) => a + b.durationMinutes, 0)} <span className="text-xs font-normal text-slate-400">mins</span>
          </p>
          <span className="text-[10px] text-slate-400">Time Training</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <div className="flex items-center space-x-2 text-amber-400 mb-2">
            <Award className="w-5 h-5" />
            <span className="text-xs font-bold uppercase">Goals Achieved</span>
          </div>
          <p className="text-2xl font-black text-white">{completedGoalsCount}</p>
          <span className="text-[10px] text-slate-400">{activeGoalsCount} goals active</span>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Workout Duration Chart */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span>Workout Duration (Minutes)</span>
          </h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Bar dataKey="duration" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Steps Activity Chart */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center space-x-2">
            <Footprints className="w-4 h-4 text-emerald-400" />
            <span>Step Volume Trends</span>
          </h3>
          <div className="h-56 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={activityData}>
                <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={12} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px' }} />
                <Line type="monotone" dataKey="steps" stroke="#34d399" strokeWidth={3} dot={{ fill: '#34d399', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
