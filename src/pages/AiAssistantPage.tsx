import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Bot, Sparkles, Send, Dumbbell, ShieldAlert, CheckCircle2, ArrowRight, RefreshCw, Layers, Mic } from 'lucide-react';
import { MuscleGroup, PrimaryGoal, DifficultyLevel, GeneratedPlan } from '../types/fitness';
import { LiveVoiceCoach } from '../components/LiveVoiceCoach';

export const AiAssistantPage: React.FC = () => {
  const { profile, workouts, meals, dailyActivities, waterLogs, goals, logWorkout } = useFitness();

  const [activeTab, setActiveTab] = useState<'assistant' | 'live_voice' | 'plan_generator'>('assistant');

  // AI Assistant Chat state
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
    {
      role: 'assistant',
      text: `Hello ${profile.name}! I am your AI Fitness Assistant. I have analyzed your profile (${profile.fitnessGoal.replace('_', ' ')} goal, ${profile.weightKg} kg, ${profile.streak}-day streak) and workout history. Ask me anything about your training, nutrition, or recovery!`
    }
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [loadingAi, setLoadingAi] = useState(false);

  // Plan Generator state
  const [genGoal, setGenGoal] = useState<PrimaryGoal>(profile.fitnessGoal || 'muscle_gain');
  const [genLevel, setGenLevel] = useState<DifficultyLevel>('Intermediate');
  const [genDays, setGenDays] = useState<number>(4);
  const [genDuration, setGenDuration] = useState<number>(60);
  const [genEquipment, setGenEquipment] = useState<string>('Full Gym');
  const [genMuscles, setGenMuscles] = useState<MuscleGroup[]>(['Chest', 'Back', 'Legs', 'Shoulders']);

  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [loadingPlan, setLoadingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);

  const presetQueries = [
    'What workout should I do today?',
    'How consistent was I this week?',
    'Which muscle groups have I trained recently?',
    'How can I improve my workout consistency?',
    'Create a beginner workout plan.'
  ];

  const handleSendQuery = async (queryText?: string) => {
    const q = queryText || inputQuery;
    if (!q.trim() || loadingAi) return;

    const userMsg = q;
    setInputQuery('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoadingAi(true);

    try {
      const userContext = {
        profile,
        recentWorkouts: workouts.slice(0, 5),
        recentMeals: meals.slice(0, 5),
        recentActivities: dailyActivities.slice(0, 5),
        activeGoals: goals.filter(g => g.status === 'active')
      };

      const res = await fetch('/api/ai/fitness-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg, userContext })
      });

      const data = await res.json();
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', text: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: 'Apologies, I could not process that query. Please try again.' }]);
      }
    } catch (err) {
      console.error(err);
      setMessages(prev => [...prev, { role: 'assistant', text: 'Error connecting to AI service. Please check your connection.' }]);
    } finally {
      setLoadingAi(false);
    }
  };

  const handleGeneratePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingPlan(true);
    setPlanSaved(false);

    try {
      const res = await fetch('/api/ai/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fitnessGoal: genGoal,
          experienceLevel: genLevel,
          daysPerWeek: genDays,
          durationMinutes: genDuration,
          availableEquipment: genEquipment,
          targetMuscleGroups: genMuscles
        })
      });

      const data = await res.json();
      if (data.plan) {
        setGeneratedPlan(data.plan);
      }
    } catch (err) {
      console.error(err);
      alert('Failed to generate plan. Please try again.');
    } finally {
      setLoadingPlan(false);
    }
  };

  const toggleMuscleSelection = (m: MuscleGroup) => {
    setGenMuscles(prev =>
      prev.includes(m) ? prev.filter(item => item !== m) : [...prev, m]
    );
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Bot className="w-7 h-7 text-emerald-400" />
            <span>AI Fitness Intelligence</span>
          </h1>
          <p className="text-xs text-slate-400">Personalized workout guidance and custom split generator powered by Gemini AI.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-900 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab('assistant')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'assistant' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI Chat</span>
          </button>
          <button
            onClick={() => setActiveTab('live_voice')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'live_voice' ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>Voice Coach</span>
          </button>
          <button
            onClick={() => setActiveTab('plan_generator')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center space-x-1.5 ${
              activeTab === 'plan_generator' ? 'bg-emerald-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Dumbbell className="w-3.5 h-3.5" />
            <span>Plan Generator</span>
          </button>
        </div>
      </div>

      {/* Mandatory Safety Banner */}
      <div className="p-3.5 bg-slate-900/90 border border-amber-500/30 rounded-xl text-xs text-slate-300 flex items-start space-x-3">
        <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-amber-400 font-bold">Safety Notice:</strong> AI advice is for general fitness guidance only. It does not constitute medical diagnosis or replace consultation with a physician or physical therapist.
        </p>
      </div>

      {/* TAB 1: AI Assistant Chat */}
      {activeTab === 'assistant' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Chat Box */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl flex flex-col h-[520px] overflow-hidden">
            {/* Messages Scroll Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                      m.role === 'user'
                        ? 'bg-emerald-500 text-slate-950 font-semibold rounded-br-none'
                        : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-line">{m.text}</p>
                  </div>
                </div>
              ))}

              {loadingAi && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 border border-slate-700 p-3 rounded-2xl text-xs text-slate-400 flex items-center space-x-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                    <span>Analyzing fitness logs & generating response...</span>
                  </div>
                </div>
              )}
            </div>

            {/* Input Bar */}
            <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center space-x-2">
              <input
                type="text"
                placeholder="Ask your fitness question..."
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendQuery()}
                className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
              />
              <button
                onClick={() => handleSendQuery()}
                disabled={loadingAi}
                className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Presets Panel */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Suggested Questions</span>
            </h3>

            <div className="space-y-2">
              {presetQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendQuery(q)}
                  className="w-full text-left p-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-xs font-semibold text-slate-200 border border-slate-800 transition flex items-center justify-between group"
                >
                  <span>"{q}"</span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Live Voice Coach */}
      {activeTab === 'live_voice' && (
        <div className="max-w-2xl mx-auto">
          <LiveVoiceCoach />
        </div>
      )}
      {activeTab === 'plan_generator' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Plan Form */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Custom Split Preferences</h3>

            <form onSubmit={handleGeneratePlan} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Goal</label>
                <select
                  value={genGoal}
                  onChange={e => setGenGoal(e.target.value as PrimaryGoal)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-xs"
                >
                  <option value="weight_loss">Weight Loss</option>
                  <option value="muscle_gain">Muscle Gain</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="improve_fitness">Improve Fitness</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Experience Level</label>
                <select
                  value={genLevel}
                  onChange={e => setGenLevel(e.target.value as DifficultyLevel)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white font-semibold text-xs"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Days / Week</label>
                  <input
                    type="number"
                    min="2"
                    max="6"
                    value={genDays}
                    onChange={e => setGenDays(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    step="15"
                    value={genDuration}
                    onChange={e => setGenDuration(Number(e.target.value))}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1">Equipment Available</label>
                <input
                  type="text"
                  placeholder="e.g. Gym, Dumbbells, Bodyweight"
                  value={genEquipment}
                  onChange={e => setGenEquipment(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2">Target Muscle Groups</label>
                <div className="flex flex-wrap gap-1.5">
                  {(['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Core'] as MuscleGroup[]).map(m => {
                    const sel = genMuscles.includes(m);
                    return (
                      <button
                        key={m}
                        type="button"
                        onClick={() => toggleMuscleSelection(m)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border transition ${
                          sel
                            ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {m}
                      </button>
                    );
                  })}
                </div>
              </div>

              <button
                type="submit"
                disabled={loadingPlan}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs transition shadow-lg shadow-emerald-500/20 flex items-center justify-center space-x-2"
              >
                {loadingPlan ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Generating Plan with AI...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Structured Plan</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Plan Output Display */}
          <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-4">
            {!generatedPlan ? (
              <div className="text-center py-16 text-slate-500 text-xs">
                Configure your split preferences on the left and click "Generate Structured Plan".
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    AI Generated Weekly Plan
                  </span>
                  <h3 className="text-xl font-black text-white mt-1">{generatedPlan.planTitle}</h3>
                  <p className="text-xs text-slate-300 mt-1">{generatedPlan.summary}</p>
                </div>

                <div className="space-y-4">
                  {generatedPlan.weeklySchedule.map((day, dayIdx) => (
                    <div key={dayIdx} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                      <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                        <h4 className="text-sm font-bold text-emerald-400">{day.dayName}</h4>
                        <span className="text-xs text-slate-400 font-medium">{day.focus}</span>
                      </div>

                      <div className="space-y-1.5 pt-1 text-xs">
                        {day.exercises.map((ex, exIdx) => (
                          <div key={exIdx} className="flex justify-between text-slate-200">
                            <span>• <strong>{ex.name}</strong> ({ex.targetMuscle})</span>
                            <span className="text-slate-400">{ex.sets} sets × {ex.reps} (Rest: {ex.restSeconds}s)</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {generatedPlan.generalTips && (
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl text-xs space-y-1 text-slate-300">
                    <strong className="text-emerald-400 block mb-1">Key Training Tips:</strong>
                    {generatedPlan.generalTips.map((tip, idx) => (
                      <p key={idx}>• {tip}</p>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
