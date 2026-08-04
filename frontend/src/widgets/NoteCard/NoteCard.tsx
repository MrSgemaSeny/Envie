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
    <div className={`bg-card p-5 rounded-2xl border ${note.pinned ? 'border-primary' : 'border-border'} transition-all duration-300 ease-out shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-hover)]`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-muted-foreground font-medium">
          {new Date(note.createdAt).toLocaleString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleTogglePin}
            className={`p-1.5 rounded-full transition-transform duration-300 ease-out active:scale-95 ${
              note.pinned ? 'bg-primary text-primary-foreground opacity-90' : 'bg-input text-muted-foreground hover:text-foreground'
            }`}
            title={note.pinned ? "Unpin note" : "Pin note"}
          >
            <svg className="w-4 h-4" fill={note.pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full bg-destructive/10 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-300 ease-out active:scale-95"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-foreground whitespace-pre-wrap mb-4">{note.content}</p>
      
      {note.media && note.media.length > 0 && (
        <div className="flex gap-3 mb-4 flex-wrap">
          {note.media.map(m => {
            const url = getMediaUrl(m);
            if (m.mediaType.startsWith('image/')) {
              return (
                <a key={m.id} href={url} target="_blank" rel="noopener noreferrer" className="block max-w-[200px] overflow-hidden rounded-xl border border-border">
                  <img src={url} alt={m.originalName} className="object-cover w-full h-32 hover:opacity-90 transition-opacity duration-300 ease-out" />
                </a>
              );
            }
            return (
              <a 
                key={m.id} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-3 py-2 bg-input text-foreground rounded-lg hover:bg-muted transition-colors text-sm font-medium"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                {m.originalName}
              </a>
            );
          })}
        </div>
      )}

      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {note.tags.map((tag, idx) => (
            <span key={idx} className="px-3 py-1 bg-input text-muted-foreground text-xs rounded-full font-medium">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
