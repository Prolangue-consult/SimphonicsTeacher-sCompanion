import React, { useState } from 'react';
import {
  Play,
  Clock,
  Sparkles,
  Copy,
  Trash2,
  Edit3,
  Plus,
  BookOpen,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Layers,
  Wand2,
  RefreshCw
} from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { StrandId, LessonPlan, Activity } from '../types/simphonics';
import { SIMPHONICS_STRANDS, SIMPHONICS_SKILLS } from '../data/simphonicsData';

interface TeachTabProps {
  onOpenPrintable?: (printable: any) => void;
}

export const TeachTab: React.FC<TeachTabProps> = ({ onOpenPrintable }) => {
  const {
    selectedClass,
    selectedClassId,
    classGroups,
    activities,
    savedPlans,
    savePlan,
    updatePlan,
    duplicatePlan,
    deletePlan,
    startTeachingLesson,
  } = useSimphonics();

  // Planner Wizard Selection State
  const [plannerOpen, setPlannerOpen] = useState(false);
  const [targetType, setTargetType] = useState<'class' | 'group'>('class');
  const [targetGroupId, setTargetGroupId] = useState<string>(classGroups[0]?.id || '');
  const [selectedStrand, setSelectedStrand] = useState<StrandId>('phonemic_awareness');
  const [selectedDuration, setSelectedDuration] = useState<number>(10);
  const [selectedActivityId, setSelectedActivityId] = useState<string>('');

  // Editing Plan state
  const [editingPlan, setEditingPlan] = useState<LessonPlan | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiMessage, setAiMessage] = useState<string | null>(null);

  // Available activities filtered by selected strand
  const matchingActivities = activities.filter((a) => a.strandId === selectedStrand);

  const handleAssemblePlan = () => {
    const act =
      activities.find((a) => a.id === selectedActivityId) ||
      matchingActivities[0] ||
      activities[0];

    const targetName =
      targetType === 'group'
        ? classGroups.find((g) => g.id === targetGroupId)?.name || 'Focus Group'
        : selectedClass?.name || 'Reception A';

    const newDraft: LessonPlan = {
      id: `draft_${Date.now()}`,
      title: `${act.title} · ${targetName}`,
      targetType,
      targetId: targetType === 'group' ? targetGroupId : selectedClassId,
      strandId: act.strandId,
      durationMinutes: selectedDuration,
      activityId: act.id,
      learningIntention: act.learningIntention,
      prerequisites: act.prerequisites,
      preparation: act.preparation,
      bookReference: act.bookReference,
      model: act.model,
      guidedPractice: act.guidedPractice,
      independentAttempt: act.independentAttempt,
      check: act.check,
      adaptation: act.adaptation,
      status: 'draft',
      lastUpdated: new Date().toISOString(),
    };

    setEditingPlan(newDraft);
  };

  const handleSaveAndStart = () => {
    if (!editingPlan) return;
    const saved = savePlan(editingPlan);
    setEditingPlan(null);
    setPlannerOpen(false);
    startTeachingLesson(saved);
  };

  const handleSaveOnly = () => {
    if (!editingPlan) return;
    savePlan(editingPlan);
    setEditingPlan(null);
    setPlannerOpen(false);
  };

  // AI Helper: Suggest Adaptation
  const handleAiSuggestAdaptation = async () => {
    if (!editingPlan) return;
    setAiLoading(true);
    setAiMessage(null);
    try {
      const res = await fetch('/api/ai/suggest-adaptation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityTitle: editingPlan.title,
          strand: editingPlan.strandId,
          learnerNeed: 'Practical multi-sensory support for 3-5 year old beginners',
        }),
      });
      const data = await res.json();
      if (data.extraSupport && data.extension) {
        setEditingPlan({
          ...editingPlan,
          adaptation: {
            extraSupport: data.extraSupport,
            extension: data.extension,
          },
        });
        setAiMessage(
          data.aiGenerated
            ? 'Adaptations refined with Simphonics early years guidelines.'
            : 'Default evidence-backed adaptations applied.'
        );
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header and Quick Planner Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Speed Lesson Planner & Teaching Hub
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Assemble, adapt, and deliver structured 5–20 minute foundational literacy lessons.
          </p>
        </div>

        {!plannerOpen && !editingPlan && (
          <button
            onClick={() => {
              setPlannerOpen(true);
              setSelectedActivityId(matchingActivities[0]?.id || '');
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Assemble new plan</span>
          </button>
        )}
      </div>

      {/* PLANNER WIZARD: Class/Group -> Skill -> Time -> Materials */}
      {plannerOpen && !editingPlan && (
        <div className="bg-white rounded-xl border-2 border-teal-600/60 p-6 shadow-md space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Speed Planner: 4 Quick Steps
              </h3>
              <p className="text-xs text-slate-500">
                Target → Skill Strand → Available Time → Approved Activity
              </p>
            </div>
            <button
              onClick={() => setPlannerOpen(false)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-700 cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Step 1: Target (Class or Group) */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">1. Target Learners</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTargetType('class')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    targetType === 'class'
                      ? 'bg-teal-50 border-teal-600 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Whole Class ({selectedClass?.name})
                </button>

                <button
                  type="button"
                  onClick={() => setTargetType('group')}
                  className={`flex-1 py-2 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-colors ${
                    targetType === 'group'
                      ? 'bg-teal-50 border-teal-600 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Small Group
                </button>
              </div>

              {targetType === 'group' && (
                <div className="pt-2">
                  <select
                    value={targetGroupId}
                    onChange={(e) => setTargetGroupId(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-teal-600"
                  >
                    {classGroups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name} ({g.learnerIds.length} learners)
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Step 2: Time Duration */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-700">2. Available Lesson Time</label>
              <div className="grid grid-cols-4 gap-2">
                {[5, 10, 15, 20].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setSelectedDuration(mins)}
                    className={`py-2 text-center rounded-lg border text-xs font-bold cursor-pointer transition-colors ${
                      selectedDuration === mins
                        ? 'bg-teal-700 text-white border-teal-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {mins} min
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Skill Strand */}
            <div className="space-y-2 md:col-span-2">
              <label className="block font-bold text-slate-700">3. Learning Strand Focus</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {SIMPHONICS_STRANDS.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      setSelectedStrand(st.id);
                      const acts = activities.filter((a) => a.strandId === st.id);
                      setSelectedActivityId(acts[0]?.id || '');
                    }}
                    className={`p-2.5 rounded-lg border text-left transition-colors cursor-pointer ${
                      selectedStrand === st.id
                        ? 'bg-teal-50 border-teal-600 text-teal-900 font-bold'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <p className="text-xs font-semibold leading-tight">{st.shortName}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 4: Approved Activity Selection */}
            <div className="space-y-2 md:col-span-2">
              <label className="block font-bold text-slate-700">
                4. Select Approved Activity from Library
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {matchingActivities.map((act) => (
                  <div
                    key={act.id}
                    onClick={() => setSelectedActivityId(act.id)}
                    className={`p-3 rounded-lg border transition-colors cursor-pointer flex flex-col justify-between ${
                      selectedActivityId === act.id
                        ? 'bg-teal-50/90 border-teal-600 ring-1 ring-teal-600'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-bold text-slate-900 text-xs">{act.title}</span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {act.durationMinutes}m
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-1 line-clamp-2">
                        {act.learningIntention}
                      </p>
                    </div>

                    {act.bookReference && (
                      <p className="text-[10px] text-teal-800 font-semibold mt-2">
                        {act.bookReference}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              onClick={() => setPlannerOpen(false)}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleAssemblePlan}
              className="px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              Assemble Editable Plan →
            </button>
          </div>
        </div>
      )}

      {/* EDITABLE PLAN PREVIEW CARD */}
      {editingPlan && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-md space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                Editable Lesson Plan
              </span>
              <input
                type="text"
                value={editingPlan.title}
                onChange={(e) => setEditingPlan({ ...editingPlan, title: e.target.value })}
                className="block text-xl font-bold text-slate-900 mt-1 w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 focus:bg-white"
              />
              <p className="text-xs text-slate-500 mt-1">
                Duration: {editingPlan.durationMinutes} min · Strand: {editingPlan.strandId}
                {editingPlan.bookReference && ` · ${editingPlan.bookReference}`}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleAiSuggestAdaptation}
                disabled={aiLoading}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                title="Refine support & extension using early years principles"
              >
                {aiLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Wand2 className="w-3.5 h-3.5 text-teal-700" />
                )}
                <span>Suggest Adaptation</span>
              </button>
            </div>
          </div>

          {aiMessage && (
            <div className="p-3 bg-teal-50 border border-teal-200 rounded-lg text-xs text-teal-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-teal-700 shrink-0" />
              <span>{aiMessage}</span>
            </div>
          )}

          {/* Structured Plan Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {/* Learning Intention */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                Learning Intention (One observable outcome)
              </label>
              <textarea
                rows={2}
                value={editingPlan.learningIntention}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, learningIntention: e.target.value })
                }
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600 font-medium"
              />
            </div>

            {/* Preparation & Materials */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                Preparation & Book Reference
              </label>
              <textarea
                rows={2}
                value={editingPlan.preparation}
                onChange={(e) => setEditingPlan({ ...editingPlan, preparation: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            {/* Prerequisites */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                Prerequisites (Skills already needed)
              </label>
              <input
                type="text"
                value={editingPlan.prerequisites.join(', ')}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    prerequisites: e.target.value.split(',').map((s) => s.trim()),
                  })
                }
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            {/* Model */}
            <div className="p-4 bg-teal-50/50 rounded-xl border border-teal-200 space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider text-teal-900 text-[11px] block">
                Model (What the teacher says & demonstrates)
              </label>
              <textarea
                rows={3}
                value={editingPlan.model}
                onChange={(e) => setEditingPlan({ ...editingPlan, model: e.target.value })}
                className="w-full p-2 bg-white border border-teal-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            {/* Guided Practice */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                Guided Practice (Supported participation)
              </label>
              <textarea
                rows={3}
                value={editingPlan.guidedPractice}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, guidedPractice: e.target.value })
                }
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            {/* Independent Attempt */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
              <label className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                Independent Attempt (Brief demonstration)
              </label>
              <textarea
                rows={3}
                value={editingPlan.independentAttempt}
                onChange={(e) =>
                  setEditingPlan({ ...editingPlan, independentAttempt: e.target.value })
                }
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            {/* Check */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1 md:col-span-2">
              <label className="font-bold uppercase tracking-wider text-slate-700 text-[11px] block">
                Check (What evidence to record)
              </label>
              <input
                type="text"
                value={editingPlan.check}
                onChange={(e) => setEditingPlan({ ...editingPlan, check: e.target.value })}
                className="w-full p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            {/* Adaptations */}
            <div className="p-4 bg-amber-50/60 rounded-xl border border-amber-200 space-y-1">
              <label className="font-bold uppercase tracking-wider text-amber-900 text-[11px] block">
                Adaptation: Extra Support (Scaffolding)
              </label>
              <textarea
                rows={2}
                value={editingPlan.adaptation.extraSupport}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    adaptation: { ...editingPlan.adaptation, extraSupport: e.target.value },
                  })
                }
                className="w-full p-2 bg-white border border-amber-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>

            <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-1">
              <label className="font-bold uppercase tracking-wider text-teal-900 text-[11px] block">
                Adaptation: Extension (Challenge)
              </label>
              <textarea
                rows={2}
                value={editingPlan.adaptation.extension}
                onChange={(e) =>
                  setEditingPlan({
                    ...editingPlan,
                    adaptation: { ...editingPlan.adaptation, extension: e.target.value },
                  })
                }
                className="w-full p-2 bg-white border border-teal-200 rounded-lg text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={() => setEditingPlan(null)}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 cursor-pointer"
            >
              Cancel Edit
            </button>

            <div className="flex items-center gap-3">
              <button
                onClick={handleSaveOnly}
                className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Save to Library
              </button>

              <button
                onClick={handleSaveAndStart}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Save & Start Teaching</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SAVED LESSON PLANS LIST */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            Saved Lesson Plans ({savedPlans.length})
          </h3>
          <span className="text-xs text-slate-500">Reusable and fully editable</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {savedPlans.map((plan) => {
            const strand = SIMPHONICS_STRANDS.find((s) => s.id === plan.strandId);
            return (
              <div
                key={plan.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {strand?.shortName || plan.strandId}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {plan.durationMinutes} min
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 mt-2 line-clamp-1">
                    {plan.title}
                  </h4>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                    {plan.learningIntention}
                  </p>

                  {plan.bookReference && (
                    <p className="text-[11px] text-slate-500 font-medium mt-2">
                      Book: {plan.bookReference}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => duplicatePlan(plan.id)}
                      className="p-1.5 text-slate-400 hover:text-slate-700 rounded transition-colors cursor-pointer"
                      title="Duplicate & adapt plan"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Delete this lesson plan?')) deletePlan(plan.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded transition-colors cursor-pointer"
                      title="Delete plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingPlan(plan)}
                      className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => startTeachingLesson(plan)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Teach</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
