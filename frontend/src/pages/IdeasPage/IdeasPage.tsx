import React, { useState } from 'react';
import { useGetIdeas } from '../../entities/idea/api';
import { IdeaCard } from '../../widgets/IdeaCard/ui/IdeaCard';
import { CreateIdeaDrawer } from '../../features/createIdea/ui/CreateIdeaDrawer';

export const IdeasPage: React.FC = () => {
  const { data: ideas, isLoading, isError } = useGetIdeas();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  if (isError) {
    return <div className="text-destructive">Failed to load ideas.</div>;
  }

  return (
    <div className="flex flex-col gap-6 w-full pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground tracking-tight">Ideas</h1>
          <p className="text-muted-foreground mt-1">Capture and manage your project concepts.</p>
        </div>
        <CreateIdeaDrawer
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          trigger={
            <button className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-transform duration-300 ease-out active:scale-95">
              + New Idea
            </button>
          }
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-card rounded-2xl h-[250px] border border-border animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ideas?.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
          {ideas?.length === 0 && (
            <div className="col-span-full text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border border-dashed">
              No ideas yet. Create one to get started!
            </div>
          )}
        </div>
      )}
    </div>
  );
};
