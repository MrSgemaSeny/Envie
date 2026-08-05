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
      {/* Sidebar */}
      <div className="w-80 flex-shrink-0 border-r border-border/30 flex flex-col overflow-y-auto">
        <div className="p-5 pb-4">
          <h1 className="text-base text-foreground" style={{ fontWeight: 600 }}>Notes</h1>
          <p className="text-xs text-muted-foreground/50 mt-0.5" style={{ fontWeight: 400 }}>
            Quick thoughts, ideas, and files
          </p>
        </div>

        <div className="px-5 pb-5">
          <CreateNoteForm />
        </div>

        {/* Stats */}
        <div className="mt-auto p-5 border-t border-border/20">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { label: 'Total', value: notes?.length ?? 0 },
              { label: 'Pinned', value: pinned.length },
              { label: 'Media', value: notes?.filter(n => n.media.length > 0).length ?? 0 },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-xl text-foreground/80 tabular-nums" style={{ fontWeight: 300 }}>{stat.value}</div>
                <div className="text-[10px] uppercase tracking-widest text-muted-foreground/30 mt-0.5" style={{ fontWeight: 500 }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 md:p-8 max-w-2xl">
          {/* Loading */}
          {isLoading && (
            <div className="grid gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="rounded-xl border border-border/20 p-4 animate-pulse">
                  <div className="h-3 w-20 bg-muted/20 rounded mb-3" />
                  <div className="space-y-2">
                    <div className="h-3 w-full bg-muted/15 rounded" />
                    <div className="h-3 w-4/5 bg-muted/10 rounded" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-4 text-sm text-red-400/80" style={{ fontWeight: 400 }}>
              Failed to load notes. Check your connection.
            </div>
          )}

          {/* Empty */}
          {notes && notes.length === 0 && !isLoading && (
            <div className="flex flex-col items-center justify-center py-32 text-center">
              <div className="w-14 h-14 rounded-2xl bg-muted/10 border border-border/20 flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-muted-foreground/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="text-sm text-foreground/70" style={{ fontWeight: 500 }}>No notes yet</h3>
              <p className="text-xs text-muted-foreground/40 mt-1 max-w-xs" style={{ fontWeight: 400 }}>
                Start by writing your first note in the composer on the left. Attach images, files, and add tags to organize.
              </p>
            </div>
          )}

          {/* Pinned section */}
          {pinned.length > 0 && (
            <section className="mb-8">
              <h2 className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50 mb-3" style={{ fontWeight: 600 }}>
                Pinned
              </h2>
              <div className="grid gap-3">
                {pinned.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </section>
          )}

          {/* Recent section */}
          {unpinned.length > 0 && (
            <section>
              {pinned.length > 0 && (
                <h2 className="text-[11px] uppercase tracking-[0.12em] text-muted-foreground/50 mb-3" style={{ fontWeight: 600 }}>
                  Recent
                </h2>
              )}
              <div className="grid gap-3">
                {unpinned.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};
