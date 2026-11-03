/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SimphonicsProvider, useSimphonics } from './context/SimphonicsContext';
import { Header, ActiveTab } from './components/Header';
import { TodayTab } from './components/TodayTab';
import { LearnersTab } from './components/LearnersTab';
import { TeachTab } from './components/TeachTab';
import { ResourcesTab } from './components/ResourcesTab';
import { ReportsTab } from './components/ReportsTab';
import { TeachingModeModal } from './components/TeachingModeModal';
import { QuickObserveModal } from './components/QuickObserveModal';
import { GroupModal } from './components/GroupModal';
import { PrintableModal } from './components/PrintableModal';
import { AdminSettingsModal } from './components/AdminSettingsModal';
import { Learner, Activity, PrintableSheet } from './types/simphonics';

function MainApp() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('today');

  // Modals state
  const [isQuickObserveOpen, setIsQuickObserveOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [activeGroupId, setActiveGroupId] = useState<string | undefined>(undefined);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [activePrintable, setActivePrintable] = useState<PrintableSheet | null>(null);
  const [parentSummaryLearnerId, setParentSummaryLearnerId] = useState<string | null>(null);

  const {
    activeLesson,
    isTeachingModeOpen,
    pauseTeachingLesson,
    startTeachingLesson,
    activities,
    savePlan,
    selectedClassId,
  } = useSimphonics();

  const handleStartTeachingActivity = (act: Activity) => {
    // Create or find a plan for this activity and launch teaching mode
    const plan = savePlan({
      title: `${act.title}`,
      targetType: 'class',
      targetId: selectedClassId,
      strandId: act.strandId,
      durationMinutes: act.durationMinutes,
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
      status: 'in_progress',
    });
    startTeachingLesson(plan);
  };

  const handleOpenParentSummaryForLearner = (learner: Learner) => {
    setParentSummaryLearnerId(learner.id);
    setActiveTab('reports');
  };

  const currentActivity = activities.find((a) => a.id === activeLesson?.activityId);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-800">
      {/* Top Header strictly compliant with Top Bar Contract */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* Main Tab Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'today' && (
          <TodayTab
            setActiveTab={setActiveTab}
            onOpenQuickObserve={() => setIsQuickObserveOpen(true)}
            onOpenGroupModal={(gid) => {
              setActiveGroupId(gid);
              setIsGroupModalOpen(true);
            }}
            onOpenLessonPlanner={() => setActiveTab('teach')}
          />
        )}

        {activeTab === 'learners' && (
          <LearnersTab onOpenParentSummary={handleOpenParentSummaryForLearner} />
        )}

        {activeTab === 'teach' && (
          <TeachTab onOpenPrintable={(sheet) => setActivePrintable(sheet)} />
        )}

        {activeTab === 'resources' && (
          <ResourcesTab
            onStartTeachingActivity={handleStartTeachingActivity}
            onOpenPrintable={(sheet) => setActivePrintable(sheet)}
          />
        )}

        {activeTab === 'reports' && (
          <ReportsTab initialLearnerId={parentSummaryLearnerId} />
        )}
      </main>

      {/* Clean Educational Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 sm:px-6 lg:px-8 text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">Simphonics Teacher Companion</span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span>Prolangue Educational Literacy</span>
          </div>

          <p className="text-slate-400 text-center sm:text-right italic">
            “Know what to teach next, access the right activity, and record each learner’s progress in minutes.”
          </p>
        </div>
      </footer>

      {/* MODAL 1: TEACHING MODE FULLSCREEN VIEW */}
      {isTeachingModeOpen && activeLesson && (
        <TeachingModeModal
          plan={activeLesson}
          activity={currentActivity}
          onClose={pauseTeachingLesson}
          onOpenPrintable={(sheet) => setActivePrintable(sheet)}
        />
      )}

      {/* MODAL 2: QUICK OBSERVATION ENTRY */}
      {isQuickObserveOpen && (
        <QuickObserveModal onClose={() => setIsQuickObserveOpen(false)} />
      )}

      {/* MODAL 3: SMALL GROUP MANAGEMENT & COMPACT RECORDER */}
      {isGroupModalOpen && (
        <GroupModal
          initialGroupId={activeGroupId}
          onClose={() => {
            setIsGroupModalOpen(false);
            setActiveGroupId(undefined);
          }}
        />
      )}

      {/* MODAL 4: CLASSROOM PRINTABLE SHEET */}
      {activePrintable && (
        <PrintableModal
          sheet={activePrintable}
          onClose={() => setActivePrintable(null)}
        />
      )}

      {/* MODAL 5: SETTINGS & CONTENT MAINTENANCE */}
      {isAdminOpen && (
        <AdminSettingsModal onClose={() => setIsAdminOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <SimphonicsProvider>
      <MainApp />
    </SimphonicsProvider>
  );
}
