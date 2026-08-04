import React, { useState } from 'react';
import { Idea } from '../../../entities/idea/types';
import { useDeleteIdea } from '../../../entities/idea/api';
import { Drawer } from 'vaul';
import { CreateIdeaDrawer } from '../../../features/createIdea/ui/CreateIdeaDrawer';

interface IdeaCardProps {
  idea: Idea;
}

export const IdeaCard: React.FC<IdeaCardProps> = ({ idea }) => {
  const [isDeleteDrawerOpen, setIsDeleteDrawerOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const deleteIdea = useDeleteIdea();
  const getStatusColor = (status: Idea['status']) => {
    switch (status) {
      case 'RAW':
        return 'bg-muted/50 text-muted-foreground border-border';
      case 'EXPLORING':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'ACCEPTED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'REJECTED':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-muted/50 text-muted-foreground border-border';
    }
  };

  return (
    <>
      <div
        className={`flex flex-col bg-card rounded-xl p-5 border border-border shadow-sm relative group`}
      >
        <div className="flex justify-between items-start mb-4 gap-4">
          <h3 className="font-semibold text-foreground text-sm leading-tight">{idea.title}</h3>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[11px] font-semibold tracking-wide whitespace-nowrap ${getStatusColor(
              idea.status
            )}`}
          >
            {idea.status}
          </span>
        </div>

        <div className="flex flex-col gap-3 mb-6 text-sm text-muted-foreground">
          <p className="leading-relaxed">
            <strong className="text-foreground font-medium">Summary:</strong> {idea.summary}
          </p>
          {idea.problem && (
            <p className="leading-relaxed">
              <strong className="text-foreground font-medium">Problem:</strong> {idea.problem}
            </p>
          )}
          {idea.solution && (
            <p className="leading-relaxed">
              <strong className="text-foreground font-medium">Solution:</strong> {idea.solution}
            </p>
          )}
          {idea.audience && (
            <p className="leading-relaxed">
              <strong className="text-foreground font-medium">Audience:</strong> {idea.audience}
            </p>
          )}
          {idea.monetization && (
            <p className="leading-relaxed">
              <strong className="text-foreground font-medium">Monetization:</strong> {idea.monetization}
            </p>
          )}
        </div>

        <div className="mt-auto pt-4 flex gap-2 border-t border-border/50">
          <button
            onClick={() => setIsEditDrawerOpen(true)}
            className="flex-1 py-2 text-xs font-medium text-foreground bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteDrawerOpen(true)}
            className="flex-1 py-2 text-xs font-medium text-destructive bg-destructive/10 rounded-lg hover:bg-destructive/20 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>

      <Drawer.Root open={isDeleteDrawerOpen} onOpenChange={setIsDeleteDrawerOpen}>
        <Drawer.Portal>
          <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 transition-opacity" />
          <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] max-h-[96%] fixed bottom-0 left-0 right-0 z-50 p-6 border-t border-border focus:outline-none">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
            <div className="max-w-md mx-auto w-full">
              <Drawer.Title className="font-semibold text-foreground text-xl mb-2 text-center">
                Delete Idea
              </Drawer.Title>
              <Drawer.Description className="text-muted-foreground text-center mb-6">
                Are you sure you want to delete "{idea.title}"? This action cannot be undone.
              </Drawer.Description>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    deleteIdea.mutate(idea.id, {
                      onSuccess: () => setIsDeleteDrawerOpen(false),
                    });
                  }}
                  disabled={deleteIdea.isPending}
                  className="w-full py-2.5 bg-destructive text-destructive-foreground font-medium rounded-lg hover:opacity-90 transition-opacity active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {deleteIdea.isPending ? 'Deleting...' : 'Delete Idea'}
                </button>
                <Drawer.Close asChild>
                  <button
                    className="w-full py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-opacity active:scale-95"
                  >
                    Cancel
                  </button>
                </Drawer.Close>
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
