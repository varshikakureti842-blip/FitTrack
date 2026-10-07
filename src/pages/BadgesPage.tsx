import React from 'react';
import { useFitness } from '../context/FitnessContext';
import { Flame, Award, Calendar, CheckCircle2, Lock, Dumbbell, Footprints, Droplet, Trophy, Target, Zap } from 'lucide-react';

export const BadgesPage: React.FC = () => {
  const { profile, badges } = useFitness();

  const getIcon = (name: string) => {
    switch (name) {
      case 'Dumbbell': return <Dumbbell className="w-6 h-6" />;
      case 'Flame': return <Flame className="w-6 h-6" />;
      case 'Footprints': return <Footprints className="w-6 h-6" />;
      case 'Droplet': return <Droplet className="w-6 h-6" />;
      case 'Trophy': return <Trophy className="w-6 h-6" />;
      case 'Target': return <Target className="w-6 h-6" />;
      case 'Calendar': return <Calendar className="w-6 h-6" />;
      case 'Zap': return <Zap className="w-6 h-6" />;
      default: return <Award className="w-6 h-6" />;
    }
  };

  const unlockedCount = badges.filter(b => b.unlocked).length;

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <Award className="w-7 h-7 text-amber-400" />
          <span>Streaks & Badges</span>
        </h1>
        <p className="text-xs text-slate-400">Unlock milestone badges by staying consistent with your workouts and daily health habits.</p>
      </div>

      {/* Streak Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-orange-950/40 border border-orange-500/30 rounded-2xl p-6 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold">
            <Flame className="w-8 h-8 fill-orange-500 stroke-orange-400" />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{profile.streak} Days</p>
            <p className="text-xs font-bold text-orange-400 uppercase tracking-wider">Current Streak</p>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
            <Trophy className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{profile.longestStreak} Days</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Longest Streak</p>
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
            <Award className="w-7 h-7" />
          </div>
          <div>
            <p className="text-3xl font-black text-white">{unlockedCount} / {badges.length}</p>
            <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Badges Unlocked</p>
          </div>
        </div>
      </div>

      {/* Badges Grid */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white">Milestone Badges</h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {badges.map(b => (
            <div
              key={b.id}
              className={`p-5 rounded-2xl border transition flex flex-col justify-between ${
                b.unlocked
                  ? 'bg-slate-950 border-amber-500/30 text-slate-100 shadow-md'
                  : 'bg-slate-950/40 border-slate-800/80 text-slate-500 opacity-70'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold ${
                      b.unlocked ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-slate-800 text-slate-600'
                    }`}
                  >
                    {getIcon(b.iconName)}
                  </div>

                  {b.unlocked ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Unlocked
                    </span>
                  ) : (
                    <Lock className="w-4 h-4 text-slate-600" />
                  )}
                </div>

                <h4 className="text-sm font-bold text-white mb-1">{b.title}</h4>
                <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
              </div>

              {b.unlockedAt && (
                <p className="text-[10px] font-semibold text-amber-400 mt-4 pt-2 border-t border-slate-800">
                  Unlocked on {b.unlockedAt}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
