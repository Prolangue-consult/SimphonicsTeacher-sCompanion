import React, { useState } from 'react';
import {
  Volume2,
  ChevronLeft,
  ChevronRight,
  Pause,
  Check,
  Printer,
  Sparkles,
  Layers,
  BookOpen,
  Eye,
  RotateCcw,
  X,
  FileText
} from 'lucide-react';
import { LessonPlan, Activity, Learner, ObservationStatus } from '../types/simphonics';
import { useSimphonics } from '../context/SimphonicsContext';
import { phonemeAudio } from '../utils/audioPlayer';
import { SIMPHONICS_SKILLS, SIMPHONICS_STRANDS } from '../data/simphonicsData';

interface TeachingModeModalProps {
  plan: LessonPlan;
  activity?: Activity;
  onClose: () => void;
  onOpenPrintable?: (printable: any) => void;
}

export const TeachingModeModal: React.FC<TeachingModeModalProps> = ({
  plan,
  activity,
  onClose,
  onOpenPrintable,
}) => {
  const {
    activeLessonStep,
    setActiveLessonStep,
    pauseTeachingLesson,
    finishTeachingLesson,
    classLearners,
    groups,
    recordObservation,
  } = useSimphonics();

  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [quickNotes, setQuickNotes] = useState<{ [learnerId: string]: string }>({});

  // Determine target learners for quick observation in this lesson
  let targetLearners: Learner[] = [];
  if (plan.targetType === 'group') {
    const grp = groups.find((g) => g.id === plan.targetId);
    if (grp) {
      targetLearners = classLearners.filter((l) => grp.learnerIds.includes(l.id));
    }
  } else if (plan.targetType === 'learner') {
    targetLearners = classLearners.filter((l) => l.id === plan.targetId);
  }
  if (targetLearners.length === 0) {
    targetLearners = classLearners;
  }

  // Find linked skill for recording
  const matchingSkill =
    SIMPHONICS_SKILLS.find((s) => s.strandId === plan.strandId) || SIMPHONICS_SKILLS[0];

  const steps = [
    { title: '1. Intention & Setup', key: 'intention' },
    { title: '2. Teacher Model', key: 'model' },
    { title: '3. Guided Practice', key: 'guided' },
    { title: '4. Independent Attempt', key: 'attempt' },
    { title: '5. Record Evidence', key: 'check' },
    { title: '6. Adaptation & Finish', key: 'adaptation' },
  ];

  const currentStep = steps[activeLessonStep] || steps[0];

  const handlePlayPhoneme = (phoneme: string) => {
    setIsPlayingAudio(true);
    phonemeAudio.playPhoneme(phoneme);
    setTimeout(() => setIsPlayingAudio(false), 900);
  };

  const handleNext = () => {
    if (activeLessonStep < steps.length - 1) {
      setActiveLessonStep(activeLessonStep + 1);
    } else {
      finishTeachingLesson();
    }
  };

  const handlePrev = () => {
    if (activeLessonStep > 0) {
      setActiveLessonStep(activeLessonStep - 1);
    }
  };

  const currentCard = activity?.flashcards?.[activeCardIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-md flex flex-col justify-between overflow-y-auto">
      {/* Top Header Bar */}
      <div className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4 sticky top-0 z-20">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-200 shrink-0">
            Teaching Mode
          </span>
          <h2 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {plan.title}
          </h2>
          {plan.bookReference && (
            <span className="hidden md:inline text-xs text-slate-500 font-medium">
              · {plan.bookReference}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {activity?.printableSheet && onOpenPrintable && (
            <button
              onClick={() => onOpenPrintable(activity.printableSheet)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Printable</span>
            </button>
          )}

          <button
            onClick={() => {
              pauseTeachingLesson();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            title="Pause lesson and resume later"
          >
            <Pause className="w-3.5 h-3.5" />
            <span>Pause & Close</span>
          </button>
        </div>
      </div>

      {/* Progress Step Navigator */}
      <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-8 py-2">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-1 overflow-x-auto">
          {steps.map((st, idx) => (
            <button
              key={st.key}
              onClick={() => setActiveLessonStep(idx)}
              className={`px-3 py-1 text-xs font-semibold rounded-md whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                activeLessonStep === idx
                  ? 'bg-teal-700 text-white shadow-xs'
                  : activeLessonStep > idx
                  ? 'bg-teal-50 text-teal-800 hover:bg-teal-100'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              {st.title}
            </button>
          ))}
        </div>
      </div>

      {/* Center Stage: Large, Clean, Distraction-Free Content */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="max-w-3xl w-full bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-lg space-y-6">
          {/* STEP 1: Intention & Preparation */}
          {activeLessonStep === 0 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step 1 · Outcome
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Learning Intention</h3>
                <p className="text-lg text-slate-700 mt-2 font-medium leading-relaxed">
                  {plan.learningIntention}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Materials & Preparation
                </h4>
                <p className="text-sm text-slate-700 font-medium">{plan.preparation}</p>
                {activity?.materialsNeeded && (
                  <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 mt-2">
                    {activity.materialsNeeded.map((mat, i) => (
                      <li key={i}>{mat}</li>
                    ))}
                  </ul>
                )}
              </div>

              {activity?.audioPhoneme && (
                <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-teal-800">
                      Approved Pronunciation Audio
                    </span>
                    <p className="text-sm font-bold text-slate-900 mt-0.5">
                      Pure Phoneme: {activity.audioPhoneme.phoneme} (Word: "
                      {activity.audioPhoneme.sampleWord}")
                    </p>
                    <p className="text-xs text-slate-600">{activity.audioPhoneme.description}</p>
                  </div>
                  <button
                    onClick={() => handlePlayPhoneme(activity.audioPhoneme!.phoneme)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer shrink-0"
                  >
                    <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-pulse' : ''}`} />
                    <span>Play Audio</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Teacher Model & Flashcard Display */}
          {activeLessonStep === 1 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step 2 · Teacher Direct Model
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">What to Say & Demonstrate</h3>
              </div>

              <div className="p-6 rounded-xl bg-teal-50/70 border border-teal-200 text-slate-800 font-serif text-lg sm:text-xl leading-relaxed">
                “{plan.model}”
              </div>

              {/* Flashcard / Visual Display if available */}
              {activity?.flashcards && activity.flashcards.length > 0 && (
                <div className="p-6 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="flex items-center justify-between w-full max-w-sm">
                    <span className="text-xs font-semibold text-slate-500 uppercase">
                      Card {activeCardIndex + 1} of {activity.flashcards.length}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() =>
                          setActiveCardIndex((prev) =>
                            prev > 0 ? prev - 1 : activity.flashcards!.length - 1
                          )
                        }
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4 text-slate-600" />
                      </button>
                      <button
                        onClick={() =>
                          setActiveCardIndex((prev) =>
                            prev < activity.flashcards!.length - 1 ? prev + 1 : 0
                          )
                        }
                        className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4 text-slate-600" />
                      </button>
                    </div>
                  </div>

                  {/* Card Front */}
                  <div className="w-48 h-40 bg-white rounded-2xl border-2 border-teal-700 shadow-md flex flex-col items-center justify-center p-4">
                    <span className="text-5xl font-extrabold text-slate-900 tracking-wider">
                      {currentCard?.front}
                    </span>
                    {currentCard?.back && (
                      <span className="text-xs text-slate-500 mt-2 font-medium">
                        {currentCard.back}
                      </span>
                    )}
                  </div>

                  {/* Sound play button for card */}
                  <button
                    onClick={() => handlePlayPhoneme(currentCard?.front || 's')}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold text-teal-800 bg-white border border-teal-300 rounded-lg shadow-xs hover:bg-teal-50 cursor-pointer"
                  >
                    <Volume2 className="w-4 h-4 text-teal-700" />
                    <span>Replay pronunciation ({currentCard?.front})</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* STEP 3: Guided Practice */}
          {activeLessonStep === 2 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step 3 · Supported Learner Participation
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Guided Practice</h3>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-base sm:text-lg leading-relaxed space-y-4">
                <p>{plan.guidedPractice}</p>
                <div className="p-3 bg-white rounded-lg border border-slate-200 text-xs text-slate-600">
                  <span className="font-bold text-slate-800 block mb-1">Teacher Tip:</span>
                  Ensure clean articulation. Praise effort immediately and maintain a brisk, joyful rhythm.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Independent Attempt */}
          {activeLessonStep === 3 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step 4 · Individual Check
                </span>
                <h3 className="text-2xl font-bold text-slate-900 mt-1">Independent Demonstration</h3>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-base sm:text-lg leading-relaxed">
                <p>{plan.independentAttempt}</p>
              </div>

              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200 text-xs text-teal-900">
                <span className="font-bold block text-sm mb-1">What Evidence to Watch For:</span>
                <p className="text-slate-700">{plan.check}</p>
              </div>
            </div>
          )}

          {/* STEP 5: Quick Observation Recording in Lesson */}
          {activeLessonStep === 4 && (
            <div className="space-y-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step 5 · Record Evidence
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">
                  Quick In-Lesson Observations
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tap state for each learner. Missing observation is neutral, not failure.
                </p>
              </div>

              <div className="divide-y divide-slate-100 max-h-96 overflow-y-auto pr-1">
                {targetLearners.map((learner) => {
                  const existingObs = learner.observations[matchingSkill.id];
                  const status = existingObs?.status || 'not_observed';

                  return (
                    <div
                      key={learner.id}
                      className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="text-sm font-bold text-slate-900">{learner.name}</span>
                        <span className="text-xs text-slate-500 ml-2">({learner.ageBand})</span>
                      </div>

                      <div className="flex items-center gap-1.5 flex-wrap">
                        <button
                          onClick={() =>
                            recordObservation(
                              learner.id,
                              matchingSkill.id,
                              'needs_support',
                              quickNotes[learner.id],
                              plan.title
                            )
                          }
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            status === 'needs_support'
                              ? 'bg-amber-100 text-amber-900 border-amber-300 font-bold'
                              : 'bg-white text-amber-700 border-amber-200 hover:bg-amber-50'
                          }`}
                        >
                          Needs support
                        </button>

                        <button
                          onClick={() =>
                            recordObservation(
                              learner.id,
                              matchingSkill.id,
                              'developing',
                              quickNotes[learner.id],
                              plan.title
                            )
                          }
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            status === 'developing'
                              ? 'bg-sky-100 text-sky-900 border-sky-300 font-bold'
                              : 'bg-white text-sky-700 border-sky-200 hover:bg-sky-50'
                          }`}
                        >
                          Developing
                        </button>

                        <button
                          onClick={() =>
                            recordObservation(
                              learner.id,
                              matchingSkill.id,
                              'independent',
                              quickNotes[learner.id],
                              plan.title
                            )
                          }
                          className={`px-2.5 py-1 text-xs font-semibold rounded-lg border transition-colors cursor-pointer ${
                            status === 'independent'
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
            </div>
          )}

          {/* STEP 6: Adaptations & Finish */}
          {activeLessonStep === 5 && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Step 6 · Differentiated Adaptations
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">Extra Support & Extension</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Extra Support (Scaffolding)
                  </h4>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                    {plan.adaptation.extraSupport}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-teal-900">
                    Extension (Challenge)
                  </h4>
                  <p className="text-xs text-slate-700 mt-1.5 leading-relaxed">
                    {plan.adaptation.extension}
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <h5 className="text-sm font-bold text-slate-900">Lesson Finished?</h5>
                  <p className="text-xs text-slate-500">
                    All observations have been saved automatically to learner profiles.
                  </p>
                </div>
                <button
                  onClick={finishTeachingLesson}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  Complete & Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="bg-white border-t border-slate-200 px-4 sm:px-8 py-3.5 sticky bottom-0 z-20 flex items-center justify-between">
        <button
          onClick={handlePrev}
          disabled={activeLessonStep === 0}
          className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
            activeLessonStep === 0
              ? 'opacity-40 text-slate-400 cursor-not-allowed'
              : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Previous</span>
        </button>

        <span className="text-xs text-slate-500 font-medium">
          Step {activeLessonStep + 1} of {steps.length}
        </span>

        <button
          onClick={handleNext}
          className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
        >
          <span>{activeLessonStep === steps.length - 1 ? 'Finish Lesson' : 'Next Step'}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
