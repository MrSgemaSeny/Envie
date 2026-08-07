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
        <Drawer.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-md z-40 transition-opacity duration-300" />
        <Drawer.Content className="fixed inset-x-0 bottom-0 sm:bottom-auto sm:top-1/2 sm:-translate-y-1/2 max-w-3xl mx-auto w-full max-h-[92vh] sm:max-h-[85vh] bg-[#0c0c0e]/95 backdrop-blur-xl border border-zinc-800/80 rounded-t-2xl sm:rounded-2xl shadow-2xl z-50 flex flex-col focus:outline-none overflow-hidden text-foreground font-sans">
          {/* Mobile Handle */}
          <div className="sm:hidden w-12 h-1 bg-zinc-700/60 rounded-full mx-auto my-2.5 flex-shrink-0" />

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/60 bg-zinc-900/30 flex-shrink-0">
            <div className="flex flex-col gap-0.5">
              <Drawer.Title className="text-lg font-semibold text-foreground tracking-tight">
                {idea ? 'Edit Idea' : 'Create New Idea'}
              </Drawer.Title>
              <p className="text-xs text-zinc-400">
                Structure your concept, target market, and monetization strategy.
              </p>
            </div>
            <button
              onClick={() => onOpenChange(false)}
              className="p-1.5 rounded-lg text-zinc-400 hover:text-foreground hover:bg-zinc-800/60 transition-colors duration-150 active:scale-95"
              title="Close"
              type="button"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Scrollable Form Body */}
          <form id="create-idea-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
            {/* Idea Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Idea Title <span className="text-red-400">*</span></label>
              <input
                type="text"
                placeholder="e.g. Decentralized Storage Network"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all duration-150"
                autoFocus
              />
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Summary <span className="text-red-400">*</span></label>
              <textarea
                rows={3}
                placeholder="Brief description of the core idea"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all duration-150 resize-y leading-relaxed"
              />
            </div>

            {/* Problem & Solution */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Problem Statement</label>
                <textarea
                  rows={4}
                  placeholder="What pain point does this solve?"
                  value={problem}
                  onChange={(e) => setProblem(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all duration-150 resize-y leading-relaxed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Proposed Solution</label>
                <textarea
                  rows={4}
                  placeholder="How does your solution address the problem?"
                  value={solution}
                  onChange={(e) => setSolution(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all duration-150 resize-y leading-relaxed"
                />
              </div>
            </div>

            {/* Target Audience & Monetization */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Target Audience</label>
                <input
                  type="text"
                  placeholder="Who is this for?"
                  value={audience}
                  onChange={(e) => setAudience(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all duration-150"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-400">Monetization Strategy</label>
                <input
                  type="text"
                  placeholder="How will this make money?"
                  value={monetization}
                  onChange={(e) => setMonetization(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-foreground placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all duration-150"
                />
              </div>
            </div>

            {/* Canvas Status */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400">Canvas Status</label>
              <div className="relative">
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as IdeaStatus)}
                  className="w-full appearance-none px-3.5 py-2.5 bg-zinc-900/60 border border-zinc-800 rounded-xl text-sm text-foreground focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500/30 transition-all duration-150 cursor-pointer pr-10"
                >
                  <option value="RAW" className="bg-zinc-900 text-foreground">RAW</option>
                  <option value="EXPLORING" className="bg-zinc-900 text-foreground">EXPLORING</option>
                  <option value="ACCEPTED" className="bg-zinc-900 text-foreground">ACCEPTED</option>
                  <option value="REJECTED" className="bg-zinc-900 text-foreground">REJECTED</option>
                </select>
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </div>
            </div>
          </form>

          {/* Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t border-zinc-800/60 bg-zinc-900/30 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-foreground hover:bg-zinc-800/60 rounded-xl transition-all duration-150 ease-out active:scale-95"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="create-idea-form"
              disabled={!title.trim() || !summary.trim() || isPending}
              className="px-5 py-2 text-xs font-semibold text-zinc-950 bg-foreground hover:bg-zinc-200 rounded-xl shadow-md transition-all duration-150 ease-out active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
            >
              {isPending ? 'Saving...' : (idea ? 'Save Changes' : 'Create Idea')}
            </button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};
