import React, { useState } from 'react';
import { useCreateSubtask } from '../../../entities/task/api';

interface CreateSubtaskFormProps {
  taskId: string;
}

export const CreateSubtaskForm: React.FC<CreateSubtaskFormProps> = ({ taskId }) => {
  const [title, setTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const createSubtask = useCreateSubtask();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createSubtask.mutate(
      { taskId, payload: { title } },
      {
        onSuccess: () => {
          setTitle('');
          setIsAdding(false);
        },
      }
    );
  };

  if (!isAdding) {
    return (
      <button
        onClick={() => setIsAdding(true)}
        className="text-xs text-muted-foreground hover:text-foreground font-medium transition-opacity duration-300 ease-out active:scale-95 flex items-center gap-1 mt-2"
      >
        <span>+</span> Add subtask
      </button>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mt-2">
      <input
        type="text"
        placeholder="Subtask title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-2 py-1.5 text-sm bg-input border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:border-muted-foreground outline-none transition-opacity duration-300 ease-out"
        autoFocus
        onBlur={() => {
          if (!title.trim()) setIsAdding(false);
        }}
      />
    </form>
  );
};
