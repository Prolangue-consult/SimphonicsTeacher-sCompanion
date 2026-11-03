import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Learner,
  ClassGroup,
  TeachingGroup,
  Activity,
  LessonPlan,
  ObservationStatus,
  ObservationRecord,
  ParentSummary,
} from '../types/simphonics';
import {
  INITIAL_CLASSES,
  INITIAL_GROUPS,
  INITIAL_LEARNERS,
  SIMPHONICS_ACTIVITIES,
  SIMPHONICS_SKILLS,
  INITIAL_SAVED_PLANS,
} from '../data/simphonicsData';

interface SimphonicsContextType {
  classes: ClassGroup[];
  selectedClassId: string;
  setSelectedClassId: (id: string) => void;
  selectedClass: ClassGroup | undefined;
  learners: Learner[];
  classLearners: Learner[];
  groups: TeachingGroup[];
  classGroups: TeachingGroup[];
  activities: Activity[];
  savedPlans: LessonPlan[];
  activeLesson: LessonPlan | null;
  isTeachingModeOpen: boolean;
  activeLessonStep: number;
  favouriteActivityIds: string[];
  saveStatus: 'saved' | 'saving' | 'error';
  teacherName: string;
  setTeacherName: (name: string) => void;

  // Actions
  addLearner: (learner: Omit<Learner, 'id' | 'createdDate' | 'observations'>) => Learner;
  updateLearner: (id: string, updates: Partial<Learner>) => void;
  deleteLearner: (id: string) => void;
  importLearners: (names: string[], classId: string, ageBand: Learner['ageBand']) => void;

  addGroup: (group: Omit<TeachingGroup, 'id' | 'createdDate'>) => TeachingGroup;
  updateGroup: (id: string, updates: Partial<TeachingGroup>) => void;
  deleteGroup: (id: string) => void;

  addActivity: (activity: Omit<Activity, 'id'>) => Activity;
  toggleFavouriteActivity: (activityId: string) => void;

  savePlan: (plan: Omit<LessonPlan, 'id' | 'lastUpdated'>) => LessonPlan;
  updatePlan: (id: string, updates: Partial<LessonPlan>) => void;
  duplicatePlan: (id: string) => LessonPlan;
  deletePlan: (id: string) => void;

  startTeachingLesson: (plan: LessonPlan) => void;
  pauseTeachingLesson: () => void;
  resumeTeachingLesson: () => void;
  finishTeachingLesson: () => void;
  setActiveLessonStep: (step: number) => void;

  recordObservation: (
    learnerId: string,
    skillId: string,
    status: ObservationStatus,
    note?: string,
    lessonTitle?: string
  ) => void;

  recordGroupObservations: (
    skillId: string,
    records: { learnerId: string; status: ObservationStatus; note?: string }[],
    lessonTitle?: string
  ) => void;

  parentSummaries: Record<string, ParentSummary>;
  saveParentSummary: (summary: ParentSummary) => void;
  resetAllData: () => void;
}

const SimphonicsContext = createContext<SimphonicsContextType | null>(null);

const STORAGE_KEY = 'simphonics_companion_v1';

