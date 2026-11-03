import React, { useState } from 'react';
import {
  Play,
  Clock,
  Users,
  Eye,
  PlusCircle,
  BookOpen,
  ArrowRight,
  ChevronDown,
  Sparkles,
  CheckCircle,
  FileEdit,
  FolderOpen
} from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { ActiveTab } from './Header';
import { SIMPHONICS_STRANDS } from '../data/simphonicsData';

interface TodayTabProps {
  setActiveTab: (tab: ActiveTab) => void;
  onOpenQuickObserve: () => void;
  onOpenGroupModal: (groupId?: string) => void;
  onOpenLessonPlanner: () => void;
}

export const TodayTab: React.FC<TodayTabProps> = ({
  setActiveTab,
  onOpenQuickObserve,
  onOpenGroupModal,
  onOpenLessonPlanner,
}) => {
  const {
    teacherName,
    classes,
    selectedClassId,
    setSelectedClassId,
    selectedClass,
    classLearners,
    classGroups,
    activeLesson,
    savedPlans,
    startTeachingLesson,
    resumeTeachingLesson,
  } = useSimphonics();

  const [classDropdownOpen, setClassDropdownOpen] = useState(false);

  // Derive next lesson (either the active lesson or the latest saved plan)
  const nextLesson = activeLesson || savedPlans[0];

  // Derive recent progress updates from observations across learners
  const recentObservations = classLearners
    .flatMap((l) =>
      Object.values(l.observations).map((obs) => ({
        ...obs,
        learnerName: l.name,
        learnerId: l.id,
      }))
    )
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Banner: Greeting & Selected Class */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
            Good morning, {teacherName}
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Know what to teach next, access the right activity, and record progress in minutes.
          </p>
        </div>

        {/* Selected class dropdown */}
        <div className="relative inline-block text-left shrink-0">
          <label className="block text-xs font-medium text-slate-500 mb-1">Active Class</label>
          <button
            type="button"
            onClick={() => setClassDropdownOpen(!classDropdownOpen)}
            className="inline-flex items-center justify-between gap-2 px-3.5 py-2 text-sm font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg shadow-xs hover:bg-slate-50 transition-colors cursor-pointer min-w-[160px]"
          >
            <span>{selectedClass?.name || 'Reception A'}</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>

          {classDropdownOpen && (
            <div className="absolute right-0 mt-1 w-56 rounded-lg bg-white shadow-lg border border-slate-200 py-1 z-20">
              {classes.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedClassId(c.id);
                    setClassDropdownOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors cursor-pointer flex items-center justify-between ${
                    c.id === selectedClassId
                      ? 'bg-teal-50 text-teal-800 font-semibold'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{c.name}</span>
                  {c.id === selectedClassId && <CheckCircle className="w-4 h-4 text-teal-600" />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main Grid: Next Lesson & Continue Planning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Next Lesson */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Next lesson
              </span>
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {nextLesson?.durationMinutes || 10} min
              </span>
            </div>

            <h3 className="text-lg font-bold text-slate-900 leading-snug">
              {nextLesson?.title || 'Oral blending with previously taught sounds'}
            </h3>

            <p className="text-sm text-slate-600 mt-2 line-clamp-3">
              {nextLesson?.learningIntention ||
                'Blend spoken pure phonemes to identify objects in the mystery bag without visual cues.'}
            </p>

            <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
              <span className="font-medium text-slate-700">Focus:</span>
              <span>{nextLesson?.preparation || 'Mystery Pouch + household items'}</span>
              {nextLesson?.bookReference && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-600 font-medium">{nextLesson.bookReference}</span>
                </>
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-3">
            <button
              onClick={() => {
                if (nextLesson) {
                  startTeachingLesson(nextLesson);
                } else {
                  onOpenLessonPlanner();
                }
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <Play className="w-4 h-4 fill-white" />
              <span>Start teaching</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('teach');
              }}
              className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              Edit plan
            </button>
          </div>
        </div>

        {/* Card 2: Continue Planning / Saved Lessons */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                Continue planning
              </span>
              <button
                onClick={onOpenLessonPlanner}
                className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>New plan</span>
              </button>
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Lesson Plans for {selectedClass?.name}
            </h3>

            <p className="text-sm text-slate-600 mt-1">
              Assemble fast, structured 5–20 minute sessions mapped to verified Simphonics sequences.
            </p>

            <div className="mt-4 space-y-2">
              {savedPlans.slice(0, 3).map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => {
                    startTeachingLesson(plan);
                  }}
                  className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 hover:bg-teal-50/60 hover:border-teal-200 transition-colors cursor-pointer flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-slate-900 truncate">{plan.title}</p>
                    <p className="text-[11px] text-slate-500">
                      {plan.durationMinutes} min · {plan.status === 'in_progress' ? 'In progress' : 'Ready'}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">{savedPlans.length} plans available</span>
            <button
              onClick={() => setActiveTab('teach')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 cursor-pointer flex items-center gap-1"
            >
              <span>View all plans</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Row 2: Groups Needing Practice & Recent Progress */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Groups Needing Practice */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Groups needing practice</h3>
              <p className="text-xs text-slate-500 mt-0.5">Flexible small groups formed around specific skills</p>
            </div>
            <button
              onClick={() => onOpenGroupModal()}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Create group</span>
            </button>
          </div>

          <div className="space-y-3">
            {classGroups.map((grp) => {
              const count = grp.learnerIds.length;
              return (
                <div
                  key={grp.id}
                  onClick={() => onOpenGroupModal(grp.id)}
                  className="p-3.5 rounded-lg border border-slate-200 hover:border-teal-300 hover:bg-slate-50/80 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-semibold text-slate-900">{grp.name}</h4>
                    <span className="text-xs font-medium text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                      {count} {count === 1 ? 'learner' : 'learners'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">{grp.teachingFocus}</p>
                </div>
              );
            })}

            {classGroups.length === 0 && (
              <p className="text-xs text-slate-500 py-3 text-center">
                No active small groups yet. Form one for targeted blending or letter formation!
              </p>
            )}
          </div>
        </div>

        {/* Recent Progress */}
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
          <div className="flex items-center justify-between gap-2 mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">Recent progress</h3>
              <p className="text-xs text-slate-500 mt-0.5">Brief, descriptive teacher observation updates</p>
            </div>
            <button
              onClick={() => setActiveTab('reports')}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 transition-colors cursor-pointer"
            >
              Reports
            </button>
          </div>

          <div className="space-y-3">
            {recentObservations.map((obs, idx) => {
              const strand = SIMPHONICS_STRANDS.find((s) => s.id === obs.strandId);
              return (
                <div key={idx} className="flex items-start justify-between gap-3 text-xs border-b border-slate-100 pb-2.5 last:border-none">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-900">{obs.learnerName}</span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-slate-600 font-medium">{obs.skillName}</span>
                    </div>
                    {obs.note && <p className="text-slate-500 mt-0.5 italic">"{obs.note}"</p>}
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-block font-semibold px-2 py-0.5 rounded text-[11px] ${
                        obs.status === 'independent'
                          ? 'bg-emerald-50 text-emerald-800'
                          : obs.status === 'developing'
                          ? 'bg-sky-50 text-sky-800'
                          : obs.status === 'needs_support'
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {obs.status === 'needs_support'
                        ? 'Needs support'
                        : obs.status.charAt(0).toUpperCase() + obs.status.slice(1)}
                    </span>
                    <p className="text-[10px] text-slate-600 mt-0.5">{obs.date}</p>
                  </div>
                </div>
              );
            })}

            {recentObservations.length === 0 && (
              <p className="text-xs text-slate-500 py-4 text-center">
                No observations recorded yet. Use "Quick actions" below to observe a learner!
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Bar */}
      <div className="bg-slate-900 text-white rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Quick actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={onOpenQuickObserve}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-left text-xs font-semibold text-slate-100"
          >
            <Eye className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Observe a learner</span>
          </button>

          <button
            onClick={onOpenLessonPlanner}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-left text-xs font-semibold text-slate-100"
          >
            <Play className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Start a lesson</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-left text-xs font-semibold text-slate-100"
          >
            <BookOpen className="w-4 h-4 text-teal-400 shrink-0" />
            <span>Open resources</span>
          </button>

          <button
            onClick={() => onOpenGroupModal()}
            className="flex items-center gap-2.5 p-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors cursor-pointer text-left text-xs font-semibold text-slate-100"
          >
            <Users className="w-4 h-4 text-teal-400 shrink-0" />
            <span>New group</span>
          </button>
        </div>
      </div>
    </div>
  );
};
