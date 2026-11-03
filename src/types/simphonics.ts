export type StrandId =
  | 'oral_language'
  | 'phonological_awareness'
  | 'phonemic_awareness'
  | 'phonics_decoding'
  | 'handwriting_foundations'
  | 'letter_formation'
  | 'word_text_reading'
  | 'comprehension_expression';

export interface Strand {
  id: StrandId;
  name: string;
  shortName: string;
  description: string;
  color: string;
  iconName: string;
}

export type ObservationStatus = 'not_observed' | 'needs_support' | 'developing' | 'independent';

export interface Skill {
  id: string;
  strandId: StrandId;
  code: string;
  name: string;
  description: string;
  level: string; // e.g. "Level 1"
  prerequisites: string[];
  teacherInstruction: string;
  promptOrMaterial: string;
  lookFor: string;
}

export interface ObservationRecord {
  skillId: string;
  skillName: string;
  strandId: StrandId;
  status: ObservationStatus;
  date: string; // ISO date string
  note?: string;
  lessonTitle?: string;
}

export interface Learner {
  id: string;
  name: string;
  classId: string;
  ageBand: '2–3 years' | '3–4 years' | '4–5 years' | '5–6 years' | '6+ Foundational';
  languageBackground: string;
  groupId?: string;
  currentFocus: string;
  focusRationale?: string;
  observations: Record<string, ObservationRecord>; // skillId -> record
  createdDate: string;
}

export interface ClassGroup {
  id: string;
  name: string;
  description?: string;
}

export interface TeachingGroup {
  id: string;
  classId: string;
  name: string; // e.g. "Oral Blending Group", "Initial Sounds /s/ & /a/"
  teachingFocus: string;
  learnerIds: string[];
  createdDate: string;
}

export interface Flashcard {
  id: string;
  type: 'letter' | 'picture' | 'word';
  front: string;
  back?: string;
  audioPrompt?: string;
}

export interface DecodableStory {
  title: string;
  taughtCorrespondences: string[];
  commonExceptionWords: string[];
  sentences: string[];
  comprehensionQuestion: string;
}

export interface PrintableSheet {
  title: string;
  purpose: string;
  instructions: string;
  items: string[];
}

export interface Activity {
  id: string;
  title: string;
  strandId: StrandId;
  level: string;
  durationMinutes: number; // 5, 10, 15, 20
  correspondences: string[];
  exceptionWords?: string[];
  learningIntention: string;
  prerequisites: string[];
  preparation: string;
  bookReference?: string; // verified reference, e.g. "Simphonics Activity Book 1, p. 6"
  materialType: 'audio' | 'flashcard' | 'printable' | 'movement' | 'decodable_text' | 'manipulative';
  materialsNeeded: string[];
  model: string;
  guidedPractice: string;
  independentAttempt: string;
  check: string;
  adaptation: {
    extraSupport: string;
    extension: string;
  };
  audioPhoneme?: {
    phoneme: string;
    sampleWord: string;
    description: string;
  };
  flashcards?: Flashcard[];
  decodableStory?: DecodableStory;
  printableSheet?: PrintableSheet;
}

export interface LessonPlan {
  id: string;
  title: string;
  targetType: 'class' | 'group' | 'learner';
  targetId: string;
  strandId: StrandId;
  durationMinutes: number;
  activityId: string;
  learningIntention: string;
  prerequisites: string[];
  preparation: string;
  bookReference?: string;
  model: string;
  guidedPractice: string;
  independentAttempt: string;
  check: string;
  adaptation: {
    extraSupport: string;
    extension: string;
  };
  status: 'draft' | 'in_progress' | 'completed';
  currentStepIndex?: number;
  lastUpdated: string;
}

export interface ParentSummary {
  id: string;
  learnerId: string;
  learnerName: string;
  dateRange: string;
  whatWePractised: string;
  independent: string;
  needsSupport: string;
  nextTeachingFocus: string;
  homeActivity: string;
  lastEdited: string;
}
