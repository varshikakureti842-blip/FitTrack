import React, { useState, useEffect } from 'react';
import { useFitness } from '../context/FitnessContext';
import { ActivityLevel, PrimaryGoal, Gender } from '../types/fitness';
import { calculateBMI, getBMICategory, calculateBMR, calculateTDEE, calculateCalorieGoal } from '../utils/fitnessCalculations';
import { User as UserIcon, Save, CheckCircle2, Flame, Scale, Activity } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile, currentUser, signInWithGoogle, signOutUser } = useFitness();

  const [name, setName] = useState(profile.name || '');
  const [age, setAge] = useState(profile.age || 25);
  const [gender, setGender] = useState<Gender>(profile.gender || 'male');
  const [heightCm, setHeightCm] = useState(profile.heightCm || 175);
  const [weightKg, setWeightKg] = useState(profile.weightKg || 70);
  const [targetWeightKg, setTargetWeightKg] = useState(profile.targetWeightKg || 65);
  const [fitnessGoal, setFitnessGoal] = useState<PrimaryGoal>(profile.fitnessGoal || 'muscle_gain');
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>(profile.activityLevel || 'moderately_active');

  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  useEffect(() => {
    setName(profile.name || '');
    setAge(profile.age || 25);
    setGender(profile.gender || 'male');
    setHeightCm(profile.heightCm || 175);
    setWeightKg(profile.weightKg || 70);
    setTargetWeightKg(profile.targetWeightKg || 65);
    setFitnessGoal(profile.fitnessGoal || 'muscle_gain');
    setActivityLevel(profile.activityLevel || 'moderately_active');
  }, [profile]);

  const bmi = calculateBMI(weightKg, heightCm);
  const bmiCat = getBMICategory(bmi);

  const bmr = calculateBMR(weightKg, heightCm, age, gender);
  const tdee = calculateTDEE(weightKg, heightCm, age, gender, activityLevel);
  const recommendedCalorieGoal = calculateCalorieGoal(tdee, fitnessGoal);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        name,
        age: Number(age),
        gender,
        heightCm: Number(heightCm),
        weightKg: Number(weightKg),
        targetWeightKg: Number(targetWeightKg),
        fitnessGoal,
        activityLevel,
        dailyCalorieGoal: recommendedCalorieGoal
      });

      setSavedMessage('Profile and health metrics saved successfully!');
      setTimeout(() => setSavedMessage(''), 4000);
    } catch (err) {
      console.error(err);
      setSavedMessage('Failed to save profile changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <UserIcon className="w-7 h-7 text-emerald-400" />
            <span>User Profile & Health Parameters</span>
          </h1>
          <p className="text-xs text-slate-400">Update physical statistics, goal focus, and calculate BMR/TDEE energy targets.</p>
        </div>

        {currentUser ? (
          <button
            onClick={signOutUser}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700"
          >
            Sign Out ({currentUser.email})
          </button>
        ) : (
          <button
            onClick={signInWithGoogle}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md shadow-emerald-500/20"
          >
            Sign In with Google
          </button>
        )}
      </div>

      {savedMessage && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs font-bold text-emerald-400 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{savedMessage}</span>
        </div>
      )}

      {/* Auto-Calculated Health Summary Box */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <span className="text-[10px] font-bold uppercase text-slate-400">Body Mass Index</span>
          <p className="text-2xl font-black text-white mt-1">{bmi}</p>
          <span className={`text-[10px] font-bold ${bmiCat.color}`}>{bmiCat.label}</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <span className="text-[10px] font-bold uppercase text-slate-400">BMR (Basal Rate)</span>
          <p className="text-2xl font-black text-slate-200 mt-1">{bmr} <span className="text-xs font-normal text-slate-400">kcal</span></p>
          <span className="text-[10px] text-slate-500">At rest requirement</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <span className="text-[10px] font-bold uppercase text-slate-400">TDEE Energy</span>
          <p className="text-2xl font-black text-amber-400 mt-1">{tdee} <span className="text-xs font-normal text-slate-400">kcal</span></p>
          <span className="text-[10px] text-amber-400">Active expenditure</span>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-5">
          <span className="text-[10px] font-bold uppercase text-slate-400">Target Intake</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">{recommendedCalorieGoal} <span className="text-xs font-normal text-slate-400">kcal</span></p>
          <span className="text-[10px] text-emerald-400">For {fitnessGoal.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm focus:outline-none focus:border-emerald-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Gender</label>
              <select
                value={gender}
                onChange={e => setGender(e.target.value as Gender)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-semibold text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other / Non-binary</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Age</label>
              <input
                type="number"
                min="10"
                max="120"
                value={age}
                onChange={e => setAge(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Height (cm)</label>
              <input
                type="number"
                min="100"
                max="250"
                value={heightCm}
                onChange={e => setHeightCm(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Current Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="300"
                value={weightKg}
                onChange={e => setWeightKg(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Target Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                min="30"
                max="300"
                value={targetWeightKg}
                onChange={e => setTargetWeightKg(Number(e.target.value))}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white font-bold text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Primary Fitness Goal</label>
              <select
                value={fitnessGoal}
                onChange={e => setFitnessGoal(e.target.value as PrimaryGoal)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-bold text-sm"
              >
                <option value="weight_loss">Weight Loss (Caloric Deficit)</option>
                <option value="muscle_gain">Muscle Gain (Hypertrophy Surplus)</option>
                <option value="maintain_weight">Maintain Weight</option>
                <option value="improve_fitness">Improve General Fitness</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Daily Activity Level</label>
              <select
                value={activityLevel}
                onChange={e => setActivityLevel(e.target.value as ActivityLevel)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2.5 text-white font-semibold text-sm"
              >
                <option value="sedentary">Sedentary (Little or no exercise)</option>
                <option value="lightly_active">Lightly Active (1-3 days/week)</option>
                <option value="moderately_active">Moderately Active (3-5 days/week)</option>
                <option value="very_active">Very Active (6-7 days/week)</option>
                <option value="extra_active">Extra Active (Hard training & job)</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center space-x-2 px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
