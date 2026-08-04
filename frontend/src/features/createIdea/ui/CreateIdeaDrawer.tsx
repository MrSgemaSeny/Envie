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
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 transition-opacity" />
        <Drawer.Content className="bg-card flex flex-col rounded-t-[10px] h-[90vh] mt-24 fixed bottom-0 left-0 right-0 z-50 focus:outline-none">
          <div className="p-4 bg-card rounded-t-[10px] flex-1 overflow-y-auto">
            <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-8" />
            <div className="max-w-2xl mx-auto w-full">
              <Drawer.Title className="font-semibold text-xl mb-4 text-foreground">
                {idea ? 'Edit Idea' : 'Create Idea'}
              </Drawer.Title>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Idea Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-input/50 rounded-xl border border-border focus:border-muted-foreground outline-none transition-colors duration-300 text-foreground"
                  autoFocus
                />
                
                <textarea
                  placeholder="Summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-4 py-3 bg-input/50 rounded-xl border border-border focus:border-muted-foreground outline-none transition-colors duration-300 text-foreground resize-none min-h-[80px]"
                />

                <textarea
                  placeholder="Problem Statement"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-4 py-3 bg-input/50 rounded-xl border border-border focus:border-muted-foreground outline-none transition-colors duration-300 text-foreground resize-none min-h-[80px]"
                />

                <textarea
                  placeholder="Proposed Solution"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full px-4 py-3 bg-input/50 rounded-xl border border-border focus:border-muted-foreground outline-none transition-colors duration-300 text-foreground resize-none min-h-[80px]"
                />

                <input
                  type="text"
                  placeholder="Target Audience"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-4 py-3 bg-input/50 rounded-xl border border-border focus:border-muted-foreground outline-none transition-colors duration-300 text-foreground"
                />

                <input
                  type="text"
                  placeholder="Monetization Strategy"
                  value={monetization}
                  onChange={(e) => setMonetization(e.target.value)}
                  className="w-full px-4 py-3 bg-input/50 rounded-xl border border-border focus:border-muted-foreground outline-none transition-colors duration-300 text-foreground"
                />

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                  className="w-full px-4 py-3 bg-input/50 rounded-xl border border-border focus:border-muted-foreground outline-none transition-colors duration-300 text-foreground"
                >
                  <option value="RAW">RAW</option>
                  <option value="EXPLORING">EXPLORING</option>
                  <option value="ACCEPTED">ACCEPTED</option>
                  <option value="REJECTED">REJECTED</option>
                </select>

                <div className="flex justify-end gap-3 mt-4 mb-8">
                  <button
                    type="button"
                    onClick={() => onOpenChange(false)}
                    className="px-6 py-2.5 font-medium text-muted-foreground hover:text-foreground transition-opacity duration-300 ease-out active:scale-95 rounded-xl"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!title.trim() || !summary.trim() || isPending}
                    className="px-6 py-2.5 font-medium text-primary-foreground bg-primary rounded-xl hover:opacity-90 transition-transform duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
                  >
                    {isPending ? 'Saving...' : (idea ? 'Save Changes' : 'Create Idea')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
