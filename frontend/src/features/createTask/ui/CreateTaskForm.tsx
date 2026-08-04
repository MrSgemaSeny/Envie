import React, { useState } from 'react';
import { useCreateTask } from '../../../entities/task/api';

export const CreateTaskForm: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const createTask = useCreateTask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createTask.mutate(
      { title, description },
      {
        onSuccess: () => {
          setTitle('');
          setDescription('');
          setIsOpen(false);
        },
      }
    );
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-opacity duration-300 ease-out active:scale-95 px-4 py-2 rounded-xl hover:bg-input"
      >
        <span className="text-xl leading-none">+</span> Add new task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-card p-4 rounded-2xl border border-border"
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 bg-transparent border-b border-border focus:border-muted-foreground outline-none transition-opacity duration-300 ease-out text-foreground font-medium placeholder:font-normal placeholder:text-muted-foreground"
        autoFocus
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 bg-transparent outline-none resize-none min-h-[80px] text-sm text-foreground transition-opacity duration-300 ease-out placeholder:text-muted-foreground"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-opacity duration-300 ease-out active:scale-95 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || createTask.isPending}
          className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary rounded-lg hover:opacity-90 transition-transform duration-300 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {createTask.isPending ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};
