import React, { useState } from 'react';
import { useCreateIdea } from '../../../entities/idea/api';
import { IdeaStatus } from '../../../entities/idea/types';
import { Drawer } from 'vaul';
import { toast } from 'sonner';

export const CreateIdeaForm: React.FC = () => {
  const [open, setOpen] = useState(false);
  const createIdea = useCreateIdea();
  
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [problem, setProblem] = useState('');
  const [solution, setSolution] = useState('');
  const [audience, setAudience] = useState('');
  const [monetization, setMonetization] = useState('');
  const [status, setStatus] = useState<IdeaStatus>('RAW');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    
    createIdea.mutate({
      title,
      summary,
      problem,
      solution,
      audience,
      monetization,
      status,
    }, {
      onSuccess: () => {
        toast.success('Idea created successfully');
        setOpen(false);
        setTitle('');
        setSummary('');
        setProblem('');
        setSolution('');
        setAudience('');
        setMonetization('');
        setStatus('RAW');
      },
      onError: (err) => {
        toast.error(`Failed to create idea: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    });
  };

  return (
    <Drawer.Root open={open} onOpenChange={setOpen}>
      <Drawer.Trigger asChild>
        <button className="bg-foreground text-background font-medium py-2 px-4 rounded-xl hover:opacity-90 transition-opacity duration-300 ease-out active:scale-95 shadow-sm">
          Create New Idea
        </button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ease-out" />
        <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] max-h-[96%] fixed bottom-0 left-0 right-0 z-50 p-6 border-t border-border focus:outline-none overflow-y-auto">
          <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
          <Drawer.Title className="font-semibold text-foreground text-xl mb-4 text-center">
            New Idea
          </Drawer.Title>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg mx-auto w-full pb-8">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="title" className="text-sm font-medium text-foreground">Title</label>
              <input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., AI Task Manager"
                className="w-full bg-input text-foreground border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-out"
                autoFocus
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-medium text-foreground">Status</label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                className="w-full bg-input text-foreground border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-out"
              >
                <option value="RAW">RAW</option>
                <option value="EXPLORING">EXPLORING</option>
                <option value="ACCEPTED">ACCEPTED</option>
                <option value="REJECTED">REJECTED</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="summary" className="text-sm font-medium text-foreground">Summary</label>
              <textarea
                id="summary"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="Brief summary..."
                className="w-full bg-input text-foreground border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-out min-h-[80px] resize-y"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="problem" className="text-sm font-medium text-foreground">Problem</label>
              <textarea
                id="problem"
                value={problem}
                onChange={(e) => setProblem(e.target.value)}
                placeholder="What problem does it solve?"
                className="w-full bg-input text-foreground border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-out min-h-[80px] resize-y"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="solution" className="text-sm font-medium text-foreground">Solution</label>
              <textarea
                id="solution"
                value={solution}
                onChange={(e) => setSolution(e.target.value)}
                placeholder="How does it solve the problem?"
                className="w-full bg-input text-foreground border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-out min-h-[80px] resize-y"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="audience" className="text-sm font-medium text-foreground">Audience</label>
              <input
                id="audience"
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                placeholder="Who is this for?"
                className="w-full bg-input text-foreground border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-out"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="monetization" className="text-sm font-medium text-foreground">Monetization</label>
              <input
                id="monetization"
                value={monetization}
                onChange={(e) => setMonetization(e.target.value)}
                placeholder="How will it make money?"
                className="w-full bg-input text-foreground border border-border rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-ring transition-all duration-300 ease-out"
              />
            </div>
            <div className="mt-4 flex gap-3">
              <button
                type="submit"
                disabled={createIdea.isPending}
                className="flex-1 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 transition-opacity duration-300 ease-out active:scale-95 disabled:opacity-50"
              >
                {createIdea.isPending ? 'Saving...' : 'Save Idea'}
              </button>
              <Drawer.Close asChild>
                <button
                  type="button"
                  className="flex-1 py-3 bg-input text-foreground font-medium rounded-xl hover:bg-muted transition-opacity duration-300 ease-out active:scale-95"
                >
                  Cancel
                </button>
              </Drawer.Close>
            </div>
          </form>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
