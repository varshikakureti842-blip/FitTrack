import React, { useState } from 'react';
import { exerciseLibrary } from '../data/exerciseLibrary';
import { MuscleGroup } from '../types/fitness';
import { BookOpen, Search, Filter, Dumbbell, ChevronDown, ChevronUp } from 'lucide-react';

const categories: ('All' | MuscleGroup)[] = [
  'All',
  'Chest',
  'Back',
  'Shoulders',
  'Arms',
  'Legs',
  'Core',
  'Full Body',
  'Cardio'
];

export const ExerciseLibraryPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | MuscleGroup>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredExercises = exerciseLibrary.filter(ex => {
    const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
    const matchesSearch =
      ex.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.targetMuscle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ex.equipment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <BookOpen className="w-7 h-7 text-emerald-400" />
          <span>Exercise Library</span>
        </h1>
        <p className="text-xs text-slate-400">Explore exercises with target muscles, equipment, difficulty, and step-by-step instructions.</p>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search exercise by name, target muscle, or equipment..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700/80 text-white pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-emerald-400 transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === cat
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Exercise Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredExercises.length === 0 ? (
          <div className="col-span-full text-center py-12 text-slate-500 text-sm">
            No exercises match your search criteria.
          </div>
        ) : (
          filteredExercises.map(ex => {
            const isExpanded = expandedId === ex.id;

            return (
              <div
                key={ex.id}
                className="bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {ex.category}
                      </span>
                      <h3 className="text-base font-bold text-white mt-1.5">{ex.name}</h3>
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded-lg ${
                        ex.difficulty === 'Beginner'
                          ? 'bg-blue-500/10 text-blue-400'
                          : ex.difficulty === 'Intermediate'
                          ? 'bg-amber-500/10 text-amber-400'
                          : 'bg-rose-500/10 text-rose-400'
                      }`}
                    >
                      {ex.difficulty}
                    </span>
                  </div>

                  <div className="mt-3 space-y-1 text-xs">
                    <p className="text-slate-300">
                      <strong className="text-slate-400 font-medium">Target Muscle:</strong> {ex.targetMuscle}
                    </p>
                    <p className="text-slate-300">
                      <strong className="text-slate-400 font-medium">Equipment:</strong> {ex.equipment}
                    </p>
                  </div>
                </div>

                {/* Instructions Dropdown */}
                <div className="mt-4 pt-3 border-t border-slate-800/80">
                  <button
                    onClick={() => toggleExpand(ex.id)}
                    className="w-full flex items-center justify-between text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition"
                  >
                    <span>{isExpanded ? 'Hide Instructions' : 'View Instructions'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>

                  {isExpanded && (
                    <ol className="mt-3 space-y-1.5 text-xs text-slate-300 list-decimal list-inside bg-slate-950 p-3 rounded-xl border border-slate-800">
                      {ex.instructions.map((step, idx) => (
                        <li key={idx} className="leading-relaxed">
                          {step}
                        </li>
                      ))}
                    </ol>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
