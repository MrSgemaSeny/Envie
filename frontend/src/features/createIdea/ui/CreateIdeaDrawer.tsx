import React, { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { useCreateIdea, useUpdateIdea } from '../../../entities/idea/api';
import { Idea, IdeaStatus } from '../../../entities/idea/types';

interface CreateIdeaDrawerProps {
  idea?: Idea;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trigger?: React.ReactNode;
}

export const CreateIdeaDrawer: React.FC<CreateIdeaDrawerProps> = ({ idea, open, onOpenChange, trigger }) => {
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [audience, setAudience] = useState('');
  const [monetization, setMonetization] = useState('');
  const [status, setStatus] = useState<IdeaStatus>('RAW');

  const createIdea = useCreateIdea();
  const updateIdea = useUpdateIdea();

  useEffect(() => {
    if (idea && open) {
      setTitle(idea.title);
      setSummary(idea.summary);
      setProblem(idea.problem);
      setSolution(idea.solution);
      setAudience(idea.audience);
      setMonetization(idea.monetization);
      setStatus(idea.status);
    } else if (!idea && open) {
      setTitle('');
      setSummary('');
      setProblem('');
      setSolution('');
      setAudience('');
      setMonetization('');
      setStatus('RAW');
    }
  }, [idea, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim()) return;

    const payload = {
      title,
      summary,
      problem,
      solution,
      audience,
      monetization,
      status,
    };

    if (idea) {
      updateIdea.mutate(
        { id: idea.id, payload },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        }
      );
    } else {
      createIdea.mutate(payload, {
        onSuccess: () => {
          onOpenChange(false);
        },
      });
    }
  };

  const isPending = createIdea.isPending || updateIdea.isPending;

  return (
    <Drawer.Root open={open} onOpenChange={onOpenChange}>
      {trigger && <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>}
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/60 z-40 transition-opacity" />
        <Drawer.Content className="bg-card/90 backdrop-blur-xl border-t border-border flex flex-col rounded-t-2xl max-h-[85vh] fixed bottom-0 left-0 right-0 z-50 focus:outline-none shadow-2xl">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-border mt-4 mb-6" />
          <div className="px-6 pb-6 overflow-y-auto flex-1 max-w-2xl mx-auto w-full">
            <div className="flex flex-col gap-1 mb-6 border-b border-border/50 pb-4">
              <Drawer.Title className="font-semibold text-lg text-foreground">
                {idea ? 'Edit Idea' : 'Create Idea'}
              </Drawer.Title>
              <p className="text-xs text-muted-foreground">
                Structure your concept, target market, and monetization strategy.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Idea Title</label>
                <input
                  type="text"
                  placeholder="e.g. Decentralized Storage Network"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-background/50 rounded-md border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground"
                  autoFocus
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Summary</label>
                <textarea
                  placeholder="Brief description of the core idea"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-background/50 rounded-md border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground resize-none min-h-[60px]"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Problem Statement</label>
                  <textarea
                    placeholder="What pain point does this solve?"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full px-3 py-2 bg-background/50 rounded-md border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground resize-none min-h-[80px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Proposed Solution</label>
                  <textarea
                    placeholder="How does your solution address the problem?"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full px-3 py-2 bg-background/50 rounded-md border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground resize-none min-h-[80px]"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Target Audience</label>
                  <input
                    type="text"
                    placeholder="Who is this for?"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-background/50 rounded-md border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Monetization Strategy</label>
                  <input
                    type="text"
                    placeholder="How will this make money?"
                    value={monetization}
                    onChange={(e) => setMonetization(e.target.value)}
                    className="w-full px-3 py-2 bg-background/50 rounded-md border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1.5">Canvas Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                  className="w-full px-3 py-2 bg-background/50 rounded-md border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground"
                >
                  <option value="RAW">RAW</option>
                  <option value="EXPLORING">EXPLORING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="px-4 py-2 font-medium text-xs text-muted-foreground hover:text-foreground transition-all duration-200 ease-out active:scale-95 rounded-md hover:bg-muted"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!title.trim() || !summary.trim() || isPending}
                  className="px-4 py-2 font-medium text-xs text-primary-foreground bg-primary rounded-md hover:opacity-90 transition-all duration-200 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                >
                  {isPending ? 'Saving...' : (idea ? 'Save Changes' : 'Create Idea')}
                </button>
              </div>
            </form>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
