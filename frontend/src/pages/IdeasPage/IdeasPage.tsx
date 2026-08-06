import React, { useState, useEffect } from 'react';
import { useGetIdeas } from '../../entities/idea/api';
import { IdeaCard } from '../../widgets/IdeaCard/ui/IdeaCard';
import { CreateIdeaDrawer } from '../../features/createIdea/ui/CreateIdeaDrawer';

export const IdeasPage: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: ideas, isLoading, isError } = useGetIdeas(searchQuery);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="p-6 md:p-8 flex flex-col gap-8 w-full pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Ideas</h1>
          <p className="text-muted-foreground mt-1 text-sm">Capture and manage your project concepts.</p>
        </div>
        <CreateIdeaDrawer
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <button className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity active:scale-95">
              + New Idea
            </button>
          }
        />
      </div>
      
      <div className="relative max-w-md -mt-2">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="w-4 h-4 text-muted-foreground/50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search ideas..."
          className="w-full bg-background border border-border/30 rounded-lg py-2 pl-9 pr-4 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
        />
      </div>

      {isError && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-xl text-sm font-medium text-center">
          Failed to load ideas.
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card/50 rounded-xl h-[250px] border border-border animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ideas?.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
          {ideas?.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 px-4 bg-card/50 rounded-xl border border-dashed border-border">
              <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-4">
                <svg className="h-6 w-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold text-foreground">No ideas yet</h3>
              <p className="mt-1 text-sm text-muted-foreground text-center max-w-sm">Create an idea to get started!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
