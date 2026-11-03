import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  HelpCircle,
  Edit2,
  Trash2,
  FileText,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Check,
  X,
  Plus,
  Upload,
  Info
} from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { Learner, ObservationStatus, StrandId } from '../types/simphonics';
import { SIMPHONICS_STRANDS, SIMPHONICS_SKILLS } from '../data/simphonicsData';

interface LearnersTabProps {
  onOpenParentSummary?: (learner: Learner) => void;
}

export const LearnersTab: React.FC<LearnersTabProps> = ({ onOpenParentSummary }) => {
  const {
    classLearners,
    selectedClass,
    selectedClassId,
    classGroups,
    addLearner,
    updateLearner,
    deleteLearner,
    importLearners,
    recordObservation,
  } = useSimphonics();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGroupId, setSelectedGroupId] = useState<string>('all');
  const [selectedLearnerId, setSelectedLearnerId] = useState<string | null>(classLearners[0]?.id || null);

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [activeObservationStrand, setActiveObservationStrand] = useState<StrandId>('phonemic_awareness');

  // Form state for single learner
  const [newLearnerName, setNewLearnerName] = useState('');
  const [newAgeBand, setNewAgeBand] = useState<Learner['ageBand']>('4–5 years');
  const [newLanguage, setNewLanguage] = useState('English (Home language)');
  const [newGroup, setNewGroup] = useState('');
  const [newFocus, setNewFocus] = useState('Set 1 sounds and oral blending');

  // Bulk import state
  const [importNamesText, setImportNamesText] = useState('');
  const [importAgeBand, setImportAgeBand] = useState<Learner['ageBand']>('4–5 years');

  // Inline note editing state
  const [activeSkillNote, setActiveSkillNote] = useState<{ [skillId: string]: string }>({});

  const selectedLearner = classLearners.find((l) => l.id === selectedLearnerId) || classLearners[0];

  const filteredLearners = classLearners.filter((learner) => {
    const matchesSearch = learner.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGroup = selectedGroupId === 'all' || learner.groupId === selectedGroupId;
    return matchesSearch && matchesGroup;
  });

  const handleAddLearnerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLearnerName.trim()) return;

    const added = addLearner({
      name: newLearnerName.trim(),
      classId: selectedClassId,
      ageBand: newAgeBand,
      languageBackground: newLanguage.trim() || 'English (Home language)',
      groupId: newGroup || undefined,
      currentFocus: newFocus.trim() || 'Set 1 sounds and oral blending',
    });

    setNewLearnerName('');
    setIsAddModalOpen(false);
    setSelectedLearnerId(added.id);
  };

  const handleBulkImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const names = importNamesText
      .split('\n')
      .map((n) => n.trim())
      .filter((n) => n.length > 0);
    if (names.length === 0) return;

    importLearners(names, selectedClassId, importAgeBand);
    setImportNamesText('');
    setIsImportModalOpen(false);
  };

  const getObservationCounts = (learner: Learner) => {
    const obs = Object.values(learner.observations);
    return {
      independent: obs.filter((o) => o.status === 'independent').length,
      developing: obs.filter((o) => o.status === 'developing').length,
      needs_support: obs.filter((o) => o.status === 'needs_support').length,
      total: obs.length,
    };
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Controls: Search, Group Filter, Add Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Learner Profiles & Starting Observations
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Class: <span className="font-semibold text-slate-700">{selectedClass?.name}</span> ·{' '}
            {classLearners.length} active learners
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add learner</span>
          </button>

          <button
            onClick={() => setIsImportModalOpen(true)}
            className="inline-flex items-center gap-2 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
          >
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Class import</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Learner Directory (4 cols) */}
        <div className="lg:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
          {/* Search and Group Filter */}
          <div className="space-y-2">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search learner by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            <div className="flex items-center gap-2">
              <label className="text-[11px] font-medium text-slate-500 shrink-0">Group:</label>
              <select
                value={selectedGroupId}
                onChange={(e) => setSelectedGroupId(e.target.value)}
                className="w-full py-1 px-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                <option value="all">All Groups ({classLearners.length})</option>
                {classGroups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Learner Item List */}
          <div className="divide-y divide-slate-100 max-h-[620px] overflow-y-auto pr-1">
            {filteredLearners.map((learner) => {
              const isSelected = learner.id === selectedLearner?.id;
              const counts = getObservationCounts(learner);
              const group = classGroups.find((g) => g.id === learner.groupId);

              return (
                <div
                  key={learner.id}
                  onClick={() => setSelectedLearnerId(learner.id)}
                  className={`p-3 rounded-lg transition-colors cursor-pointer flex items-center justify-between gap-2 my-1 ${
                    isSelected
                      ? 'bg-teal-50/80 border border-teal-200'
                      : 'hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {learner.name}
                      </span>
                      <span className="text-[11px] text-slate-500">· {learner.ageBand}</span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      Focus: <span className="text-slate-700 font-medium">{learner.currentFocus}</span>
                    </p>

                    {group && (
                      <span className="inline-block mt-1 text-[10px] text-teal-800 bg-teal-100/70 px-1.5 py-0.5 rounded">
                        {group.name}
                      </span>
                    )}
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end">
                    <div className="flex items-center gap-1 text-[10px] font-semibold">
                      <span className="text-emerald-700" title="Independent">
                        {counts.independent}✓
                      </span>
                      <span className="text-sky-700" title="Developing">
                        {counts.developing}↑
                      </span>
                      <span className="text-amber-700" title="Needs Support">
                        {counts.needs_support}!
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 mt-1">
                      {counts.total} observed
                    </span>
                  </div>
                </div>
              );
            })}

            {filteredLearners.length === 0 && (
              <p className="text-xs text-slate-500 py-6 text-center">No matching learners found.</p>
            )}
          </div>
        </div>

        {/* Right Column: Detailed Learner Profile & Starting Observations (8 cols) */}
        {selectedLearner ? (
          <div className="lg:col-span-8 space-y-6">
            {/* Learner Profile Header */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div>
                  <div className="flex items-baseline gap-3">
                    <h3 className="text-2xl font-bold text-slate-900">{selectedLearner.name}</h3>
                    <span className="text-xs text-slate-500">{selectedLearner.ageBand}</span>
                    <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {selectedLearner.languageBackground}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 mt-1">
                    Group:{' '}
                    <span className="font-medium text-slate-800">
                      {classGroups.find((g) => g.id === selectedLearner.groupId)?.name || 'Not assigned'}
                    </span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {onOpenParentSummary && (
                    <button
                      onClick={() => onOpenParentSummary(selectedLearner)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Parent Summary</span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (confirm(`Remove ${selectedLearner.name} from class list?`)) {
                        deleteLearner(selectedLearner.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Remove learner"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Recommendation Banner with Explanation & Accept/Change/Postpone */}
              <div className="mt-4 p-4 rounded-lg bg-teal-50/60 border border-teal-200/80">
                <div className="flex items-start gap-3">
                  <Info className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                        Current Teaching Focus
                      </h4>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            const newFocusVal = prompt('Change teaching focus for ' + selectedLearner.name, selectedLearner.currentFocus);
                            if (newFocusVal) {
                              updateLearner(selectedLearner.id, { currentFocus: newFocusVal });
                            }
                          }}
                          className="text-[11px] font-semibold text-teal-800 hover:text-teal-950 underline cursor-pointer"
                        >
                          Change focus
                        </button>
                        <span aria-hidden="true" className="text-teal-300">·</span>
                        <button
                          onClick={() => {
                            updateLearner(selectedLearner.id, {
                              focusRationale: 'Postponed for consolidation of earlier prerequisite routines.'
                            });
                          }}
                          className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
                        >
                          Postpone
                        </button>
                      </div>
                    </div>

                    <p className="text-sm font-semibold text-slate-900 mt-1">
                      {selectedLearner.currentFocus}
                    </p>

                    <p className="text-xs text-slate-600 mt-1 italic">
                      “{selectedLearner.focusRationale ||
                        `Recommended based on recent starting observations across phonemic awareness and sound correspondences.`}”
                    </p>
                  </div>
                </div>
              </div>

              {/* State Guide legend */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-4 text-[11px] text-slate-500">
                <span className="font-semibold text-slate-700">Observation States:</span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-slate-200 border border-slate-300"></span>
                  Not yet observed (neutral)
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                  Needs support
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
                  Developing
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  Independent
                </span>
              </div>
            </div>

            {/* Starting Observation Checklist Organized by Strand */}
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h4 className="text-base font-bold text-slate-900">
                    Starting Observation Checklist
                  </h4>
                  <p className="text-xs text-slate-500">
                    Complete across short sessions. Tap any state to record instant evidence.
                  </p>
                </div>
              </div>

              {/* Strand Selector Tabs */}
              <div className="flex gap-1 overflow-x-auto pb-2 border-b border-slate-200">
                {SIMPHONICS_STRANDS.map((strand) => {
                  const isActive = activeObservationStrand === strand.id;
                  const strandSkills = SIMPHONICS_SKILLS.filter((s) => s.strandId === strand.id);
                  const observedCount = strandSkills.filter(
                    (s) => selectedLearner.observations[s.id]
                  ).length;

                  return (
                    <button
                      key={strand.id}
                      onClick={() => setActiveObservationStrand(strand.id)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-teal-700 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {strand.shortName}{' '}
                      <span className={`ml-1 text-[10px] ${isActive ? 'text-teal-200' : 'text-slate-400'}`}>
                        ({observedCount}/{strandSkills.length})
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Skills for Active Strand */}
              <div className="space-y-4">
                {SIMPHONICS_SKILLS.filter((s) => s.strandId === activeObservationStrand).map(
                  (skill) => {
                    const currentObs = selectedLearner.observations[skill.id];
                    const currentStatus: ObservationStatus = currentObs?.status || 'not_observed';
                    const noteDraft = activeSkillNote[skill.id] ?? (currentObs?.note || '');

                    return (
                      <div
                        key={skill.id}
                        className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] font-bold tracking-wider text-slate-600 uppercase bg-slate-200 px-1.5 py-0.5 rounded">
                                {skill.code}
                              </span>
                              <h5 className="text-sm font-bold text-slate-900">{skill.name}</h5>
                            </div>
                            <p className="text-xs text-slate-600 mt-1">{skill.description}</p>
                          </div>

                          {currentObs && (
                            <span className="text-[10px] text-slate-600 shrink-0">
                              Observed {currentObs.date}
                            </span>
                          )}
                        </div>

                        {/* Checklist Prompts: Instruction, Prompt/Material, Look For */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs bg-white p-3 rounded-lg border border-slate-200">
                          <div>
                            <span className="font-semibold text-slate-700 block text-[11px]">
                              1. Teacher Instruction
                            </span>
                            <p className="text-slate-600 mt-0.5">{skill.teacherInstruction}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 block text-[11px]">
                              2. Prompt or Material
                            </span>
                            <p className="text-slate-600 mt-0.5">{skill.promptOrMaterial}</p>
                          </div>
                          <div>
                            <span className="font-semibold text-slate-700 block text-[11px]">
                              3. What to Look For
                            </span>
                            <p className="text-slate-600 mt-0.5">{skill.lookFor}</p>
                          </div>
                        </div>

                        {/* One-Tap Observation Choices (4 states) */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-semibold text-slate-700 mr-2">
                              Record observation:
                            </span>

                            <button
                              onClick={() => {
                                recordObservation(
                                  selectedLearner.id,
                                  skill.id,
                                  'not_observed',
                                  noteDraft
                                );
                              }}
                              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                                currentStatus === 'not_observed'
                                  ? 'bg-slate-200 text-slate-800 border-slate-300 font-bold'
                                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                              }`}
                            >
                              Not yet observed
                            </button>

                            <button
                              onClick={() => {
                                recordObservation(
                                  selectedLearner.id,
                                  skill.id,
                                  'needs_support',
                                  noteDraft
                                );
                              }}
                              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                                currentStatus === 'needs_support'
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                                  : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                              }`}
                            >
                              Needs support
                            </button>

                            <button
                              onClick={() => {
                                recordObservation(
                                  selectedLearner.id,
                                  skill.id,
                                  'developing',
                                  noteDraft
                                );
                              }}
                              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                                currentStatus === 'developing'
                                  ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                                  : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'
                              }`}
                            >
                              Developing
                            </button>

                            <button
                              onClick={() => {
                                recordObservation(
                                  selectedLearner.id,
                                  skill.id,
                                  'independent',
                                  noteDraft
                                );
                              }}
                              className={`px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                                currentStatus === 'independent'
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                                  : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                              }`}
                            >
                              Independent
                            </button>
                          </div>

                          {/* Quick Note input */}
                          <div className="w-full sm:w-64">
                            <input
                              type="text"
                              placeholder="Optional observation note..."
                              value={noteDraft}
                              onChange={(e) => {
                                setActiveSkillNote({
                                  ...activeSkillNote,
                                  [skill.id]: e.target.value,
                                });
                              }}
                              onBlur={() => {
                                if (currentObs) {
                                  recordObservation(
                                    selectedLearner.id,
                                    skill.id,
                                    currentStatus,
                                    noteDraft
                                  );
                                }
                              }}
                              className="w-full px-2.5 py-1 text-xs bg-white border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
                            />
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="lg:col-span-8 bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            Select a learner from the directory to review observations.
          </div>
        )}
      </div>

      {/* Modal 1: Add Learner */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Add New Learner</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddLearnerSubmit} className="space-y-4 mt-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  First Name or Identifier *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Amina or Learner 04"
                  value={newLearnerName}
                  onChange={(e) => setNewLearnerName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Age Band</label>
                  <select
                    value={newAgeBand}
                    onChange={(e) => setNewAgeBand(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="2–3 years">2–3 years</option>
                    <option value="3–4 years">3–4 years</option>
                    <option value="4–5 years">4–5 years</option>
                    <option value="5–6 years">5–6 years</option>
                    <option value="6+ Foundational">6+ Foundational</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teaching Group</label>
                  <select
                    value={newGroup}
                    onChange={(e) => setNewGroup(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    <option value="">None (Whole class)</option>
                    {classGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Relevant Language Background
                </label>
                <input
                  type="text"
                  placeholder="e.g. English, EAL / Bilingual (English & Urdu)"
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Initial Teaching Focus
                </label>
                <input
                  type="text"
                  value={newFocus}
                  onChange={(e) => setNewFocus(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Save Learner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal 2: Bulk Class Import */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-lg w-full p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Simple Class Import</h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleBulkImportSubmit} className="space-y-4 mt-4 text-xs">
              <p className="text-slate-600">
                Paste or type learner first names into the box below (one per line). Profiles will be created instantly in{' '}
                <span className="font-semibold text-slate-800">{selectedClass?.name}</span> with starting observation checklists ready to complete.
              </p>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Default Age Band for this Roster
                </label>
                <select
                  value={importAgeBand}
                  onChange={(e) => setImportAgeBand(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600"
                >
                  <option value="2–3 years">2–3 years</option>
                  <option value="3–4 years">3–4 years</option>
                  <option value="4–5 years">4–5 years</option>
                  <option value="5–6 years">5–6 years</option>
                  <option value="6+ Foundational">6+ Foundational</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Learner Names (one per line)
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Lucas&#10;Zainab&#10;Oliver&#10;Fatima&#10;Noah"
                  value={importNamesText}
                  onChange={(e) => setImportNamesText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white font-mono text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3.5 py-2 text-slate-600 hover:text-slate-800 font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Import Learners
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