export const SimphonicsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [classes, setClasses] = useState<ClassGroup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_classes`);
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [selectedClassId, setSelectedClassId] = useState<string>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_selected_class`);
    return saved || 'rec_a';
  });

  const [learners, setLearners] = useState<Learner[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_learners`);
    return saved ? JSON.parse(saved) : INITIAL_LEARNERS;
  });

  const [groups, setGroups] = useState<TeachingGroup[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_groups`);
    return saved ? JSON.parse(saved) : INITIAL_GROUPS;
  });

  const [activities, setActivities] = useState<Activity[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_activities`);
    return saved ? JSON.parse(saved) : SIMPHONICS_ACTIVITIES;
  });

  const [savedPlans, setSavedPlans] = useState<LessonPlan[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_plans`);
    return saved ? JSON.parse(saved) : INITIAL_SAVED_PLANS;
  });

  const [activeLesson, setActiveLesson] = useState<LessonPlan | null>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_active_lesson`);
    return saved ? JSON.parse(saved) : INITIAL_SAVED_PLANS[0];
  });

  const [isTeachingModeOpen, setIsTeachingModeOpen] = useState<boolean>(false);
  const [activeLessonStep, setActiveLessonStep] = useState<number>(0);

  const [favouriteActivityIds, setFavouriteActivityIds] = useState<string[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_favs`);
    return saved ? JSON.parse(saved) : ['act_1', 'act_2', 'act_6'];
  });

  const [parentSummaries, setParentSummaries] = useState<Record<string, ParentSummary>>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_parent_summaries`);
    return saved ? JSON.parse(saved) : {};
  });

  const [teacherName, setTeacherName] = useState<string>(() => {
    return localStorage.getItem(`${STORAGE_KEY}_teacher_name`) || 'Teacher Alane';
  });

  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');

  // Auto-save effects
  useEffect(() => {
    try {
      setSaveStatus('saving');
      localStorage.setItem(`${STORAGE_KEY}_classes`, JSON.stringify(classes));
      localStorage.setItem(`${STORAGE_KEY}_selected_class`, selectedClassId);
      localStorage.setItem(`${STORAGE_KEY}_learners`, JSON.stringify(learners));
      localStorage.setItem(`${STORAGE_KEY}_groups`, JSON.stringify(groups));
      localStorage.setItem(`${STORAGE_KEY}_activities`, JSON.stringify(activities));
      localStorage.setItem(`${STORAGE_KEY}_plans`, JSON.stringify(savedPlans));
      localStorage.setItem(`${STORAGE_KEY}_favs`, JSON.stringify(favouriteActivityIds));
      localStorage.setItem(`${STORAGE_KEY}_parent_summaries`, JSON.stringify(parentSummaries));
      localStorage.setItem(`${STORAGE_KEY}_teacher_name`, teacherName);
      if (activeLesson) {
        localStorage.setItem(`${STORAGE_KEY}_active_lesson`, JSON.stringify(activeLesson));
      }
      setTimeout(() => setSaveStatus('saved'), 200);
    } catch (e) {
      console.error('Storage error', e);
      setSaveStatus('error');
    }
  }, [
    classes,
    selectedClassId,
    learners,
    groups,
    activities,
    savedPlans,
    activeLesson,
    favouriteActivityIds,
    parentSummaries,
    teacherName,
  ]);

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0];
  const classLearners = learners.filter((l) => l.classId === selectedClassId);
  const classGroups = groups.filter((g) => g.classId === selectedClassId);

  // Learner operations
  const addLearner = (data: Omit<Learner, 'id' | 'createdDate' | 'observations'>): Learner => {
    const newLearner: Learner = {
      ...data,
      id: `lrn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdDate: new Date().toISOString(),
      observations: {},
    };
    setLearners((prev) => [newLearner, ...prev]);
    return newLearner;
  };

  const updateLearner = (id: string, updates: Partial<Learner>) => {
    setLearners((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const deleteLearner = (id: string) => {
    setLearners((prev) => prev.filter((l) => l.id !== id));
  };

  const importLearners = (names: string[], classId: string, ageBand: Learner['ageBand']) => {
    const newItems: Learner[] = names
      .map((n) => n.trim())
      .filter((n) => n.length > 0)
      .map((name, i) => ({
        id: `lrn_imp_${Date.now()}_${i}`,
        name,
        classId,
        ageBand,
        languageBackground: 'English (Home language)',
        currentFocus: 'Set 1 sounds and oral blending',
        observations: {},
        createdDate: new Date().toISOString(),
      }));
    setLearners((prev) => [...prev, ...newItems]);
  };

  // Group operations
  const addGroup = (groupData: Omit<TeachingGroup, 'id' | 'createdDate'>): TeachingGroup => {
    const newGroup: TeachingGroup = {
      ...groupData,
      id: `grp_${Date.now()}`,
      createdDate: new Date().toISOString(),
    };
    setGroups((prev) => [...prev, newGroup]);
    return newGroup;
  };

  const updateGroup = (id: string, updates: Partial<TeachingGroup>) => {
    setGroups((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGroup = (id: string) => {
    setGroups((prev) => prev.filter((g) => g.id !== id));
  };

  // Activity operations
  const addActivity = (data: Omit<Activity, 'id'>): Activity => {
    const newAct: Activity = {
      ...data,
      id: `act_${Date.now()}`,
    };
    setActivities((prev) => [...prev, newAct]);
    return newAct;
  };

  const toggleFavouriteActivity = (activityId: string) => {
    setFavouriteActivityIds((prev) =>
      prev.includes(activityId) ? prev.filter((id) => id !== activityId) : [...prev, activityId]
    );
  };

  // Plan operations
  const savePlan = (data: Omit<LessonPlan, 'id' | 'lastUpdated'>): LessonPlan => {
    const newPlan: LessonPlan = {
      ...data,
      id: `plan_${Date.now()}`,
      lastUpdated: new Date().toISOString(),
    };
    setSavedPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const updatePlan = (id: string, updates: Partial<LessonPlan>) => {
    setSavedPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates, lastUpdated: new Date().toISOString() } : p))
    );
    if (activeLesson?.id === id) {
      setActiveLesson((prev) => (prev ? { ...prev, ...updates } : null));
    }
  };

  const duplicatePlan = (id: string): LessonPlan => {
    const source = savedPlans.find((p) => p.id === id);
    if (!source) throw new Error('Plan not found');
    const copy: LessonPlan = {
      ...source,
      id: `plan_${Date.now()}`,
      title: `${source.title} (Copy)`,
      status: 'draft',
      lastUpdated: new Date().toISOString(),
    };
    setSavedPlans((prev) => [copy, ...prev]);
    return copy;
  };

  const deletePlan = (id: string) => {
    setSavedPlans((prev) => prev.filter((p) => p.id !== id));
    if (activeLesson?.id === id) {
      setActiveLesson(null);
    }
  };

  // Teaching Mode operations
  const startTeachingLesson = (plan: LessonPlan) => {
    setActiveLesson(plan);
    setActiveLessonStep(plan.currentStepIndex || 0);
    setIsTeachingModeOpen(true);
    updatePlan(plan.id, { status: 'in_progress' });
  };

  const pauseTeachingLesson = () => {
    if (activeLesson) {
      updatePlan(activeLesson.id, { currentStepIndex: activeLessonStep });
    }
    setIsTeachingModeOpen(false);
  };

  const resumeTeachingLesson = () => {
    if (activeLesson) {
      setIsTeachingModeOpen(true);
    }
  };

  const finishTeachingLesson = () => {
    if (activeLesson) {
      updatePlan(activeLesson.id, { status: 'completed', currentStepIndex: 0 });
    }
    setIsTeachingModeOpen(false);
    setActiveLessonStep(0);
  };

  // Observation recording
  const recordObservation = (
    learnerId: string,
    skillId: string,
    status: ObservationStatus,
    note?: string,
    lessonTitle?: string
  ) => {
    const skill = SIMPHONICS_SKILLS.find((s) => s.id === skillId);
    if (!skill) return;

    const record: ObservationRecord = {
      skillId,
      skillName: skill.name,
      strandId: skill.strandId,
      status,
      date: new Date().toISOString().split('T')[0],
      note,
      lessonTitle: lessonTitle || activeLesson?.title,
    };

    setLearners((prev) =>
      prev.map((l) => {
        if (l.id !== learnerId) return l;

        // Auto-recommendation update if needs support
        let updatedFocus = l.currentFocus;
        let updatedRationale = l.focusRationale;
        if (status === 'needs_support') {
          updatedFocus = `Practise ${skill.name}`;
          updatedRationale = `Recent observation (${new Date().toLocaleDateString()}) shows ${l.name} needs support with ${skill.name}.`;
        } else if (status === 'independent' && l.currentFocus.toLowerCase().includes(skill.name.toLowerCase())) {
          updatedFocus = 'Consolidating cumulative reading & next skill sequence';
          updatedRationale = `Learner demonstrated independent mastery of ${skill.name}. Ready for progression.`;
        }

        return {
          ...l,
          currentFocus: updatedFocus,
          focusRationale: updatedRationale,
          observations: {
            ...l.observations,
            [skillId]: record,
          },
        };
      })
    );
  };

  const recordGroupObservations = (
    skillId: string,
    records: { learnerId: string; status: ObservationStatus; note?: string }[],
    lessonTitle?: string
  ) => {
    records.forEach((r) => {
      recordObservation(r.learnerId, skillId, r.status, r.note, lessonTitle);
    });
  };

  const saveParentSummary = (summary: ParentSummary) => {
    setParentSummaries((prev) => ({
      ...prev,
      [summary.learnerId]: summary,
    }));
  };

  const resetAllData = () => {
    localStorage.clear();
    setClasses(INITIAL_CLASSES);
    setSelectedClassId('rec_a');
    setLearners(INITIAL_LEARNERS);
    setGroups(INITIAL_GROUPS);
    setActivities(SIMPHONICS_ACTIVITIES);
    setSavedPlans(INITIAL_SAVED_PLANS);
    setActiveLesson(INITIAL_SAVED_PLANS[0]);
    setFavouriteActivityIds(['act_1', 'act_2', 'act_6']);
    setParentSummaries({});
    setTeacherName('Teacher Alane');
  };

  return (
    <SimphonicsContext.Provider
      value={{
        classes,
        selectedClassId,
        setSelectedClassId,
        selectedClass,
        learners,
        classLearners,
        groups,
        classGroups,
        activities,
        savedPlans,
        activeLesson,
        isTeachingModeOpen,
        activeLessonStep,
        favouriteActivityIds,
        saveStatus,
        teacherName,
        setTeacherName,

        addLearner,
        updateLearner,
        deleteLearner,
        importLearners,

        addGroup,
        updateGroup,
        deleteGroup,

        addActivity,
        toggleFavouriteActivity,

        savePlan,
        updatePlan,
        duplicatePlan,
        deletePlan,

        startTeachingLesson,
        pauseTeachingLesson,
        resumeTeachingLesson,
        finishTeachingLesson,
        setActiveLessonStep,

        recordObservation,
        recordGroupObservations,

        parentSummaries,
        saveParentSummary,
        resetAllData,
      }}
    >
      {children}
    </SimphonicsContext.Provider>
  );
};

export const useSimphonics = () => {
  const context = useContext(SimphonicsContext);
  if (!context) {
    throw new Error('useSimphonics must be used within a SimphonicsProvider');
  }
  return context;
};
