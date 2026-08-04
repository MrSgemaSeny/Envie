import React, { useState } from 'react';
import { Idea } from '../../../entities/idea/types';
import { useDeleteIdea, useGenerateArchitectureIdea } from '../../../entities/idea/api';
import { Drawer } from 'vaul';
import { CreateIdeaDrawer } from '../../../features/createIdea/ui/CreateIdeaDrawer';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const deleteIdea = useDeleteIdea();
  const generateArchitecture = useGenerateArchitectureIdea();

  const getStatusColor = (status: Idea['status']) => {
    switch (status) {
      case 'RAW':
        return 'bg-muted text-muted-foreground';
      case 'EXPLORING':
        return 'bg-blue-500/20 text-blue-400';
      case 'ACCEPTED':
        return 'bg-green-500/20 text-green-400';
      case 'REJECTED':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  const isGenerating = generateArchitecture.isPending;

  return (
    <>
      <div
        className={`flex flex-col bg-card rounded-2xl p-5 border border-border transition-all duration-300 ease-out ${
          isGenerating ? 'animate-pulse' : ''
        }`}
      >
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-semibold text-lg text-foreground">{idea.title}</h3>
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(
              idea.status
            )}`}
          >
            {idea.status}
          </span>
        </div>

        <div className="flex flex-col gap-2 mb-4 text-sm text-muted-foreground">
          <p>
            <strong className="text-foreground">Summary:</strong> {idea.summary}
          </p>
          {idea.problem && (
            <p>
              <strong className="text-foreground">Problem:</strong> {idea.problem}
            </p>
          )}
          {idea.solution && (
            <p>
              <strong className="text-foreground">Solution:</strong> {idea.solution}
            </p>
          )}
          {idea.audience && (
            <p>
              <strong className="text-foreground">Audience:</strong> {idea.audience}
            </p>
          )}
          {idea.monetization && (
            <p>
              <strong className="text-foreground">Monetization:</strong> {idea.monetization}
            </p>
          )}
        </div>

        {idea.aiArchitecture && !isGenerating && (
          <div className="mt-4 p-4 bg-background rounded-xl border border-border">
            <h4 className="font-semibold text-foreground mb-2 text-sm">AI Architecture:</h4>
            <div className="text-sm text-muted-foreground whitespace-pre-wrap font-mono">
              {idea.aiArchitecture}
            </div>
          </div>
        )}

        <div className="mt-auto pt-4 flex flex-col gap-2">
          {!idea.aiArchitecture && (
            <button
              onClick={() => generateArchitecture.mutate(idea.id)}
              disabled={isGenerating}
              className="w-full px-4 py-2 font-medium text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-transform duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isGenerating ? 'Generating...' : 'Generate Architecture'}
            </button>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditDrawerOpen(true)}
              disabled={isGenerating}
              className="flex-1 px-4 py-2 text-sm font-medium text-foreground bg-input/50 border border-border rounded-xl hover:bg-input transition-colors duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              Edit
            </button>
            <button
              onClick={() => setIsDeleteDrawerOpen(true)}
              disabled={isGenerating}
              className="flex-1 px-4 py-2 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-xl hover:bg-destructive/20 transition-colors duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <Drawer.Root open={isDeleteDrawerOpen} onOpenChange={setIsDeleteDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 transition-opacity" />
          <Drawer.Content className="bg-card flex flex-col rounded-t-[10px] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
            <div className="p-6 bg-card rounded-t-[10px]">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
              <div className="max-w-md mx-auto w-full text-center">
                <Drawer.Title className="font-semibold text-xl mb-2 text-foreground">
                  Delete Idea
                </Drawer.Title>
                <Drawer.Description className="text-muted-foreground mb-8">
                  Are you sure you want to delete "{idea.title}"? This action cannot be undone.
                </Drawer.Description>
                <div className="flex gap-3">
                  <button
                    onClick={() => setIsDeleteDrawerOpen(false)}
                    className="flex-1 px-4 py-3 font-medium text-foreground bg-input/50 rounded-xl hover:bg-input transition-colors duration-300 ease-out active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      deleteIdea.mutate(idea.id, {
                        onSuccess: () => setIsDeleteDrawerOpen(false),
                      });
                    }}
                    disabled={deleteIdea.isPending}
                    className="flex-1 px-4 py-3 font-medium text-destructive-foreground bg-destructive rounded-xl hover:opacity-90 transition-opacity duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {deleteIdea.isPending ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </Drawer.Content>
        </Drawer.Portal>
      </Drawer.Root>

      <CreateIdeaDrawer 
        idea={idea} 
        open={isEditDrawerOpen} 
        onOpenChange={setIsEditDrawerOpen} 
      />
    </>
  );
};
