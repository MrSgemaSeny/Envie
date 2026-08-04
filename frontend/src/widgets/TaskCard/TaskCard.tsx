import React from 'react';
import { Task, Subtask } from '../../entities/task/types';
import { useDeleteTask, useUpdateSubtask, useDeleteSubtask } from '../../entities/task/api';
import { CreateSubtaskForm } from '../../features/createSubtask/ui/CreateSubtaskForm';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const deleteTask = useDeleteTask();
  const updateSubtask = useUpdateSubtask();
  const deleteSubtask = useDeleteSubtask();

  const handleDeleteTask = () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTask.mutate(task.id);
    }
  };

  const handleToggleSubtask = (subtask: Subtask) => {
    updateSubtask.mutate({
      id: subtask.id,
      payload: { title: subtask.title, done: !subtask.done },
    });
  };

  const handleDeleteSubtask = (subtaskId: string) => {
    deleteSubtask.mutate(subtaskId);
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 flex flex-col gap-3 group transition-transform duration-300 ease-out hover:shadow-md">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-slate-900 leading-tight">{task.title}</h3>
        <button
          onClick={handleDeleteTask}
          className="text-slate-300 hover:text-red-500 transition-colors duration-200 ease-out active:scale-95 opacity-0 group-hover:opacity-100 p-1 -mr-2 -mt-2"
          aria-label="Delete task"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18"></path>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
          </svg>
        </button>
      </div>

      {task.description && (
        <p className="text-sm text-slate-500 whitespace-pre-wrap">{task.description}</p>
      )}

      {(task.subtasks?.length > 0 || true) && (
        <div className="mt-2 flex flex-col gap-2">
          {task.subtasks?.map((subtask) => (
            <div key={subtask.id} className="flex items-center justify-between group/subtask">
              <label className="flex items-center gap-2 cursor-pointer flex-1">
                <div className="relative flex items-center justify-center w-4 h-4">
                  <input
                    type="checkbox"
                    checked={subtask.done}
                    onChange={() => handleToggleSubtask(subtask)}
                    className="peer appearance-none w-4 h-4 border border-slate-300 rounded-[4px] checked:bg-slate-900 checked:border-slate-900 transition-colors duration-200 ease-out cursor-pointer"
                  />
                  <svg
                    className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity duration-200 ease-out"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                </div>
                <span className={`text-sm transition-colors duration-200 ease-out ${subtask.done ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                  {subtask.title}
                </span>
              </label>
              
              <button
                onClick={() => handleDeleteSubtask(subtask.id)}
                className="text-slate-300 hover:text-red-500 transition-colors duration-200 ease-out active:scale-95 opacity-0 group-hover/subtask:opacity-100 p-1"
                aria-label="Delete subtask"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
          
          <CreateSubtaskForm taskId={task.id} />
        </div>
      )}
    </div>
  );
};
