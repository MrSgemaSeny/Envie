import React from 'react';
import { useNotes } from '../../entities/note/api';
import { CreateNoteForm } from '../../features/createNote/CreateNoteForm';
import { NoteCard } from '../../widgets/NoteCard/NoteCard';

export const FeedPage: React.FC = () => {
  const { data: notes, isLoading, error } = useNotes();

  return (
    <div className="max-w-3xl mx-auto py-8 px-6 md:px-8 w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold text-foreground tracking-tight">Your Notes</h1>
        <p className="text-muted-foreground mt-1 text-sm">Capture your thoughts and media in one place.</p>
      </div>
      
      <div className="mb-8">
        <CreateNoteForm />
      </div>
      
      <div className="space-y-4">
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-sm font-medium">Loading notes...</p>
          </div>
        )}
        
        {error && (
          <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium text-center">
            Failed to load notes. Please try again.
          </div>
        )}
        
        {notes && notes.length === 0 && !isLoading && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-card/50 rounded-xl border border-dashed border-border">
            <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
              <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-foreground">No notes yet</h3>
            <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">Get started by creating a new note above. Your notes will appear here.</p>
          </div>
        )}
        
        {notes && (
          <div className="flex flex-col gap-4">
            {notes.map(note => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
