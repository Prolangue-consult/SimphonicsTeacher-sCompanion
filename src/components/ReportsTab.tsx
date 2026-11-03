import React, { useState, useEffect } from 'react';
import {
  FileText,
  Printer,
  Copy,
  Sparkles,
  CheckCircle,
  Clock,
  ChevronDown,
  Layers,
  Check,
  Edit2,
  RefreshCw,
  Info
} from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { Learner, ParentSummary, StrandId } from '../types/simphonics';
import { SIMPHONICS_STRANDS, SIMPHONICS_SKILLS } from '../data/simphonicsData';

interface ReportsTabProps {
  initialLearnerId?: string | null;
}

export const ReportsTab: React.FC<ReportsTabProps> = ({ initialLearnerId }) => {
  const {
    classLearners,
    selectedClass,
    parentSummaries,
    saveParentSummary,
    teacherName,
  } = useSimphonics();

  const [selectedLearnerId, setSelectedLearnerId] = useState<string>(
    initialLearnerId || classLearners[0]?.id || ''
  );
  const [activeReportSubTab, setActiveReportSubTab] = useState<'class_overview' | 'parent_summary'>(
    'parent_summary'
  );

  const selectedLearner =
    classLearners.find((l) => l.id === selectedLearnerId) || classLearners[0];

  // Parent summary form state
  const [whatWePractised, setWhatWePractised] = useState('');
  const [independent, setIndependent] = useState('');
  const [needsSupport, setNeedsSupport] = useState('');
  const [nextTeachingFocus, setNextTeachingFocus] = useState('');
  const [homeActivity, setHomeActivity] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [aiDraftLoading, setAiDraftLoading] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  // Sync state when selectedLearner changes
  useEffect(() => {
    if (!selectedLearner) return;

    const saved = parentSummaries[selectedLearner.id];
    if (saved) {
      setWhatWePractised(saved.whatWePractised);
      setIndependent(saved.independent);
      setNeedsSupport(saved.needsSupport);
      setNextTeachingFocus(saved.nextTeachingFocus);
      setHomeActivity(saved.homeActivity);
      setDateRange(saved.dateRange);
    } else {
      // Initialize based on actual observations
      const obs = Object.values(selectedLearner.observations);
      const indep = obs.filter((o) => o.status === 'independent').map((o) => o.skillName);
      const supp = obs.filter((o) => o.status === 'needs_support').map((o) => o.skillName);
      const dev = obs.filter((o) => o.status === 'developing').map((o) => o.skillName);

      const earliestDate = obs.length > 0 ? obs.map((o) => o.date).sort()[0] : 'Recent weeks';
      const latestDate = obs.length > 0 ? obs.map((o) => o.date).sort().reverse()[0] : 'Present';

      setDateRange(`${earliestDate} – ${latestDate}`);
      setWhatWePractised(
        obs.length > 0
          ? `${selectedLearner.name} has been participating in foundational oral blending, sound recognition, and listening games.`
          : `${selectedLearner.name} is beginning our foundational Simphonics literacy sessions.`
      );
      setIndependent(
        indep.length > 0
          ? `${selectedLearner.name} now independently demonstrates ${indep.slice(0, 3).join(', ')} with high confidence.`
          : `${selectedLearner.name} participates attentively during shared rhymes and sound activities.`
      );
      setNeedsSupport(
        supp.length > 0
          ? `We are continuing to provide gentle scaffolding and extra modelling for ${supp.slice(0, 2).join(' and ')}.`
          : dev.length > 0
          ? `${selectedLearner.name} is developing confidence in ${dev.slice(0, 2).join(' and ')} with occasional prompts.`
          : `We are supporting steady rhythm and smooth sound connections.`
      );
      setNextTeachingFocus(
        selectedLearner.currentFocus || 'Advancing to cumulative word reading'
      );
      setHomeActivity(
        `Play a 2-minute oral blending game at home: say a simple 3-sound word slowly like "s-a-t" or "c-u-p" and invite ${selectedLearner.name} to jump and say the whole word together.`
      );
    }
  }, [selectedLearner, parentSummaries]);

  // AI-Assisted Parent Summary Generation via backend endpoint
  const handleDraftWithAi = async () => {
    if (!selectedLearner) return;
    setAiDraftLoading(true);
    try {
      const obsArray = Object.values(selectedLearner.observations);
      const strandSummaries = SIMPHONICS_STRANDS.map((st) => {
        const skillsInStrand = SIMPHONICS_SKILLS.filter((s) => s.strandId === st.id);
        const learnerObs = skillsInStrand.map((s) => selectedLearner.observations[s.id]).filter(Boolean);
        return {
          strand: st.shortName,
          observedCount: learnerObs.length,
          independentCount: learnerObs.filter((o) => o?.status === 'independent').length,
          needsSupportCount: learnerObs.filter((o) => o?.status === 'needs_support').length,
        };
      });

      const res = await fetch('/api/ai/draft-parent-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          learnerName: selectedLearner.name,
          observations: obsArray,
          currentFocus: selectedLearner.currentFocus,
          strandSummaries,
        }),
      });

      const data = await res.json();
      if (data.summary) {
        setWhatWePractised(data.summary.whatWePractised || whatWePractised);
        setIndependent(data.summary.independent || independent);
        setNeedsSupport(data.summary.needsSupport || needsSupport);
        setNextTeachingFocus(data.summary.nextTeachingFocus || nextTeachingFocus);
        setHomeActivity(data.summary.homeActivity || homeActivity);
      }
    } catch (e) {
      console.error('Failed to draft summary with AI', e);
    } finally {
      setAiDraftLoading(false);
    }
  };

  const handleSaveSummary = () => {
    if (!selectedLearner) return;
    const summary: ParentSummary = {
      id: `psum_${selectedLearner.id}`,
      learnerId: selectedLearner.id,
      learnerName: selectedLearner.name,
      dateRange,
      whatWePractised,
      independent,
      needsSupport,
      nextTeachingFocus,
      homeActivity,
      lastEdited: new Date().toISOString(),
    };
    saveParentSummary(summary);
  };

  const handleCopyClipboard = () => {
    const fullText = `SIMPHONICS PROGRESS SUMMARY — ${selectedLearner.name.toUpperCase()}
Date: ${dateRange}
Teacher: ${teacherName}
Class: ${selectedClass?.name}

1. WHAT WE PRACTISED
${whatWePractised}

2. WHAT YOUR CHILD NOW DOES INDEPENDENTLY
${independent}

3. WHAT STILL NEEDS SUPPORT
${needsSupport}

4. OUR NEXT TEACHING FOCUS
${nextTeachingFocus}

5. ONE MANAGEABLE HOME ACTIVITY
${homeActivity}

Simphonics Teacher Companion · Prolangue`;

    navigator.clipboard.writeText(fullText);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const handlePrint = () => {
    handleSaveSummary();
    window.print();
  };

  // Compute Class Overview Metrics across Strands
  const classStrandStats = SIMPHONICS_STRANDS.map((strand) => {
    const strandSkills = SIMPHONICS_SKILLS.filter((s) => s.strandId === strand.id);
    let independentCount = 0;
    let developingCount = 0;
    let supportCount = 0;

    classLearners.forEach((l) => {
      strandSkills.forEach((s) => {
        const obs = l.observations[s.id];
        if (obs?.status === 'independent') independentCount++;
        else if (obs?.status === 'developing') developingCount++;
        else if (obs?.status === 'needs_support') supportCount++;
      });
    });

    return {
      strand,
      independentCount,
      developingCount,
      supportCount,
      totalPossible: strandSkills.length * classLearners.length,
    };
  });

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Top Bar with Sub-Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Progress Reports & Parent Summaries
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Strictly evidence-based reporting that directly informs the next instructional decision.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveReportSubTab('parent_summary')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeReportSubTab === 'parent_summary'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Parent Summary
          </button>
          <button
            onClick={() => setActiveReportSubTab('class_overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
              activeReportSubTab === 'class_overview'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Class Strand Overview
          </button>
        </div>
      </div>

      {/* SUB-TAB 1: PARENT SUMMARY BUILDER */}
      {activeReportSubTab === 'parent_summary' && (
        <div className="space-y-6">
          {/* Learner Selector & AI Draft Action */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
            <div className="flex items-center gap-3">
              <label className="text-xs font-bold text-slate-700">Select Learner:</label>
              <select
                value={selectedLearner?.id || ''}
                onChange={(e) => setSelectedLearnerId(e.target.value)}
                className="py-1.5 px-3 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-600"
              >
                {classLearners.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.name} ({l.ageBand})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleDraftWithAi}
                disabled={aiDraftLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-teal-800 bg-teal-50 border border-teal-200 hover:bg-teal-100 rounded-lg transition-colors cursor-pointer"
                title="Draft structured summary strictly from recorded observations"
              >
                {aiDraftLoading ? (
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-teal-700" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                )}
                <span>Draft with AI (Grounded)</span>
              </button>

              <button
                onClick={handleCopyClipboard}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                {copyFeedback ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
                <span>{copyFeedback ? 'Copied!' : 'Copy Text'}</span>
              </button>

              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Printable Parent Summary Sheet */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-8">
            {/* Document Header */}
            <div className="pb-6 border-b border-slate-200 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Simphonics Literacy Companion
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-0.5">
                  Parent Progress Summary
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Learner: <strong className="text-slate-800 text-sm">{selectedLearner?.name}</strong>{' '}
                  · Class: {selectedClass?.name} · Teacher: {teacherName}
                </p>
              </div>

              <div className="text-left sm:text-right shrink-0">
                <label className="text-[10px] font-semibold uppercase text-slate-400 block">
                  Observation Date Range
                </label>
                <input
                  type="text"
                  value={dateRange}
                  onChange={(e) => setDateRange(e.target.value)}
                  className="text-xs font-semibold text-slate-700 border-b border-dashed border-slate-300 focus:outline-none"
                />
              </div>
            </div>

            {/* 5 Strictly Structured Required Sections */}
            <div className="space-y-6 text-xs">
              {/* Section 1: What We Practised */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-slate-800 text-xs block">
                  1. What We Practised
                </label>
                <p className="text-[11px] text-slate-500">
                  Core skills, sounds, or activities engaged in during classroom sessions.
                </p>
                <textarea
                  rows={2}
                  value={whatWePractised}
                  onChange={(e) => setWhatWePractised(e.target.value)}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 text-sm"
                />
              </div>

              {/* Section 2: What Your Child Now Does Independently */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-emerald-800 text-xs block">
                  2. What Your Child Now Does Independently
                </label>
                <p className="text-[11px] text-slate-500">
                  Demonstrated consistently without teacher prompting or assistance.
                </p>
                <textarea
                  rows={2}
                  value={independent}
                  onChange={(e) => setIndependent(e.target.value)}
                  className="w-full p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 text-sm"
                />
              </div>

              {/* Section 3: What Still Needs Support */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-amber-800 text-xs block">
                  3. What Still Needs Support
                </label>
                <p className="text-[11px] text-slate-500">
                  Skills where your child is currently developing confidence with adult modelling.
                </p>
                <textarea
                  rows={2}
                  value={needsSupport}
                  onChange={(e) => setNeedsSupport(e.target.value)}
                  className="w-full p-3 bg-amber-50/50 border border-amber-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 text-sm"
                />
              </div>

              {/* Section 4: Our Next Teaching Focus */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-teal-800 text-xs block">
                  4. Our Next Teaching Focus
                </label>
                <p className="text-[11px] text-slate-500">
                  The immediate next skill we will be practicing in class.
                </p>
                <textarea
                  rows={2}
                  value={nextTeachingFocus}
                  onChange={(e) => setNextTeachingFocus(e.target.value)}
                  className="w-full p-3 bg-teal-50/50 border border-teal-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 text-sm"
                />
              </div>

              {/* Section 5: One Manageable Home Activity */}
              <div className="space-y-1.5">
                <label className="font-bold uppercase tracking-wider text-indigo-800 text-xs block">
                  5. One Manageable Home Activity (2 Minutes)
                </label>
                <p className="text-[11px] text-slate-500">
                  A simple, pressure-free verbal game or practical activity for home routines.
                </p>
                <textarea
                  rows={2}
                  value={homeActivity}
                  onChange={(e) => setHomeActivity(e.target.value)}
                  className="w-full p-3 bg-indigo-50/40 border border-indigo-200 rounded-lg text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-1 focus:ring-teal-600 text-sm"
                />
              </div>
            </div>

            {/* Bottom Actions and Save Button */}
            <div className="pt-6 border-t border-slate-200 flex items-center justify-between no-print">
              <span className="text-[11px] text-slate-500">
                Edits are saved to {selectedLearner?.name}’s profile record.
              </span>
              <button
                onClick={handleSaveSummary}
                className="px-5 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-bold text-xs rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                Save Parent Summary
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: CLASS STRAND OVERVIEW */}
      {activeReportSubTab === 'class_overview' && (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Class Progression Across the 8 Strands
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Cumulative evidence recorded across all {classLearners.length} learners in{' '}
              {selectedClass?.name}. Missing observations are neutral.
            </p>
          </div>

          <div className="space-y-4">
            {classStrandStats.map((stat) => {
              return (
                <div
                  key={stat.strand.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{stat.strand.name}</h4>
                      <p className="text-xs text-slate-500">{stat.strand.description}</p>
                    </div>

                    <div className="flex items-center gap-3 text-xs font-semibold shrink-0">
                      <span className="text-emerald-700">
                        {stat.independentCount} Independent
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-sky-700">
                        {stat.developingCount} Developing
                      </span>
                      <span aria-hidden="true" className="text-slate-300">·</span>
                      <span className="text-amber-700">
                        {stat.supportCount} Needs support
                      </span>
                    </div>
                  </div>

                  {/* Progress bar visual */}
                  <div className="w-full bg-slate-200 rounded-full h-2 flex overflow-hidden">
                    <div
                      className="bg-emerald-600 h-2"
                      style={{
                        width: `${Math.min(
                          100,
                          (stat.independentCount / (stat.totalPossible || 1)) * 100
                        )}%`,
                      }}
                      title="Independent"
                    />
                    <div
                      className="bg-sky-500 h-2"
                      style={{
                        width: `${Math.min(
                          100,
                          (stat.developingCount / (stat.totalPossible || 1)) * 100
                        )}%`,
                      }}
                      title="Developing"
                    />
                    <div
                      className="bg-amber-500 h-2"
                      style={{
                        width: `${Math.min(
                          100,
                          (stat.supportCount / (stat.totalPossible || 1)) * 100
                        )}%`,
                      }}
                      title="Needs support"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
