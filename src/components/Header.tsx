import React from 'react';
import { Play, CheckCircle2, RefreshCw, AlertCircle, Settings } from 'lucide-react';
import { useSimphonics } from '../context/SimphonicsContext';

export type ActiveTab = 'today' | 'learners' | 'teach' | 'resources' | 'reports';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAdmin: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onOpenAdmin }) => {
  const { activeLesson, resumeTeachingLesson, saveStatus } = useSimphonics();

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'today', label: 'Today' },
    { id: 'learners', label: 'Learners' },
    { id: 'teach', label: 'Teach' },
    { id: 'resources', label: 'Resources' },
    { id: 'reports', label: 'Reports' },
  ];

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4 md:gap-8 h-16">
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setActiveTab('today')}
              className="text-left group flex items-baseline gap-2 cursor-pointer focus:outline-none"
            >
              <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-teal-700 transition-colors whitespace-nowrap">
                Simphonics
              </span>
              <span className="hidden sm:inline text-xs font-semibold uppercase tracking-wider text-teal-700 whitespace-nowrap">
                Teacher Companion
              </span>
            </button>
            
            {/* Auto-save subtle indicator */}
            <div className="hidden lg:flex items-center text-xs text-slate-600 gap-1 pl-2 border-l border-slate-200">
              {saveStatus === 'saving' && (
                <>
                  <RefreshCw className="w-3 h-3 animate-spin text-slate-600" />
                  <span>Saving</span>
                </>
              )}
              {saveStatus === 'saved' && (
                <>
                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                  <span className="text-slate-600">Saved</span>
                </>
              )}
              {saveStatus === 'error' && (
                <>
                  <AlertCircle className="w-3 h-3 text-rose-500" />
                  <span className="text-rose-600">Storage issue</span>
                </>
              )}
            </div>
          </div>

          {/* Zone 2: 5 clean single-line text navigation links */}
          <nav className="hidden md:flex items-center gap-1 sm:gap-4 lg:gap-6 text-sm font-medium">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3 py-2 text-sm font-semibold transition-all whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
                    isActive
                      ? 'border-teal-700 text-teal-800'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: 1 primary action */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {activeLesson && (
              <button
                onClick={resumeTeachingLesson}
                className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-teal-700 hover:bg-teal-800 active:bg-teal-900 rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                title="Return to unfinished lesson"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Continue lesson</span>
              </button>
            )}

            <button
              onClick={onOpenAdmin}
              className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              title="Content & Class Settings"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile navigation row (fixed at top below wordmark or visible on small screens) */}
      <div className="md:hidden flex items-center justify-around border-t border-slate-200 bg-slate-50/90 px-2 py-1">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-2 py-2 text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                isActive ? 'text-teal-700 border-b-2 border-teal-700 font-bold' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </header>
  );
};
