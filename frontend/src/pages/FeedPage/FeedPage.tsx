import React from 'react';
import { useNotes } from '../../entities/note/api';
import { CreateNoteForm } from '../../features/createNote/CreateNoteForm';
import { NoteCard } from '../../widgets/NoteCard/NoteCard';

export const FeedPage: React.FC = () => {
  const { data: notes, isLoading, error } = useNotes();

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Your Notes</h1>
      
      <CreateNoteForm />
      
      <div className="space-y-6">
        {isLoading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-gray-500 font-medium">Loading notes...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-red-50 text-red-600 rounded-xl text-center">
            Failed to load notes. Please try again.
          </div>
        )}
        
        {notes && notes.length === 0 && !isLoading && (
          <div className="text-center py-12 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No notes yet</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by creating a new note above.</p>
          </div>
        )}
        
        {notes && (
          <div className="grid gap-6">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
