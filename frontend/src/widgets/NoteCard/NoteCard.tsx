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
    <div className={`bg-white p-5 rounded-2xl shadow-sm border ${note.pinned ? 'border-yellow-200' : 'border-gray-100'} hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-3">
        <span className="text-xs text-gray-400 font-medium">
          {new Date(note.createdAt).toLocaleString()}
        </span>
        <div className="flex gap-2">
          <button
            onClick={handleTogglePin}
            className={`p-1.5 rounded-full transition-colors ${
              note.pinned ? 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'
            }`}
            title={note.pinned ? "Unpin note" : "Pin note"}
          >
            <svg className="w-4 h-4" fill={note.pinned ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-colors"
            title="Delete note"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>
      
      <p className="text-gray-800 whitespace-pre-wrap mb-4">{note.content}</p>
      
      {note.media && note.media.length > 0 && (
        <div className="flex gap-3 mb-4 flex-wrap">
          {note.media.map(m => {
            const url = getMediaUrl(m);
            if (m.mediaType.startsWith('image/')) {
              return (
                <a key={m.id} href={url} target="_blank" rel="noopener noreferrer" className="block max-w-[200px] overflow-hidden rounded-xl border border-gray-100">
                  <img src={url} alt={m.originalName} className="object-cover w-full h-32 hover:scale-105 transition-transform duration-300" />
                </a>
              );
            }
            return (
              <a 
                key={m.id} 
                href={url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium"
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
            <span key={idx} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-medium">
              #{tag.trim()}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};
