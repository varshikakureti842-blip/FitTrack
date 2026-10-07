import React, { useState } from 'react';
import { useFitness } from '../context/FitnessContext';
import { Ruler, Plus, History, Activity } from 'lucide-react';
import { getTodayDateString } from '../utils/fitnessCalculations';

export const MeasurementsPage: React.FC = () => {
  const { measurementLogs, logMeasurement } = useFitness();
  const today = getTodayDateString();

  const [waist, setWaist] = useState<number>(75);
  const [chest, setChest] = useState<number>(92);
  const [arms, setArms] = useState<number>(30);
  const [hips, setHips] = useState<number>(96);
  const [thighs, setThighs] = useState<number>(54);
  const [bodyFat, setBodyFat] = useState<number>(21.5);

  const [modalOpen, setModalOpen] = useState(false);

  const latest = measurementLogs.length ? measurementLogs[0] : null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await logMeasurement({
      waistCm: Number(waist),
      chestCm: Number(chest),
      armsCm: Number(arms),
      hipsCm: Number(hips),
      thighsCm: Number(thighs),
      bodyFatPercentage: Number(bodyFat),
      date: today
    });
    setModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-white flex items-center space-x-2">
            <Ruler className="w-7 h-7 text-purple-400" />
            <span>Body Measurements</span>
          </h1>
          <p className="text-xs text-slate-400">Track changes in waist, chest, arms, hips, thighs, and body fat percentage.</p>
        </div>

        <button
          onClick={() => setModalOpen(!modalOpen)}
          className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-sm shadow-lg shadow-purple-500/20 transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Measurements Log</span>
        </button>
      </div>

      {/* Latest Body Circumferences Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Waist</p>
          <p className="text-xl font-black text-white mt-1">{latest?.waistCm || '--'} <span className="text-xs font-normal text-slate-400">cm</span></p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Chest</p>
          <p className="text-xl font-black text-white mt-1">{latest?.chestCm || '--'} <span className="text-xs font-normal text-slate-400">cm</span></p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Arms</p>
          <p className="text-xl font-black text-white mt-1">{latest?.armsCm || '--'} <span className="text-xs font-normal text-slate-400">cm</span></p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Hips</p>
          <p className="text-xl font-black text-white mt-1">{latest?.hipsCm || '--'} <span className="text-xs font-normal text-slate-400">cm</span></p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-slate-400">Thighs</p>
          <p className="text-xl font-black text-white mt-1">{latest?.thighsCm || '--'} <span className="text-xs font-normal text-slate-400">cm</span></p>
        </div>

        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 text-center">
          <p className="text-[10px] font-bold uppercase text-purple-400">Body Fat %</p>
          <p className="text-xl font-black text-purple-400 mt-1">{latest?.bodyFatPercentage || '--'}%</p>
        </div>
      </div>

      {/* Record Modal Form */}
      {modalOpen && (
        <div className="bg-slate-900 border-2 border-purple-500/30 rounded-2xl p-6 space-y-4">
          <h3 className="text-base font-bold text-white">Record Circumference & Body Fat</h3>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Waist (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={waist}
                  onChange={e => setWaist(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Chest (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={chest}
                  onChange={e => setChest(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Arms (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={arms}
                  onChange={e => setArms(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Hips (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={hips}
                  onChange={e => setHips(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">Thighs (cm)</label>
                <input
                  type="number"
                  step="0.5"
                  value={thighs}
                  onChange={e => setThighs(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-purple-400 mb-1">Body Fat (%)</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={e => setBodyFat(Number(e.target.value))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-bold text-xs"
                />
              </div>
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
                className="flex-1 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs transition"
              >
                Save Measurements
              </button>
            </div>
          </form>
        </div>
      )}

      {/* History Table */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center space-x-2">
          <History className="w-5 h-5 text-purple-400" />
          <span>Measurement History ({measurementLogs.length})</span>
        </h3>

        {measurementLogs.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            No body measurements recorded yet. Click "New Measurements Log" above.
          </div>
        ) : (
          <div className="space-y-3">
            {measurementLogs.map(m => (
              <div key={m.id} className="p-4 bg-slate-950 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-white">{m.date}</span>
                  <p className="text-[11px] text-purple-400 font-semibold mt-0.5">
                    Body Fat: {m.bodyFatPercentage || '--'}%
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-3 font-semibold text-slate-300 text-center">
                  <div>
                    <span className="block text-[10px] text-slate-500">Waist</span>
                    <span>{m.waistCm || '--'} cm</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Chest</span>
                    <span>{m.chestCm || '--'} cm</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Arms</span>
                    <span>{m.armsCm || '--'} cm</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Hips</span>
                    <span>{m.hipsCm || '--'} cm</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500">Thighs</span>
                    <span>{m.thighsCm || '--'} cm</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
