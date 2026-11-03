import React, { useState } from 'react';
import { X, Check, Eye } from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { ObservationStatus, StrandId } from '../types/simphonics';
import { SIMPHONICS_STRANDS, SIMPHONICS_SKILLS } from '../data/simphonicsData';

interface QuickObserveModalProps {
  onClose: () => void;
  defaultLearnerId?: string;
}

export const QuickObserveModal: React.FC<QuickObserveModalProps> = ({
  onClose,
  defaultLearnerId,
}) => {
  const { classLearners, recordObservation } = useSimphonics();

  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(
    defaultLearnerId || classLearners[0]?.id || ''
  );
  const [selectedStrand, setSelectedStrand] = useState<StrandId>('phonemic_awareness');
  const [selectedSkillId, setSelectedSkillId] = useState<string>('pm_1');
  const [status, setStatus] = useState<ObservationStatus>('developing');
  const [note, setNote] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const strandSkills = SIMPHONICS_SKILLS.filter((s) => s.strandId === selectedStrand);
  const currentSkill = SIMPHONICS_SKILLS.find((s) => s.id === selectedSkillId) || strandSkills[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLearnerId || !selectedSkillId) return;

    recordObservation(selectedLearnerId, selectedSkillId, status, note.trim() || undefined);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-teal-700" />
            <h3 className="text-base font-bold text-slate-900">Record Quick Observation</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          {/* Select Learner */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Learner</label>
            <select
              value={selectedLearnerId}
              onChange={(e) => setSelectedLearnerId(e.target.value)}
              className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 text-sm font-semibold focus:outline-none focus:ring-1 focus:ring-teal-600"
            >
              {classLearners.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.name} ({l.ageBand})
                </option>
              ))}
            </select>
          </div>

          {/* Strand & Skill Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Strand</label>
              <select
                value={selectedStrand}
                onChange={(e) => {
                  const newStrand = e.target.value as StrandId;
                  setSelectedStrand(newStrand);
                  const skills = SIMPHONICS_SKILLS.filter((s) => s.strandId === newStrand);
                  setSelectedSkillId(skills[0]?.id || '');
                }}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {SIMPHONICS_STRANDS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.shortName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Skill</label>
              <select
                value={selectedSkillId}
                onChange={(e) => setSelectedSkillId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {strandSkills.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.code}: {sk.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Teacher Guide Prompt */}
          {currentSkill && (
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200 space-y-1">
              <span className="font-bold text-teal-900 block text-[11px]">
                Look For: {currentSkill.lookFor}
              </span>
              <p className="text-[11px] text-teal-800">Prompt: {currentSkill.teacherInstruction}</p>
            </div>
          )}

          {/* Observation State Selector (4 buttons) */}
          <div className="space-y-1.5">
            <label className="block font-semibold text-slate-700">Observed State</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setStatus('not_observed')}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  status === 'not_observed'
                    ? 'bg-slate-200 text-slate-900 border-slate-400 font-bold'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Not observed
              </button>

              <button
                type="button"
                onClick={() => setStatus('needs_support')}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  status === 'needs_support'
                    ? 'bg-amber-100 text-amber-900 border-amber-400 font-bold'
                    : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                }`}
              >
                Needs support
              </button>

              <button
                type="button"
                onClick={() => setStatus('developing')}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  status === 'developing'
                    ? 'bg-sky-100 text-sky-900 border-sky-400 font-bold'
                    : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'
                }`}
              >
                Developing
              </button>

              <button
                type="button"
                onClick={() => setStatus('independent')}
                className={`py-2 px-1 text-center rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                  status === 'independent'
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-400 font-bold'
                    : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                }`}
              >
                Independent
              </button>
            </div>
          </div>

          {/* Optional Note */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Observation Note / Evidence (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Blended 3 words with finger taps; confused /t/ and /p/ on last attempt"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              {savedSuccess ? <Check className="w-4 h-4 text-white" /> : null}
              <span>{savedSuccess ? 'Saved!' : 'Save Observation'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
