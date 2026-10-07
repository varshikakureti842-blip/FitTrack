import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import {
  WorkoutType,
  WorkoutExercise,
  ExerciseSet,
  WorkoutTemplate,
  TemplateExercise
} from '../types/fitness';
import { exerciseLibrary } from '../data/exerciseLibrary';
import {
  Dumbbell,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  CheckCircle,
  History,
  Clock,
  Flame,
  Award,
  Bookmark,
  Layers,
  Sparkles,
  X
} from 'lucide-react';
import { findPreviousBestForExercise, getTodayDateString } from '../utils/fitnessCalculations';

export const WorkoutTrackerPage: React.FC = () => {
  const { workouts, workoutTemplates, logWorkout, createWorkoutTemplate, removeWorkoutTemplate } = useFitness();
  const today = getTodayDateString();

  // Active workout state
  const [isRecording, setIsRecording] = useState(false);
  const [workoutTitle, setWorkoutTitle] = useState('My Fitness Session');
  const [workoutType, setWorkoutType] = useState<WorkoutType>('Strength Training');
  const [caloriesInput, setCaloriesInput] = useState<number>(350);
  const [notes, setNotes] = useState('');

  // Live Timer state
  const [secondsElapsed, setSecondsElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  // Exercises in current active workout
  const [activeExercises, setActiveExercises] = useState<WorkoutExercise[]>([]);

  // Selected exercise to add from library
  const [selectedExName, setSelectedExName] = useState(exerciseLibrary[0].name);

  // Template creation modal state
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [tplTitle, setTplTitle] = useState('');
  const [tplType, setTplType] = useState<WorkoutType>('Strength Training');
  const [tplDuration, setTplDuration] = useState<number>(45);
  const [tplCalories, setTplCalories] = useState<number>(350);
  const [tplNotes, setTplNotes] = useState('');
  const [tplExercises, setTplExercises] = useState<TemplateExercise[]>([
    { exerciseName: exerciseLibrary[0].name, muscleGroup: exerciseLibrary[0].category, targetSets: 3, targetReps: 10, defaultWeightKg: 20 }
  ]);

  const formatTimerTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleStartWorkout = () => {
    setIsRecording(true);
    setIsTimerRunning(true);
  };

  const handleStartFromTemplate = (tpl: WorkoutTemplate) => {
    setWorkoutTitle(tpl.title);
    setWorkoutType(tpl.type);
    setCaloriesInput(tpl.estimatedCaloriesBurned || 350);
    setNotes(tpl.notes || '');

    // Pre-populate exercises and sets from template
    const convertedExercises: WorkoutExercise[] = tpl.exercises.map(te => {
      const sets: ExerciseSet[] = Array.from({ length: te.targetSets }, (_, i) => ({
        setNumber: i + 1,
        reps: te.targetReps,
        weightKg: te.defaultWeightKg,
        completed: true
      }));

      return {
        exerciseName: te.exerciseName,
        muscleGroup: te.muscleGroup,
        sets
      };
    });

    setActiveExercises(convertedExercises);
    setIsRecording(true);
    setIsTimerRunning(true);
    setSecondsElapsed(0);
  };

  const handleToggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };

  const handleResetTimer = () => {
    setIsTimerRunning(false);
    setSecondsElapsed(0);
  };

  const handleAddExerciseToSession = () => {
    const matchedEx = exerciseLibrary.find(e => e.name === selectedExName);
    const muscleGroup = matchedEx ? matchedEx.category : 'General';

    const newEx: WorkoutExercise = {
      exerciseName: selectedExName,
      muscleGroup,
      sets: [
        { setNumber: 1, reps: 10, weightKg: 20, completed: true }
      ]
    };

    setActiveExercises(prev => [...prev, newEx]);
  };

  const handleAddSet = (exerciseIdx: number) => {
    setActiveExercises(prev => {
      const copy = [...prev];
      const targetEx = copy[exerciseIdx];
      const lastSet = targetEx.sets[targetEx.sets.length - 1] || { reps: 10, weightKg: 20 };
      targetEx.sets.push({
        setNumber: targetEx.sets.length + 1,
        reps: lastSet.reps,
        weightKg: lastSet.weightKg,
        completed: true
      });
      return copy;
    });
  };

  const handleUpdateSet = (
    exerciseIdx: number,
    setIdx: number,
    field: 'reps' | 'weightKg' | 'completed',
    val: any
  ) => {
    setActiveExercises(prev => {
      const copy = [...prev];
      const targetSet = copy[exerciseIdx].sets[setIdx];
      if (field === 'reps') targetSet.reps = Math.max(1, Number(val));
      if (field === 'weightKg') targetSet.weightKg = Math.max(0, Number(val));
      if (field === 'completed') targetSet.completed = Boolean(val);
      return copy;
    });
  };

  const handleRemoveExercise = (exerciseIdx: number) => {
    setActiveExercises(prev => prev.filter((_, idx) => idx !== exerciseIdx));
  };

  const handleSaveWorkout = async () => {
    const durationMins = Math.max(1, Math.round(secondsElapsed / 60));
    await logWorkout({
      title: workoutTitle || 'Fitness Workout',
      type: workoutType,
      durationMinutes: durationMins,
      caloriesBurned: caloriesInput || 250,
      date: today,
      notes,
      exercises: activeExercises
    });

    setIsRecording(false);
    setIsTimerRunning(false);
    setSecondsElapsed(0);
    setActiveExercises([]);
    setNotes('');
  };

  // Template creation modal handlers
  const handleAddTemplateExercise = () => {
    setTplExercises(prev => [
      ...prev,
      { exerciseName: exerciseLibrary[0].name, muscleGroup: exerciseLibrary[0].category, targetSets: 3, targetReps: 10, defaultWeightKg: 20 }
    ]);
  };

  const handleUpdateTemplateExercise = (index: number, field: keyof TemplateExercise, val: any) => {
    setTplExercises(prev => {
      const copy = [...prev];
      if (field === 'exerciseName') {
        copy[index].exerciseName = val;
        const matched = exerciseLibrary.find(e => e.name === val);
        if (matched) copy[index].muscleGroup = matched.category;
      } else if (field === 'targetSets') {
        copy[index].targetSets = Math.max(1, Number(val));
      } else if (field === 'targetReps') {
        copy[index].targetReps = Math.max(1, Number(val));
      } else if (field === 'defaultWeightKg') {
        copy[index].defaultWeightKg = Math.max(0, Number(val));
      }
      return copy;
    });
  };

  const handleRemoveTemplateExercise = (index: number) => {
    setTplExercises(prev => prev.filter((_, i) => i !== index));
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tplTitle.trim()) return;

    await createWorkoutTemplate({
      title: tplTitle,
      type: tplType,
      estimatedDurationMinutes: Number(tplDuration),
      estimatedCaloriesBurned: Number(tplCalories),
      notes: tplNotes,
      exercises: tplExercises
    });

    setTplTitle('');
    setTplNotes('');
    setTemplateModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Dumbbell className="w-7 h-7 text-emerald-400" />
            <span>Workout Tracker & Routine Templates</span>
          </h1>
          <p className="text-xs text-slate-400">Record workouts, launch custom templates (Push, Pull, Legs), and track progressive overload.</p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setTemplateModalOpen(true)}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition"
          >
            <Bookmark className="w-4 h-4" />
            <span>Create Template</span>
          </button>

          {!isRecording && (
            <button
              onClick={handleStartWorkout}
              className="flex items-center justify-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition"
            >
              <Play className="w-4 h-4 fill-slate-950" />
              <span>Start Blank Workout</span>
            </button>
          )}
        </div>
      </div>

      {/* Workout Templates Carousel / Grid */}
      {!isRecording && (
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-emerald-400" />
                <span>Saved Workout Templates ({workoutTemplates.length})</span>
              </h3>
              <p className="text-xs text-slate-400">Initiate a pre-configured split routine with 1 click.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {workoutTemplates.map(tpl => (
              <div
                key={tpl.id}
                className="bg-slate-950 border border-slate-800 hover:border-emerald-500/40 rounded-xl p-4 flex flex-col justify-between space-y-3 transition group relative"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tpl.type}
                      </span>
                      <h4 className="text-base font-bold text-white mt-1 group-hover:text-emerald-400 transition">{tpl.title}</h4>
                    </div>

                    <button
                      onClick={() => removeWorkoutTemplate(tpl.id)}
                      className="text-slate-600 hover:text-rose-400 transition"
                      title="Delete Template"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {tpl.exercises.length} Exercises • ~{tpl.estimatedDurationMinutes} mins • ~{tpl.estimatedCaloriesBurned} kcal
                  </p>

                  <div className="mt-3 pt-2 border-t border-slate-800/80 space-y-1 text-xs text-slate-300">
                    {tpl.exercises.slice(0, 3).map((ex, idx) => (
                      <div key={idx} className="flex justify-between text-[11px]">
                        <span className="truncate">{ex.exerciseName}</span>
                        <span className="text-slate-400 font-semibold">{ex.targetSets} sets × {ex.targetReps} reps</span>
                      </div>
                    ))}
                    {tpl.exercises.length > 3 && (
                      <span className="text-[10px] text-emerald-400 font-semibold">+{tpl.exercises.length - 3} more exercises</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleStartFromTemplate(tpl)}
                  className="w-full mt-2 py-2 rounded-xl bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-slate-950 border border-emerald-500/30 text-xs font-bold transition flex items-center justify-center space-x-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Start Workout Routine</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Active Workout Recording View */}
      {isRecording && (
        <div className="bg-slate-900 border-2 border-emerald-500/40 rounded-2xl p-6 space-y-6 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div className="space-y-2 flex-1">
              <input
                type="text"
                value={workoutTitle}
                onChange={e => setWorkoutTitle(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-lg font-black text-white px-3 py-1.5 rounded-xl w-full max-w-md focus:outline-none focus:border-emerald-400"
              />
              <div className="flex items-center space-x-3 text-xs">
                <select
                  value={workoutType}
                  onChange={e => setWorkoutType(e.target.value as WorkoutType)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 px-3 py-1 rounded-lg font-semibold"
                >
                  <option value="Strength Training">Strength Training</option>
                  <option value="Cardio">Cardio</option>
                  <option value="Running">Running</option>
                  <option value="Cycling">Cycling</option>
                  <option value="Walking">Walking</option>
                  <option value="HIIT">HIIT</option>
                  <option value="Yoga">Yoga</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* Live Workout Timer Display */}
            <div className="flex items-center space-x-4 bg-slate-950 px-4 py-2.5 rounded-2xl border border-slate-800">
              <div className="text-right">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Timer</p>
                <p className="text-2xl font-black text-emerald-400 font-mono">{formatTimerTime(secondsElapsed)}</p>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={handleToggleTimer}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white transition"
                  title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                >
                  {isTimerRunning ? <Pause className="w-4 h-4 text-amber-400" /> : <Play className="w-4 h-4 text-emerald-400" />}
                </button>
                <button
                  onClick={handleResetTimer}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
                  title="Reset Timer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add Exercise Controller */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-slate-800/40 p-3 rounded-xl border border-slate-800">
            <select
              value={selectedExName}
              onChange={e => setSelectedExName(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-white px-3 py-2 rounded-xl text-sm font-semibold flex-1 w-full"
            >
              {exerciseLibrary.map(ex => (
                <option key={ex.id} value={ex.name}>
                  {ex.name} ({ex.category})
                </option>
              ))}
            </select>

            <button
              onClick={handleAddExerciseToSession}
              className="w-full sm:w-auto flex items-center justify-center space-x-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 font-bold text-xs border border-emerald-500/30 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Exercise</span>
            </button>
          </div>

          {/* Exercises Set Table */}
          <div className="space-y-4">
            {activeExercises.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-xs">
                No exercises added yet. Pick an exercise above or start from a saved template!
              </div>
            ) : (
              activeExercises.map((ex, exIdx) => {
                const prevBest = findPreviousBestForExercise(workouts, ex.exerciseName);

                return (
                  <div key={exIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-white flex items-center space-x-2">
                          <span>{ex.exerciseName}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                            {ex.muscleGroup}
                          </span>
                        </h4>

                        {prevBest ? (
                          <p className="text-[11px] text-amber-400 flex items-center space-x-1 mt-0.5 font-medium">
                            <Award className="w-3.5 h-3.5 text-amber-400" />
                            <span>Previous Best: {prevBest.maxWeight} kg x {prevBest.maxReps} reps ({prevBest.date})</span>
                          </p>
                        ) : (
                          <p className="text-[11px] text-slate-500 mt-0.5">First time recording this exercise.</p>
                        )}
                      </div>

                      <button
                        onClick={() => handleRemoveExercise(exIdx)}
                        className="text-slate-500 hover:text-rose-400 transition"
                        title="Remove Exercise"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2">
                      <div className="grid grid-cols-4 gap-2 text-[10px] font-bold uppercase text-slate-400 text-center">
                        <span>Set</span>
                        <span>Kg</span>
                        <span>Reps</span>
                        <span>Done</span>
                      </div>

                      {ex.sets.map((set, setIdx) => (
                        <div key={setIdx} className="grid grid-cols-4 gap-2 items-center text-center">
                          <span className="text-xs font-bold text-slate-400">#{set.setNumber}</span>
                          <input
                            type="number"
                            min="0"
                            value={set.weightKg}
                            onChange={e => handleUpdateSet(exIdx, setIdx, 'weightKg', e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-white font-bold text-xs text-center focus:outline-none focus:border-emerald-400"
                          />
                          <input
                            type="number"
                            min="1"
                            value={set.reps}
                            onChange={e => handleUpdateSet(exIdx, setIdx, 'reps', e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-lg py-1 px-2 text-white font-bold text-xs text-center focus:outline-none focus:border-emerald-400"
                          />
                          <button
                            type="button"
                            onClick={() => handleUpdateSet(exIdx, setIdx, 'completed', !set.completed)}
                            className={`py-1 rounded-lg text-xs font-bold transition flex items-center justify-center ${
                              set.completed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-800 text-slate-500'
                            }`}
                          >
                            <CheckCircle className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleAddSet(exIdx)}
                      className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 pt-1"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add Set</span>
                    </button>
                  </div>
                );
              })
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Estimated Calories Burned (kcal)</label>
              <input
                type="number"
                value={caloriesInput}
                onChange={e => setCaloriesInput(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Workout Notes / Reflection</label>
              <input
                type="text"
                placeholder="How did this workout feel?"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-sm"
              />
            </div>
          </div>

          <div className="flex space-x-3 pt-4 border-t border-slate-800">
            <button
              onClick={() => setIsRecording(false)}
              className="flex-1 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold transition"
            >
              Discard Session
            </button>
            <button
              onClick={handleSaveWorkout}
              className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-sm font-bold transition shadow-lg shadow-emerald-500/20"
            >
              Complete & Save Workout
            </button>
          </div>
        </div>
      )}

      {/* Workout History List */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <History className="w-5 h-5 text-emerald-400" />
          <span>Workout History ({workouts.length})</span>
        </h3>

        {workouts.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-sm">
            No workouts logged yet.
          </div>
        ) : (
          <div className="space-y-4">
            {workouts.map(w => (
              <div key={w.id} className="bg-slate-950 border border-slate-800/80 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{w.type}</span>
                    <h4 className="text-base font-bold text-white">{w.title}</h4>
                  </div>
                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>{w.durationMinutes} mins</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Flame className="w-3.5 h-3.5 text-rose-400" />
                      <span>{w.caloriesBurned} kcal</span>
                    </span>
                    <span className="font-semibold text-slate-300">{w.date}</span>
                  </div>
                </div>

                {w.notes && (
                  <p className="text-xs italic text-slate-400 bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                    "{w.notes}"
                  </p>
                )}

                {w.exercises && w.exercises.length > 0 && (
                  <div className="space-y-2">
                    {w.exercises.map((ex, exIdx) => (
                      <div key={exIdx} className="bg-slate-900/80 p-2.5 rounded-lg border border-slate-800 text-xs">
                        <div className="flex justify-between font-bold text-slate-200">
                          <span>{ex.exerciseName} ({ex.muscleGroup})</span>
                          <span className="text-slate-400">{ex.sets.length} sets</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {ex.sets.map((s, sIdx) => (
                            <span key={sIdx} className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-300 font-semibold">
                              Set {s.setNumber}: {s.weightKg} kg × {s.reps} reps
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Custom Template Modal */}
      {templateModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-xl w-full p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center space-x-2">
                <Bookmark className="w-5 h-5 text-emerald-400" />
                <span>Create Workout Routine Template</span>
              </h3>
              <button
                onClick={() => setTemplateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTemplate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Routine Title</label>
                <input
                  type="text"
                  placeholder="e.g. Upper Body Push Day"
                  value={tplTitle}
                  onChange={e => setTplTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-sm"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Type</label>
                  <select
                    value={tplType}
                    onChange={e => setTplType(e.target.value as WorkoutType)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-2.5 py-2 text-white font-semibold text-xs"
                  >
                    <option value="Strength Training">Strength Training</option>
                    <option value="Cardio">Cardio</option>
                    <option value="Running">Running</option>
                    <option value="Cycling">Cycling</option>
                    <option value="HIIT">HIIT</option>
                    <option value="Yoga">Yoga</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Est. Duration (min)</label>
                  <input
                    type="number"
                    value={tplDuration}
                    onChange={e => setTplDuration(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Est. Calories (kcal)</label>
                  <input
                    type="number"
                    value={tplCalories}
                    onChange={e => setTplCalories(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-bold text-xs"
                  />
                </div>
              </div>

              {/* Template Exercises Editor */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-slate-400">Routine Exercises</label>
                  <button
                    type="button"
                    onClick={handleAddTemplateExercise}
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Exercise</span>
                  </button>
                </div>

                {tplExercises.map((te, idx) => (
                  <div key={idx} className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <select
                        value={te.exerciseName}
                        onChange={e => handleUpdateTemplateExercise(idx, 'exerciseName', e.target.value)}
                        className="bg-slate-800 border border-slate-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold flex-1"
                      >
                        {exerciseLibrary.map(ex => (
                          <option key={ex.id} value={ex.name}>
                            {ex.name} ({ex.category})
                          </option>
                        ))}
                      </select>

                      <button
                        type="button"
                        onClick={() => handleRemoveTemplateExercise(idx)}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] text-slate-500">Target Sets</label>
                        <input
                          type="number"
                          min="1"
                          value={te.targetSets}
                          onChange={e => handleUpdateTemplateExercise(idx, 'targetSets', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Target Reps</label>
                        <input
                          type="number"
                          min="1"
                          value={te.targetReps}
                          onChange={e => handleUpdateTemplateExercise(idx, 'targetReps', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs font-bold text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] text-slate-500">Default Kg</label>
                        <input
                          type="number"
                          min="0"
                          value={te.defaultWeightKg}
                          onChange={e => handleUpdateTemplateExercise(idx, 'defaultWeightKg', e.target.value)}
                          className="w-full bg-slate-800 border border-slate-700 text-white rounded px-2 py-1 text-xs font-bold text-center"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Routine Notes / Tips</label>
                <input
                  type="text"
                  placeholder="e.g. Rest 90s between heavy compound sets"
                  value={tplNotes}
                  onChange={e => setTplNotes(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setTemplateModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition"
                >
                  Save Workout Template
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
