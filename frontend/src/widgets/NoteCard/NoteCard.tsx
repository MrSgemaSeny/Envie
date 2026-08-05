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

  const handleTogglePin = () => {
    togglePin(note.id);
  };

  const handleDelete = () => {
    deleteNote(note.id);
  };

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

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <article className="group relative">
      <div className={`bg-card/40 backdrop-blur-sm border rounded-lg p-4 transition-all duration-200 hover:bg-card/60 ${
        note.pinned ? 'border-foreground/20' : 'border-border/50 hover:border-border'
      }`}>
        {/* Header row: pin indicator + timestamp + actions */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {note.pinned && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-foreground/60 flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24" stroke="none">
                  <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                Pinned
              </span>
            )}
            <time className="text-[11px] text-muted-foreground/70 font-mono">
              {formatDate(note.createdAt)}
            </time>
          </div>

          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            <button
              onClick={handleTogglePin}
              className={`p-1 rounded-md transition-colors duration-150 ${
                note.pinned
                  ? 'text-foreground/70 hover:text-foreground hover:bg-muted/50'
                  : 'text-muted-foreground/50 hover:text-foreground hover:bg-muted/50'
              }`}
              title={note.pinned ? "Unpin" : "Pin"}
            >
              <svg className="w-3.5 h-3.5" fill={note.pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              className="p-1 rounded-md text-muted-foreground/50 hover:text-red-400 hover:bg-red-400/10 transition-colors duration-150"
              title="Delete"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <p className="text-[13px] text-foreground/90 leading-[1.7] whitespace-pre-wrap mb-3">
          {note.content}
        </p>
        
        {/* Media */}
        {note.media && note.media.length > 0 && (
          <div className="flex gap-2 mb-3 flex-wrap">
            {note.media.map(m => {
              const url = getMediaUrl(m);
              if (m.mediaType.startsWith('image/')) {
                return (
                  <a
                    key={m.id}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block overflow-hidden rounded-md border border-border/30 hover:border-border transition-colors"
                  >
                    <img
                      src={url}
                      alt={m.originalName}
                      className="object-cover w-48 h-32 hover:opacity-90 transition-opacity duration-200"
                    />
                  </a>
                );
              }
              return (
                <a 
                  key={m.id} 
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-muted/30 border border-border/30 text-foreground/80 rounded-md hover:bg-muted/50 transition-colors text-[11px] font-medium"
                >
                  <svg className="w-3.5 h-3.5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                  {m.originalName}
                </a>
              );
            })}
          </div>
        )}

        {/* Tags */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
            {note.tags.map((tag, idx) => (
              <span
                key={idx}
                className="inline-flex items-center px-1.5 py-0.5 rounded bg-muted/30 text-muted-foreground/70 text-[10px] font-mono tracking-wide"
              >
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
};
