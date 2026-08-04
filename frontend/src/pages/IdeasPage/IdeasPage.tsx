import React from 'react';
import { useIdeas } from '../../entities/idea/api';
import { IdeaCard } from '../../widgets/IdeaCard/IdeaCard';
import { CreateIdeaForm } from '../../features/createIdea/ui/CreateIdeaForm';

export const IdeasPage: React.FC = () => {
  const { data: ideas, isLoading, isError, error } = useIdeas();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-foreground"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-destructive py-12">
        Failed to load ideas: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 ease-out">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Ideas Vault</h1>
        <CreateIdeaForm />
      </div>

      {!ideas || ideas.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-3xl border border-border mt-8">
          <h3 className="text-xl font-medium text-foreground mb-2">No ideas yet</h3>
          <p className="text-muted-foreground mb-6">Capture your next big thing.</p>
          <CreateIdeaForm />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 auto-rows-max">
          {ideas.map((idea) => (
            <IdeaCard key={idea.id} idea={idea} />
          ))}
        </div>
      )}
    </div>
  );
};
