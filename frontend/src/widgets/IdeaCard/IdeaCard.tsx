import React from 'react';
import { Idea } from '../../entities/idea/types';
import { useDeleteIdea } from '../../entities/idea/api';
import { GenerateArchitectureButton } from '../../features/generateArchitecture/ui/GenerateArchitectureButton';
import { Drawer } from 'vaul';

interface IdeaCardProps {
  idea: Idea;
}

const statusColors: Record<Idea['status'], string> = {
  RAW: 'bg-muted text-muted-foreground',
  EXPLORING: 'bg-primary/20 text-primary',
  ACCEPTED: 'bg-green-500/20 text-green-500',
  REJECTED: 'bg-destructive/20 text-destructive',
};

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const deleteIdea = useDeleteIdea();

  const handleDelete = () => {
    deleteIdea.mutate(idea.id);
  };

  return (
    <div className="bg-card rounded-2xl p-6 border border-border flex flex-col gap-4 group transition-all duration-300 ease-out hover:-translate-y-1 shadow-[var(--shadow-glow)] hover:shadow-[var(--shadow-glow-hover)]">
      <div className="flex justify-between items-start gap-4">
        <div className="flex flex-col gap-2">
          <h3 className="font-semibold text-foreground text-xl leading-tight">{idea.title}</h3>
          <span className={`text-xs font-medium px-2 py-1 rounded-full w-fit ${statusColors[idea.status]}`}>
            {idea.status}
          </span>
        </div>
        
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <button
              className="text-muted-foreground hover:text-destructive transition-colors duration-300 ease-out active:scale-95 opacity-0 group-hover:opacity-100 p-2 -mr-2 -mt-2 flex-shrink-0"
              aria-label="Delete idea"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-out" />
            <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] max-h-[96%] fixed bottom-0 left-0 right-0 z-50 p-6 border-t border-border focus:outline-none">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
              <Drawer.Title className="font-semibold text-foreground text-xl mb-2 text-center">
                Delete Idea
              </Drawer.Title>
              <p className="text-muted-foreground text-center mb-6">
                Are you sure you want to delete "{idea.title}"? This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDelete}
                  className="w-full py-3 bg-destructive text-destructive-foreground font-medium rounded-xl hover:opacity-90 transition-opacity duration-300 ease-out active:scale-95"
                >
                  Delete Idea
                </button>
                <Drawer.Close asChild>
                  <button className="w-full py-3 bg-input text-foreground font-medium rounded-xl hover:bg-muted transition-opacity duration-300 ease-out active:scale-95">
                    Cancel
                  </button>
                </Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      <div className="flex flex-col gap-3 text-sm text-muted-foreground">
        {idea.summary && (
          <div>
            <span className="font-medium text-foreground block mb-1">Summary:</span>
            <p className="whitespace-pre-wrap">{idea.summary}</p>
          </div>
        )}
        {idea.problem && (
          <div>
            <span className="font-medium text-foreground block mb-1">Problem:</span>
            <p className="whitespace-pre-wrap">{idea.problem}</p>
          </div>
        )}
        {idea.solution && (
          <div>
            <span className="font-medium text-foreground block mb-1">Solution:</span>
            <p className="whitespace-pre-wrap">{idea.solution}</p>
          </div>
        )}
        {idea.audience && (
          <div>
            <span className="font-medium text-foreground block mb-1">Audience:</span>
            <p>{idea.audience}</p>
          </div>
        )}
        {idea.monetization && (
          <div>
            <span className="font-medium text-foreground block mb-1">Monetization:</span>
            <p>{idea.monetization}</p>
          </div>
        )}
      </div>

      <div className="border-t border-border pt-4 mt-2">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-semibold text-foreground">AI Architecture</h4>
          <GenerateArchitectureButton ideaId={idea.id} />
        </div>
        
        {idea.aiArchitecture ? (
          <div className="bg-muted/50 p-4 rounded-xl text-sm text-foreground whitespace-pre-wrap font-mono overflow-x-auto border border-border/50">
            {idea.aiArchitecture}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground italic text-center py-4 bg-muted/20 rounded-xl border border-dashed border-border">
            No architecture generated yet.
          </p>
        )}
      </div>
    </div>
  );
};
