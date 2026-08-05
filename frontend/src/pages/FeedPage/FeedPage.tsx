import React, { useMemo } from 'react';
import { useNotes } from '../../entities/note/api';
import { CreateNoteForm } from '../../features/createNote/CreateNoteForm';
import { NoteCard } from '../../widgets/NoteCard/NoteCard';
import { NoteDto } from '../../entities/note/types';

export const FeedPage: React.FC = () => {
  const { data: notes, isLoading, error } = useNotes();

  const { pinned, unpinned } = useMemo(() => {
    if (!notes) return { pinned: [], unpinned: [] };
    const p: NoteDto[] = [];
    const u: NoteDto[] = [];
    notes.forEach(n => (n.pinned ? p : u).push(n));
    return { pinned: p, unpinned: u };
  }, [notes]);

  const totalCount = notes?.length ?? 0;

  return (
    <div className="flex h-full w-full">
      {/* Left column -- composer + stats */}
      <div className="w-80 flex-shrink-0 border-r border-border/30 p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">Notes</h1>
          <p className="text-xs text-muted-foreground/60 mt-0.5">
            {totalCount} {totalCount === 1 ? 'note' : 'notes'}
            {pinned.length > 0 && ` / ${pinned.length} pinned`}
          </p>
        </div>

        <CreateNoteForm />

        {/* Quick stats */}
        <div className="mt-auto flex flex-col gap-2 text-[11px] text-muted-foreground/50">
          <div className="flex items-center justify-between">
            <span>Total notes</span>
            <span className="font-mono">{totalCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Pinned</span>
            <span className="font-mono">{pinned.length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>With media</span>
            <span className="font-mono">{notes?.filter(n => n.media && n.media.length > 0).length ?? 0}</span>
          </div>
        </div>
      </div>

      {/* Right column -- feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-3xl">
          {/* Loading */}
          {isLoading && (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-card/30 border border-border/30 rounded-lg p-4 animate-pulse">
                  <div className="h-3 w-24 bg-muted/50 rounded mb-3" />
                  <div className="h-3 w-full bg-muted/30 rounded mb-2" />
                  <div className="h-3 w-3/4 bg-muted/30 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="p-3 bg-red-500/5 border border-red-500/10 text-red-400 rounded-lg text-xs font-medium text-center">
              Failed to load notes. Please try again.
            </div>
          )}

          {/* Empty state */}
          {notes && notes.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-10 h-10 rounded-lg bg-muted/30 border border-border/30 flex items-center justify-center mb-4">
                <svg className="h-5 w-5 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-foreground/80">No notes yet</h3>
              <p className="mt-1 text-[11px] text-muted-foreground/50 max-w-xs">
                Create your first note from the compose panel on the left.
              </p>
            </div>
          )}

          {/* Pinned section */}
          {pinned.length > 0 && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3 px-1">
                <div className="h-px flex-1 bg-border/30" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                  Pinned
                </span>
                <div className="h-px flex-1 bg-border/30" />
              </div>
              <div className="flex flex-col gap-2">
                {pinned.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          {/* All notes */}
          {unpinned.length > 0 && (
            <div className="flex flex-col gap-2">
              {pinned.length > 0 && (
                <div className="flex items-center gap-2 mb-3 px-1">
                  <div className="h-px flex-1 bg-border/30" />
                  <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                    All notes
                  </span>
                  <div className="h-px flex-1 bg-border/30" />
                </div>
              )}
              {unpinned.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
