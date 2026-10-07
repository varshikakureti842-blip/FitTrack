import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Calendar as CalendarIcon, Dumbbell, Utensils, Scale, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { getTodayDateString } from '../utils/fitnessCalculations';

export const CalendarPage: React.FC = () => {
  const { workouts, meals, weightLogs, goals } = useFitness();

  const [currentDate, setCurrentDate] = useState(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('en-US', { month: 'long', year: 'numeric' });

  const firstDayIndex = new Date(year, month, 1).getDay();
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

  const daysArray = Array.from({ length: totalDaysInMonth }, (_, i) => i + 1);

  const [selectedDateStr, setSelectedDateStr] = useState(getTodayDateString());

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Find entries for selected date
  const selectedWorkouts = workouts.filter(w => w.date === selectedDateStr);
  const selectedMeals = meals.filter(m => m.date === selectedDateStr);
  const selectedWeight = weightLogs.filter(w => w.date === selectedDateStr);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-white flex items-center space-x-2">
          <CalendarIcon className="w-7 h-7 text-emerald-400" />
          <span>Fitness Calendar</span>
        </h1>
        <p className="text-xs text-slate-400">View logged workout sessions, meals, weigh-ins, and rest days on any calendar date.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar Grid Box */}
        <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white">{monthName}</h3>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrevMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNextMonth}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold uppercase text-slate-500">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1.5 pt-2">
            {/* Empty slots for first week padding */}
            {Array.from({ length: firstDayIndex }).map((_, idx) => (
              <div key={`empty-${idx}`} className="h-16 rounded-xl bg-slate-950/30"></div>
            ))}

            {daysArray.map(dayNum => {
              const dateObj = new Date(year, month, dayNum);
              const mStr = String(month + 1).padStart(2, '0');
              const dStr = String(dayNum).padStart(2, '0');
              const dateString = `${year}-${mStr}-${dStr}`;

              const isSelected = dateString === selectedDateStr;
              const isToday = dateString === getTodayDateString();

              const hasWorkout = workouts.some(w => w.date === dateString);
              const hasMeal = meals.some(m => m.date === dateString);
              const hasWeight = weightLogs.some(w => w.date === dateString);

              return (
                <button
                  key={dayNum}
                  onClick={() => setSelectedDateStr(dateString)}
                  className={`h-16 rounded-xl p-1.5 flex flex-col justify-between text-left transition border ${
                    isSelected
                      ? 'bg-emerald-500/20 border-emerald-400 text-white font-bold'
                      : isToday
                      ? 'bg-slate-800 border-slate-700 text-emerald-400 font-bold'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-800/60'
                  }`}
                >
                  <span className="text-xs">{dayNum}</span>

                  <div className="flex items-center space-x-1">
                    {hasWorkout && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                    {hasMeal && <span className="w-2 h-2 rounded-full bg-orange-400"></span>}
                    {hasWeight && <span className="w-2 h-2 rounded-full bg-indigo-400"></span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Date Details Panel */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Activity on</span>
            <h3 className="text-lg font-bold text-white">{selectedDateStr}</h3>
          </div>

          <div className="space-y-4">
            {/* Workouts */}
            <div>
              <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center space-x-1 mb-2">
                <Dumbbell className="w-4 h-4" />
                <span>Workouts ({selectedWorkouts.length})</span>
              </h4>

              {selectedWorkouts.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Rest day - No workouts recorded.</p>
              ) : (
                selectedWorkouts.map(w => (
                  <div key={w.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-1.5">
                    <span className="font-bold text-white">{w.title}</span>
                    <p className="text-slate-400">{w.durationMinutes} mins • {w.caloriesBurned} kcal</p>
                  </div>
                ))
              )}
            </div>

            {/* Meals */}
            <div>
              <h4 className="text-xs font-bold uppercase text-orange-400 flex items-center space-x-1 mb-2">
                <Utensils className="w-4 h-4" />
                <span>Meals ({selectedMeals.length})</span>
              </h4>

              {selectedMeals.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No meals logged on this date.</p>
              ) : (
                selectedMeals.map(m => (
                  <div key={m.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs mb-1.5">
                    <span className="font-bold text-white">{m.name}</span>
                    <p className="text-slate-400">{m.calories} kcal ({m.mealType})</p>
                  </div>
                ))
              )}
            </div>

            {/* Weight */}
            <div>
              <h4 className="text-xs font-bold uppercase text-indigo-400 flex items-center space-x-1 mb-2">
                <Scale className="w-4 h-4" />
                <span>Weigh-In</span>
              </h4>

              {selectedWeight.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No weigh-in recorded.</p>
              ) : (
                selectedWeight.map(w => (
                  <div key={w.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-xs font-bold text-white">
                    Recorded Weight: {w.weightKg} kg
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
