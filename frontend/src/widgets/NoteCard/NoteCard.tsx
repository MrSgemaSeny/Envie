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

  return (
    <div className={`flex flex-col bg-card p-5 rounded-xl border ${note.pinned ? 'border-primary/50' : 'border-border'} shadow-sm relative group`}>
      <div className="flex justify-between items-start mb-4">
        <span className="text-xs text-muted-foreground font-medium">
          {new Date(note.createdAt).toLocaleString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleTogglePin}
            className={`p-1.5 rounded-md transition-colors ${
              note.pinned ? 'bg-primary/10 text-primary hover:bg-primary/20' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title={note.pinned ? "Unpin note" : "Pin note"}
          >
            <svg className="w-4 h-4" fill={note.pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-md text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-foreground text-sm leading-relaxed whitespace-pre-wrap mb-5">{note.content}</p>
      
      {note.media && note.media.length > 0 && (
        <div className="flex gap-3 mb-5 flex-wrap">
          {note.media.map(m => {
            const url = getMediaUrl(m);
            if (m.mediaType.startsWith('image/')) {
              return (
                <a key={m.id} href={url} target="_blank" rel="noopener noreferrer" className="block w-full max-w-xs overflow-hidden rounded-lg border border-border">
                  <img src={url} alt={m.originalName} className="object-cover w-full h-40 hover:opacity-90 transition-opacity" />
                </a>
              );
            }
            return (
              <a 
                key={m.id} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border text-foreground rounded-lg hover:bg-muted transition-colors text-xs font-medium"
              >
                <svg className="w-4 h-4 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {m.originalName}
              </a>
            );
          })}
        </div>
      )}

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {note.tags.map((tag, idx) => (
            <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded-md bg-muted/50 border border-border text-muted-foreground text-[11px] font-medium tracking-wide">
              {tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

