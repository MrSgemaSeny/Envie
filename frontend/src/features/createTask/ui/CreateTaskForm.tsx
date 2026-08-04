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
        className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors duration-200 ease-out active:scale-95 px-4 py-2 rounded-xl hover:bg-slate-100"
      >
        <span className="text-xl leading-none">+</span> Add new task
      </button>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 bg-white p-4 rounded-2xl shadow-sm border border-slate-200"
    >
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full px-3 py-2 border-b border-slate-100 focus:border-slate-300 outline-none transition-colors duration-200 ease-out text-slate-900 font-medium placeholder:font-normal placeholder:text-slate-400"
        autoFocus
      />
      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full px-3 py-2 outline-none resize-none min-h-[80px] text-sm text-slate-600 transition-colors duration-200 ease-out placeholder:text-slate-400"
      />
      <div className="flex justify-end gap-2 mt-2">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors duration-200 ease-out active:scale-95 rounded-lg"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!title.trim() || createTask.isPending}
          className="px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors duration-200 ease-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
        >
          {createTask.isPending ? 'Saving...' : 'Save Task'}
        </button>
      </div>
    </form>
  );
};
