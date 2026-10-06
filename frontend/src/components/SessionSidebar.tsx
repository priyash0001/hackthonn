import type { FC } from 'react';
import type { SocraticMessage, SubjectArea, HintTier } from '../types';
import { History, Trash2, ChevronLeft, ChevronRight, BookOpen, Clock, Sparkles } from 'lucide-react';

export interface SavedSession {
  id: string;
  problemText: string;
  subject: SubjectArea;
  currentTier: HintTier;
  messages: SocraticMessage[];
  timestamp: string;
  isMastered: boolean;
}

interface SessionSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  sessions: SavedSession[];
  onSelectSession: (session: SavedSession) => void;
  onClearSessions: () => void;
  activeSessionId?: string;
}

export const SessionSidebar: FC<SessionSidebarProps> = ({
  isOpen,
  onToggle,
  sessions,
  onSelectSession,
  onClearSessions,
  activeSessionId,
}) => {
  return (
    <aside
      className={`fixed top-16 left-0 bottom-0 z-40 bg-slate-950/95 border-r border-slate-800/90 backdrop-blur-xl transition-all duration-300 flex flex-col ${
        isOpen ? 'w-80' : 'w-12'
      }`}
    >
      {/* Toggle Header */}
      <div className="p-3 border-b border-slate-800 flex items-center justify-between">
        {isOpen ? (
          <>
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <History className="w-4 h-4 text-purple-400" />
              <span>Learning Sessions</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-300">
                {sessions.length}
              </span>
            </div>
            <button
              onClick={onToggle}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={onToggle}
            className="w-full flex items-center justify-center p-1 rounded-lg text-purple-400 hover:text-white hover:bg-slate-900 transition"
            title="Expand Sessions"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Sessions List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {sessions.length === 0 ? (
            <div className="text-center py-12 px-4 text-slate-500">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-600 opacity-60" />
              <p className="text-xs font-medium text-slate-400">No saved sessions yet</p>
              <p className="text-[10px] text-slate-600 mt-1">
                Your problem reviews and Socratic dialogues will appear here.
              </p>
            </div>
          ) : (
            sessions.map((s) => {
              const isSelected = activeSessionId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => onSelectSession(s)}
                  className={`w-full text-left p-3 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-purple-950/40 border-purple-500/50 ring-1 ring-purple-500/30'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-slate-800 text-purple-300 uppercase">
                      {s.subject}
                    </span>
                    {s.isMastered && (
                      <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Mastered
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold text-slate-200 line-clamp-1">
                    {s.problemText || 'Untitled Problem'}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {s.timestamp}
                    </span>
                    <span>Tier {s.currentTier}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}

      {/* Footer / Clear button */}
      {isOpen && sessions.length > 0 && (
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={onClearSessions}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-slate-900 hover:bg-rose-950/60 border border-slate-800 hover:border-rose-500/40 text-[11px] text-slate-400 hover:text-rose-300 transition"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Session History</span>
          </button>
        </div>
      )}
    </aside>
  );
};
