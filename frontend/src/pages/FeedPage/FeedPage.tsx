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

  return (
    <div className="flex h-full">
      {/* Left panel -- compose */}
      <div className="w-72 flex-shrink-0 border-r border-border/20 p-5 flex flex-col gap-5 overflow-y-auto">
        <div>
          <h1 className="text-sm font-medium text-foreground tracking-tight">Notes</h1>
          <p className="text-[11px] text-muted-foreground/40 mt-0.5">
            {notes?.length ?? 0} notes
          </p>
        </div>

        <CreateNoteForm />

        {/* Mini stats */}
        <div className="mt-auto pt-4 border-t border-border/10">
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center">
              <div className="text-lg font-light text-foreground/70 tabular-nums">{notes?.length ?? 0}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/30 mt-0.5">Total</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-light text-foreground/70 tabular-nums">{pinned.length}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/30 mt-0.5">Pinned</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-light text-foreground/70 tabular-nums">{notes?.filter(n => n.media.length > 0).length ?? 0}</div>
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground/30 mt-0.5">Media</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel -- feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-xl px-8 py-6">

          {/* Loading skeleton */}
          {isLoading && (
            <div className="flex flex-col divide-y divide-border/10">
              {[1, 2, 3].map(i => (
                <div key={i} className="py-4 animate-pulse">
                  <div className="h-2.5 w-12 bg-muted/20 rounded mb-3" />
                  <div className="h-2.5 w-full bg-muted/15 rounded mb-2" />
                  <div className="h-2.5 w-2/3 bg-muted/10 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="py-4 text-[12px] text-red-400/70 text-center">
              Failed to load notes.
            </div>
          )}

          {/* Empty */}
          {notes && notes.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-24 text-center">
              <div className="text-[11px] text-muted-foreground/30">No notes yet. Write something.</div>
            </div>
          )}

          {/* Pinned */}
          {pinned.length > 0 && (
            <div className="mb-2">
              <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/25 mb-1 px-px">
                Pinned
              </div>
              {pinned.map(note => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}

          {/* Rest */}
          {unpinned.length > 0 && (
            <div>
              {pinned.length > 0 && (
                <div className="text-[9px] uppercase tracking-[0.15em] text-muted-foreground/25 mb-1 mt-4 px-px">
                  Recent
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
