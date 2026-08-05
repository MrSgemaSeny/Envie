import React from 'react';
import { NoteDto, MediaDto } from '../../entities/note/types';
import { useTogglePin, useDeleteNote } from '../../entities/note/api';
import { apiClient } from '../../shared/api/client';

interface NoteCardProps {
  note: NoteDto;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note }) => {
  const { mutate: togglePin } = useTogglePin();
  const { mutate: deleteNote } = useDeleteNote();

  const getMediaUrl = (media: MediaDto) => {
    const baseUrl = apiClient.defaults.baseURL || 'http://localhost:8080/api/v1';
    return `${baseUrl}/media/${media.filePath}`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - d.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <div className="group rounded-xl border border-border/40 bg-card/30 hover:bg-card/50 hover:border-border/60 transition-colors duration-200 overflow-hidden">
      {/* Media at top if exists */}
      {note.media && note.media.length > 0 && (
        <div className="flex gap-0.5 overflow-hidden">
          {note.media.map(m => {
            const url = getMediaUrl(m);
            if (m.mediaType.startsWith('image/')) {
              return (
                <a key={m.id} href={url} target="_blank" rel="noopener noreferrer" className="block flex-1 min-w-0">
                  <img
                    src={url}
                    alt={m.originalName}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-200"
                  />
                </a>
              );
            }
            return null;
          })}
        </div>
      )}

      <div className="p-4">
        {/* Header: pinned badge + time + actions */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            {note.pinned && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-foreground/10 text-foreground/70 text-[10px]" style={{ fontWeight: 500 }}>
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Pinned
              </span>
            )}
            <span className="text-xs text-muted-foreground/50" style={{ fontWeight: 400 }}>
              {formatDate(note.createdAt)}
            </span>
          </div>

          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={() => togglePin(note.id)}
              className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-foreground hover:bg-muted/30 transition-colors duration-150 active:scale-95"
              title={note.pinned ? 'Unpin' : 'Pin'}
            >
              <svg className="w-4 h-4" fill={note.pinned ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={() => deleteNote(note.id)}
              className="p-1.5 rounded-lg text-muted-foreground/40 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150 active:scale-95"
              title="Delete"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap" style={{ fontWeight: 400 }}>
          {note.content}
        </p>

        {/* File attachments (non-image) */}
        {note.media && note.media.some(m => !m.mediaType.startsWith('image/')) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {note.media.filter(m => !m.mediaType.startsWith('image/')).map(m => (
              <a
                key={m.id}
                href={getMediaUrl(m)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/20 border border-border/30 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:border-border/50 transition-colors duration-150"
                style={{ fontWeight: 400 }}
              >
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {m.originalName}
              </a>
            ))}
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/20 text-xs text-muted-foreground/70"
                style={{ fontWeight: 400 }}
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
