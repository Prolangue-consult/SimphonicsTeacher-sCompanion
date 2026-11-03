import React, { useState } from 'react';
import { X, Users, Check, Trash2, Edit2, Plus, Sparkles, CheckCheck } from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { TeachingGroup, ObservationStatus } from '../types/simphonics';
import { SIMPHONICS_SKILLS } from '../data/simphonicsData';

interface GroupModalProps {
  initialGroupId?: string;
  onClose: () => void;
  onStartTeachingGroup?: (group: TeachingGroup) => void;
}

export const GroupModal: React.FC<GroupModalProps> = ({
  initialGroupId,
  onClose,
  onStartTeachingGroup,
}) => {
  const {
    classGroups,
    classLearners,
    selectedClassId,
    addGroup,
    updateGroup,
    deleteGroup,
    recordObservation,
  } = useSimphonics();

  const [activeGroupId, setActiveGroupId] = useState<string>(
    initialGroupId || classGroups[0]?.id || 'new'
  );

  const [activeSubTab, setActiveSubTab] = useState<'details' | 'quick_record'>('details');

  // Form states for new or edited group
  const activeGroup = classGroups.find((g) => g.id === activeGroupId);
  const [groupName, setGroupName] = useState(activeGroup?.name || 'Oral Blending Practice');
  const [teachingFocus, setTeachingFocus] = useState(
    activeGroup?.teachingFocus || 'Consolidating blending with previously taught sounds (/s/, /a/, /t/, /p/)'
  );
  const [selectedLearnerIds, setSelectedLearnerIds] = useState<string[]>(
    activeGroup?.learnerIds || []
  );

  // Group quick recorder state
  const [targetSkillId, setTargetSkillId] = useState<string>('pm_1');
  const [learnerStatuses, setLearnerStatuses] = useState<{ [learnerId: string]: ObservationStatus }>(
    {}
  );
  const [bulkRecordedSuccess, setBulkRecordedSuccess] = useState(false);

  const handleSaveGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    if (activeGroup) {
      updateGroup(activeGroup.id, {
        name: groupName.trim(),
        teachingFocus: teachingFocus.trim(),
        learnerIds: selectedLearnerIds,
      });
    } else {
      const created = addGroup({
        classId: selectedClassId,
        name: groupName.trim(),
        teachingFocus: teachingFocus.trim(),
        learnerIds: selectedLearnerIds,
      });
      setActiveGroupId(created.id);
    }
  };

  const handleToggleLearner = (learnerId: string) => {
    setSelectedLearnerIds((prev) =>
      prev.includes(learnerId) ? prev.filter((id) => id !== learnerId) : [...prev, learnerId]
    );
  };

  const handleRecordAllGroup = () => {
    if (!activeGroup) return;
    const skill = SIMPHONICS_SKILLS.find((s) => s.id === targetSkillId);
    if (!skill) return;

    activeGroup.learnerIds.forEach((lId) => {
      const status = learnerStatuses[lId] || 'developing';
      recordObservation(lId, skill.id, status, `Group session: ${activeGroup.name}`);
    });

    setBulkRecordedSuccess(true);
    setTimeout(() => setBulkRecordedSuccess(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-700" />
            <h3 className="text-base sm:text-lg font-bold text-slate-900">
              Flexible Small-Group Teaching
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Group Selector Pill bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          {classGroups.map((g) => (
            <button
              key={g.id}
              onClick={() => {
                setActiveGroupId(g.id);
                setGroupName(g.name);
                setTeachingFocus(g.teachingFocus);
                setSelectedLearnerIds(g.learnerIds);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                activeGroupId === g.id
                  ? 'bg-teal-700 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {g.name} ({g.learnerIds.length})
            </button>
          ))}

          <button
            onClick={() => {
              setActiveGroupId('new');
              setGroupName('');
              setTeachingFocus('');
              setSelectedLearnerIds([]);
            }}
            className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap border border-dashed transition-colors cursor-pointer shrink-0 ${
              activeGroupId === 'new'
                ? 'border-teal-700 text-teal-800 bg-teal-50'
                : 'border-slate-300 text-slate-600 hover:bg-slate-50'
            }`}
          >
            + Create New Group
          </button>
        </div>

        {/* Sub-tabs: Edit Details vs Compact Group Recorder */}
        {activeGroup && (
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2 text-xs">
            <button
              onClick={() => setActiveSubTab('details')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'details'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Group Details & Roster
            </button>
            <button
              onClick={() => setActiveSubTab('quick_record')}
              className={`px-3 py-1.5 font-semibold rounded-md transition-colors cursor-pointer ${
                activeSubTab === 'quick_record'
                  ? 'bg-teal-50 text-teal-800 font-bold'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Compact Post-Activity Recorder
            </button>
          </div>
        )}

        {/* VIEW 1: GROUP DETAILS & ROSTER */}
        {activeSubTab === 'details' && (
          <form onSubmit={handleSaveGroup} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Group Name (Must describe teaching focus, e.g. "Oral Blending Practice")
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Oral Blending Practice or Set 1 Consolidating Group"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Specific Teaching Focus
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Practising oral blending with s, a, t, p with minimal pauses"
                value={teachingFocus}
                onChange={(e) => setTeachingFocus(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
              />
            </div>

            {/* Select Learners in this Group */}
            <div>
              <label className="block font-semibold text-slate-700 mb-2">
                Select Group Members ({selectedLearnerIds.length} of {classLearners.length} selected)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                {classLearners.map((learner) => {
                  const isChecked = selectedLearnerIds.includes(learner.id);
                  return (
                    <button
                      key={learner.id}
                      type="button"
                      onClick={() => handleToggleLearner(learner.id)}
                      className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer flex items-center justify-between ${
                        isChecked
                          ? 'bg-teal-50 border-teal-600 text-teal-900 font-semibold'
                          : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="truncate">
                        <p className="truncate text-xs">{learner.name}</p>
                        <p className="text-[10px] text-slate-500">{learner.ageBand}</p>
                      </div>
                      {isChecked && <Check className="w-3.5 h-3.5 text-teal-700 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {activeGroup ? (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('Delete this small group?')) {
                      deleteGroup(activeGroup.id);
                      onClose();
                    }
                  }}
                  className="text-xs text-rose-600 hover:text-rose-800 font-medium cursor-pointer"
                >
                  Delete Group
                </button>
              ) : (
                <span />
              )}

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Save Group
                </button>
              </div>
            </div>
          </form>
        )}

        {/* VIEW 2: COMPACT POST-ACTIVITY RECORDER */}
        {activeSubTab === 'quick_record' && activeGroup && (
          <div className="space-y-4 text-xs">
            <div className="p-3 rounded-lg bg-teal-50 border border-teal-200">
              <span className="font-bold text-teal-900 block text-xs">
                Compact Post-Activity Observation Sheet
              </span>
              <p className="text-slate-700 mt-0.5">
                Record evidence for all group members together in seconds without visiting separate profiles.
              </p>
            </div>

            {/* Target Skill selector */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Target Skill Assessed</label>
              <select
                value={targetSkillId}
                onChange={(e) => setTargetSkillId(e.target.value)}
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none"
              >
                {SIMPHONICS_SKILLS.map((sk) => (
                  <option key={sk.id} value={sk.id}>
                    {sk.code}: {sk.name} ({sk.level})
                  </option>
                ))}
              </select>
            </div>

            {/* Compact Learner Row Table */}
            <div className="divide-y divide-slate-100 max-h-64 overflow-y-auto pr-1">
              {classLearners
                .filter((l) => activeGroup.learnerIds.includes(l.id))
                .map((learner) => {
                  const currentStatus =
                    learnerStatuses[learner.id] ||
                    learner.observations[targetSkillId]?.status ||
                    'developing';

                  return (
                    <div
                      key={learner.id}
                      className="py-2.5 flex items-center justify-between gap-3"
                    >
                      <span className="font-bold text-slate-900 text-xs w-28 truncate">
                        {learner.name}
                      </span>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setLearnerStatuses({ ...learnerStatuses, [learner.id]: 'needs_support' })
                          }
                          className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                            currentStatus === 'needs_support'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                              : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          Needs support
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setLearnerStatuses({ ...learnerStatuses, [learner.id]: 'developing' })
                          }
                          className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                            currentStatus === 'developing'
                              ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                              : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'
                          }`}
                        >
                          Developing
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setLearnerStatuses({ ...learnerStatuses, [learner.id]: 'independent' })
                          }
                          className={`px-2 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                            currentStatus === 'independent'
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                              : 'bg-white text-emerald-700 border-emerald-200 hover:bg-emerald-50'
                          }`}
                        >
                          Independent
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {bulkRecordedSuccess && (
                <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                  <Check className="w-4 h-4 text-emerald-600" />
                  Observations saved to all learner profiles!
                </span>
              )}
              {!bulkRecordedSuccess && <span />}

              <button
                type="button"
                onClick={handleRecordAllGroup}
                className="px-5 py-2 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Record Group Observations
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
