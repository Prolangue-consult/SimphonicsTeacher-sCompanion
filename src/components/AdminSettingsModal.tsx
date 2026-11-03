import React, { useState } from 'react';
import { X, Settings, Download, Upload, RotateCcw, Plus, Check } from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { StrandId, Activity } from '../types/simphonics';
import { SIMPHONICS_STRANDS } from '../data/simphonicsData';

interface AdminSettingsModalProps {
  onClose: () => void;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({ onClose }) => {
  const {
    teacherName,
    setTeacherName,
    classes,
    learners,
    groups,
    activities,
    savedPlans,
    addActivity,
    resetAllData,
  } = useSimphonics();

  const [activeTab, setActiveTab] = useState<'general' | 'add_activity' | 'backup'>('general');
  const [nameInput, setNameInput] = useState(teacherName);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // New activity form state
  const [actTitle, setActTitle] = useState('');
  const [actStrand, setActStrand] = useState<StrandId>('phonics_decoding');
  const [actDuration, setActDuration] = useState<number>(10);
  const [actCorrespondences, setActCorrespondences] = useState('s, a, t');
  const [actIntention, setActIntention] = useState('');
  const [actBookRef, setActBookRef] = useState('');
  const [actMaterialType, setActMaterialType] = useState<Activity['materialType']>('flashcard');
  const [actMaterials, setActMaterials] = useState('');
  const [actModel, setActModel] = useState('');
  const [actGuided, setActGuided] = useState('');
  const [actAttempt, setActAttempt] = useState('');
  const [actCheck, setActCheck] = useState('');
  const [actSupport, setActSupport] = useState('');
  const [actExtension, setActExtension] = useState('');

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    setTeacherName(nameInput.trim() || 'Teacher Alane');
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleCreateActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!actTitle.trim() || !actIntention.trim()) return;

    addActivity({
      title: actTitle.trim(),
      strandId: actStrand,
      level: 'Level 1 Foundations',
      durationMinutes: actDuration,
      correspondences: actCorrespondences
        .split(',')
        .map((s) => s.trim().replace(/[\/]/g, ''))
        .filter(Boolean),
      learningIntention: actIntention.trim(),
      prerequisites: ['Foundational listening'],
      preparation: actMaterials.trim() || 'Classroom cards and mat',
      bookReference: actBookRef.trim() || undefined,
      materialType: actMaterialType,
      materialsNeeded: actMaterials ? actMaterials.split(',').map((s) => s.trim()) : [],
      model: actModel.trim(),
      guidedPractice: actGuided.trim(),
      independentAttempt: actAttempt.trim(),
      check: actCheck.trim(),
      adaptation: {
        extraSupport: actSupport.trim() || 'Provide tactile counters and slow down pace.',
        extension: actExtension.trim() || 'Invite child to segment and spell the word.',
      },
    });

    setActTitle('');
    setActIntention('');
    setActiveTab('general');
    alert('Activity successfully added to Simphonics Library!');
  };

  const handleExportBackup = () => {
    const data = {
      classes,
      learners,
      groups,
      activities,
      savedPlans,
      teacherName,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simphonics_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.learners) {
          localStorage.setItem('simphonics_companion_v1_learners', JSON.stringify(parsed.learners));
        }
        if (parsed.classes) {
          localStorage.setItem('simphonics_companion_v1_classes', JSON.stringify(parsed.classes));
        }
        if (parsed.groups) {
          localStorage.setItem('simphonics_companion_v1_groups', JSON.stringify(parsed.groups));
        }
        if (parsed.activities) {
          localStorage.setItem('simphonics_companion_v1_activities', JSON.stringify(parsed.activities));
        }
        window.location.reload();
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Settings & Administrator Area
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 border-b border-slate-100 pb-2 text-xs">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'general'
                ? 'bg-teal-50 text-teal-800 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            General & Profile
          </button>
          <button
            onClick={() => setActiveTab('add_activity')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'add_activity'
                ? 'bg-teal-50 text-teal-800 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Maintain Content (Add Activity)
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-teal-50 text-teal-800 font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Data Backup & Reset
          </button>
        </div>

        {/* TAB 1: GENERAL */}
        {activeTab === 'general' && (
          <form onSubmit={handleSaveGeneral} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teacher Name / Identifier
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white text-sm"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Appears on the Today greeting, lesson plans, and generated parent summaries.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block text-xs">Current Database Roster</span>
              <p className="text-slate-600">
                • {classes.length} Classes configured ({classes.map((c) => c.name).join(', ')})
              </p>
              <p className="text-slate-600">• {learners.length} Active learners enrolled</p>
              <p className="text-slate-600">• {activities.length} Approved Simphonics activities</p>
              <p className="text-slate-600">• {savedPlans.length} Saved lesson plans</p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              {savedSuccess ? (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Saved!
                </span>
              ) : (
                <span />
              )}
              <button
                type="submit"
                className="px-5 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: MAINTAIN CONTENT */}
        {activeTab === 'add_activity' && (
          <form onSubmit={handleCreateActivity} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Activity Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Tactile Sound Hopscotch"
                value={actTitle}
                onChange={(e) => setActTitle(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Strand</label>
                <select
                  value={actStrand}
                  onChange={(e) => setActStrand(e.target.value as StrandId)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                >
                  {SIMPHONICS_STRANDS.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.shortName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Duration</label>
                <select
                  value={actDuration}
                  onChange={(e) => setActDuration(Number(e.target.value))}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
                >
                  <option value={5}>5 minutes</option>
                  <option value={10}>10 minutes</option>
                  <option value={15}>15 minutes</option>
                  <option value={20}>20 minutes</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Learning Intention (Outcome) *
              </label>
              <textarea
                rows={2}
                required
                placeholder="What observable skill the child will demonstrate"
                value={actIntention}
                onChange={(e) => setActIntention(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Correspondences (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="s, a, t, p"
                  value={actCorrespondences}
                  onChange={(e) => setActCorrespondences(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Book Reference</label>
                <input
                  type="text"
                  placeholder="Simphonics Book 1, p. 32"
                  value={actBookRef}
                  onChange={(e) => setActBookRef(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Teacher Model (Script)
              </label>
              <textarea
                rows={2}
                placeholder="What the teacher says and demonstrates"
                value={actModel}
                onChange={(e) => setActModel(e.target.value)}
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('general')}
                className="px-3.5 py-1.5 font-medium text-slate-600 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Add to Library
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: BACKUP & RESET */}
        {activeTab === 'backup' && (
          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <h4 className="font-bold text-slate-900 text-sm">Export & Import Application Data</h4>
              <p className="text-slate-600">
                Save an offline JSON snapshot of all classes, learners, and recorded observations, or restore from a previously exported file.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={handleExportBackup}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                >
                  <Download className="w-4 h-4 text-slate-600" />
                  <span>Export JSON Backup</span>
                </button>

                <label className="inline-flex items-center gap-1.5 px-3.5 py-2 font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer">
                  <Upload className="w-4 h-4 text-slate-600" />
                  <span>Restore from JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportBackup}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 space-y-2">
              <h4 className="font-bold text-rose-900 text-sm">Reset Demo Dataset</h4>
              <p className="text-rose-700">
                Resets the application back to the initial Prolangue Simphonics Reception A dataset. All custom changes will be replaced.
              </p>
              <button
                type="button"
                onClick={() => {
                  if (confirm('Reset all classes, learners, and plans back to the default demo data?')) {
                    resetAllData();
                    onClose();
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset to Default Data</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
