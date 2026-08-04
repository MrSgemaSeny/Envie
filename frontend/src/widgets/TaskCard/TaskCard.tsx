import React from 'react';
import { Task, Subtask } from '../../entities/task/types';
import { useDeleteTask, useUpdateSubtask, useDeleteSubtask } from '../../entities/task/api';
import { CreateSubtaskForm } from '../../features/createSubtask/ui/CreateSubtaskForm';
import { Drawer } from 'vaul';

interface TaskCardProps {
  task: Task;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const deleteTask = useDeleteTask();
  const updateSubtask = useUpdateSubtask();
  const deleteSubtask = useDeleteSubtask();

  const handleDeleteTask = () => {
    deleteTask.mutate(task.id);
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
    <div className="bg-card rounded-xl p-5 border border-border flex flex-col gap-4 shadow-sm relative group">
      <div className="flex justify-between items-start gap-4">
        <h3 className="font-semibold text-foreground text-sm leading-tight">{task.title}</h3>
        <Drawer.Root>
          <Drawer.Trigger asChild>
            <button
              className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md p-1 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 -mr-2 -mt-2"
              aria-label="Delete task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 6h18"></path>
                <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
              </svg>
            </button>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay className="fixed inset-0 bg-black/40 z-40 transition-opacity" />
            <Drawer.Content className="bg-card flex flex-col rounded-t-[20px] max-h-[96%] fixed bottom-0 left-0 right-0 z-50 p-6 border-t border-border focus:outline-none">
              <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-muted mb-6" />
              <Drawer.Title className="font-semibold text-foreground text-xl mb-2 text-center">
                Delete Task
              </Drawer.Title>
              <p className="text-muted-foreground text-center mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>
              <div className="flex flex-col gap-3">
                <button
                  onClick={handleDeleteTask}
                  className="w-full py-2.5 bg-destructive text-destructive-foreground font-medium rounded-lg hover:opacity-90 transition-opacity active:scale-95"
                >
                  Delete Task
                </button>
                <Drawer.Close asChild>
                  <button className="w-full py-2.5 bg-muted text-foreground font-medium rounded-lg hover:bg-muted/80 transition-opacity active:scale-95">
                    Cancel
                  </button>
                </Drawer.Close>
              </div>
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>

      {task.description && (
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{task.description}</p>
      )}

      {(task.subtasks?.length > 0 || true) && (
        <div className="flex flex-col gap-2 mt-1">
          {task.subtasks?.map((subtask) => (
            <div key={subtask.id} className="flex items-start justify-between group/subtask gap-2">
              <label className="flex items-start gap-2.5 cursor-pointer flex-1 pt-0.5">
                <div className="relative flex items-center justify-center w-4 h-4 mt-[2px] flex-shrink-0">
                  <input
                    type="checkbox"
                    checked={subtask.done}
                    onChange={() => handleToggleSubtask(subtask)}
                    className="peer appearance-none w-4 h-4 border border-primary/30 rounded-[4px] checked:bg-primary checked:border-primary transition-colors cursor-pointer"
                  />
                  <svg
                    className="absolute w-3 h-3 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
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
                <span className={`text-sm leading-tight transition-colors ${subtask.done ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                  {subtask.title}
                </span>
              </label>
              
              <button
                onClick={() => handleDeleteSubtask(subtask.id)}
                className="text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md p-1 transition-colors opacity-0 group-hover/subtask:opacity-100 flex-shrink-0"
                aria-label="Delete subtask"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          ))}
          
          <div className="mt-1">
            <CreateSubtaskForm taskId={task.id} />
          </div>
        </div>
      )}
    </div>
  );
};
