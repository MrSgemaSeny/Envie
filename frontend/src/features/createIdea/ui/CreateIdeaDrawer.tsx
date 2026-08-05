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
        <Drawer.Overlay className="fixed inset-0 bg-black/80 z-40 transition-opacity" />
        <Drawer.Content className="bg-background flex flex-col fixed inset-0 z-50 focus:outline-none overflow-y-auto">
          <div className="w-full max-w-2xl mx-auto px-6 py-12 flex flex-col gap-8">
            {/* Top Navigation / Header */}
            <div className="flex flex-col gap-4 border-b border-border/50 pb-6">
              <button
                onClick={() => onOpenChange(false)}
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors w-fit pointer-events-auto"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M19 12H5M12 19l-7-7 7-7" />
                </svg>
                Back to Ideas
              </button>
              
              <div className="flex flex-col gap-1">
                <Drawer.Title className="font-semibold text-2xl text-foreground tracking-tight">
                  {idea ? 'Edit Idea' : 'Create New Idea'}
                </Drawer.Title>
                <p className="text-sm text-muted-foreground">
                  Structure your concept, target market, and monetization strategy.
                </p>
              </div>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Idea Title</label>
                <input
                  type="text"
                  placeholder="e.g. Decentralized Storage Network"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground rounded-md"
                  autoFocus
                />
              </div>
              
              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</label>
                <textarea
                  placeholder="Brief description of the core idea"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 bg-card border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground resize-none min-h-[70px] rounded-md"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Problem Statement</label>
                  <textarea
                    placeholder="What pain point does this solve?"
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground resize-none min-h-[90px] rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Proposed Solution</label>
                  <textarea
                    placeholder="How does your solution address the problem?"
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground resize-none min-h-[90px] rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Target Audience</label>
                  <input
                    type="text"
                    placeholder="Who is this for?"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground rounded-md"
                  />
                </div>

                <div className="flex flex-col">
                  <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Monetization Strategy</label>
                  <input
                    type="text"
                    placeholder="How will this make money?"
                    value={monetization}
                    onChange={(e) => setMonetization(e.target.value)}
                    className="w-full px-3 py-2 bg-card border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground rounded-md"
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">Canvas Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                  className="w-full px-3 py-2 bg-card border border-border focus:border-foreground/30 focus:ring-1 focus:ring-foreground/10 outline-none transition-all duration-200 text-sm text-foreground rounded-md"
                >
                  <option value="RAW">RAW</option>
                  <option value="EXPLORING">EXPLORING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 mt-6 border-t border-border/50 pt-6">
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
