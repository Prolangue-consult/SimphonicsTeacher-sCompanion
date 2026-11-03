import React, { useState } from 'react';
import {
  Search,
  Bookmark,
  BookmarkCheck,
  Volume2,
  BookOpen,
  Printer,
  Clock,
  Layers,
  ArrowRight,
  Filter,
  Check,
  Sparkles,
  Play,
  X
} from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';
import { Activity, StrandId } from '../types/simphonics';
import { SIMPHONICS_STRANDS } from '../data/simphonicsData';
import { phonemeAudio } from '../utils/audioPlayer';

interface ResourcesTabProps {
  onStartTeachingActivity: (activity: Activity) => void;
  onOpenPrintable?: (printable: any) => void;
}

export const ResourcesTab: React.FC<ResourcesTabProps> = ({
  onStartTeachingActivity,
  onOpenPrintable,
}) => {
  const { activities, favouriteActivityIds, toggleFavouriteActivity } = useSimphonics();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStrand, setSelectedStrand] = useState<string>('all');
  const [selectedMaterialType, setSelectedMaterialType] = useState<string>('all');
  const [selectedDuration, setSelectedDuration] = useState<string>('all');
  const [selectedCorrespondence, setSelectedCorrespondence] = useState<string>('all');
  const [onlyFavourites, setOnlyFavourites] = useState(false);

  // Active preview modal
  const [previewActivity, setPreviewActivity] = useState<Activity | null>(null);
  const [previewCardIdx, setPreviewCardIdx] = useState(0);

  const allCorrespondences = Array.from(
    new Set(activities.flatMap((a) => a.correspondences || []))
  );

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      act.learningIntention.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (act.bookReference && act.bookReference.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStrand = selectedStrand === 'all' || act.strandId === selectedStrand;
    const matchesMaterial =
      selectedMaterialType === 'all' || act.materialType === selectedMaterialType;
    const matchesDuration =
      selectedDuration === 'all' || act.durationMinutes === Number(selectedDuration);
    const matchesCorrespondence =
      selectedCorrespondence === 'all' ||
      act.correspondences.includes(selectedCorrespondence);
    const matchesFav = !onlyFavourites || favouriteActivityIds.includes(act.id);

    return (
      matchesSearch &&
      matchesStrand &&
      matchesMaterial &&
      matchesDuration &&
      matchesCorrespondence &&
      matchesFav
    );
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Top Section */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Searchable Simphonics Resource Library
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Access verified pronunciation recordings, decodable texts, flashcard decks, and practical classroom printables.
        </p>
      </div>

      {/* Search and Multi-Filter Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, correspondence (e.g. s, a, t), learning purpose, or book..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-teal-600 focus:bg-white"
            />
          </div>

          <button
            onClick={() => setOnlyFavourites(!onlyFavourites)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg border transition-colors cursor-pointer shrink-0 ${
              onlyFavourites
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            {onlyFavourites ? (
              <BookmarkCheck className="w-4 h-4 text-amber-600" />
            ) : (
              <Bookmark className="w-4 h-4 text-slate-400" />
            )}
            <span>Saved ({favouriteActivityIds.length})</span>
          </button>
        </div>

        {/* Filter Dropdowns & Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 border-t border-slate-100 text-xs">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Strand</label>
            <select
              value={selectedStrand}
              onChange={(e) => setSelectedStrand(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Strands</option>
              {SIMPHONICS_STRANDS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.shortName}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Material Type</label>
            <select
              value={selectedMaterialType}
              onChange={(e) => setSelectedMaterialType(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Materials</option>
              <option value="audio">Audio Pronunciation</option>
              <option value="flashcard">Flashcards</option>
              <option value="decodable_text">Decodable Story</option>
              <option value="printable">Printable Sheet</option>
              <option value="manipulative">Manipulatives</option>
              <option value="movement">Physical Movement</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">Duration</label>
            <select
              value={selectedDuration}
              onChange={(e) => setSelectedDuration(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">Any Duration</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
              <option value="20">20 minutes</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Correspondence
            </label>
            <select
              value={selectedCorrespondence}
              onChange={(e) => setSelectedCorrespondence(e.target.value)}
              className="w-full py-1.5 px-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
            >
              <option value="all">All Letters</option>
              {allCorrespondences.map((c) => (
                <option key={c} value={c}>
                  /{c}/
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Results Count & Card Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredActivities.length}</strong> verified
            Simphonics resources
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredActivities.map((act) => {
            const strand = SIMPHONICS_STRANDS.find((s) => s.id === act.strandId);
            const isFav = favouriteActivityIds.includes(act.id);

            return (
              <div
                key={act.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between hover:border-teal-300 transition-all space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                      {strand?.shortName || act.strandId}
                    </span>
                    <button
                      onClick={() => toggleFavouriteActivity(act.id)}
                      className="text-slate-400 hover:text-amber-500 transition-colors cursor-pointer"
                      title={isFav ? 'Remove bookmark' : 'Bookmark resource'}
                    >
                      {isFav ? (
                        <BookmarkCheck className="w-4 h-4 text-amber-500 fill-amber-100" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mt-2 leading-snug">
                    {act.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1 line-clamp-3 leading-relaxed">
                    {act.learningIntention}
                  </p>

                  {/* Clean unboxed metadata with bullet separators */}
                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-3 pt-3 border-t border-slate-100 flex-wrap">
                    <span>{act.durationMinutes} min</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{act.materialType.replace('_', ' ')}</span>
                    {act.correspondences.length > 0 && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="font-semibold text-slate-700">
                          /{act.correspondences.join('/ /')}/
                        </span>
                      </>
                    )}
                  </div>

                  {act.bookReference && (
                    <p className="text-[11px] text-teal-800 font-semibold mt-2">
                      {act.bookReference}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => {
                      setPreviewActivity(act);
                      setPreviewCardIdx(0);
                    }}
                    className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                  >
                    Preview
                  </button>

                  <button
                    onClick={() => onStartTeachingActivity(act)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-xs transition-colors cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-white" />
                    <span>Teach</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {filteredActivities.length === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center text-slate-500">
            No resources matched your filter criteria. Try clearing the search or changing filters.
          </div>
        )}
      </div>

      {/* INTERACTIVE RESOURCE PREVIEW MODAL */}
      {previewActivity && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-2xl w-full p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
                  Resource Preview · {previewActivity.level}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1">{previewActivity.title}</h3>
                {previewActivity.bookReference && (
                  <p className="text-xs text-teal-800 font-semibold mt-0.5">
                    {previewActivity.bookReference}
                  </p>
                )}
              </div>
              <button
                onClick={() => setPreviewActivity(null)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Purpose & Prerequisites */}
            <div className="space-y-3 text-xs">
              <div>
                <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
                  Learning Intention
                </span>
                <p className="text-sm font-medium text-slate-800 mt-0.5">
                  {previewActivity.learningIntention}
                </p>
              </div>

              {previewActivity.prerequisites.length > 0 && (
                <div>
                  <span className="font-bold uppercase tracking-wider text-slate-600 block text-[11px]">
                    Prerequisites
                  </span>
                  <p className="text-slate-700 mt-0.5">{previewActivity.prerequisites.join(' · ')}</p>
                </div>
              )}
            </div>

            {/* Audio Preview if available */}
            {previewActivity.audioPhoneme && (
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-between gap-4">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-teal-800">
                    Audio Pronunciation Model
                  </span>
                  <p className="text-sm font-bold text-slate-900 mt-0.5">
                    Pure Sound: {previewActivity.audioPhoneme.phoneme} (Word: "
                    {previewActivity.audioPhoneme.sampleWord}")
                  </p>
                  <p className="text-xs text-slate-600">
                    {previewActivity.audioPhoneme.description}
                  </p>
                </div>
                <button
                  onClick={() => phonemeAudio.playPhoneme(previewActivity.audioPhoneme!.phoneme)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold text-xs rounded-lg transition-colors cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Play Pure Sound</span>
                </button>
              </div>
            )}

            {/* Flashcard Preview Gallery */}
            {previewActivity.flashcards && previewActivity.flashcards.length > 0 && (
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                  Flashcard Gallery ({previewActivity.flashcards.length} cards)
                </span>
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {previewActivity.flashcards.map((fc, idx) => (
                    <div
                      key={fc.id}
                      onClick={() => phonemeAudio.playWord(fc.front)}
                      className="w-28 h-28 bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col items-center justify-center text-center shrink-0 hover:border-teal-400 cursor-pointer transition-colors"
                      title="Tap to speak"
                    >
                      <span className="text-3xl font-extrabold text-slate-900">{fc.front}</span>
                      {fc.back && (
                        <span className="text-[10px] text-slate-500 mt-1 line-clamp-1">
                          {fc.back}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Decodable Story Preview */}
            {previewActivity.decodableStory && (
              <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200 space-y-3">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                  Decodable Reader Text: “{previewActivity.decodableStory.title}”
                </span>
                <div className="space-y-1.5 font-serif text-slate-900 text-sm pl-2 border-l-2 border-amber-300">
                  {previewActivity.decodableStory.sentences.map((sent, i) => (
                    <p key={i}>{sent}</p>
                  ))}
                </div>
                <p className="text-xs text-slate-600 italic">
                  Comprehension Check: {previewActivity.decodableStory.comprehensionQuestion}
                </p>
              </div>
            )}

            {/* Printable Preview */}
            {previewActivity.printableSheet && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    Classroom Printable Included
                  </span>
                  <p className="text-xs font-semibold text-slate-900 mt-0.5">
                    {previewActivity.printableSheet.title}
                  </p>
                  <p className="text-[11px] text-slate-500">
                    {previewActivity.printableSheet.purpose}
                  </p>
                </div>
                {onOpenPrintable && (
                  <button
                    onClick={() => onOpenPrintable(previewActivity.printableSheet)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg cursor-pointer"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Open Sheet</span>
                  </button>
                )}
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                onClick={() => setPreviewActivity(null)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const act = previewActivity;
                  setPreviewActivity(null);
                  onStartTeachingActivity(act);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-lg shadow-sm transition-colors cursor-pointer"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Teach this activity</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
